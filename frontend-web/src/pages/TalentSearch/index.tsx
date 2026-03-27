import { useState } from 'react';
import { Card, Row, Col, Input, Select, Button, Tag, Checkbox, Divider } from 'tdesign-react';
import ResumeCard from '@/components/ResumeCard';
import './TalentSearch.css';

const { Search } = Input;

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

  return (
    <div className="talent-search">
      <Card className="search-panel">
        <div className="search-bar">
          <Search
            placeholder="输入关键词搜索（支持布尔逻辑：AND / OR / NOT）"
            style={{ flex: 1 }}
          />
          <Button theme="primary">搜索</Button>
          <Button theme="default">保存为模板</Button>
        </div>

        <Divider />

        {/* 基础条件 */}
        <div className="condition-section">
          <h4 className="section-title">基础条件</h4>
          <Row gutter={[16, 16]}>
            {searchConditions.basic.map((condition) => (
              <Col key={condition.key} span={8}>
                <div className="condition-item">
                  <span className="condition-label">{condition.label}:</span>
                  <div className="condition-options">
                    {condition.options.slice(0, 4).map((option) => (
                      <Tag
                        key={option}
                        theme={selectedConditions[condition.key]?.includes(option) ? 'primary' : 'default'}
                        variant={selectedConditions[condition.key]?.includes(option) ? 'dark' : 'outline'}
                        onClick={() => toggleCondition(condition.key, option)}
                        style={{ cursor: 'pointer' }}
                      >
                        {option}
                      </Tag>
                    ))}
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </div>

        <Divider />

        {/* 专业条件 */}
        <div className="condition-section">
          <h4 className="section-title">专业条件</h4>
          <Row gutter={[16, 16]}>
            {searchConditions.professional.map((condition) => (
              <Col key={condition.key} span={8}>
                <div className="condition-item">
                  <span className="condition-label">{condition.label}:</span>
                  <div className="condition-options">
                    {condition.options.map((option) => (
                      <Tag
                        key={option}
                        theme={selectedConditions[condition.key]?.includes(option) ? 'primary' : 'default'}
                        variant={selectedConditions[condition.key]?.includes(option) ? 'dark' : 'outline'}
                        onClick={() => toggleCondition(condition.key, option)}
                        style={{ cursor: 'pointer' }}
                      >
                        {option}
                      </Tag>
                    ))}
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </div>

        <Divider />

        {/* 高级条件 */}
        <div className="condition-section">
          <h4 className="section-title">高级条件</h4>
          <Row gutter={[16, 16]}>
            {searchConditions.advanced.map((condition) => (
              <Col key={condition.key} span={8}>
                <div className="condition-item">
                  <span className="condition-label">{condition.label}:</span>
                  <div className="condition-options">
                    {condition.options.slice(0, 3).map((option) => (
                      <Tag
                        key={option}
                        theme={selectedConditions[condition.key]?.includes(option) ? 'primary' : 'default'}
                        variant={selectedConditions[condition.key]?.includes(option) ? 'dark' : 'outline'}
                        onClick={() => toggleCondition(condition.key, option)}
                        style={{ cursor: 'pointer' }}
                      >
                        {option}
                      </Tag>
                    ))}
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </Card>

      {/* 搜索结果 */}
      <Card className="results-panel" title="搜索结果 (156人)">
        <ResumeCard
          variant="row"
          data={{
            id: '1',
            name: '张**',
            currentTitle: '高级前端工程师',
            currentCompany: '字节跳动',
            experience: '5年',
            education: '本科 · 清华大学',
            location: '北京',
            expectedSalary: '40-60K',
            skills: ['React', 'TypeScript', 'Node.js'],
            lastActive: '2小时前',
            matchScore: 95,
            personalScore: 88,
          }}
          onAction={(action) => console.log('action:', action)}
        />
      </Card>
    </div>
  );
}
