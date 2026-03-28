import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

// 候选人 API
export const candidateApi = {
  findAll: (params?: any) => api.get('/candidates', { params }),
  findOne: (id: string) => api.get(`/candidates/${id}`),
  create: (data: any) => api.post('/candidates', data),
  update: (id: string, data: any) => api.put(`/candidates/${id}`, data),
  remove: (id: string) => api.delete(`/candidates/${id}`),
  addTag: (id: string, tag: string) => api.post(`/candidates/${id}/tags`, { tag }),
  updateStatus: (id: string, status: string) => api.patch(`/candidates/${id}/status`, { status }),
};

// 职位 API
export const jobApi = {
  findAll: (params?: any) => api.get('/jobs', { params }),
  findOne: (id: string) => api.get(`/jobs/${id}`),
  create: (data: any) => api.post('/jobs', data),
  update: (id: string, data: any) => api.put(`/jobs/${id}`, data),
  updateStatus: (id: string, status: string) => api.patch(`/jobs/${id}/status`, { status }),
  remove: (id: string) => api.delete(`/jobs/${id}`),
};

// 面试 API
export const interviewApi = {
  findAll: (params?: any) => api.get('/interviews', { params }),
  findOne: (id: string) => api.get(`/interviews/${id}`),
  create: (data: any) => api.post('/interviews', data),
  updateStatus: (id: string, status: string) => api.patch(`/interviews/${id}/status`, { status }),
  updateFeedback: (id: string, data: any) => api.patch(`/interviews/${id}/feedback`, data),
};

// 简历 API
export const resumeApi = {
  findAll: () => api.get('/resumes'),
  upload: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/resumes', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  remove: (id: string) => api.delete(`/resumes/${id}`),
};

// 统计 API
export const statisticsApi = {
  getOverview: () => api.get('/statistics/overview'),
};
