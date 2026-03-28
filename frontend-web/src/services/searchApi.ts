import apiClient from '../utils/api';

export interface SearchCandidateParams {
  keyword?: string;
  city?: string;
  educationLevel?: number;
  workYearsMin?: number;
  workYearsMax?: number;
  skills?: string[];
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface Candidate {
  id: string;
  name: string;
  currentTitle?: string;
  currentCompany?: string;
  experience?: string;
  education?: string;
  school?: string;
  location: string;
  expectedSalary?: string;
  skills: string[];
  avatar?: string;
  lastActive: string;
  matchScore?: number;
  personalScore?: number;
  work_years?: number;
  education_level?: number;
  resumeJsonb?: any;
}

export interface SearchResults {
  data: Candidate[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SearchSuggestion {
  success: true;
  data: string[];
}

/**
 * 搜索候选人
 */
export async function searchCandidates(params: SearchCandidateParams): Promise<SearchResults> {
  const response = await apiClient.get('/candidates/search', { params });
  return response.data;
}

/**
 * 获取搜索建议
 */
export async function getSearchSuggestions(query: string, limit: number = 5): Promise<string[]> {
  const response = await apiClient.get('/candidates/search/suggestions', {
    params: { q: query, limit },
  });
  return response.data;
}

/**
 * 获取搜索统计
 */
export async function getSearchStats(params: SearchCandidateParams): Promise<any> {
  const response = await apiClient.get('/candidates/search/stats', { params });
  return response.data;
}

/**
 * 获取候选人详情
 */
export async function getCandidateById(id: number): Promise<Candidate> {
  const response = await apiClient.get(`/candidates/${id}`);
  return response.data;
}

/**
 * 将后端候选人数据转换为前端格式
 */
export function transformCandidate(backendCandidate: any): Candidate {
  const resumeData = backendCandidate.resumeJsonb || {};
  
  return {
    id: String(backendCandidate.id),
    name: backendCandidate.name || '',
    currentTitle: resumeData.currentTitle || '',
    currentCompany: resumeData.currentCompany || '',
    experience: formatExperience(backendCandidate.work_years),
    education: formatEducation(backendCandidate.education_level),
    school: resumeData.school || '',
    location: backendCandidate.city || '',
    expectedSalary: resumeData.expectedSalary || '',
    skills: resumeData.skills || [],
    avatar: resumeData.avatar || '',
    lastActive: formatLastActive(backendCandidate.updated_at),
    matchScore: calculateMatchScore(backendCandidate),
    personalScore: calculatePersonalScore(backendCandidate),
    work_years: backendCandidate.work_years,
    education_level: backendCandidate.education_level,
    resumeJsonb: resumeData,
  };
}

/**
 * 将后端搜索结果转换为前端格式
 */
export function transformSearchResults(backendResults: any): SearchResults {
  return {
    data: backendResults.data.map(transformCandidate),
    total: backendResults.total,
    page: backendResults.page,
    limit: backendResults.limit,
    totalPages: backendResults.totalPages,
  };
}

/**
 * 格式化工作年限为经验描述
 */
function formatExperience(workYears?: number): string {
  if (workYears === undefined || workYears === null) return '';
  if (workYears < 1) return '应届生';
  if (workYears < 3) return '1-3 年';
  if (workYears < 5) return '3-5 年';
  if (workYears < 10) return '5-10 年';
  return '10 年以上';
}

/**
 * 格式化学历
 */
function formatEducation(level?: number): string {
  if (level === undefined || level === null) return '';
  const educationMap: Record<number, string> = {
    5: '高中及以下',
    4: '大专',
    1: '本科',
    2: '硕士',
    3: '博士',
  };
  return educationMap[level] || '';
}

/**
 * 格式化最后活跃时间
 */
function formatLastActive(updatedAt?: string): string {
  if (!updatedAt) return '未知';
  
  const now = new Date();
  const updated = new Date(updatedAt);
  const diffMs = now.getTime() - updated.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffHours < 1) return '刚刚活跃';
  if (diffHours < 24) return `${diffHours}小时前`;
  if (diffDays < 7) return `${diffDays}天前`;
  return updated.toLocaleDateString('zh-CN');
}

/**
 * 计算匹配度分数（简化版本）
 */
function calculateMatchScore(candidate: any): number {
  let score = 70; // 基础分
  
  // 根据工作年限加分
  if (candidate.work_years) {
    if (candidate.work_years >= 3 && candidate.work_years <= 10) score += 10;
    if (candidate.work_years > 10) score += 5;
  }
  
  // 根据学历加分
  if (candidate.education_level) {
    if (candidate.education_level >= 1) score += 10;
    if (candidate.education_level >= 2) score += 5;
  }
  
  // 根据技能数量加分
  const skills = candidate.resumeJsonb?.skills || [];
  if (skills.length >= 3) score += 5;
  if (skills.length >= 5) score += 5;
  
  return Math.min(score, 100);
}

/**
 * 计算个人综合分数（简化版本）
 */
function calculatePersonalScore(candidate: any): number {
  let score = 75; // 基础分
  
  // 根据最近更新时间加分
  if (candidate.updated_at) {
    const updated = new Date(candidate.updated_at);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - updated.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 1) score += 15;
    else if (diffDays < 7) score += 10;
    else if (diffDays < 30) score += 5;
  }
  
  // 根据技能数量加分
  const skills = candidate.resumeJsonb?.skills || [];
  if (skills.length >= 5) score += 10;
  
  return Math.min(score, 100);
}
