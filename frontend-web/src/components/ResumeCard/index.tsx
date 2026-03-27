import React from 'react';
import { Card, Tag, Button, Avatar, Rate } from 'tdesign-react';
import './ResumeCard.css';

export interface ResumeCardProps {
  data: {
    id: string;
    name: string;
    currentTitle: string;
    currentCompany: string;
    experience: string;
    education: string;
    location: string;
    expectedSalary: string;
    skills: string[];
    avatar?: string;
    lastActive: string;
    matchScore?: number;
    personalScore?: number;
  };
  variant?: 'default' | 'compact' | 'dialog';
  onAction?: (action: { type: string; id: string }) => void;
}

const ResumeCard: React.FC<ResumeCardProps> = ({ data, variant = 'default', onAction }) => {
  const handleViewDetail = () => {
    onAction?.({ type: 'view', id: data.id });
  };

  const handleContact = () => {
    onAction?.({ type: 'contact', id: data.id });
  };

  const handleAddToPool = () => {
    onAction?.({ type: 'add', id: data.id });
  };

  return (
    <Card className={`resume-card resume-card--${variant}`} hoverShadow>
      <div className="card-header">
        <Avatar size="48px" image={data.avatar} className="avatar">
          {data.name?.charAt(0)}
        </Avatar>
        <div className="basic-info">
          <div className="name-row">
            <span className="candidate-name">{data.name}</span>
            <span className="last-active">活跃于 {data.lastActive}</span>
          </div>
          <div className="position-row">
            <span className="position">{data.currentTitle}</span>
            <span className="separator">·</span>
            <span className="company">{data.currentCompany}</span>
          </div>
          <div className="meta-row">
            <span className="meta-item">
              <span className="icon">📍</span>
              {data.location}
            </span>
            <span className="meta-item">
              <span className="icon">💰</span>
              <span className="salary-number">{data.expectedSalary}</span>
            </span>
            <span className="meta-item">
              <span className="icon">🎓</span>
              {data.education}
            </span>
            <span className="meta-item">
              <span className="icon">⏱️</span>
              {data.experience}
            </span>
          </div>
        </div>
      </div>

      <div className="card-body">
        <div className="summary">{data.currentCompany} · {data.currentTitle}</div>
      </div>

      <div className="card-tags">
        {data.skills.slice(0, 5).map((skill, index) => (
          <Tag key={index} theme="primary" variant="light" className="skill-tag">
            {skill}
          </Tag>
        ))}
        {data.skills.length > 5 && (
          <Tag theme="default" variant="outline">
            +{data.skills.length - 5}
          </Tag>
        )}
      </div>

      <div className="card-footer">
        {data.personalScore !== undefined && (
          <div className="score-item">
            <span className="score-label">个人评分：</span>
            <Tag theme="primary" variant="light">
              {data.personalScore}分
            </Tag>
          </div>
        )}
        {data.matchScore !== undefined && (
          <div className="score-item">
            <span className="score-label">匹配度：</span>
            <Tag
              theme={data.matchScore >= 70 ? 'success' : data.matchScore >= 50 ? 'warning' : 'default'}
              variant="light"
            >
              {data.matchScore}%
            </Tag>
          </div>
        )}
      </div>

      <div className="card-actions">
        <Button variant="outline" onClick={handleViewDetail}>
          查看详情
        </Button>
        <Button theme="primary" onClick={handleContact}>
          立即沟通
        </Button>
        <Button variant="outline" onClick={handleAddToPool}>
          加入人才库
        </Button>
      </div>
    </Card>
  );
};

export default ResumeCard;
