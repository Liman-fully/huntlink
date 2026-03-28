import React from 'react';
import { Card } from 'tdesign-react';
import './StatsCard.css';

export interface StatsCardProps {
  title: string;
  value: string | number;
  trend?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  icon?: React.ReactNode;
  subtitle?: string;
  loading?: boolean;
}

/**
 * 核心指标卡片组件
 * 用于展示日活、下载量、搜索量等关键指标
 */
const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  trend,
  icon,
  subtitle,
  loading = false,
}) => {
  if (loading) {
    return (
      <Card className="stats-card stats-card-loading" bordered={false}>
        <div className="stats-card-content">
          <div className="stats-card-icon">{icon}</div>
          <div className="stats-card-body">
            <div className="stats-card-title">{title}</div>
            <div className="stats-card-value">
              <div className="value-skeleton"></div>
            </div>
            {subtitle && <div className="stats-card-subtitle">{subtitle}</div>}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="stats-card" bordered={false}>
      <div className="stats-card-content">
        {icon && (
          <div className="stats-card-icon">{icon}</div>
        )}
        <div className="stats-card-body">
          <div className="stats-card-title">{title}</div>
          <div className="stats-card-value">
            {value}
            {trend && (
              <span className={`stats-card-trend ${trend.type}`}>
                {trend.type === 'increase' ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
            )}
          </div>
          {subtitle && <div className="stats-card-subtitle">{subtitle}</div>}
        </div>
      </div>
    </Card>
  );
};

export default StatsCard;
