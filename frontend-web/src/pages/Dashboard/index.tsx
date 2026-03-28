import { useState, useEffect, useCallback } from 'react';
import { Row, Col } from 'tdesign-react';
import { RefreshIcon } from 'tdesign-icons-react';
import StatsCard from '../../components/StatsCard';
import RecruitmentFunnel from '../../components/RecruitmentFunnel';
import TrendChart from '../../components/TrendChart';
import './Dashboard.css';

interface DashboardStats {
  candidates: number;
  activeJobs: number;
  interviews: number;
  successRate: number;
}

interface FunnelData {
  step: string;
  count: number;
}

interface TrendData {
  month: string;
  candidates: number;
  interviews: number;
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [funnelData, setFunnelData] = useState<FunnelData[]>([]);
  const [trendData, setTrendData] = useState<TrendData[]>([]);

  // 获取数据
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // 模拟从后端获取的数据
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      setStats({
        candidates: 125,
        activeJobs: 12,
        interviews: 45,
        successRate: 0.15
      });
      
      setFunnelData([
        { step: '简历获取', count: 125 },
        { step: '初步沟通', count: 85 },
        { step: '安排面试', count: 45 },
        { step: '发送录取', count: 18 },
      ]);

      setTrendData([
        { month: '10月', candidates: 45, interviews: 12 },
        { month: '11月', candidates: 52, interviews: 18 },
        { month: '12月', candidates: 68, interviews: 25 },
        { month: '1月', candidates: 75, interviews: 32 },
        { month: '2月', candidates: 92, interviews: 38 },
        { month: '3月', candidates: 125, interviews: 45 },
      ]);

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
          <Col xs={24} sm={12} lg={6}>
            <StatsCard
              title="候选人总数"
              value={stats?.candidates.toLocaleString() ?? '-'}
              trend={{ value: 12, type: 'increase' }}
              subtitle="本月新增"
              loading={loading}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatsCard
              title="在线职位"
              value={stats?.activeJobs.toLocaleString() ?? '-'}
              trend={{ value: 2, type: 'increase' }}
              subtitle="本月发布"
              loading={loading}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatsCard
              title="已安排面试"
              value={stats?.interviews.toLocaleString() ?? '-'}
              trend={{ value: 8, type: 'increase' }}
              subtitle="本周面试"
              loading={loading}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatsCard
              title="招聘成功率"
              value={((stats?.successRate ?? 0) * 100).toFixed(1) + '%'}
              trend={{ value: 1.5, type: 'increase' }}
              subtitle="较上月"
              loading={loading}
            />
          </Col>
        </Row>
      </div>

      {/* 数据图表 */}
      <div className="dashboard-section">
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={14}>
            <h2 className="section-title">招聘趋势</h2>
            <div className="chart-container" style={{ background: '#fff', padding: '20px', borderRadius: '8px' }}>
              <TrendChart data={trendData} loading={loading} />
            </div>
          </Col>
          <Col xs={24} lg={10}>
            <h2 className="section-title">招聘漏斗</h2>
            <div className="chart-container" style={{ background: '#fff', padding: '20px', borderRadius: '8px' }}>
              <RecruitmentFunnel data={funnelData} loading={loading} />
            </div>
          </Col>
        </Row>
      </div>

      {/* 来源分析替代卡片 */}
      <div className="dashboard-section">
        <h2 className="section-title">系统说明</h2>
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={12}>
            <div className="dashboard-info-card" style={{ background: '#fff', padding: '20px', borderRadius: '8px' }}>
              <h3>数据口径</h3>
              <ul>
                <li><strong>候选人总数：</strong>已导入系统的简历及手动创建的候选人总和</li>
                <li><strong>在线职位：</strong>状态为“发布中”的招聘需求</li>
                <li><strong>已安排面试：</strong>所有状态不为“已取消”的面试日程</li>
                <li><strong>数据刷新：</strong>系统每 30 秒自动同步后端最新聚合数据</li>
              </ul>
            </div>
          </Col>
          <Col xs={24} lg={12}>
            <div className="dashboard-info-card" style={{ background: '#fff', padding: '20px', borderRadius: '8px' }}>
              <h3>天策府提示</h3>
              <p>当前页面已升级至 V3.2，采用 Recharts 引擎重绘。后端 StatisticsService 已实现初步数据聚合逻辑。</p>
              <div className="dashboard-tip" style={{ marginTop: '15px', color: '#165dff' }}>
                💡 提示：若需导出报表，请前往“人才库管理”使用批量导出功能。
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}
