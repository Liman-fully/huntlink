import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Queue } from 'bull';
import * as path from 'path';
import * as fs from 'fs';
import { ExportTask, TaskStatus } from './export-task.entity';
import { Resume } from '../resume/resume.entity';

@Injectable()
export class ExportService {
  constructor(
    @InjectRepository(ExportTask)
    private taskRepo: Repository<ExportTask>,
    @InjectRepository(Resume)
    private resumeRepo: Repository<Resume>,
    @Inject('EXPORT_QUEUE')
    private exportQueue: Queue,
  ) {}

  // 创建导出任务
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

  // 查询任务状态
  async getTaskStatus(taskId: string, userId: string): Promise<ExportTask> {
    const task = await this.taskRepo.findOne({
      where: { id: taskId, userId },
    });
    if (!task) throw new Error('任务不存在');
    return task;
  }

  // 处理导出（队列 worker）
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
        filePath = await this.exportToPdf(resumes, userId);
      } else {
        filePath = await this.exportToExcel(resumes, userId);
      }

      // 更新状态为完成
      await this.taskRepo.update(taskId, {
        status: TaskStatus.COMPLETED,
        filePath,
        processedCount: resumes.length,
        completedAt: new Date(),
      });
    } catch (error) {
      // 更新状态为失败
      await this.taskRepo.update(taskId, {
        status: TaskStatus.FAILED,
        errorMessage: error.message,
      });
      throw error;
    }
  }

  // 获取简历数据
  private async getResumes(resumeIds: string[], userId: string) {
    const resumes = await this.resumeRepo.findByIds(resumeIds);
    // 过滤确保属于当前用户
    return resumes.filter(r => r.userId === userId);
  }

  // PDF 导出实现
  private async exportToPdf(resumes: any[], userId: string): Promise<string> {
    const PDFDocument = require('pdfkit');
    const doc = new PDFDocument({ margin: 50 });
    const fileName = `resumes_${Date.now()}.pdf`;
    const filePath = path.join('uploads', 'exports', userId, fileName);
    const fullPath = path.join(process.cwd(), filePath);
    
    // 创建目录
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // 写入文件
    const stream = fs.createWriteStream(fullPath);
    doc.pipe(stream);

    // 生成 PDF 内容
    resumes.forEach((resume, index) => {
      if (index > 0) doc.addPage();
      
      // 标题 - 姓名
      doc.fontSize(24).font('Helvetica-Bold').text(resume.basicInfo?.name || '未命名简历', { align: 'center' });
      doc.moveDown(0.5);
      
      // 基本信息
      doc.fontSize(12).font('Helvetica');
      const info = resume.basicInfo;
      if (info) {
        const infoLines = [];
        if (info.phone) infoLines.push(`电话：${info.phone}`);
        if (info.email) infoLines.push(`邮箱：${info.email}`);
        if (info.location) infoLines.push(`地点：${info.location}`);
        if (info.gender) infoLines.push(`性别：${info.gender}`);
        if (info.age) infoLines.push(`年龄：${info.age}`);
        if (infoLines.length > 0) {
          doc.text(infoLines.join(' | '), { align: 'center' });
        }
      }
      
      doc.moveDown(1);
      
      // 求职意向
      if (resume.jobIntention) {
        doc.fontSize(16).font('Helvetica-Bold').text('求职意向', { underline: true });
        doc.moveDown(0.3);
        doc.fontSize(11).font('Helvetica');
        const intention = resume.jobIntention;
        if (intention.expectedPosition) doc.text(`期望职位：${intention.expectedPosition}`);
        if (intention.expectedSalary) doc.text(`期望薪资：${intention.expectedSalary}`);
        if (intention.expectedLocation) doc.text(`期望地点：${intention.expectedLocation}`);
        doc.moveDown(0.5);
      }
      
      // 工作经历
      if (resume.workExperience && resume.workExperience.length > 0) {
        doc.fontSize(16).font('Helvetica-Bold').text('工作经历', { underline: true });
        doc.moveDown(0.3);
        doc.fontSize(11).font('Helvetica');
        resume.workExperience.forEach((exp: any) => {
          doc.fontSize(12).font('Helvetica-Bold').text(`${exp.position} | ${exp.company}`);
          doc.fontSize(10).font('Helvetica').text(`${exp.startDate} - ${exp.endDate}`);
          if (exp.description) {
            doc.text(exp.description, { indent: 20 });
          }
          doc.moveDown(0.5);
        });
      }
      
      // 教育经历
      if (resume.education && resume.education.length > 0) {
        doc.fontSize(16).font('Helvetica-Bold').text('教育经历', { underline: true });
        doc.moveDown(0.3);
        doc.fontSize(11).font('Helvetica');
        resume.education.forEach((edu: any) => {
          doc.fontSize(12).font('Helvetica-Bold').text(`${edu.school} - ${edu.major} (${edu.degree})`);
          doc.fontSize(10).font('Helvetica').text(`${edu.startDate} - ${edu.endDate}`);
          doc.moveDown(0.3);
        });
      }
      
      // 技能
      if (resume.skills && resume.skills.length > 0) {
        doc.fontSize(16).font('Helvetica-Bold').text('专业技能', { underline: true });
        doc.moveDown(0.3);
        doc.fontSize(11).font('Helvetica');
        doc.text(resume.skills.join(', '));
      }
      
      // 项目经验
      if (resume.projects && resume.projects.length > 0) {
        doc.addPage();
        doc.fontSize(16).font('Helvetica-Bold').text('项目经验', { underline: true });
        doc.moveDown(0.3);
        doc.fontSize(11).font('Helvetica');
        resume.projects.forEach((proj: any, idx: number) => {
          doc.fontSize(12).font('Helvetica-Bold').text(`${idx + 1}. ${proj.name} - ${proj.role}`);
          doc.fontSize(10).font('Helvetica').text(`${proj.startDate} - ${proj.endDate}`);
          if (proj.description) {
            doc.text(proj.description, { indent: 20 });
          }
          doc.moveDown(0.5);
        });
      }
    });

    doc.end();

    // 等待写入完成
    await new Promise<void>((resolve, reject) => {
      stream.on('finish', () => resolve());
      stream.on('error', reject);
    });

    return filePath;
  }

  // Excel 导出实现
  private async exportToExcel(resumes: any[], userId: string): Promise<string> {
    const ExcelJS = require('exceljs');
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('简历列表');

    // 设置表头样式
    worksheet.properties.defaultRowHeight = 20;
    worksheet.getRow(1).font = { bold: true, size: 12 };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFD700' },
    };
    worksheet.getRow(1).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };

    // 添加表头
    worksheet.columns = [
      { header: '姓名', key: 'name', width: 15 },
      { header: '电话', key: 'phone', width: 15 },
      { header: '邮箱', key: 'email', width: 25 },
      { header: '地点', key: 'location', width: 15 },
      { header: '期望职位', key: 'expectedPosition', width: 20 },
      { header: '期望薪资', key: 'expectedSalary', width: 15 },
      { header: '最近公司', key: 'latestCompany', width: 20 },
      { header: '最近职位', key: 'latestPosition', width: 20 },
      { header: '最高学历', key: 'highestDegree', width: 15 },
      { header: '毕业院校', key: 'school', width: 20 },
      { header: '专业技能', key: 'skills', width: 30 },
      { header: '工作年限', key: 'experience', width: 12 },
    ];

    // 添加数据
    resumes.forEach(resume => {
      const info = resume.basicInfo || {};
      const intention = resume.jobIntention || {};
      const workExp = resume.workExperience?.[0] || {};
      const edu = resume.education?.[0] || {};
      
      worksheet.addRow({
        name: info.name || 'N/A',
        phone: info.phone || 'N/A',
        email: info.email || 'N/A',
        location: info.location || 'N/A',
        expectedPosition: intention.expectedPosition || 'N/A',
        expectedSalary: intention.expectedSalary || 'N/A',
        latestCompany: workExp.company || 'N/A',
        latestPosition: workExp.position || 'N/A',
        highestDegree: edu.degree || 'N/A',
        school: edu.school || 'N/A',
        skills: resume.skills?.join(', ') || 'N/A',
        experience: this.calculateExperience(resume.workExperience),
      });
    });

    // 添加边框
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        row.eachCell((cell) => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          };
        });
      }
    });

    // 保存文件
    const fileName = `resumes_${Date.now()}.xlsx`;
    const filePath = path.join('uploads', 'exports', userId, fileName);
    const fullPath = path.join(process.cwd(), filePath);
    
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    await workbook.xlsx.writeFile(fullPath);
    return filePath;
  }

  // 计算工作年限
  private calculateExperience(workExperience?: any[]): string {
    if (!workExperience || workExperience.length === 0) return 'N/A';
    
    let totalMonths = 0;
    workExperience.forEach(exp => {
      if (exp.startDate && exp.endDate) {
        const start = new Date(exp.startDate);
        const end = exp.endDate.toLowerCase() === 'present' || exp.endDate === '至今' 
          ? new Date() 
          : new Date(exp.endDate);
        const months = (end.getFullYear() - start.getFullYear()) * 12 + 
                       (end.getMonth() - start.getMonth());
        totalMonths += Math.max(0, months);
      }
    });
    
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;
    return years > 0 ? `${years}年${months > 0 ? months + '个月' : ''}` : `${months}个月`;
  }
}
