import { useState } from 'react';
import { Card, Row, Col, Button, Table, Tag, Space, Input, Select, Progress } from 'tdesign-react';
import { PlusIcon, ChartIcon } from 'tdesign-icons-react';
import './JobManagement.css';

const mockJobs = [
  {
    id: '1',
    title: '高级前端工程师',
    department: '技术部',
    location: '北京',
    salary: '30-50K',
    status: 'active',
    applicants: 45,
    interviews: 12,
    offers: 3,
    progress: 75,
    publishTime: '2026-03-01',
  },
  {
    id: '2',
    title: '产品经理',
    department: '产品部',
    location: '杭州',
    salary: '25-40K',
    status: 'active',
    applicants: 38,
    interviews: 8,
    offers: 1,
    progress: 60,
    publishTime: '2026-03-05',
  },
  {
    id: '3',
    title: 'Java架构师',
    department: '技术部',
    location: '深圳',
    salary: '50-80K',
    status: 'paused',
    applicants: 22,
    interviews: 5,
    offers: 0,
    progress: 40,
    publishTime: '2026-03-10',
  },
];

export default function JobManagement() {
  const [filter, setFilter] = useState({
    status: '',
    location: '',
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilter({ ...filter, [key]: value });
  };

  const columns = [
    { colKey: 'title', title: '职位名称', width: 180 },
    { colKey: 'department', title: '所属部门', width: 100 },
    { colKey: 'location', title: '工作地点', width: 100 },
    { colKey: 'salary', title: '薪资范围', width: 120 },
    {
      colKey: 'status',
      title: '状态',
      width: 100,
      render: ({ row }: { row: typeof mockJobs[0] }) => (
        <Tag theme={row.status === 'active' ? 'success' : 'warning'} variant="light">
          {row.status === 'active' ? '招聘中' : '已暂停'}
        </Tag>
      ),
    },
    {
      colKey: 'progress',
      title: '招聘进度',
      width: 200,
      render: ({ row }: { row: typeof mockJobs[0] }) => (
        <div className="progress-cell">
          <Progress percentage={row.progress} size="small" />
          <span className="progress-text">
            {row.applicants}人申请 / {row.interviews}面试 / {row.offers}offer
          </span>
        </div>
      ),
    },
    { colKey: 'publishTime', title: '发布时间', width: 120 },
    {
      colKey: 'actions',
      title: '操作',
      width: 200,
      render: () => (
        <Space>
          <Button theme="primary" variant="text" size="small">
            查看
          </Button>
          <Button theme="default" variant="text" size="small">
            编辑
          </Button>
          <Button theme="default" variant="text" size="small">
            暂停
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="job-management">
      <Card className="stats-card">
        <Row gutter={24}>
          <Col span={6}>
            <div className="stat-item">
              <span className="stat-value">12</span>
              <span className="stat-label">在招职位</span>
            </div>
          </Col>
          <Col span={6}>
            <div className="stat-item">
              <span className="stat-value">156</span>
              <span className="stat-label">总申请数</span>
            </div>
          </Col>
          <Col span={6}>
            <div className="stat-item">
              <span className="stat-value">38</span>
              <span className="stat-label">待处理简历</span>
            </div>
          </Col>
          <Col span={6}>
            <div className="stat-item">
              <span className="stat-value">8</span>
              <span className="stat-label">本周面试</span>
            </div>
          </Col>
        </Row>
      </Card>

      <Card className="job-list-card" style={{ marginTop: 16 }}>
        <div className="panel-header">
          <Space>
            <Input
              placeholder="搜索职位..."
              style={{ width: 300 }}
            />
            <Select
              placeholder="状态筛选"
              value={filter.status}
              onChange={(value) => handleFilterChange('status', String(value))}
              style={{ width: 120 }}
              options={[
                { label: '全部', value: '' },
                { label: '招聘中', value: 'active' },
                { label: '已暂停', value: 'paused' },
              ]}
            />
            <Select
              placeholder="工作地点"
              value={filter.location}
              onChange={(value) => handleFilterChange('location', String(value))}
              style={{ width: 120 }}
              options={[
                { label: '全部', value: '' },
                { label: '北京', value: '北京' },
                { label: '上海', value: '上海' },
                { label: '深圳', value: '深圳' },
                { label: '杭州', value: '杭州' },
              ]}
            />
          </Space>
          <Space>
            <Button theme="default" icon={<ChartIcon />}>
              数据分析
            </Button>
            <Button theme="primary" icon={<PlusIcon />}>
              发布职位
            </Button>
          </Space>
        </div>

        <Table
          data={mockJobs}
          columns={columns}
          rowKey="id"
          hover
          pagination={{ defaultPageSize: 10 }}
        />
      </Card>
    </div>
  );
}
