import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Space, Button, Dialog, Form, DatePicker, Select, Message } from 'tdesign-react';
import { interviewApi, candidateApi, jobApi } from '../services/api';

const statusMap: Record<string, string> = {
  pending: '待确认',
  confirmed: '已确认',
  completed: '已完成',
  cancelled: '已取消',
};

interface Interview {
  id: string;
  candidate: { name: string };
  job: { title: string };
  scheduledAt: string;
  status: string;
  feedback: string;
}

const Interview: React.FC = () => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState({ candidateId: '', jobId: '', scheduledAt: '', feedback: '' });

  const fetchInterviews = async () => {
    setLoading(true);
    try {
      const res = await interviewApi.findAll();
      setInterviews(res.data.data || []);
    } catch (error) {
      Message.error('加载失败');
    }
    setLoading(false);
  };

  const fetchCandidates = async () => {
    const res = await candidateApi.findAll({ limit: 100 });
    setCandidates(res.data.data || []);
  };

  const fetchJobs = async () => {
    const res = await jobApi.findAll({ limit: 100 });
    setJobs(res.data.data || []);
  };

  useEffect(() => {
    fetchInterviews();
    fetchCandidates();
    fetchJobs();
  }, []);

  const handleAdd = async () => {
    try {
      await interviewApi.create(formData);
      Message.success('创建成功');
      setVisible(false);
      setFormData({ candidateId: '', jobId: '', scheduledAt: '', feedback: '' });
      fetchInterviews();
    } catch (error) {
      Message.error('创建失败');
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await interviewApi.updateStatus(id, status);
      Message.success('更新成功');
      fetchInterviews();
    } catch (error) {
      Message.error('更新失败');
    }
  };

  const handleFeedback = async (id: string) => {
    const feedback = prompt('输入面试反馈：');
    if (!feedback) return;
    try {
      await interviewApi.updateFeedback(id, { feedback });
      Message.success('反馈已保存');
      fetchInterviews();
    } catch (error) {
      Message.error('保存失败');
    }
  };

  const columns = [
    { colKey: 'candidate', title: '候选人', width: 120, render: (h: any, row: Interview) => row.candidate?.name || '-' },
    { colKey: 'job', title: '职位', width: 150, render: (h: any, row: Interview) => row.job?.title || '-' },
    { colKey: 'scheduledAt', title: '面试时间', width: 150 },
    {
      colKey: 'status',
      title: '状态',
      width: 100,
      render: (h: any, row: Interview) => <Tag theme="primary" variant="light">{statusMap[row.status] || row.status}</Tag>,
    },
    { colKey: 'feedback', title: '反馈', width: 200, ellipsis: true },
    {
      colKey: 'action',
      title: '操作',
      width: 250,
      render: (h: any, row: Interview) => (
        <Space>
          {row.status === 'pending' && <Button theme="primary" size="small" onClick={() => handleStatusChange(row.id, 'confirmed')}>确认</Button>}
          {row.status === 'confirmed' && <Button theme="success" size="small" onClick={() => handleStatusChange(row.id, 'completed')}>完成</Button>}
          <Button theme="default" size="small" onClick={() => handleFeedback(row.id)}>反馈</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card header="面试管理">
        <div style={{ marginBottom: 16 }}>
          <Button theme="primary" onClick={() => setVisible(true)}>安排面试</Button>
        </div>
        <Table rowKey="id" columns={columns} data={interviews} loading={loading} pagination={{ defaultPageSize: 20 }} />
      </Card>

      <Dialog header="安排面试" visible={visible} onConfirm={handleAdd} onCancel={() => setVisible(false)}>
        <Form layout="vertical">
          <Form.FormItem label="候选人" required>
            <Select value={formData.candidateId} onChange={(v) => setFormData({ ...formData, candidateId: v })} options={candidates.map((c) => ({ label: c.name, value: c.id }))} />
          </Form.FormItem>
          <Form.FormItem label="职位" required>
            <Select value={formData.jobId} onChange={(v) => setFormData({ ...formData, jobId: v })} options={jobs.map((j) => ({ label: j.title, value: j.id }))} />
          </Form.FormItem>
          <Form.FormItem label="面试时间" required>
            <DatePicker value={formData.scheduledAt} onChange={(v) => setFormData({ ...formData, scheduledAt: v })} />
          </Form.FormItem>
        </Form>
      </Dialog>
    </div>
  );
};

export default Interview;
