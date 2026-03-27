import { useState } from 'react';
import { Card, Row, Col, Input, Select, Tag, Button } from 'tdesign-react';
import ResumeCard from '@/components/ResumeCard';
import './TalentMarket.css';

const mockTalents = [
  {
    id: '1',
    name: '张**',
    currentTitle: '高级前端工程师',
    currentCompany: '字节跳动',
    experience: '5年',
    education: '本科 · 清华大学',
    location: '北京',
    expectedSalary: '40-60K',
    skills: ['React', 'TypeScript', 'Node.js', 'Vue'],
    avatar: '',
    lastActive: '2小时前',
    matchScore: 95,
    personalScore: 88,
  },
  {
    id: '2',
    name: '李**',
    currentTitle: '产品经理',
    currentCompany: '阿里巴巴',
    experience: '7年',
    education: '硕士 · 北京大学',
    location: '杭州',
    expectedSalary: '50-80K',
    skills: ['产品规划', '用户研究', '数据分析', 'B端产品'],
    avatar: '',
    lastActive: '刚刚活跃',
    matchScore: 92,
    personalScore: 90,
  },
  {
    id: '3',
    name: '王**',
    currentTitle: 'Java架构师',
    currentCompany: '腾讯',
    experience: '10年',
    education: '本科 · 浙江大学',
    location: '深圳',
    expectedSalary: '60-100K',
    skills: ['Java', 'Spring Cloud', '微服务', '分布式系统'],
    avatar: '',
    lastActive: '1天前',
    matchScore: 88,
    personalScore: 95,
  },
];

export default function TalentMarket() {
  const [searchKey, setSearchKey] = useState('');
  const [filter, setFilter] = useState({
    location: '',
    experience: '',
    education: '',
  });
  const [activeTab, setActiveTab] = useState('recommend');

  const handleFilterChange = (key: string, value: string) => {
    setFilter({ ...filter, [key]: value });
  };

  return (
    <div className="talent-market">
      <Card className="search-card">
        <div className="search-header">
          <Input
            placeholder="搜索人才姓名、技能、公司..."
            value={searchKey}
            onChange={setSearchKey}
            style={{ width: 400 }}
          />
          <div className="filters">
            <Select
              placeholder="工作地点"
              value={filter.location}
              onChange={(value) => handleFilterChange('location', String(value))}
              style={{ width: 120 }}
              options={[
                { label: '北京', value: '北京' },
                { label: '上海', value: '上海' },
                { label: '深圳', value: '深圳' },
                { label: '杭州', value: '杭州' },
              ]}
            />
            <Select
              placeholder="工作经验"
              value={filter.experience}
              onChange={(value) => handleFilterChange('experience', String(value))}
              style={{ width: 120 }}
              options={[
                { label: '1-3年', value: '1-3年' },
                { label: '3-5年', value: '3-5年' },
                { label: '5-10年', value: '5-10年' },
                { label: '10年以上', value: '10年以上' },
              ]}
            />
            <Select
              placeholder="学历"
              value={filter.education}
              onChange={(value) => handleFilterChange('education', String(value))}
              style={{ width: 120 }}
              options={[
                { label: '本科', value: '本科' },
                { label: '硕士', value: '硕士' },
                { label: '博士', value: '博士' },
              ]}
            />
          </div>
        </div>

        <div className="tab-nav">
          {[
            { key: 'recommend', label: '推荐人才' },
            { key: 'newest', label: '最新入驻' },
            { key: 'active', label: '活跃人才' },
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
      </Card>

      <Row gutter={[16, 16]} className="talent-grid">
        {mockTalents.map((talent) => (
          <Col key={talent.id} span={8}>
            <ResumeCard
              data={talent}
              onAction={(action) => console.log('action:', action, talent.id)}
            />
          </Col>
        ))}
      </Row>
    </div>
  );
}
