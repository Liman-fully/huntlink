import React from 'react';
import { Card, Tag, Button, Avatar, Rate, Space } from 'tdesign-react';
import './ResumeCard.css';

export interface ResumeCardProps {
  id: string;
  name: string;
  avatar?: string;
  position: string;
  experience: string;
  location: string;
  salary: string;
  education: string;
  company: string;
  department?: string;
  summary: string;
  skills: string[];
  activityScore: number; // 1-5
  matchScore?: number; // 0-100
  jobStatus?: 'actively_looking' | 'open_to_offers' | 'not_looking';
  onViewDetail?: () => void;
  onContact?: () => void;
  onAddToPool?: () => void;
}

const jobStatusMap = {
  actively_looking: { text: '正在找工作', color: '#2BA471' },
  open_to_offers: { text: '观望中', color: '#E37318' },
  not_looking: { text: '暂不考虑', color: '#C9CDD4' },
};

const ResumeCard: React.FC<ResumeCardProps> = ({
  name,
  avatar,
  position,
  experience,
  location,
  salary,
  education,
  company,
  department,
  summary,
  skills,
  activityScore,
  matchScore,
  jobStatus,
  onViewDetail,
  onContact,
  onAddToPool,
}) => {
  return (
    <Card className="resume-card" hoverShadow>
      <div className="card-header">
        <Avatar size="48px" image={avatar} className="avatar">
          {name?.charAt(0)}
        </Avatar>
        <div className="basic-info">
          <div className="name-row">
            <span className="candidate-name">{name}</span>
            {jobStatus && (
              <span
                className="job-status"
                style={{ backgroundColor: jobStatusMap[jobStatus].color }}
              >
                {jobStatusMap[jobStatus].text}
              </span>
            )}
          </div>
          <div className="position-row">
            <span className="position">{position}</span>
            <span className="separator">·</span>
            <span className="experience">{experience}</span>
          </div>
          <div className="meta-row">
            <span className="meta-item">
              <span className="icon">📍</span>
              {location}
            </span>
            <span className="meta-item">
              <span className="icon">💰</span>
              <span className="salary-number">{salary}</span>
            </span>
            <span className="meta-item">
              <span className="icon">🎓</span>
              {education}
            </span>
          </div>
        </div>
      </div>

      <div className="card-body">
        <div className="company-row">
          <span className="icon">🏢</span>
          <span className="company">{company}</span>
          {department && (
            <>
              <span className="separator">·</span>
              <span className="department">{department}</span>
            </>
          )}
        </div>
        <div className="summary">{summary}</div>
      </div>

      <div className="card-tags">
        {skills.slice(0, 5).map((skill, index) => (
          <Tag key={index} theme="primary" variant="light" className="skill-tag">
            {skill}
          </Tag>
        ))}
        {skills.length > 5 && (
          <Tag theme="default" variant="outline">
            +{skills.length - 5}
          </Tag>
        )}
      </div>

      <div className="card-footer">
        <div className="rating">
          <span className="rating-label">活跃度：</span>
          <Rate value={activityScore} readonly size="14px" />
        </div>
        {matchScore !== undefined && (
          <div className="match-score">
            <span className="match-label">匹配度：</span>
            <Tag
              theme={matchScore >= 70 ? 'success' : matchScore >= 50 ? 'warning' : 'default'}
              variant="light"
            >
              {matchScore}%
            </Tag>
          </div>
        )}
      </div>

      <div className="card-actions">
        <Button variant="outline" onClick={onViewDetail}>
          查看详情
        </Button>
        <Button theme="primary" onClick={onContact}>
          立即沟通
        </Button>
        <Button variant="outline" onClick={onAddToPool}>
          加入人才库
        </Button>
      </div>
    </Card>
  );
};

export default ResumeCard;
