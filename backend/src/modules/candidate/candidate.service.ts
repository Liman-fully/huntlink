import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { Candidate } from './candidate.entity';

export interface SearchCandidateDto {
  keyword?: string;        // 关键词搜索（职位/技能）
  city?: string;           // 城市
  educationLevel?: number; // 学历（1:本科，2:硕士，3:博士）
  workYearsMin?: number;   // 最小工作年限
  workYearsMax?: number;   // 最大工作年限
  skills?: string[];       // 技能标签
  page?: number;           // 页码
  limit?: number;          // 每页数量
  sortBy?: string;         // 排序字段（relevance/work_years/created_at）
  sortOrder?: 'ASC' | 'DESC'; // 排序方式
}

export interface SearchResults {
  data: Candidate[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class CandidateService {
  constructor(
    @InjectRepository(Candidate)
    private candidateRepo: Repository<Candidate>,
  ) {}

  /**
   * 搜索候选人（基于 PostgreSQL GIN 索引 + tsvector）
   */
  async searchCandidates(query: SearchCandidateDto): Promise<SearchResults> {
    const page = query.page || 1;
    const limit = Math.min(query.limit || 20, 100); // 最大 100 条
    const offset = (page - 1) * limit;

    // 构建查询
    const qb = this.candidateRepo.createQueryBuilder('candidate');

    // 全文搜索（使用 GIN 索引）
    if (query.keyword) {
      const tsquery = this.buildTsQuery(query.keyword);
      qb.andWhere('candidate.search_context @@ to_tsquery(:tsquery)', { tsquery })
        .addSelect('ts_rank(candidate.search_context, to_tsquery(:tsquery))', 'rank')
        .addOrderBy('rank', 'DESC');
    }

    // 城市过滤
    if (query.city) {
      qb.andWhere('candidate.city = :city', { city: query.city });
    }

    // 学历过滤
    if (query.educationLevel) {
      qb.andWhere('candidate.education_level >= :educationLevel', { 
        educationLevel: query.educationLevel 
      });
    }

    // 工作年限过滤
    if (query.workYearsMin !== undefined) {
      qb.andWhere('candidate.work_years >= :workYearsMin', { 
        workYearsMin: query.workYearsMin 
      });
    }
    if (query.workYearsMax !== undefined) {
      qb.andWhere('candidate.work_years <= :workYearsMax', { 
        workYearsMax: query.workYearsMax 
      });
    }

    // 技能标签过滤（JSONB 查询）
    if (query.skills && query.skills.length > 0) {
      qb.andWhere(new Brackets(qb => {
        query.skills.forEach((skill, index) => {
          qb.orWhere(`candidate.resume_jsonb->'skills' @> :skill${index}`, {
            [`skill${index}`]: JSON.stringify([skill]),
          });
        });
      }));
    }

    // 排序
    if (query.sortBy === 'work_years') {
      qb.orderBy('candidate.work_years', query.sortOrder || 'DESC');
    } else if (query.sortBy === 'created_at') {
      qb.orderBy('candidate.created_at', query.sortOrder || 'DESC');
    } else if (!query.keyword) {
      // 无关键词时默认按创建时间排序
      qb.orderBy('candidate.created_at', 'DESC');
    }

    // 分页
    qb.skip(offset).take(limit);

    // 执行查询
    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * 构建 PostgreSQL tsquery
   * 支持中文分词和同义词扩展
   */
  private buildTsQuery(keyword: string): string {
    // 清理特殊字符
    const cleaned = keyword
      .replace(/[&|!()<>]/g, ' ')  // 移除布尔运算符
      .trim();

    // 按空格分词，使用 & 连接（AND 逻辑）
    const terms = cleaned.split(/\s+/).filter(t => t.length > 0);
    
    if (terms.length === 0) {
      return "''";
    }

    // 使用 & 连接所有词（必须同时匹配）
    return terms.map(t => `${t}:*`).join(' & ');
  }

  /**
   * 高亮显示搜索结果
   */
  async highlightResult(candidateId: number, keyword: string): Promise<any> {
    const candidate = await this.candidateRepo.findOne({ where: { id: candidateId } });
    
    if (!candidate) {
      throw new Error('候选人不存在');
    }

    const tsquery = this.buildTsQuery(keyword);
    
    // 使用 ts_headline 高亮
    const result = await this.candidateRepo.query(`
      SELECT 
        id,
        name,
        ts_headline('chinese', resume_jsonb->>'work_experience_text', to_tsquery($1), 
          'StartSel=<b>, StopSel=</b>, MaxFragments=3, FragmentDelimiter=" ... "') 
        as highlighted_experience
      FROM candidates
      WHERE id = $2
    `, [tsquery, candidateId]);

    return {
      ...candidate,
      highlightedExperience: result[0]?.highlighted_experience || '',
    };
  }

  /**
   * 获取搜索建议（自动补全）
   */
  async getSearchSuggestions(query: string, limit: number = 5): Promise<string[]> {
    if (!query || query.length < 2) {
      return [];
    }

    // 从历史搜索中获取热门建议
    const suggestions = await this.candidateRepo.query(`
      SELECT DISTINCT city as suggestion
      FROM candidates
      WHERE city ILIKE $1 || '%'
      GROUP BY city
      ORDER BY COUNT(*) DESC
      LIMIT $2
    `, [query, limit]);

    return suggestions.map(s => s.suggestion);
  }

  /**
   * 统计搜索结果的分布
   */
  async getSearchStats(query: SearchCandidateDto): Promise<any> {
    const baseQb = this.candidateRepo.createQueryBuilder('candidate');
    
    // 应用搜索条件
    if (query.keyword) {
      const tsquery = this.buildTsQuery(query.keyword);
      baseQb.andWhere('candidate.search_context @@ to_tsquery(:tsquery)', { tsquery });
    }
    if (query.city) {
      baseQb.andWhere('candidate.city = :city', { city: query.city });
    }

    // 城市分布
    const cityStats = await baseQb
      .clone()
      .select('city', 'city')
      .addSelect('COUNT(*)', 'count')
      .groupBy('city')
      .orderBy('count', 'DESC')
      .limit(10)
      .getRawMany();

    // 学历分布
    const educationStats = await baseQb
      .clone()
      .select('education_level', 'level')
      .addSelect('COUNT(*)', 'count')
      .groupBy('education_level')
      .orderBy('level', 'ASC')
      .getRawMany();

    // 工作年限分布
    const workYearStats = await baseQb
      .clone()
      .select(`
        CASE 
          WHEN work_years < 3 THEN '0-3 年'
          WHEN work_years < 5 THEN '3-5 年'
          WHEN work_years < 10 THEN '5-10 年'
          ELSE '10 年以上'
        END
      `, 'range')
      .addSelect('COUNT(*)', 'count')
      .groupBy('range')
      .getRawMany();

    return {
      cityStats,
      educationStats,
      workYearStats,
    };
  }
}
