import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExportTask } from './export-task.entity';
import { Resume } from '../resume/resume.entity';
import { ExportService } from './export.service';
import { ExportController } from './export.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ExportTask, Resume]),
  ],
  controllers: [ExportController],
  providers: [
    ExportService,
    {
      provide: 'EXPORT_QUEUE',
      useFactory: () => {
        const Queue = require('bull');
        return new Queue('export', {
          redis: {
            host: process.env.REDIS_HOST || 'localhost',
            port: Number(process.env.REDIS_PORT) || 6379,
          },
        });
      },
    },
  ],
  exports: [ExportService],
})
export class ExportModule {}
