import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { ResumeService } from './resume.service';
import { Logger } from '@nestjs/common';

@Processor('resume-parsing')
export class ResumeProcessor {
  private readonly logger = new Logger(ResumeProcessor.name);

  constructor(private readonly resumeService: ResumeService) {}

  @Process({ name: 'parse', concurrency: 1 })
  async handleParsing(job: Job<{ resumeId: string }>) {
    const { resumeId } = job.data;
    this.logger.log(`开始处理简历解析任务: ${resumeId}`);
    
    try {
      await this.resumeService.parseResumeAsync(resumeId);
      this.logger.log(`简历解析任务完成: ${resumeId}`);
    } catch (error) {
      this.logger.error(`简历解析任务失败: ${resumeId}`, error.stack);
      throw error;
    }
  }
}
