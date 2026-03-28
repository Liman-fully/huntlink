import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export interface ClassificationLogInput {
  inputText: string;
  resultCategoryCode?: string;
  resultCategoryName?: string;
  resultIndustryCode?: string;
  resultIndustryName?: string;
  confidence: number;
  matchType: 'exact' | 'partial' | 'weighted' | 'keyword';
  matchedKeywords: string[];
  userId?: string;
}

export interface ClassificationLog extends ClassificationLogInput {
  id: string;
  isManualOverride: boolean;
  manualResultCategoryCode?: string;
  errorType?: 'false_positive' | 'false_negative' | 'wrong_category';
  createdAt: Date;
}

@Injectable()
export class ClassificationLogger {
  constructor(
    @InjectRepository('classification_logs')
    private logsRepo: Repository<ClassificationLog>,
  ) {}

  /**
   * 记录分类日志
   */
  async log(input: ClassificationLogInput): Promise<ClassificationLog> {
    const log: ClassificationLog = {
      id: this.generateId(),
      isManualOverride: false,
      ...input,
      createdAt: new Date(),
    };

    try {
      await this.logsRepo.save(log);
    } catch (error) {
      console.error('[ClassificationLogger] Failed to save log:', error);
    }

    return log;
  }

  /**
   * 批量记录分类日志
   */
  async batchLog(inputs: ClassificationLogInput[]): Promise<void> {
    const logs: ClassificationLog[] = inputs.map(input => ({
      id: this.generateId(),
      isManualOverride: false,
      ...input,
      createdAt: new Date(),
    }));

    try {
      await this.logsRepo.save(logs);
    } catch (error) {
      console.error('[ClassificationLogger] Failed to save batch logs:', error);
    }
  }

  /**
   * 标记错误日志
   */
  async markError(
    logId: string,
    errorType: 'false_positive' | 'false_negative' | 'wrong_category',
    manualResultCategoryCode?: string,
  ): Promise<void> {
    try {
      await this.logsRepo.update(logId, {
        isManualOverride: true,
        manualResultCategoryCode,
        errorType,
      });
    } catch (error) {
      console.error('[ClassificationLogger] Failed to mark error:', error);
    }
  }

  /**
   * 获取待审核日志
   */
  async getPendingReview(limit: number = 100): Promise<ClassificationLog[]> {
    try {
      return await this.logsRepo.find({
        where: [
          { confidence: 0.5 },  // 低置信度
          { isManualOverride: true },  // 人工覆盖
        ],
        order: { createdAt: 'DESC' },
        take: limit,
      });
    } catch (error) {
      console.error('[ClassificationLogger] Failed to get pending review:', error);
      return [];
    }
  }

  /**
   * 获取错误统计
   */
  async getErrorStats(days: number = 7): Promise<{
    totalLogs: number;
    errorCount: number;
    errorRate: number;
    byType: Record<string, number>;
  }> {
    try {
      const since = new Date();
      since.setDate(since.getDate() - days);

      const logs = await this.logsRepo.find({
        where: { createdAt: since },
      });

      const totalLogs = logs.length;
      const errorCount = logs.filter(l => l.errorType).length;
      const byType: Record<string, number> = {};

      for (const log of logs) {
        if (log.errorType) {
          byType[log.errorType] = (byType[log.errorType] || 0) + 1;
        }
      }

      return {
        totalLogs,
        errorCount,
        errorRate: totalLogs > 0 ? errorCount / totalLogs : 0,
        byType,
      };
    } catch (error) {
      console.error('[ClassificationLogger] Failed to get error stats:', error);
      return {
        totalLogs: 0,
        errorCount: 0,
        errorRate: 0,
        byType: {},
      };
    }
  }

  /**
   * 检测潜在错误
   */
  detectPotentialError(log: ClassificationLog): boolean {
    // 规则 1: 置信度<0.5
    if (log.confidence < 0.5) return true;

    // 规则 2: 关键词匹配<3 个
    if (log.matchedKeywords.length < 3) return true;

    // 规则 3: 被人工覆盖
    if (log.isManualOverride) return true;

    return false;
  }

  private generateId(): string {
    return `log_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
}
