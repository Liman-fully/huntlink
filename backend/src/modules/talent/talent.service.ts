import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between, MoreThan, LessThan, In } from 'typeorm';
import { Talent } from './talent.entity';
import { TalentFilterDto, SortBy, SortOrder } from './dto/talent-filter.dto';

@Injectable()
export class TalentService {
  constructor(
    @InjectRepository(Talent)
    private talentRepo: Repository<Talent>,
  ) {}

  async getTalents(filter: TalentFilterDto) {
    const { 
      page = 1, 
      pageSize = 20, 
      sortBy = SortBy.LATEST, 
      sortOrder = SortOrder.DESC, 
      ...filters 
    } = filter;
    
    const skip = (page - 1) * pageSize;

    // 构建查询条件
    const where: any = {};
    
    // 精确匹配和模糊匹配
    if (filters.location) where.location = Like(`%${filters.location}%`);
    if (filters.experience) where.experience = filters.experience;
    if (filters.education) where.education = filters.education;
    if (filters.company) where.currentCompany = Like(`%${filters.company}%`);
    if (filters.expectedSalary) where.expectedSalary = filters.expectedSalary;
    if (filters.jobStatus) where.jobStatus = filters.jobStatus;
    if (filters.industry) where.industry = Like(`%${filters.industry}%`);
    if (filters.gender) where.gender = filters.gender;
    if (filters.jobType) where.jobType = filters.jobType;
    if (filters.workExperience) where.workExperience = filters.workExperience;
    if (filters.educationYear) where.educationYear = filters.educationYear;
    if (filters.resumeComplete !== undefined) where.resumeComplete = filters.resumeComplete;
    if (filters.verified !== undefined) where.verified = filters.verified;

    // 技能标签（数组包含）
    if (filters.skills) {
      const skillList = filters.skills.split(',').map(s => s.trim());
      // TypeORM 简单数组包含查询
      where.skills = In(skillList);
    }

    // 年龄范围解析
    if (filters.age) {
      const [minAge, maxAge] = filters.age.split('-').map(Number);
      if (!isNaN(minAge) && !isNaN(maxAge)) {
        where.age = Between(minAge, maxAge);
      }
    }

    // 技能数量范围解析
    if (filters.skillsCount) {
      const [minCount, maxCount] = filters.skillsCount.split('-').map(Number);
      if (!isNaN(minCount) && !isNaN(maxCount)) {
        where.skillsCount = Between(minCount, maxCount);
      }
    }

    // 匹配分数范围解析
    if (filters.matchScore) {
      const [minScore, maxScore] = filters.matchScore.split('-').map(Number);
      if (!isNaN(minScore) && !isNaN(maxScore)) {
        where.matchScore = Between(minScore, maxScore);
      }
    }

    // 最后活跃时间范围解析
    if (filters.lastActive) {
      const days = parseInt(filters.lastActive.replace('天', '').replace('最近', ''));
      if (!isNaN(days)) {
        const daysAgo = new Date();
        daysAgo.setDate(daysAgo.getDate() - days);
        where.lastActive = MoreThan(daysAgo);
      }
    }

    // 排序
    const order: any = {};
    switch (sortBy) {
      case SortBy.ACTIVE:
        order.lastActive = sortOrder === SortOrder.ASC ? 'ASC' : 'DESC';
        break;
      case SortBy.SCORE:
        order.matchScore = sortOrder === SortOrder.ASC ? 'ASC' : 'DESC';
        break;
      case SortBy.LATEST:
      default:
        order.createdAt = sortOrder === SortOrder.ASC ? 'ASC' : 'DESC';
    }

    // 执行查询
    const [data, total] = await this.talentRepo.findAndCount({
      where,
      order,
      skip,
      take: pageSize,
    });

    return {
      data,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }
}
