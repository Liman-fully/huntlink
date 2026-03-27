import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as path from 'path';
import * as fs from 'fs';
import * as Express from 'express';
import { Resume } from './resume.entity';
import { ResumeFolder } from './resume-folder.entity';

interface ParseResult {
  basicInfo?: any;
  education?: any[];
  workExperience?: any[];
  projects?: any[];
  skills?: string[];
  certifications?: any[];
  jobIntention?: any;
}

@Injectable()
export class ResumeService {
  constructor(
    @InjectRepository(Resume)
    private resumeRepository: Repository<Resume>,
    @InjectRepository(ResumeFolder)
    private folderRepository: Repository<ResumeFolder>,
  ) {}

  async uploadResume(
    userId: string,
    file: Express.Multer.File,
    folderId?: string,
  ): Promise<Resume> {
    // 保存文件
    const uploadDir = path.join(process.cwd(), 'uploads', 'resumes', userId);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const fileName = `${Date.now()}_${file.originalname}`;
    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, file.buffer);

    // 创建简历记录
    const resume = this.resumeRepository.create({
      userId,
      filePath,
      fileName: file.originalname,
      fileSize: file.size,
      fileType: this.getFileType(file.originalname),
      folderId,
      parseStatus: 'pending',
    });

    await this.resumeRepository.save(resume);

    // 异步解析简历
    this.parseResumeAsync(resume.id);

    return resume;
  }

  async parseResumeAsync(resumeId: string): Promise<void> {
    const resume = await this.resumeRepository.findOne({ where: { id: resumeId } });
    if (!resume) return;

    try {
      // 更新状态为处理中
      resume.parseStatus = 'processing';
      await this.resumeRepository.save(resume);

      // 调用解析服务
      const parseResult = await this.callParseService(resume.filePath);

      // 更新解析结果
      resume.basicInfo = parseResult.basicInfo;
      resume.education = parseResult.education;
      resume.workExperience = parseResult.workExperience;
      resume.projects = parseResult.projects;
      resume.skills = parseResult.skills;
      resume.certifications = parseResult.certifications;
      resume.jobIntention = parseResult.jobIntention;
      resume.tags = this.generateTags(parseResult);
      resume.parseStatus = 'success';

      await this.resumeRepository.save(resume);
    } catch (error) {
      resume.parseStatus = 'failed';
      resume.parseError = error.message;
      await this.resumeRepository.save(resume);
    }
  }

  private async callParseService(filePath: string): Promise<ParseResult> {
    // TODO: 调用实际的解析服务
    // 方案1: SmartResume (需要GPU环境)
    // 方案2: 腾讯云OCR + 结构化处理
    // 方案3: DeepSeek API + prompt工程
    
    // 临时返回模拟数据
    return {
      basicInfo: {
        name: '示例姓名',
        phone: '13800138000',
        email: 'example@example.com',
      },
      education: [],
      workExperience: [],
      projects: [],
      skills: [],
    };
  }

  private getFileType(fileName: string): string {
    const ext = path.extname(fileName).toLowerCase();
    const typeMap: Record<string, string> = {
      '.pdf': 'pdf',
      '.doc': 'doc',
      '.docx': 'docx',
      '.jpg': 'jpg',
      '.jpeg': 'jpg',
      '.png': 'png',
    };
    return typeMap[ext] || 'unknown';
  }

  private generateTags(parseResult: ParseResult): string[] {
    const tags: string[] = [];
    
    // 从技能提取标签
    if (parseResult.skills) {
      tags.push(...parseResult.skills.slice(0, 10));
    }

    // 从工作经历提取公司标签
    if (parseResult.workExperience) {
      parseResult.workExperience.forEach(exp => {
        if (exp.company && !tags.includes(exp.company)) {
          tags.push(exp.company);
        }
      });
    }

    return tags;
  }

  async getResumes(userId: string, folderId?: string): Promise<Resume[]> {
    const query = this.resumeRepository.createQueryBuilder('resume')
      .where('resume.userId = :userId', { userId })
      .orderBy('resume.createdAt', 'DESC');

    if (folderId) {
      query.andWhere('resume.folderId = :folderId', { folderId });
    }

    return query.getMany();
  }

  async getResumeById(id: string, userId: string): Promise<Resume> {
    return this.resumeRepository.findOne({
      where: { id, userId },
    });
  }

  async createFolder(userId: string, name: string, parentId?: string): Promise<ResumeFolder> {
    const folder = this.folderRepository.create({
      userId,
      name,
      parentId,
    });
    return this.folderRepository.save(folder);
  }

  async getFolders(userId: string): Promise<ResumeFolder[]> {
    return this.folderRepository.find({
      where: { userId },
      order: { order: 'ASC', createdAt: 'ASC' },
    });
  }

  async deleteResume(id: string, userId: string): Promise<void> {
    const resume = await this.resumeRepository.findOne({ where: { id, userId } });
    if (!resume) {
      throw new BadRequestException('简历不存在');
    }

    // 删除文件
    if (fs.existsSync(resume.filePath)) {
      fs.unlinkSync(resume.filePath);
    }

    // 删除记录
    await this.resumeRepository.remove(resume);
  }
}
