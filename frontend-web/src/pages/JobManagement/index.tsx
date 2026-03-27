import { useState } from 'react';
import { Card, Row, Col, Button, Table, Tag, Space, Input, Select, Progress } from 'tdesign-react';
import { PlusIcon, RefreshIcon, ChartIcon } from 'tdesign-icons-react';
import './JobManagement.css';

const { Search } = Input;

const mockJobs = [
  {
    id: '1',
    title: '高级前端工程师',
    department: '技术部',
    location: '北京',
    salary: '30-50K',
    applicants: 128,
    newApplicants: 12,
    status: 'recruiting',
    createTime: '2024-03-20',
    views: 2560,
  },
  {
    id: '2',
    title: '产品经理',
    department: '产品部',
    location: '上海',
    salary: '25-40K',
    applicants: 86,
    newApplicants: 5,
    status: 'recruiting',
    createTime: '2024-03-15',
    views: 1820,
  },
  {
    id: '3',
    title: 'Java架构师',
    department: '技术部',
    location: '深圳',
    salary: '50-80K',
    applicants: 45,
    newApplicants: 3,
    status: 'paused',
    createTime: '2024-03-10',
    views: 980,
  },
];

export default function JobManagement() {
  return (
    <div className="job-management">
      <Card className="stats-card">
        <Row gutter={24}>
          <Col span={6}>
            <div className="stat-item">
              <span className="stat-value">8</span>
              <span className="stat-label">招聘中</span>
            </div>
          </Col>
          <Col span={6}>
            <div className="stat-item">
              <span className="stat-value">156</span>
              <span className="stat-label">总投递</span>
            </div>
          </Col>
          <Col span={6}>
            <div className="stat-item">
              <span className="stat-value">23</span>
              <span className="stat-label">待处理</span>
            </div>
          </Col>
          <Col span={6}>
            <div className="stat-item">
              <span className="stat-value">12</span>
              <span className="stat-label">面试中</span>
            </div>
          </Col>
        </Row>
      </Card>

      <Card className="job-list-card">
        <div className="panel-header">
          <Space>
            <Search placeholder="搜索职位..." style={{ width: 300 }} />
            <Select placeholder="状态筛选" style={{ width: 120 }} options={[
              { label: '全部', value: 'all' },
              { label: '招聘中', value: 'recruiting' },
              { label: '已暂停', value: 'paused' },
              { label: '已关闭', value: 'closed' },
            ]} />
          </Space>
          <Space>
            <Button theme="default" icon={<ChartIcon />}>
              数据统计
            </Button>
            <Button theme="primary" icon={<PlusIcon />}>
              发布职位
            </Button>
          </Space>
        </div>

        <Table
          data={mockJobs}
          columns={[
            {
              title: '职位名称',
              colKey: 'title',
              cell: ({ row }) => (
                <div>
                  <div style={{ fontWeight: 600 }}>{row.title}</div>
                  <div style={{ fontSize: 12, color: '#999' }}>{row.department}</div>
                </div>
              ),
            },
            { title: '工作地点', colKey: 'location' },
            { title: '薪资范围', colKey: 'salary' },
            {
              title: '投递数',
              colKey: 'applicants',
              cell: ({ row }) => (
                <div>
                  <span>{row.applicants}</span>
                  {row.newApplicants > 0 && (
                    <Tag theme="primary" size="small" style={{ marginLeft: 8 }}>
                      +{row.newApplicants}
                    </Tag>
                  )}
                </div>
              ),
            },
            { title: '浏览量', colKey: 'views' },
            {
              title: '状态',
              colKey: 'status',
              cell: ({ row }) => (
                <Tag theme={row.status === 'recruiting' ? 'success' : 'default'}>
                  {row.status === 'recruiting' ? '招聘中' : '已暂停'}
                </Tag>
              ),
            },
            {
              title: '操作',
              colKey: 'actions',
              cell: ({ row }) => (
                <Space>
                  <Button theme="primary" variant="text" size="small">
                    查看候选人
                  </Button>
                  <Button theme="default" variant="text" size="small">
                    编辑
                  </Button>
                </Space>
              ),
            },
          ]}
          rowKey="id"
        />
      </Card>
    </div>
  );
}
