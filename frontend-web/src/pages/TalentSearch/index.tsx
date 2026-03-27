import { useState } from 'react';
import { Card, Row, Col, Input, Button, Tag, Divider } from 'tdesign-react';
import ResumeCard from '@/components/ResumeCard';
import './TalentSearch.css';

const searchConditions = {
  basic: [
    { key: 'location', label: '工作地点', options: ['北京', '上海', '深圳', '杭州', '广州', '成都'] },
    { key: 'salary', label: '期望薪资', options: ['10-20K', '20-40K', '40-60K', '60-100K', '100K+'] },
    { key: 'experience', label: '工作经验', options: ['应届', '1-3年', '3-5年', '5-10年', '10年以上'] },
    { key: 'age', label: '年龄范围', options: ['20-25', '25-30', '30-35', '35-40', '40+'] },
    { key: 'education', label: '学历要求', options: ['大专', '本科', '硕士', '博士'] },
  ],
  professional: [
    { key: 'industry', label: '行业', options: ['互联网', '金融', '教育', '医疗', '制造业'] },
    { key: 'function', label: '职能', options: ['技术', '产品', '设计', '运营', '市场'] },
    { key: 'skills', label: '技能标签', options: ['React', 'Vue', 'Java', 'Python', 'Go'] },
  ],
  advanced: [
    { key: 'jobStatus', label: '求职状态', options: ['离职-随时到岗', '在职-暂无意向', '在职-月内到岗', '在职-考虑机会'] },
    { key: 'activeTime', label: '活跃时间', options: ['刚刚', '今日', '3日内', '7日内', '30日内'] },
    { key: 'updateTime', label: '简历更新', options: ['今日', '7日内', '30日内', '90日内'] },
  ],
};

export default function TalentSearch() {
  const [selectedConditions, setSelectedConditions] = useState<Record<string, string[]>>({});

  const toggleCondition = (key: string, value: string) => {
    setSelectedConditions((prev) => {
      const current = prev[key] || [];
      const exists = current.includes(value);
      return {
        ...prev,
        [key]: exists ? current.filter((v) => v !== value) : [...current, value],
      };
    });
  };

  const handleSearch = () => {
    console.log('Search with conditions:', selectedConditions);
  };

  return (
    <div className="talent-search">
      <Card className="search-panel">
        <div className="search-bar">
          <Input
            placeholder="输入关键词搜索（支持布尔逻辑：AND / OR / NOT）"
            style={{ flex: 1 }}
          />
          <Button theme="primary" onClick={handleSearch}>搜索</Button>
        </div>

        <Divider />

        {Object.entries(searchConditions).map(([category, conditions]) => (
          <div key={category} className="condition-section">
            <h4 className="section-title">
              {category === 'basic' ? '基础条件' : category === 'professional' ? '专业条件' : '高级筛选'}
            </h4>
            {conditions.map((condition) => (
              <div key={condition.key} className="condition-row">
                <span className="condition-label">{condition.label}：</span>
                <div className="condition-options">
                  {condition.options.map((option) => (
                    <Tag
                      key={option}
                      theme={selectedConditions[condition.key]?.includes(option) ? 'primary' : 'default'}
                      variant={selectedConditions[condition.key]?.includes(option) ? 'dark' : 'outline'}
                      className="condition-tag"
                      onClick={() => toggleCondition(condition.key, option)}
                    >
                      {option}
                    </Tag>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </Card>

      <div className="search-results">
        <Row gutter={[16, 16]}>
          {mockTalentData.map((talent) => (
            <Col key={talent.id} span={6}>
              <ResumeCard
                data={talent}
                onAction={(action) => console.log('Action:', action)}
              />
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}

const mockTalentData = [
  {
    id: '1',
    name: '张*',
    currentTitle: '高级前端工程师',
    currentCompany: '字节跳动',
    experience: '5年',
    education: '本科 · 计算机科学',
    location: '北京',
    expectedSalary: '30-50K',
    skills: ['React', 'TypeScript', 'Node.js', 'Vue'],
    lastActive: '2小时前',
    matchScore: 85,
    personalScore: 78,
  },
  {
    id: '2',
    name: '李*',
    currentTitle: '产品经理',
    currentCompany: '阿里巴巴',
    experience: '3年',
    education: '硕士 · 软件工程',
    location: '杭州',
    expectedSalary: '25-40K',
    skills: ['产品设计', '数据分析', 'Axure'],
    lastActive: '1天前',
    matchScore: 72,
    personalScore: 82,
  },
];
