import { useState, useEffect, useCallback } from 'react';
import { Row, Col } from 'tdesign-react';
import { RefreshIcon } from 'tdesign-icons-react';
import StatsCard from '../../components/StatsCard';
import StatsChart, { ChartDataPoint } from '../../components/StatsChart';
import './Dashboard.css';

// 模拟数据生成器
const generateMockData = () => ({
  stats: {
    dailyActive: {
      value: Math.floor(Math.random() * 500) + 800,
      trend: { value: Math.floor(Math.random() * 20) + 5, type: 'increase' as const },
    },
    downloads: {
      value: Math.floor(Math.random() * 1000) + 2000,
      trend: { value: Math.floor(Math.random() * 15) + 3, type: 'increase' as const },
    },
    searches: {
      value: Math.floor(Math.random() * 2000) + 5000,
      trend: { value: Math.floor(Math.random() * 10) + 2, type: 'decrease' as const },
    },
  },
  charts: {
    dailyTrend: Array.from({ length: 7 }, (_, i) => ({
      label: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'][i],
      value: Math.floor(Math.random() * 500) + 500,
    })),
    weeklyStats: Array.from({ length: 4 }, (_, i) => ({
      label: ['第 1 周', '第 2 周', '第 3 周', '第 4 周'][i],
      value: Math.floor(Math.random() * 1000) + 2000,
    })),
    sourceDistribution: [
      { label: '直接访问', value: Math.floor(Math.random() * 30) + 20 },
      { label: '搜索引擎', value: Math.floor(Math.random() * 25) + 15 },
      { label: '社交媒体', value: Math.floor(Math.random() * 20) + 10 },
      { label: '推荐链接', value: Math.floor(Math.random() * 15) + 5 },
    ],
  },
});

interface DashboardStats {
  dailyActive: { value: number; trend: { value: number; type: 'increase' | 'decrease' } };
  downloads: { value: number; trend: { value: number; type: 'increase' | 'decrease' } };
  searches: { value: number; trend: { value: number; type: 'increase' | 'decrease' } };
}

interface DashboardCharts {
  dailyTrend: ChartDataPoint[];
  weeklyStats: ChartDataPoint[];
  sourceDistribution: ChartDataPoint[];
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [charts, setCharts] = useState<DashboardCharts | null>(null);

  // 获取数据
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // 模拟 API 调用延迟
      await new Promise((resolve) => setTimeout(resolve, 800));
      const data = generateMockData();
      setStats(data.stats);
      setCharts(data.charts);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('获取数据失败:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // 初始加载
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 自动刷新（每 30 秒）
  useEffect(() => {
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="dashboard">
      {/* 页面头部 */}
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h1>数据看板</h1>
          <p className="dashboard-subtitle">实时监控核心业务指标</p>
        </div>
        <div className="dashboard-actions">
          <span className="last-updated">
            最后更新：{formatTime(lastUpdated)}
          </span>
          <button 
            className="refresh-btn" 
            onClick={fetchData}
            disabled={loading}
          >
            <RefreshIcon /> {loading ? '刷新中...' : '刷新'}
          </button>
        </div>
      </div>

      {/* 核心指标卡片 */}
      <div className="dashboard-section">
        <h2 className="section-title">核心指标</h2>
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} lg={8}>
            <StatsCard
              title="日活跃用户"
              value={stats?.dailyActive.value.toLocaleString() ?? '-'}
              trend={stats?.dailyActive.trend}
              subtitle="较昨日"
              loading={loading}
            />
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <StatsCard
              title="下载量"
              value={stats?.downloads.value.toLocaleString() ?? '-'}
              trend={stats?.downloads.trend}
              subtitle="较昨日"
              loading={loading}
            />
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <StatsCard
              title="搜索量"
              value={stats?.searches.value.toLocaleString() ?? '-'}
              trend={stats?.searches.trend}
              subtitle="较昨日"
              loading={loading}
            />
          </Col>
        </Row>
      </div>

      {/* 数据图表 */}
      <div className="dashboard-section">
        <h2 className="section-title">数据趋势</h2>
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={12}>
            <StatsChart
              title="日活趋势"
              data={charts?.dailyTrend ?? []}
              type="line"
              height={280}
              loading={loading}
            />
          </Col>
          <Col xs={24} lg={12}>
            <StatsChart
              title="周下载统计"
              data={charts?.weeklyStats ?? []}
              type="bar"
              height={280}
              loading={loading}
            />
          </Col>
        </Row>
      </div>

      {/* 来源分析 */}
      <div className="dashboard-section">
        <h2 className="section-title">用户来源分析</h2>
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={12}>
            <StatsChart
              title="流量来源分布"
              data={charts?.sourceDistribution ?? []}
              type="doughnut"
              height={280}
              loading={loading}
            />
          </Col>
          <Col xs={24} lg={12}>
            <div className="dashboard-info-card">
              <h3>数据说明</h3>
              <ul>
                <li><strong>日活跃用户：</strong>每日独立访问用户数</li>
                <li><strong>下载量：</strong>简历/文档等资源下载次数</li>
                <li><strong>搜索量：</strong>平台内搜索请求总数</li>
                <li><strong>数据更新：</strong>每 30 秒自动刷新</li>
              </ul>
              <div className="dashboard-tip">
                💡 提示：点击右上角刷新按钮可手动更新数据
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}
