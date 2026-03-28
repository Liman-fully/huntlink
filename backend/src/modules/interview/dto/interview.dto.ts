import { IsString, IsOptional, IsEnum, IsUUID, IsInt, IsDateString } from 'class-validator';
import { InterviewStatus } from '../interview.entity';

export class CreateInterviewDto {
  @IsUUID()
  candidateId: string;

  @IsUUID()
  jobId: string;

  @IsDateString()
  scheduledAt: string;

  @IsOptional()
  @IsEnum(['pending', 'confirmed', 'completed', 'cancelled'])
  status?: InterviewStatus;
}

export class UpdateFeedbackDto {
  @IsString()
  feedback: string;

  @IsOptional()
  @IsInt()
  score?: number;
}
