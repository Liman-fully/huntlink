import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('candidates')
@Index(['city'])
@Index(['education_level'])
@Index(['work_years'])
export class Candidate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  name: string;

  @Index({ unique: true })
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

  @Column({ name: 'resume_jsonb', type: 'json', nullable: true })
  resumeJsonb: any;

  @Column({ name: 'resume_url', length: 255, nullable: true })
  resumeUrl: string;

  @Column({ name: 'is_verified', default: false })
  isVerified: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
