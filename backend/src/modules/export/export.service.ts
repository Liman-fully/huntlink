import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Queue } from 'bull';
import { ExportTask, TaskStatus } from './export-task.entity';
import { Resume } from '../resume/resume.entity';
import { PdfExporter } from './pdf-exporter';
import { ExcelExporter } from './excel-exporter';

@Injectable()
export class ExportService {
  constructor(
    @InjectRepository(ExportTask)
    private taskRepo: Repository<ExportTask>,
    @InjectRepository(Resume)
    private resumeRepo: Repository<Resume>,
    @Inject('EXPORT_QUEUE')
    private exportQueue: Queue,
    private pdfExporter: PdfExporter,
    private excelExporter: ExcelExporter,
  ) {}

  /**
   * 创建导出任务
   */
  async createExportTask(
    userId: string,
    resumeIds: string[],
    format: string,
  ): Promise<ExportTask> {
    const task = this.taskRepo.create({
      userId,
      format,
      status: TaskStatus.PENDING,
      totalCount: resumeIds.length,
      processedCount: 0,
    });
    await this.taskRepo.save(task);

    // 添加到队列
    await this.exportQueue.add({
      taskId: task.id,
      userId,
      resumeIds,
      format,
    });

    return task;
  }

  /**
   * 查询任务状态
   */
  async getTaskStatus(taskId: string, userId: string): Promise<ExportTask> {
    const task = await this.taskRepo.findOne({
      where: { id: taskId, userId },
    });
    if (!task) throw new Error('任务不存在');
    return task;
  }

  /**
   * 处理导出（队列 worker）
   */
  async processExport(data: any) {
    const { taskId, userId, resumeIds, format } = data;

    try {
      // 更新状态为处理中
      await this.taskRepo.update(taskId, { status: TaskStatus.PROCESSING });

      // 获取所有简历数据
      const resumes = await this.getResumes(resumeIds, userId);

      // 根据格式导出
      let filePath: string;
      if (format === 'pdf') {
        filePath = await this.pdfExporter.export(resumes, userId);
      } else {
        filePath = await this.excelExporter.export(resumes, userId);
      }

      // TODO: 集成 COS 存储
      // const cosUrl = await this.uploadToCos(filePath);

      // 更新状态为完成
      await this.taskRepo.update(taskId, {
        status: TaskStatus.COMPLETED,
        filePath,
        processedCount: resumes.length,
        completedAt: new Date(),
      });

      return { success: true, filePath };
    } catch (error) {
      // 更新状态为失败
      await this.taskRepo.update(taskId, {
        status: TaskStatus.FAILED,
        errorMessage: error.message,
      });
      throw error;
    }
  }

  /**
   * 获取简历数据
   */
  private async getResumes(resumeIds: string[], userId: string) {
    const resumes = await this.resumeRepo.findByIds(resumeIds);
    // 过滤确保属于当前用户
    return resumes.filter(r => r.userId === userId);
  }

  /**
   * 上传文件到 COS（待实现）
   */
  private async uploadToCos(filePath: string): Promise<string> {
    // TODO: 实现 COS 上传逻辑
    // const cos = require('cos-nodejs-sdk-v5');
    // const cosInstance = new Cos({ ... });
    // return cosInstance.putObject({ ... });
    return filePath;
  }
}
