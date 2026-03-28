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

interface ClassificationResult {
  industryCode?: string;
  industryName?: string;
  categoryCode?: string;
  categoryName?: string;
  positionName?: string;
  confidence: number;
  matchType: 'exact' | 'partial' | 'keyword';
  matchedKeywords: string[];
}

export class PositionClassifier {
  private industries: ClassificationRule[] = [];
  private functions: ClassificationRule[] = [];
  private positionMap: Map<string, ClassificationRule> = new Map();
  private keywordWeights: Map<string, KeywordMatch[]> = new Map();

  constructor() {
    this.loadRules();
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
   * 分类职位名称
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

    // 3. 关键词匹配职能（confidence=0.7-0.8）
    const matchedKeywords: { keyword: string; weight: number }[] = [];
    
    for (const func of this.functions) {
      for (const keyword of func.keywords) {
        if (positionText.toLowerCase().includes(keyword.toLowerCase())) {
          matchedKeywords.push({ keyword, weight: 0.8 });
        }
      }
    }

    if (matchedKeywords.length > 0) {
      // 取权重最高的职能
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

    // 4. 无法匹配
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
