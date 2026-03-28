import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class Candidate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  name: string;

  @Column({ length: 20, unique: true })
  mobile: string;

  @Column({ length: 100, nullable: true })
  email: string;

  @Column({ name: 'work_years', default: 0 })
  workYears: number;

  @Column({ length: 50, nullable: true })
  city: string;

  @Column({ name: 'education_level', nullable: true })
  educationLevel: number;  // 1:本科，2:硕士，3:博士

  @Column({ name: 'resume_jsonb', type: 'jsonb', nullable: true })
  resumeJsonb: any;

  @Column({ name: 'search_context', type: 'tsvector', nullable: true })
  searchContext: any;

  @Column({ name: 'resume_url', length: 255, nullable: true })
  resumeUrl: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
