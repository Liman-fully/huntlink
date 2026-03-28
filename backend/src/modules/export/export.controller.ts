import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Request,
  UseGuards,
  Res,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ExportService } from './export.service';
import { ExportRequestDto, ExportFormat } from './dto/export-request.dto';
import { TaskStatus } from './export-task.entity';
import { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';

@ApiTags('导出')
@Controller('export')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ExportController {
  constructor(private readonly exportService: ExportService) {}

  @Post('resumes')
  @ApiOperation({ summary: '批量导出简历' })
  async exportResumes(
    @Request() req,
    @Body() dto: ExportRequestDto,
  ) {
    const task = await this.exportService.createExportTask(
      req.user.id,
      dto.resumeIds,
      dto.format,
    );
    return {
      success: true,
      data: { 
        taskId: task.id, 
        status: task.status,
        totalCount: task.totalCount,
      },
    };
  }

  @Get('status/:taskId')
  @ApiOperation({ summary: '查询导出进度' })
  async getExportStatus(
    @Request() req,
    @Param('taskId') taskId: string,
  ) {
    const task = await this.exportService.getTaskStatus(taskId, req.user.id);
    return {
      success: true,
      data: {
        taskId: task.id,
        status: task.status,
        totalCount: task.totalCount,
        processedCount: task.processedCount,
        filePath: task.filePath,
        errorMessage: task.errorMessage,
        createdAt: task.createdAt,
        completedAt: task.completedAt,
        progress: task.totalCount > 0 
          ? Math.round((task.processedCount / task.totalCount) * 100) 
          : 0,
      },
    };
  }

  @Get('download/:taskId')
  @ApiOperation({ summary: '下载导出文件' })
  async downloadExport(
    @Request() req,
    @Param('taskId') taskId: string,
    @Res() res: Response,
  ) {
    const task = await this.exportService.getTaskStatus(taskId, req.user.id);
    
    if (task.status !== TaskStatus.COMPLETED || !task.filePath) {
      throw new NotFoundException('文件未生成或已过期');
    }

    const fullPath = path.join(process.cwd(), task.filePath);
    
    if (!fs.existsSync(fullPath)) {
      throw new NotFoundException('文件不存在');
    }

    const fileName = path.basename(task.filePath);
    res.download(fullPath, fileName);
  }
}
