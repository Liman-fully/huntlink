import React from 'react';
import { Card, Tag, Button, Avatar, Checkbox, Dropdown } from 'tdesign-react';
import './ResumeCard.css';

export interface ResumeCardProps {
  data: {
    id: string;
    name: string;
    currentTitle: string;
    currentCompany: string;
    experience: string;
    education: string;
    school?: string;
    location: string;
    expectedSalary: string;
    skills: string[];
    avatar?: string;
    lastActive: string;
    matchScore?: number;
    personalScore?: number;
  };
  variant?: 'default' | 'compact' | 'dialog';
  selectable?: boolean;
  selected?: boolean;
  onSelect?: (id: string, selected: boolean) => void;
  onAction?: (action: { type: string; id: string }) => void;
  onClick?: (id: string) => void;
}

const ResumeCard: React.FC<ResumeCardProps> = ({
  data,
  variant = 'default',
  selectable = false,
  selected = false,
  onSelect,
  onAction,
  onClick
}) => {
  const handleViewDetail = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAction?.({ type: 'view', id: data.id });
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAction?.({ type: 'download', id: data.id });
  };

  const handleSendInterview = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAction?.({ type: 'interview', id: data.id });
  };

  const handleAddToPool = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAction?.({ type: 'add', id: data.id });
  };

  const handleSelect = (checked: boolean) => {
    onSelect?.(data.id, checked);
  };

  const handleCardClick = () => {
    onClick?.(data.id);
  };

  const moreActions = [
    { content: '分享', value: 'share' },
    { content: '收藏', value: 'favorite' },
    { content: '举报', value: 'report' },
  ];

  const handleMoreAction = (value: string) => {
    onAction?.({ type: value, id: data.id });
  };

  return (
    <Card
      className={`resume-card resume-card--${variant} ${selected ? 'resume-card--selected' : ''}`}
      hoverShadow
      onClick={handleCardClick}
    >
      {/* 顶部区域：勾选 + 头像 + 基本信息 + 评分 */}
      <div className="resume-header">
        {selectable && (
          <Checkbox
            checked={selected}
            onChange={handleSelect}
            onClick={(e) => e.stopPropagation()}
            className="select-checkbox"
          />
        )}
        <Avatar size="48px" image={data.avatar} className="avatar">
          {data.name?.charAt(0)}
        </Avatar>
        <div className="resume-info">
          <div className="name-row">
            <span className="candidate-name">{data.name}</span>
            <span className="current-title">{data.currentTitle}</span>
            {data.currentCompany && (
              <>
                <span className="separator">@</span>
                <span className="company">{data.currentCompany}</span>
              </>
            )}
          </div>
          <div className="meta-row">
            <span className="meta-item">{data.experience}</span>
            <span className="separator">·</span>
            <span className="meta-item">{data.education}</span>
            {data.school && (
              <>
                <span className="separator">·</span>
                <span className="meta-item">{data.school}</span>
              </>
            )}
            <span className="separator">·</span>
            <span className="meta-item">{data.location}</span>
            <span className="separator">·</span>
            <span className="meta-item salary">{data.expectedSalary}</span>
          </div>
        </div>
        <div className="resume-scores">
          {data.matchScore !== undefined && (
            <Tag theme="primary" variant="light" className="score-tag">
              匹配度 {data.matchScore}%
            </Tag>
          )}
          {data.personalScore !== undefined && (
            <Tag theme="success" variant="light" className="score-tag">
              评分 {data.personalScore}
            </Tag>
          )}
        </div>
      </div>

      {/* 技能区域 */}
      <div className="resume-skills">
        <span className="skills-label">技能：</span>
        {data.skills.slice(0, 6).map((skill, index) => (
          <Tag key={index} variant="outline" className="skill-tag">
            {skill}
          </Tag>
        ))}
        {data.skills.length > 6 && (
          <Tag theme="default" variant="outline">
            +{data.skills.length - 6}
          </Tag>
        )}
      </div>

      {/* 状态区域 */}
      <div className="resume-status">
        <span className="status-item">
          <span className="status-dot active"></span>
          {data.lastActive}活跃
        </span>
      </div>

      {/* 操作按钮区域 */}
      <div className="resume-actions">
        <Button theme="primary" size="small" onClick={handleViewDetail}>
          查看简历
        </Button>
        <Button variant="outline" size="small" onClick={handleDownload}>
          下载
        </Button>
        <Button variant="outline" size="small" onClick={handleSendInterview}>
          发送面试
        </Button>
        <Button variant="outline" size="small" onClick={handleAddToPool}>
          加入人才库
        </Button>
        <Dropdown
          options={moreActions}
          onClick={handleMoreAction}
          trigger="click"
        >
          <Button variant="text" size="small">
            更多
          </Button>
        </Dropdown>
      </div>
    </Card>
  );
};

export default ResumeCard;
