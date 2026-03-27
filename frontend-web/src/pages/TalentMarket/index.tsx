import { useState } from 'react';
import { Card, Row, Col, Input, Button, Tag, Checkbox, Space, Dropdown, DropdownMenu, DropdownItem } from 'tdesign-react';
import { SearchIcon, FilterIcon, DownloadIcon, ChatIcon, FolderIcon, MoreIcon } from 'tdesign-icons-react';
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
  {
    id: '4',
    name: '赵**',
    currentTitle: 'UI设计师',
    currentCompany: '美团',
    experience: '4年',
    education: '本科 · 中央美术学院',
    location: '北京',
    expectedSalary: '30-50K',
    skills: ['Figma', 'Sketch', 'UI设计', '交互设计'],
    avatar: '',
    lastActive: '刚刚活跃',
    matchScore: 85,
    personalScore: 82,
  },
  {
    id: '5',
    name: '陈**',
    currentTitle: '数据分析师',
    currentCompany: '京东',
    experience: '3年',
    education: '硕士 · 复旦大学',
    location: '上海',
    expectedSalary: '25-40K',
    skills: ['Python', 'SQL', 'Tableau', '机器学习'],
    avatar: '',
    lastActive: '3小时前',
    matchScore: 80,
    personalScore: 78,
  },
  {
    id: '6',
    name: '周**',
    currentTitle: '运维工程师',
    currentCompany: '华为',
    experience: '6年',
    education: '本科 · 西安交通大学',
    location: '深圳',
    expectedSalary: '35-55K',
    skills: ['Kubernetes', 'Docker', 'Linux', 'CI/CD'],
    avatar: '',
    lastActive: '5小时前',
    matchScore: 75,
    personalScore: 85,
  },
];

// 快捷筛选标签
const quickFilters = [
  { label: '北京', field: 'location', value: '北京' },
  { label: '上海', field: 'location', value: '上海' },
  { label: '5-10年', field: 'experience', value: '5-10年' },
  { label: '本科', field: 'education', value: '本科' },
  { label: '刚刚活跃', field: 'lastActive', value: '刚刚活跃' },
];

export default function TalentMarket() {
  const [searchKey, setSearchKey] = useState('');
  const [quickFilterActive, setQuickFilterActive] = useState<string[]>([]);
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('match');

  // 切换快捷筛选
  const toggleQuickFilter = (filter: string) => {
    setQuickFilterActive((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
    );
  };

  // 全选/取消全选
  const toggleSelectAll = () => {
    if (selectedIds.length === mockTalents.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(mockTalents.map((t) => t.id));
    }
  };

  // 单个选择
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="talent-market">
      {/* 搜索区 - 大幅强化 */}
      <Card className="search-hero">
        <div className="search-wrapper">
          <Input
            size="large"
            placeholder="搜索人才姓名、技能、公司、职位..."
            value={searchKey}
            onChange={(value) => setSearchKey(value)}
            prefixIcon={<SearchIcon />}
            className="search-input-large"
          />
          <Button theme="primary" size="large" className="search-btn-large">
            搜索
          </Button>
          <Button
            theme="default"
            size="large"
            variant="outline"
            icon={<FilterIcon />}
            onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}
          >
            高级筛选
          </Button>
        </div>

        {/* 快捷筛选标签 */}
        <div className="quick-filters">
          {quickFilters.map((filter) => (
            <Tag
              key={filter.value}
              variant={quickFilterActive.includes(filter.value) ? 'dark' : 'outline'}
              theme={quickFilterActive.includes(filter.value) ? 'primary' : 'default'}
              className="quick-filter-tag"
              onClick={() => toggleQuickFilter(filter.value)}
            >
              {filter.label}
            </Tag>
          ))}
        </div>

        {/* 高级筛选面板 - 默认折叠 */}
        {showAdvancedFilter && (
          <div className="advanced-filter-panel">
            <Row gutter={16}>
              <Col span={4}>
                <div className="filter-item">
                  <span className="filter-label">工作地点</span>
                  <Tag variant="outline" clickable>北京</Tag>
                  <Tag variant="outline" clickable>上海</Tag>
                  <Tag variant="outline" clickable>深圳</Tag>
                </div>
              </Col>
              <Col span={4}>
                <div className="filter-item">
                  <span className="filter-label">工作经验</span>
                  <Tag variant="outline" clickable>1-3年</Tag>
                  <Tag variant="outline" clickable>3-5年</Tag>
                  <Tag variant="outline" clickable>5-10年</Tag>
                </div>
              </Col>
              <Col span={4}>
                <div className="filter-item">
                  <span className="filter-label">学历要求</span>
                  <Tag variant="outline" clickable>本科</Tag>
                  <Tag variant="outline" clickable>硕士</Tag>
                  <Tag variant="outline" clickable>博士</Tag>
                </div>
              </Col>
            </Row>
          </div>
        )}
      </Card>

      {/* 结果区 */}
      <div className="result-header">
        <div className="result-info">
          共找到 <strong>3842</strong> 人
        </div>
        <div className="sort-options">
          <span className="sort-label">排序：</span>
          {[
            { key: 'match', label: '匹配度' },
            { key: 'newest', label: '最新' },
            { key: 'active', label: '活跃' },
          ].map((item) => (
            <Tag
              key={item.key}
              variant={sortBy === item.key ? 'dark' : 'outline'}
              theme={sortBy === item.key ? 'primary' : 'default'}
              className="sort-tag"
              onClick={() => setSortBy(item.key)}
            >
              {item.label}
            </Tag>
          ))}
        </div>
      </div>

      {/* 简历列表 */}
      <Row gutter={[16, 16]} className="talent-grid">
        {mockTalents.map((talent) => (
          <Col key={talent.id} span={8}>
            <Card
              className={`talent-card ${selectedIds.includes(talent.id) ? 'selected' : ''}`}
              hoverable
            >
              <div className="card-checkbox">
                <Checkbox
                  checked={selectedIds.includes(talent.id)}
                  onChange={() => toggleSelect(talent.id)}
                  onClick={(e: React.MouseEvent) => e.stopPropagation()}
                />
              </div>
              <div className="card-content" onClick={() => console.log('view', talent.id)}>
                <div className="talent-header">
                  <div className="talent-avatar">{talent.name[0]}</div>
                  <div className="talent-info">
                    <div className="talent-name">{talent.name}</div>
                    <div className="talent-title">{talent.currentTitle}</div>
                    <div className="talent-company">@{talent.currentCompany}</div>
                  </div>
                  <div className="talent-scores">
                    <Tag theme="primary" variant="light">匹配度 {talent.matchScore}%</Tag>
                    <Tag theme="success" variant="light">评分 {talent.personalScore}</Tag>
                  </div>
                </div>

                <div className="talent-meta">
                  {talent.experience} · {talent.education} · {talent.location} · {talent.expectedSalary}
                </div>

                <div className="talent-skills">
                  {talent.skills.map((skill) => (
                    <Tag key={skill} variant="outline" size="small">{skill}</Tag>
                  ))}
                </div>

                <div className="talent-footer">
                  <span className="last-active">{talent.lastActive}</span>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 批量操作栏 - 底部固定 */}
      {selectedIds.length > 0 && (
        <div className="batch-action-bar">
          <div className="batch-info">
            <Checkbox
              checked={selectedIds.length === mockTalents.length}
              indeterminate={selectedIds.length > 0 && selectedIds.length < mockTalents.length}
              onChange={toggleSelectAll}
            />
            <span>已选择 <strong>{selectedIds.length}</strong> 人</span>
          </div>
          <div className="batch-actions">
            <Button theme="primary" icon={<DownloadIcon />}>下载简历</Button>
            <Button theme="default" icon={<ChatIcon />}>发送面试</Button>
            <Button theme="default" icon={<FolderIcon />}>加入人才库</Button>
            <Dropdown
              content={
                <DropdownMenu>
                  <DropdownItem>添加标签</DropdownItem>
                  <DropdownItem>发送消息</DropdownItem>
                  <DropdownItem>移出列表</DropdownItem>
                </DropdownMenu>
              }
            >
              <Button theme="default" icon={<MoreIcon />}>更多</Button>
            </Dropdown>
          </div>
        </div>
      )}
    </div>
  );
}
