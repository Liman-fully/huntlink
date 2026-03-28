import React, { useState, useEffect } from 'react';
import { Card, Statistic, Row, Col, Table, Tag, Space, Button, Input, Select, Modal, Form, Message } from 'tdesign-react';
import { candidateApi, statisticsApi } from '../services/api';

const statusMap: Record<string, string> = {
  new: '待联系',
  contacted: '已联系',
  interviewed: '面试中',
  offered: '已录用',
  rejected: '已淘汰',
};

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  tags: string[];
  status: string;
  createdAt: string;
}

const CandidateList: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', tags: '' });

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const res = await candidateApi.findAll({ search: searchText, status: statusFilter });
      setCandidates(res.data.data || []);
    } catch (error) {
      Message.error('加载失败');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCandidates();
  }, [searchText, statusFilter]);

  const handleAdd = async () => {
    try {
      await candidateApi.create({
        ...formData,
        tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
      });
      Message.success('添加成功');
      setVisible(false);
      setFormData({ name: '', email: '', phone: '', tags: '' });
      fetchCandidates();
    } catch (error) {
      Message.error('添加失败');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定删除？')) return;
    try {
      await candidateApi.remove(id);
      Message.success('删除成功');
      fetchCandidates();
    } catch (error) {
      Message.error('删除失败');
    }
  };

  const handleAddTag = async (id: string) => {
    const tag = prompt('输入标签：');
    if (!tag) return;
    try {
      await candidateApi.addTag(id, tag);
      Message.success('添加成功');
      fetchCandidates();
    } catch (error) {
      Message.error('添加失败');
    }
  };

  const columns = [
    { colKey: 'name', title: '姓名', fixed: 'left', width: 120 },
    {
      colKey: 'contact',
      title: '联系方式',
      width: 200,
      render: (h: any, row: Candidate) => (
        <div>
          <div>{row.email}</div>
          <div>{row.phone}</div>
        </div>
      ),
    },
    {
      colKey: 'tags',
      title: '标签',
      width: 200,
      render: (h: any, row: Candidate) => (
        <Space>
          {row.tags?.map((tag: string) => (
            <Tag key={tag} theme="primary" variant="light">{tag}</Tag>
          ))}
          <Button theme="default" size="small" onClick={() => handleAddTag(row.id)}>+</Button>
        </Space>
      ),
    },
    {
      colKey: 'status',
      title: '状态',
      width: 100,
      render: (h: any, row: Candidate) => <Tag theme="primary" variant="light">{statusMap[row.status] || row.status}</Tag>,
    },
    { colKey: 'createdAt', title: '创建时间', width: 120 },
    {
      colKey: 'action',
      title: '操作',
      fixed: 'right',
      width: 150,
      render: (h: any, row: Candidate) => (
        <Space>
          <Button theme="primary" variant="text" size="small" onClick={() => handleDelete(row.id)}>删除</Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="candidate-list-page">
      <Card header="候选人管理">
        <div style={{ marginBottom: 16 }}>
          <Space>
            <Input placeholder="搜索姓名/电话" value={searchText} onChange={setSearchText} style={{ width: 200 }} />
            <Select
              placeholder="状态筛选"
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 150 }}
              options={[
                { label: '全部', value: 'all' },
                { label: '待联系', value: 'new' },
                { label: '已联系', value: 'contacted' },
                { label: '面试中', value: 'interviewed' },
                { label: '已录用', value: 'offered' },
                { label: '已淘汰', value: 'rejected' },
              ]}
            />
            <Button theme="primary" onClick={() => setVisible(true)}>添加候选人</Button>
          </Space>
        </div>
        <Table rowKey="id" columns={columns} data={candidates} loading={loading} pagination={{ defaultPageSize: 20, total: candidates.length }} />
      </Card>

      <Modal header="添加候选人" visible={visible} onConfirm={handleAdd} onCancel={() => setVisible(false)}>
        <Form layout="vertical">
          <Form.FormItem label="姓名" required>
            <Input value={formData.name} onChange={(v) => setFormData({ ...formData, name: v })} />
          </Form.FormItem>
          <Form.FormItem label="邮箱">
            <Input value={formData.email} onChange={(v) => setFormData({ ...formData, email: v })} />
          </Form.FormItem>
          <Form.FormItem label="电话">
            <Input value={formData.phone} onChange={(v) => setFormData({ ...formData, phone: v })} />
          </Form.FormItem>
          <Form.FormItem label="标签（逗号分隔）">
            <Input value={formData.tags} onChange={(v) => setFormData({ ...formData, tags: v })} placeholder="Java, 5 年经验" />
          </Form.FormItem>
        </Form>
      </Modal>
    </div>
  );
};

export default CandidateList;
