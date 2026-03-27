import { Card, Row, Col, Statistic, Button, Tag } from 'tdesign-react';
import { UserAddIcon, FolderIcon, ChatIcon, BriefcaseIcon } from 'tdesign-icons-react';
import './Dashboard.css';

export default function Dashboard() {
  return (
    <div className="dashboard">
      <div className="welcome gradient-hero">
        <h1>早上好，欢迎回来</h1>
        <p>今天有 12 份新简历等待处理</p>
      </div>

      <Row gutter={24} className="stats-row">
        <Col span={6}>
          <Card className="stat-card card-hover">
            <Statistic
              title="今日新增简历"
              value={128}
              trend="increase"
              trendValue="12%"
              prefix={<UserAddIcon />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="stat-card card-hover">
            <Statistic
              title="简历库总量"
              value={3842}
              prefix={<FolderIcon />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="stat-card card-hover">
            <Statistic
              title="待处理消息"
              value={56}
              prefix={<ChatIcon />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="stat-card card-hover">
            <Statistic
              title="活跃职位"
              value={8}
              prefix={<BriefcaseIcon />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={16}>
          <Card title="快捷入口" className="quick-actions">
            <Row gutter={16}>
              <Col span={6}>
                <Button block theme="primary" size="large">
                  发布职位
                </Button>
              </Col>
              <Col span={6}>
                <Button block theme="default" size="large">
                  搜索人才
                </Button>
              </Col>
              <Col span={6}>
                <Button block theme="default" size="large">
                  导入简历
                </Button>
              </Col>
              <Col span={6}>
                <Button block theme="default" size="large">
                  邮箱设置
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="待办事项" className="todo-list">
            <div className="todo-item">
              <Tag theme="primary">面试</Tag>
              <span>张** - 高级前端工程师</span>
              <span className="time">14:00</span>
            </div>
            <div className="todo-item">
              <Tag theme="warning">简历</Tag>
              <span>处理 8 份新简历</span>
              <span className="time">今日</span>
            </div>
            <div className="todo-item">
              <Tag theme="success">跟进</Tag>
              <span>李** - 产品经理意向确认</span>
              <span className="time">明日</span>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
