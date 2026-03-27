import { useState } from 'react';
import { Card, Row, Col, Avatar, Button, Progress, Tag, Descriptions } from 'tdesign-react';
import { EditIcon } from 'tdesign-icons-react';
import './Profile.css';

export default function Profile() {
  const [activeTab, setActiveTab] = useState('info');

  return (
    <div className="profile">
      <Row gutter={24}>
        <Col span={8}>
          <Card className="profile-card">
            <div className="profile-header">
              <Avatar size="80px">李</Avatar>
              <h2>李明</h2>
              <p>猎头 · 猎脉科技</p>
              <div className="profile-tags">
                <Tag theme="primary">高级会员</Tag>
                <Tag theme="success">已认证</Tag>
              </div>
            </div>
            <div className="profile-stats">
              <div className="stat">
                <span className="stat-value">3842</span>
                <span className="stat-label">简历库</span>
              </div>
              <div className="stat">
                <span className="stat-value">156</span>
                <span className="stat-label">收藏</span>
              </div>
              <div className="stat">
                <span className="stat-value">23</span>
                <span className="stat-label">沟通</span>
              </div>
            </div>
            <Button theme="primary" block icon={<EditIcon />}>
              编辑资料
            </Button>
          </Card>

          <Card className="points-card" title="积分账户" style={{ marginTop: 16 }}>
            <div className="points-balance">
              <span className="points-value">2,580</span>
              <span className="points-unit">积分</span>
            </div>
            <Button theme="primary" variant="dashed" block>
              充值积分
            </Button>
            <div className="points-actions">
              <span>消费记录</span>
              <span>积分规则</span>
            </div>
          </Card>
        </Col>

        <Col span={16}>
          <Card className="detail-card">
            <div className="tab-nav" style={{ marginBottom: 16 }}>
              {[
                { key: 'info', label: '基本信息' },
                { key: 'settings', label: '账号设置' },
                { key: 'history', label: '消费记录' },
              ].map((tab) => (
                <Tag
                  key={tab.key}
                  theme={activeTab === tab.key ? 'primary' : 'default'}
                  variant={activeTab === tab.key ? 'dark' : 'outline'}
                  className="tab-tag"
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                </Tag>
              ))}
            </div>

            <div className="tab-content">
              <Descriptions title="个人资料">
                <Descriptions.DescriptionsItem label="姓名">李明</Descriptions.DescriptionsItem>
                <Descriptions.DescriptionsItem label="手机号">138****8888</Descriptions.DescriptionsItem>
                <Descriptions.DescriptionsItem label="邮箱">liman@example.com</Descriptions.DescriptionsItem>
                <Descriptions.DescriptionsItem label="公司名称">猎脉科技</Descriptions.DescriptionsItem>
                <Descriptions.DescriptionsItem label="职位">猎头顾问</Descriptions.DescriptionsItem>
                <Descriptions.DescriptionsItem label="认证状态">已认证</Descriptions.DescriptionsItem>
              </Descriptions>

              <Descriptions title="会员信息" style={{ marginTop: 24 }}>
                <Descriptions.DescriptionsItem label="会员等级">高级会员</Descriptions.DescriptionsItem>
                <Descriptions.DescriptionsItem label="到期时间">2025-03-27</Descriptions.DescriptionsItem>
                <Descriptions.DescriptionsItem label="续费">
                  <Button theme="primary" size="small">立即续费</Button>
                </Descriptions.DescriptionsItem>
              </Descriptions>

              <div className="membership-benefits">
                <h4>会员权益</h4>
                <Row gutter={16}>
                  <Col span={6}>
                    <div className="benefit-item">
                      <Progress theme="circle" percentage={100} label="无限" />
                      <span>简历下载</span>
                    </div>
                  </Col>
                  <Col span={6}>
                    <div className="benefit-item">
                      <Progress theme="circle" percentage={100} label="免费" />
                      <span>简历更新</span>
                    </div>
                  </Col>
                  <Col span={6}>
                    <div className="benefit-item">
                      <Progress theme="circle" percentage={100} label="✓" />
                      <span>高级搜索</span>
                    </div>
                  </Col>
                  <Col span={6}>
                    <div className="benefit-item">
                      <Progress theme="circle" percentage={100} label="✓" />
                      <span>邮箱导入</span>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
