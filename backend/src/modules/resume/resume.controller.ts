import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResumeService } from './resume.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import * as Express from 'express';

@Controller('resume')
@UseGuards(JwtAuthGuard)
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (req, file, cb) => {
      const allowedTypes = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'];
      const ext = file.originalname.substring(file.originalname.lastIndexOf('.')).toLowerCase();
      if (allowedTypes.includes(ext)) {
        cb(null, true);
      } else {
        cb(new Error('不支持的文件类型'), false);
      }
    },
  }))
  async uploadResume(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
    @Body('folderId') folderId?: string,
  ) {
    if (!file) {
      return { success: false, message: '请上传文件' };
    }

    const resume = await this.resumeService.uploadResume(
      req.user.id,
      file,
      folderId,
    );

    return {
      success: true,
      data: resume,
      message: '简历上传成功，正在解析中',
    };
  }

  @Post('batch-upload')
  @UseInterceptors(FileInterceptor('files'))
  async batchUpload(
    @Request() req,
    @UploadedFile() files: Express.Multer.File[],
    @Body('folderId') folderId?: string,
  ) {
    // TODO: 批量上传实现
    return { success: true, message: '批量上传功能开发中' };
  }

  @Get('list')
  async getResumes(
    @Request() req,
    @Query('folderId') folderId?: string,
  ) {
    const resumes = await this.resumeService.getResumes(req.user.id, folderId);
    return { success: true, data: resumes };
  }

  @Get(':id')
  async getResume(@Request() req, @Param('id') id: string) {
    const resume = await this.resumeService.getResumeById(id, req.user.id);
    return { success: true, data: resume };
  }

  @Delete(':id')
  async deleteResume(@Request() req, @Param('id') id: string) {
    await this.resumeService.deleteResume(id, req.user.id);
    return { success: true, message: '删除成功' };
  }

  @Post('folder')
  async createFolder(
    @Request() req,
    @Body('name') name: string,
    @Body('parentId') parentId?: string,
  ) {
    const folder = await this.resumeService.createFolder(req.user.id, name, parentId);
    return { success: true, data: folder };
  }

  @Get('folders')
  async getFolders(@Request() req) {
    const folders = await this.resumeService.getFolders(req.user.id);
    return { success: true, data: folders };
  }
}
