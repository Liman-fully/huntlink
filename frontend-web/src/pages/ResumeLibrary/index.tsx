import { useState } from 'react';
import { Card, Row, Col, Button, Tree, Input, Upload, Dialog, Tag, Space } from 'tdesign-react';
import { PlusIcon, UploadIcon, RefreshIcon } from 'tdesign-icons-react';
import ResumeCard from '@/components/ResumeCard';
import './ResumeLibrary.css';

const mockFolders = [
  {
    title: '全部简历',
    key: 'all',
    children: [
      { title: '前端工程师', key: 'frontend' },
      { title: '后端工程师', key: 'backend' },
      { title: '产品经理', key: 'pm' },
      { title: '设计师', key: 'designer' },
    ],
  },
  {
    title: '邮箱导入',
    key: 'email',
    children: [
      { title: '来自猎聘', key: 'liepin' },
      { title: '来自BOSS', key: 'boss' },
    ],
  },
];

export default function ResumeLibrary() {
  const [activeFolder, setActiveFolder] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);

  return (
    <div className="resume-library">
      <Row gutter={24}>
        <Col span={4}>
          <Card className="folder-panel" title="简历文件夹">
            <Button theme="primary" variant="dashed" block icon={<PlusIcon />} style={{ marginBottom: 16 }}>
              新建文件夹
            </Button>
            <Tree
              data={mockFolders}
              actived={[activeFolder]}
              onActive={(value) => setActiveFolder(String(value?.[0] || 'all'))}
            />
          </Card>

          <Card className="email-panel" title="邮箱自动导入" style={{ marginTop: 16 }}>
            <Button theme="default" block icon={<RefreshIcon />}>
              配置邮箱同步
            </Button>
            <div className="email-stats">
              <p>已连接: 2个邮箱</p>
              <p>今日导入: 15份</p>
              <p>待解析: 3份</p>
            </div>
          </Card>
        </Col>

        <Col span={20}>
          <Card className="resume-panel">
            <div className="panel-header">
              <Input placeholder="搜索简历..." style={{ width: 300 }} />
              <Space>
                <Button theme="primary" icon={<UploadIcon />} onClick={() => setShowUploadModal(true)}>
                  上传简历
                </Button>
                <Button theme="default">批量操作</Button>
              </Space>
            </div>

            <div className="tab-nav">
              {[
                { key: 'all', label: '全部 (156)' },
                { key: 'pending', label: '待处理 (12)' },
                { key: 'parsed', label: '已解析 (140)' },
                { key: 'failed', label: '解析失败 (4)' },
              ].map((tab) => (
                <Tag key={tab.key} theme="default" variant="outline" className="tab-tag">
                  {tab.label}
                </Tag>
              ))}
            </div>

            <div className="resume-list">
              <ResumeCard
                data={{
                  id: '1',
                  name: '张**',
                  currentTitle: '高级前端工程师',
                  currentCompany: '字节跳动',
                  experience: '5年',
                  education: '本科 · 清华大学',
                  location: '北京',
                  expectedSalary: '30-50K',
                  skills: ['React', 'TypeScript'],
                  lastActive: '2小时前',
                  personalScore: 88,
                }}
                onAction={(action) => console.log('action:', action)}
              />
              <ResumeCard
                data={{
                  id: '2',
                  name: '李**',
                  currentTitle: '产品经理',
                  currentCompany: '阿里巴巴',
                  experience: '7年',
                  education: '硕士 · 北京大学',
                  location: '杭州',
                  expectedSalary: '25-40K',
                  skills: ['产品设计', '数据分析'],
                  lastActive: '1天前',
                  personalScore: 90,
                }}
                onAction={(action) => console.log('action:', action)}
              />
            </div>
          </Card>
        </Col>
      </Row>

      <Dialog
        visible={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        header="上传简历"
        footer={<Button theme="primary">开始上传</Button>}
      >
        <Upload
          theme="file-flow"
          accept=".pdf,.doc,.docx,.jpg,.png"
          multiple
          tips="支持 PDF、Word、图片格式，单份最大 10MB，一次最多上传 100 份"
        />
      </Dialog>
    </div>
  );
}
