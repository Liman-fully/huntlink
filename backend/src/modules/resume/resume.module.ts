import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResumeController } from './resume.controller';
import { ResumeService } from './resume.service';
import { Resume } from './resume.entity';
import { ResumeFolder } from './resume-folder.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Resume, ResumeFolder])],
  controllers: [ResumeController],
  providers: [ResumeService],
  exports: [ResumeService],
})
export class ResumeModule {}
