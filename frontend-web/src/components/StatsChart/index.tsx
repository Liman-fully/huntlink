import React, { useMemo } from 'react';
import { Card } from 'tdesign-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import './StatsChart.css';

// 注册 Chart.js 组件
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface StatsChartProps {
  title: string;
  data: ChartDataPoint[];
  type?: 'line' | 'bar' | 'doughnut';
  height?: number;
  subtitle?: string;
  loading?: boolean;
  colors?: {
    primary: string;
    secondary: string;
    background: string;
  };
}

// 默认颜色配置
const DEFAULT_COLORS = {
  primary: '#0052d9',
  secondary: '#00a870',
  background: 'rgba(0, 82, 217, 0.1)',
};

/**
 * 数据统计图表组件
 * 支持折线图、柱状图、环形图
 */
const StatsChart: React.FC<StatsChartProps> = ({
  title,
  data,
  type = 'line',
  height = 300,
  subtitle,
  loading = false,
  colors = DEFAULT_COLORS,
}) => {
  // 生成图表数据
  const chartData = useMemo(() => {
    const labels = data.map((d) => d.label);
    const values = data.map((d) => d.value);

    if (type === 'doughnut') {
      return {
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: [
              colors.primary,
              colors.secondary,
              '#ff9f43',
              '#54a0ff',
              '#5f27cd',
            ],
            borderWidth: 0,
          },
        ],
      };
    }

    return {
      labels,
      datasets: [
        {
          label: title,
          data: values,
          borderColor: colors.primary,
          backgroundColor: type === 'bar' ? colors.primary : colors.background,
          fill: type === 'line',
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: colors.primary,
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
        },
      ],
    };
  }, [data, type, title, colors]);

  // 图表选项
  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: type === 'doughnut',
          position: 'bottom' as const,
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          titleFont: {
            size: 14,
          },
          bodyFont: {
            size: 13,
          },
          cornerRadius: 8,
          displayColors: false,
        },
      },
      scales:
        type !== 'doughnut'
          ? {
              x: {
                grid: {
                  display: false,
                },
                ticks: {
                  color: '#979ba5',
                  font: {
                    size: 12,
                  },
                },
              },
              y: {
                grid: {
                  color: 'rgba(0, 0, 0, 0.05)',
                  borderDash: [5, 5],
                },
                ticks: {
                  color: '#979ba5',
                  font: {
                    size: 12,
                  },
                },
              },
            }
          : {},
    }),
    [type]
  );

  if (loading) {
    return (
      <Card className="stats-chart-card" title={title} subtitle={subtitle}>
        <div className="stats-chart-loading" style={{ height }}>
          <div className="chart-skeleton">
            <div className="skeleton-bars"></div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="stats-chart-card" title={title} subtitle={subtitle}>
      <div className="stats-chart-container" style={{ height }}>
        {type === 'line' && <Line data={chartData} options={options} />}
        {type === 'bar' && <Bar data={chartData} options={options} />}
        {type === 'doughnut' && <Doughnut data={chartData} options={options} />}
      </div>
    </Card>
  );
};

export default StatsChart;
