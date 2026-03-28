import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobController } from './job.controller';

@Module({
  imports: [],
  controllers: [JobController],
  providers: [],
  exports: [],
})
export class JobModule {}
