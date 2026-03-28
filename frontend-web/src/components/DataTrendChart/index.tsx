import React from 'react';
import { Card, Radio } from 'tdesign-react';
import './DataTrendChart.css';

export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface DataTrendChartProps {
  title: string;
  data: ChartDataPoint[];
  type?: 'line' | 'bar' | 'area';
  height?: number;
  onTypeChange?: (type: 'line' | 'bar' | 'area') => void;
  loading?: boolean;
}

const DataTrendChart: React.FC<DataTrendChartProps> = ({
  title,
  data,
  type = 'line',
  height = 200,
  onTypeChange,
  loading = false,
}) => {
  if (loading) {
    return (
      <Card title={title} className="data-trend-chart" bordered={false}>
        <div className="chart-loading" style={{ height }}>
          加载中...
        </div>
      </Card>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value));
  const chartHeight = height - 40;

  return (
    <Card
      title={title}
      className="data-trend-chart"
      bordered={false}
      actions={
        <Radio.Group value={type} onChange={(val) => onTypeChange?.(val as 'line' | 'bar' | 'area')}>
          <Radio.Button value="line">折线图</Radio.Button>
          <Radio.Button value="bar">柱状图</Radio.Button>
          <Radio.Button value="area">面积图</Radio.Button>
        </Radio.Group>
      }
    >
      <div className="chart-container" style={{ height: chartHeight }}>
        <div className="chart-y-axis">
          <span>{maxValue}</span>
          <span>{Math.round(maxValue / 2)}</span>
          <span>0</span>
        </div>
        <div className="chart-content">
          {data.map((point, index) => {
            const percentage = (point.value / maxValue) * 100;
            return (
              <div key={index} className="chart-bar-wrapper">
                {type === 'bar' ? (
                  <div
                    className="chart-bar"
                    style={{ height: `${percentage}%` }}
                    title={`${point.label}: ${point.value}`}
                  >
                    <span className="bar-value">{point.value}</span>
                  </div>
                ) : (
                  <div
                    className="chart-point"
                    style={{ bottom: `${percentage}%` }}
                    title={`${point.label}: ${point.value}`}
                  >
                    <div className="point-dot" />
                    <div className="point-value">{point.value}</div>
                  </div>
                )}
                <div className="chart-label">{point.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

export default DataTrendChart;
