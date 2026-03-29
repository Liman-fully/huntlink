import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Talent } from '../talent/talent.entity';

@Injectable()
export class DeduplicationService {
  private readonly logger = new Logger(DeduplicationService.name);

  constructor(
    @InjectRepository(Talent)
    private talentRepository: Repository<Talent>,
  ) {}

  /**
   * 科学去重判断逻辑
   * 维度：姓名 + (手机 OR 邮箱 OR (学校 + 公司 + 职位))
   */
  async findExistingTalent(parsedData: any): Promise<Talent | null> {
    const { name, phone, email, school, currentCompany, currentTitle } = parsedData;

    if (!name) return null;

    // 1. 强唯一标识匹配 (手机/邮箱)
    const strongMatch = await this.talentRepository.findOne({
      where: [
        { name, phone },
        { name, email }
      ]
    });
    if (strongMatch) return strongMatch;

    // 2. 软属性组合匹配 (防混淆：更换手机号/邮箱的情况)
    // 逻辑：姓名一致 且 (学校一致 OR 公司+职位一致)
    const query = this.talentRepository.createQueryBuilder('talent')
      .where('talent.name = :name', { name });

    if (school) {
      query.andWhere('talent.school = :school', { school });
    } else if (currentCompany && currentTitle) {
      query.andWhere('talent.currentCompany = :currentCompany', { currentCompany })
           .andWhere('talent.currentTitle = :currentTitle', { currentTitle });
    }

    return await query.getOne();
  }

  /**
   * 更新决策逻辑：选择“最近”且“最完整”的简历
   */
  shouldUpdate(existing: Talent, newData: any): boolean {
    // 如果新简历的工作经历更多或包含了更高学历，则更新
    const existingCompleteness = this.calculateCompleteness(existing);
    const newCompleteness = this.calculateCompleteness(newData);
    
    return newCompleteness >= existingCompleteness;
  }

  private calculateCompleteness(data: any): number {
    let score = 0;
    if (data.phone) score += 1;
    if (data.email) score += 1;
    if (data.workExperience?.length > 0) score += 5;
    if (data.projects?.length > 0) score += 3;
    if (data.education?.length > 0) score += 2;
    return score;
  }
}
