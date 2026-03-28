import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Interview } from './interview.entity';
import { CreateInterviewDto, UpdateFeedbackDto } from './dto/interview.dto';

interface FindAllParams {
  page?: number;
  limit?: number;
  candidateId?: string;
  jobId?: string;
  status?: string;
}

@Injectable()
export class InterviewService {
  constructor(
    @InjectRepository(Interview)
    private readonly interviewRepository: Repository<Interview>,
  ) {}

  async findAll(params: FindAllParams) {
    const { page = 1, limit = 20, candidateId, jobId, status } = params;
    const queryBuilder = this.interviewRepository.createQueryBuilder('interview');

    if (candidateId) {
      queryBuilder.andWhere('interview.candidateId = :candidateId', { candidateId });
    }

    if (jobId) {
      queryBuilder.andWhere('interview.jobId = :jobId', { jobId });
    }

    if (status && status !== 'all') {
      queryBuilder.andWhere('interview.status = :status', { status });
    }

    queryBuilder.skip((page - 1) * limit).take(limit);
    queryBuilder.orderBy('interview.scheduledAt', 'DESC');

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Interview> {
    const interview = await this.interviewRepository.findOne({
      where: { id },
      relations: ['candidate', 'job'],
    });

    if (!interview) {
      throw new NotFoundException(`Interview with ID ${id} not found`);
    }

    return interview;
  }

  async create(createInterviewDto: CreateInterviewDto): Promise<Interview> {
    const interview = this.interviewRepository.create(createInterviewDto);
    return this.interviewRepository.save(interview);
  }

  async updateStatus(id: string, status: string): Promise<Interview> {
    const interview = await this.findOne(id);
    interview.status = status as any;
    return this.interviewRepository.save(interview);
  }

  async updateFeedback(id: string, updateFeedbackDto: UpdateFeedbackDto): Promise<Interview> {
    const interview = await this.findOne(id);
    interview.feedback = updateFeedbackDto.feedback;
    if (updateFeedbackDto.score !== undefined) {
      interview.score = updateFeedbackDto.score;
    }
    return this.interviewRepository.save(interview);
  }
}
