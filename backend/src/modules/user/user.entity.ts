import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index
} from 'typeorm';

export enum UserRole {
  HR = 'hr',
  SEEKER = 'seeker',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ length: 11 })
  phone: string;

  @Column({ length: 50 })
  name: string;

  @Column({ name: 'id_card', length: 18 })
  idCard: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.SEEKER })
  role: UserRole;

  @Column({ nullable: true, length: 500 })
  avatar: string;

  @Column({ nullable: true, length: 200 })
  company: string;

  @Column({ default: true, name: 'is_active' })
  isActive: boolean;

  @Column({ default: false, name: 'is_blocked' })
  isBlocked: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
