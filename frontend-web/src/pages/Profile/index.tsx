import { Card, Row, Col, Avatar, Button, Tabs, Progress, Tag, Descriptions } from 'tdesign-react';
import { EditIcon, SettingIcon } from 'tdesign-icons-react';
import './Profile.css';

export default function Profile() {
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
            <Tabs
              defaultValue="info"
              tabs={[
                { label: '基本信息', value: 'info' },
                { label: '账号设置', value: 'settings' },
                { label: '消费记录', value: 'history' },
              ]}
            >
              <div className="tab-content">
                <Descriptions title="个人资料">
                  <Descriptions.Item label="姓名">李明</Descriptions.Item>
                  <Descriptions.Item label="手机号">138****8888</Descriptions.Item>
                  <Descriptions.Item label="邮箱">liman@example.com</Descriptions.Item>
                  <Descriptions.Item label="公司名称">猎脉科技</Descriptions.Item>
                  <Descriptions.Item label="职位">猎头顾问</Descriptions.Item>
                  <Descriptions.Item label="认证状态">已认证</Descriptions.Item>
                </Descriptions>

                <Descriptions title="会员信息" style={{ marginTop: 24 }}>
                  <Descriptions.Item label="会员等级">高级会员</Descriptions.Item>
                  <Descriptions.Item label="到期时间">2025-03-27</Descriptions.Item>
                  <Descriptions.Item label="续费">
                    <Button theme="primary" size="small">立即续费</Button>
                  </Descriptions.Item>
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
            </Tabs>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
