import * as fs from 'fs';
import * as path from 'path';

interface ClassificationRule {
  code: string;
  name: string;
  keywords: string[];
  positions?: string[];
}

interface KeywordMatch {
  keyword: string;
  layer: number;
  weight: number;
}

interface WeightedKeyword {
  keyword: string;
  layer: 1|2|3|4|5;
  weight: number;  // 1.0, 0.9, 0.8, 0.7, -1.0
}

interface PositionKeywords {
  positionCode?: string;
  positionName: string;
  functionCode?: string;
  keywords: {
    layer1_core?: string[];
    layer2_framework?: string[];
    layer3_tool?: string[];
    layer4_skill?: string[];
    layer5_exclude?: string[];
  };
}

interface ClassificationResult {
  industryCode?: string;
  industryName?: string;
  categoryCode?: string;
  categoryName?: string;
  positionName?: string;
  confidence: number;
  matchType: 'exact' | 'partial' | 'weighted' | 'keyword';
  matchedKeywords: string[];
  score?: number;  // 加权评分（0-1）
}

export class PositionClassifier {
  private industries: ClassificationRule[] = [];
  private functions: ClassificationRule[] = [];
  private positionMap: Map<string, ClassificationRule> = new Map();
  private positionKeywords: Map<string, PositionKeywords> = new Map();

  constructor() {
    this.loadRules();
    this.loadPositionKeywords();
  }

  /**
   * 加载规则（从 JSON 文件）
   */
  private loadRules() {
    const rulesPath = path.join(
      __dirname,
      '../../../../resume-classification-rules/rules/classification_rules.json'
    );

    if (!fs.existsSync(rulesPath)) {
      console.error('[PositionClassifier] Rules file not found:', rulesPath);
      console.error('[PositionClassifier] Current dir:', process.cwd());
      console.error('[PositionClassifier] Trying alternate path...');
      
      // 尝试备用路径
      const altPath = path.join(process.cwd(), 'resume-classification-rules/rules/classification_rules.json');
      if (fs.existsSync(altPath)) {
        console.log('[PositionClassifier] Found rules at alternate path');
        const rules = JSON.parse(fs.readFileSync(altPath, 'utf-8'));
        this.industries = rules.industries.data;
        this.functions = rules.functions.data;
        for (const func of this.functions) {
          if (func.positions) {
            for (const position of func.positions) {
              this.positionMap.set(position.toLowerCase(), func);
            }
          }
        }
        console.log(`[PositionClassifier] Loaded ${this.industries.length} industries, ${this.functions.length} functions, ${this.positionMap.size} positions`);
        return;
      }
      
      return;
    }

    const rules = JSON.parse(fs.readFileSync(rulesPath, 'utf-8'));

    // 加载行业规则
    this.industries = rules.industries.data;

    // 加载职能规则
    this.functions = rules.functions.data;

    // 构建职位映射（职位名 → 职能规则）
    for (const func of this.functions) {
      if (func.positions) {
        for (const position of func.positions) {
          this.positionMap.set(position.toLowerCase(), func);
        }
      }
    }

    console.log(`[PositionClassifier] Loaded ${this.industries} industries, ${this.functions.length} functions, ${this.positionMap.size} positions`);
  }

  /**
   * 分类职位名称（加权评分优化版）
   */
  classify(positionText: string): ClassificationResult {
    const result: ClassificationResult = {
      confidence: 0,
      matchType: 'keyword',
      matchedKeywords: [],
    };

    // 1. 精确匹配职位（最高优先级，confidence=1.0）
    const exactMatch = this.positionMap.get(positionText.toLowerCase());
    if (exactMatch) {
      result.categoryCode = exactMatch.code;
      result.categoryName = exactMatch.name;
      result.positionName = positionText;
      result.confidence = 1.0;
      result.matchType = 'exact';
      result.matchedKeywords = [positionText];
      return result;
    }

    // 2. 包含匹配职位（confidence=0.9）
    for (const [positionName, func] of this.positionMap.entries()) {
      if (positionText.toLowerCase().includes(positionName)) {
        result.categoryCode = func.code;
        result.categoryName = func.name;
        result.positionName = positionName;
        result.confidence = 0.9;
        result.matchType = 'partial';
        result.matchedKeywords = [positionName];
        return result;
      }
    }

    // 3. 加权评分匹配（优化版，confidence=0.5-0.95）
    const weightedResult = this.classifyWithWeights(positionText);
    if (weightedResult.confidence > 0.5) {
      return weightedResult;
    }

    // 4. 降级：简单关键词匹配
    return this.classifyByKeywords(positionText);
  }

  /**
   * 加权评分分类（5 层关键词）
   */
  private classifyWithWeights(text: string): ClassificationResult {
    const result: ClassificationResult = {
      confidence: 0,
      matchType: 'weighted',
      matchedKeywords: [],
    };

    // 为每个职能计算加权评分
    const scores: { func: ClassificationRule; score: number; keywords: string[] }[] = [];

    for (const func of this.functions) {
      // 加载该职能下所有职位的关键词池
      const keywords = this.getWeightedKeywords(func.code);
      const score = this.calculateWeightedScore(text, keywords);
      
      if (score > 0.5) {
        scores.push({ func, score, keywords: [] });
      }
    }

    if (scores.length > 0) {
      // 取最高分
      scores.sort((a, b) => b.score - a.score);
      const best = scores[0];
      
      result.categoryCode = best.func.code;
      result.categoryName = best.func.name;
      result.positionName = text;
      result.confidence = Math.min(0.95, best.score);
      result.matchType = 'weighted';
      
      return result;
    }

    return result;
  }

  /**
   * 获取加权关键词列表
   */
  private getWeightedKeywords(functionCode: string): WeightedKeyword[] {
    const keywords: WeightedKeyword[] = [];
    
    // 从职位关键词池加载
    for (const [positionName, pk] of this.positionKeywords.entries()) {
      if (pk.functionCode === functionCode && pk.keywords) {
        if (pk.keywords.layer1_core) {
          for (const kw of pk.keywords.layer1_core) {
            keywords.push({ keyword: kw, layer: 1, weight: 1.0 });
          }
        }
        if (pk.keywords.layer2_framework) {
          for (const kw of pk.keywords.layer2_framework) {
            keywords.push({ keyword: kw, layer: 2, weight: 0.9 });
          }
        }
        if (pk.keywords.layer3_tool) {
          for (const kw of pk.keywords.layer3_tool) {
            keywords.push({ keyword: kw, layer: 3, weight: 0.8 });
          }
        }
        if (pk.keywords.layer4_skill) {
          for (const kw of pk.keywords.layer4_skill) {
            keywords.push({ keyword: kw, layer: 4, weight: 0.7 });
          }
        }
        if (pk.keywords.layer5_exclude) {
          for (const kw of pk.keywords.layer5_exclude) {
            keywords.push({ keyword: kw, layer: 5, weight: -1.0 });
          }
        }
      }
    }

    // 如果职位关键词池为空，使用职能的通用关键词
    if (keywords.length === 0) {
      const func = this.functions.find(f => f.code === functionCode);
      if (func) {
        for (const kw of func.keywords) {
          keywords.push({ keyword: kw, layer: 2, weight: 0.8 });
        }
      }
    }

    return keywords;
  }

  /**
   * 计算加权评分
   */
  private calculateWeightedScore(text: string, keywords: WeightedKeyword[]): number {
    let score = 0;
    let maxPositiveScore = 0;
    const matchedKeywords: string[] = [];

    for (const kw of keywords) {
      if (text.toLowerCase().includes(kw.keyword.toLowerCase())) {
        matchedKeywords.push(kw.keyword);
        if (kw.weight > 0) {
          score += kw.weight;
          maxPositiveScore += kw.weight;
        } else {
          // 排除词：直接降低评分
          score += kw.weight;
        }
      } else {
        maxPositiveScore += Math.max(0, kw.weight);
      }
    }

    // 如果有排除词匹配，大幅降低置信度
    const hasExcludeMatch = keywords.some(kw => 
      kw.layer === 5 && text.toLowerCase().includes(kw.keyword.toLowerCase())
    );
    
    if (hasExcludeMatch && score < maxPositiveScore * 0.5) {
      return 0;  // 排除
    }

    // 归一化到 0-1
    return maxPositiveScore > 0 ? Math.max(0, Math.min(1, score / maxPositiveScore)) : 0;
  }

  /**
   * 简单关键词匹配（降级方案）
   */
  private classifyByKeywords(positionText: string): ClassificationResult {
    const result: ClassificationResult = {
      confidence: 0,
      matchType: 'keyword',
      matchedKeywords: [],
    };

    const matchedKeywords: { keyword: string; weight: number }[] = [];
    
    for (const func of this.functions) {
      for (const keyword of func.keywords) {
        if (positionText.toLowerCase().includes(keyword.toLowerCase())) {
          matchedKeywords.push({ keyword, weight: 0.8 });
        }
      }
    }

    if (matchedKeywords.length > 0) {
      matchedKeywords.sort((a, b) => b.weight - a.weight);
      const bestMatch = this.functions.find(f => 
        f.keywords.some(k => k.toLowerCase() === matchedKeywords[0].keyword.toLowerCase())
      );
      
      if (bestMatch) {
        result.categoryCode = bestMatch.code;
        result.categoryName = bestMatch.name;
        result.positionName = positionText;
        result.confidence = Math.min(0.8, 0.5 + matchedKeywords.length * 0.1);
        result.matchType = 'keyword';
        result.matchedKeywords = matchedKeywords.map(m => m.keyword);
        return result;
      }
    }

    result.confidence = 0;
    result.positionName = positionText;
    return result;
  }

  /**
   * 批量分类
   */
  batchClassify(positions: string[]): ClassificationResult[] {
    return positions.map(p => this.classify(p));
  }

  /**
   * 获取所有行业
   */
  getIndustries(): ClassificationRule[] {
    return this.industries;
  }

  /**
   * 获取所有职能
   */
  getFunctions(): ClassificationRule[] {
    return this.functions;
  }

  /**
   * 根据职能编码获取职位列表
   */
  getPositionsByFunction(functionCode: string): string[] {
    const func = this.functions.find(f => f.code === functionCode);
    return func?.positions || [];
  }
}
