import { Card, Row, Col, Statistic, Button, Tag, Timeline, Space } from 'tdesign-react';
import { 
  UserAddIcon, 
  FolderIcon, 
  ChatIcon,
  AddIcon,
  SearchIcon,
  UploadIcon,
  DownloadIcon,
  SettingIcon
} from 'tdesign-icons-react';
import './Dashboard.css';

export default function Dashboard() {
  // 模拟待办数据
  const todoItems = [
    { time: '14:00', type: 'interview', tag: '面试', tagTheme: 'primary', title: '张** - 高级前端工程师', subtitle: '会议室 A · 技术面' },
    { time: '15:30', type: 'call', tag: '电话', tagTheme: 'warning', title: '李** - 产品经理意向确认', subtitle: '138****1234' },
    { time: '明日', type: 'follow', tag: '跟进', tagTheme: 'success', title: '王** - offer 谈判', subtitle: '薪资确认' },
  ];

  return (
    <div className="dashboard">
      {/* 欢迎区 - 简洁 */}
      <div className="welcome-compact">
        <h1>早上好，左护法</h1>
        <p>今天有 <strong>12</strong> 份新简历 <Button size="small" variant="text">查看</Button></p>
      </div>

      <Row gutter={24}>
        {/* 左侧：核心指标 + 快捷操作 */}
        <Col span={6}>
          {/* 核心指标 - 精简到3个 */}
          <div className="stats-compact">
            <Card className="stat-card-mini card-hover">
              <div className="stat-content">
                <span className="stat-value">128</span>
                <span className="stat-label">今日新增</span>
              </div>
            </Card>
            <Card className="stat-card-mini card-hover">
              <div className="stat-content">
                <span className="stat-value">3842</span>
                <span className="stat-label">简历总量</span>
              </div>
            </Card>
            <Card className="stat-card-mini card-hover">
              <div className="stat-content">
                <span className="stat-value highlight">56</span>
                <span className="stat-label">待处理</span>
              </div>
            </Card>
          </div>
        </Col>

        {/* 右侧：快捷操作 + 待办事项 */}
        <Col span={18}>
          <Card className="quick-actions-grid" bordered={false}>
            <Row gutter={[16, 16]}>
              {/* 快捷操作 - 6个按钮 2行3列 */}
              <Col span={8}>
                <Button block theme="primary" size="large" icon={<AddIcon />}>
                  发布职位
                </Button>
              </Col>
              <Col span={8}>
                <Button block theme="default" size="large" icon={<SearchIcon />}>
                  搜索人才
                </Button>
              </Col>
              <Col span={8}>
                <Button block theme="default" size="large" icon={<UploadIcon />}>
                  导入简历
                </Button>
              </Col>
              <Col span={8}>
                <Button block theme="default" size="large" icon={<ChatIcon />}>
                  批量面试
                </Button>
              </Col>
              <Col span={8}>
                <Button block theme="default" size="large" icon={<DownloadIcon />}>
                  导出报表
                </Button>
              </Col>
              <Col span={8}>
                <Button block theme="default" size="large" icon={<SettingIcon />}>
                  邮箱设置
                </Button>
              </Col>
            </Row>
          </Card>

          {/* 待办事项 - 时间线样式 */}
          <Card title="今日待办" className="todo-timeline-card">
            <Timeline>
              {todoItems.map((item, index) => (
                <Timeline.Item 
                  key={index}
                  label={item.time}
                >
                  <div className="timeline-item-content">
                    <Tag theme={item.tagTheme as any} variant="light">{item.tag}</Tag>
                    <div className="timeline-text">
                      <span className="timeline-title">{item.title}</span>
                      <span className="timeline-subtitle">{item.subtitle}</span>
                    </div>
                  </div>
                </Timeline.Item>
              ))}
            </Timeline>
          </Card>
        </Col>
      </Row>

      {/* 数据趋势图表区 */}
      <Row gutter={24} className="chart-row">
        <Col span={8}>
          <Card title="本周简历趋势" className="chart-card">
            <div className="chart-placeholder">
              <p className="chart-hint">简历数量趋势图</p>
              <div className="mock-chart bars">
                {[65, 80, 45, 90, 120, 85, 128].map((h, i) => (
                  <div key={i} className="bar" style={{ height: `${h}%` }}></div>
                ))}
              </div>
              <div className="chart-labels">
                <span>一</span><span>二</span><span>三</span><span>四</span><span>五</span><span>六</span><span>日</span>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="职位效果对比" className="chart-card">
            <div className="chart-placeholder">
              <p className="chart-hint">职位收到的简历数</p>
              <div className="mock-chart horizontal-bars">
                {[
                  { label: '前端工程师', value: 85 },
                  { label: '产品经理', value: 60 },
                  { label: 'UI设计师', value: 45 },
                ].map((item, i) => (
                  <div key={i} className="h-bar-row">
                    <span className="h-bar-label">{item.label}</span>
                    <div className="h-bar">
                      <div className="h-bar-fill" style={{ width: `${item.value}%` }}></div>
                    </div>
                    <span className="h-bar-value">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="渠道来源分析" className="chart-card">
            <div className="chart-placeholder">
              <p className="chart-hint">简历来源分布</p>
              <div className="mock-chart pie">
                <div className="pie-chart">
                  <div className="pie-segment seg1"></div>
                  <div className="pie-segment seg2"></div>
                  <div className="pie-segment seg3"></div>
                </div>
                <div className="pie-legend">
                  <span className="legend-item"><span className="dot blue"></span>上传 45%</span>
                  <span className="legend-item"><span className="dot green"></span>邮箱 35%</span>
                  <span className="legend-item"><span className="dot orange"></span>其他 20%</span>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
