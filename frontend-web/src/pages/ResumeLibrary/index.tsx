import { useState } from 'react';
import { Card, Row, Col, Button, Tree, Input, Upload, Dialog, Tag, Space, Tabs, Pagination, Checkbox, Dropdown } from 'tdesign-react';
import { PlusIcon, UploadIcon, ChevronLeftIcon, ChevronRightIcon, DownloadIcon, MoreIcon, MailIcon } from 'tdesign-icons-react';
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

const mockResumes = [
  { id: '1', name: '张**', title: '高级前端工程师', company: '字节跳动', status: 'parsed' },
  { id: '2', name: '李**', title: '产品经理', company: '阿里巴巴', status: 'parsed' },
  { id: '3', name: '王**', title: 'Java架构师', company: '腾讯', status: 'pending' },
  { id: '4', name: '赵**', title: 'UI设计师', company: '美团', status: 'parsed' },
  { id: '5', name: '陈**', title: '数据分析师', company: '京东', status: 'failed' },
];

export default function ResumeLibrary() {
  const [activeFolder, setActiveFolder] = useState('all');
  const [activeTab, setActiveTab] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [folderCollapsed, setFolderCollapsed] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // 全选/取消全选
  const toggleSelectAll = () => {
    if (selectedIds.length === mockResumes.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(mockResumes.map((r) => r.id));
    }
  };

  // 单个选择
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="resume-library">
      {/* 顶部工具栏 */}
      <Card className="toolbar" bordered={false}>
        <div className="toolbar-content">
          <Input
            placeholder="搜索简历..."
            className="search-input"
            clearable
          />
          <Space>
            <Button theme="primary" icon={<UploadIcon />} onClick={() => setShowUploadModal(true)}>
              上传简历
            </Button>
            <Button theme="default" icon={<DownloadIcon />}>
              批量操作
            </Button>
            <Button theme="default" icon={<MailIcon />}>
              邮箱设置
            </Button>
          </Space>
        </div>
      </Card>

      <Row gutter={16}>
        {/* 左侧文件夹 - 可折叠 */}
        <Col span={folderCollapsed ? 1 : 4}>
          <Card
            className={`folder-panel ${folderCollapsed ? 'collapsed' : ''}`}
            bordered={false}
          >
            <div className="folder-header">
              {!folderCollapsed && <span className="folder-title">文件夹</span>}
              <Button
                theme="default"
                variant="text"
                icon={folderCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                onClick={() => setFolderCollapsed(!folderCollapsed)}
              />
            </div>

            {!folderCollapsed && (
              <>
                <Button theme="primary" variant="dashed" block icon={<PlusIcon />} style={{ marginBottom: 16 }}>
                  新建文件夹
                </Button>
                <Tree
                  data={mockFolders}
                  actived={[activeFolder]}
                  onActive={(value) => setActiveFolder(String(value?.[0] || 'all'))}
                />

                {/* 邮箱状态 - 简化显示 */}
                <div className="email-status">
                  <div className="email-header">
                    <MailIcon />
                    <span>邮箱</span>
                  </div>
                  <div className="email-stats">
                    <span className="stat-item">已连接 2</span>
                    <span className="stat-item">今日 15</span>
                  </div>
                </div>
              </>
            )}
          </Card>
        </Col>

        {/* 右侧内容区 */}
        <Col span={folderCollapsed ? 23 : 20}>
          <Card className="resume-panel" bordered={false}>
            {/* 标签页 - 标准Tabs组件 */}
            <Tabs
              value={activeTab}
              onChange={(value) => setActiveTab(String(value))}
              className="resume-tabs"
              list={[
                { label: <span>全部 <Tag size="small">156</Tag></span>, value: 'all' },
                { label: <span>待处理 <Tag size="small" theme="warning">12</Tag></span>, value: 'pending' },
                { label: <span>已解析 <Tag size="small" theme="success">140</Tag></span>, value: 'parsed' },
                { label: <span>解析失败 <Tag size="small" theme="danger">4</Tag></span>, value: 'failed' },
              ]}
            />

            {/* 简历列表 */}
            <div className="resume-list">
              {mockResumes.map((resume) => (
                <div
                  key={resume.id}
                  className={`resume-row ${selectedIds.includes(resume.id) ? 'selected' : ''}`}
                >
                  <div className="row-checkbox">
                    <Checkbox
                      checked={selectedIds.includes(resume.id)}
                      onChange={() => toggleSelect(resume.id)}
                    />
                  </div>
                  <div className="row-content">
                    <div className="resume-main">
                      <span className="resume-name">{resume.name}</span>
                      <span className="resume-title">{resume.title}</span>
                      <span className="resume-company">@{resume.company}</span>
                    </div>
                    <div className="resume-status">
                      {resume.status === 'parsed' && <Tag theme="success" variant="light">已解析</Tag>}
                      {resume.status === 'pending' && <Tag theme="warning" variant="light">待处理</Tag>}
                      {resume.status === 'failed' && <Tag theme="danger" variant="light">解析失败</Tag>}
                    </div>
                  </div>
                  <div className="row-actions">
                    <Button theme="default" variant="text" size="small">查看</Button>
                    <Button theme="default" variant="text" size="small">下载</Button>
                    <Dropdown
                      trigger="click"
                      options={[
                        { content: '重新解析', value: 'reparse' },
                        { content: '移动到...', value: 'move' },
                        { content: '删除', value: 'delete' },
                      ]}
                    >
                      <Button theme="default" variant="text" size="small" icon={<MoreIcon />} />
                    </Dropdown>
                  </div>
                </div>
              ))}
            </div>

            {/* 分页器 */}
            <div className="pagination-wrapper">
              <div className="batch-select">
                <Checkbox
                  checked={selectedIds.length === mockResumes.length}
                  indeterminate={selectedIds.length > 0 && selectedIds.length < mockResumes.length}
                  onChange={toggleSelectAll}
                />
                <span>全选</span>
                {selectedIds.length > 0 && (
                  <span className="selected-count">已选 {selectedIds.length} 项</span>
                )}
              </div>
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={156}
                showJumper
                onChange={(pageInfo) => {
                  setCurrentPage(pageInfo.current);
                  setPageSize(pageInfo.pageSize);
                }}
              />
            </div>
          </Card>
        </Col>
      </Row>

      {/* 上传对话框 */}
      <Dialog
        visible={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        header="上传简历"
        footer={<Button theme="primary">开始上传</Button>}
        width={600}
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
