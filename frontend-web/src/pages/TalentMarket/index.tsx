import { useState, useCallback } from 'react';
import { Tag, MessagePlugin } from 'tdesign-react';
import SearchBox from '../../components/SearchBox';
import SearchResults from '../../components/SearchResults';
import SearchFilters, { SearchFiltersData } from '../../components/SearchFilters';
import BatchActionBar from '../../components/BatchActionBar';
import type { Candidate } from '../../components/SearchResults';
import './TalentMarket.css';

// 模拟数据 - 实际应从后端 API 获取
const mockTalents: Candidate[] = [
  {
    id: '1',
    name: '张**',
    currentTitle: '高级前端工程师',
    currentCompany: '字节跳动',
    experience: '5 年',
    education: '本科 · 清华大学',
    location: '北京',
    expectedSalary: '40-60K',
    skills: ['React', 'TypeScript', 'Node.js', 'Vue'],
    avatar: '',
    lastActive: '2 小时前',
    matchScore: 95,
    personalScore: 88,
  },
  {
    id: '2',
    name: '李**',
    currentTitle: '产品经理',
    currentCompany: '阿里巴巴',
    experience: '7 年',
    education: '硕士 · 北京大学',
    location: '杭州',
    expectedSalary: '50-80K',
    skills: ['产品规划', '用户研究', '数据分析', 'B 端产品'],
    avatar: '',
    lastActive: '刚刚活跃',
    matchScore: 92,
    personalScore: 90,
  },
  {
    id: '3',
    name: '王**',
    currentTitle: 'Java 架构师',
    currentCompany: '腾讯',
    experience: '10 年',
    education: '本科 · 浙江大学',
    location: '深圳',
    expectedSalary: '60-100K',
    skills: ['Java', 'Spring Cloud', '微服务', '分布式系统'],
    avatar: '',
    lastActive: '1 天前',
    matchScore: 88,
    personalScore: 95,
  },
  {
    id: '4',
    name: '赵**',
    currentTitle: 'UI 设计师',
    currentCompany: '美团',
    experience: '4 年',
    education: '本科 · 中央美术学院',
    location: '北京',
    expectedSalary: '30-50K',
    skills: ['Figma', 'Sketch', 'UI 设计', '交互设计'],
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
    experience: '3 年',
    education: '硕士 · 复旦大学',
    location: '上海',
    expectedSalary: '25-40K',
    skills: ['Python', 'SQL', 'Tableau', '机器学习'],
    avatar: '',
    lastActive: '3 小时前',
    matchScore: 80,
    personalScore: 78,
  },
  {
    id: '6',
    name: '周**',
    currentTitle: '运维工程师',
    currentCompany: '华为',
    experience: '6 年',
    education: '本科 · 西安交通大学',
    location: '深圳',
    expectedSalary: '35-55K',
    skills: ['Kubernetes', 'Docker', 'Linux', 'CI/CD'],
    avatar: '',
    lastActive: '5 小时前',
    matchScore: 75,
    personalScore: 85,
  },
];

export default function TalentMarket() {
  // 搜索状态
  const [searchLoading, setSearchLoading] = useState(false);
  
  // 筛选状态
  const [filters, setFilters] = useState<SearchFiltersData>({});
  
  // 结果状态
  const [results, setResults] = useState<Candidate[]>(mockTalents);
  const [total, setTotal] = useState(mockTalents.length);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [resultsLoading, setResultsLoading] = useState(false);
  
  // 批量选择状态
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('match');

  // 处理搜索
  const handleSearch = useCallback(async (keyword: string) => {
    setSearchLoading(true);
    setResultsLoading(true);
    
    try {
      // TODO: 调用后端搜索 API
      // const response = await fetch(`/api/candidates/search?q=${encodeURIComponent(keyword)}`, {
      //   method: 'POST',
      //   body: JSON.stringify({ ...filters, keyword }),
      // });
      // const data = await response.json();
      // setResults(data.results);
      // setTotal(data.total);
      
      // 模拟搜索延迟
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 简单的前端过滤模拟
      const filtered = mockTalents.filter(talent => {
        if (!keyword) return true;
        const searchLower = keyword.toLowerCase();
        return (
          talent.name.toLowerCase().includes(searchLower) ||
          talent.currentTitle.toLowerCase().includes(searchLower) ||
          talent.currentCompany.toLowerCase().includes(searchLower) ||
          talent.skills.some(skill => skill.toLowerCase().includes(searchLower))
        );
      });
      
      setResults(filtered);
      setTotal(filtered.length);
      setPage(1);
      
      MessagePlugin.success(`找到 ${filtered.length} 位候选人`);
    } catch (error) {
      console.error('Search error:', error);
      MessagePlugin.error('搜索失败，请稍后重试');
    } finally {
      setSearchLoading(false);
      setResultsLoading(false);
    }
  }, [filters]);

  // 处理筛选条件变化
  const handleFilterChange = useCallback((newFilters: SearchFiltersData) => {
    setFilters(newFilters);
  }, []);

  // 处理筛选应用
  const handleApplyFilters = useCallback(async () => {
    setResultsLoading(true);
    
    try {
      // TODO: 调用后端 API 应用筛选
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 简单的前端过滤模拟
      let filtered = mockTalents;
      
      if (filters.city) {
        filtered = filtered.filter(t => t.location.includes(filters.city!));
      }
      
      if (filters.experience) {
        filtered = filtered.filter(t => t.experience.includes(filters.experience!));
      }
      
      if (filters.education) {
        filtered = filtered.filter(t => t.education.includes(filters.education!));
      }
      
      setResults(filtered);
      setTotal(filtered.length);
      setPage(1);
      
      MessagePlugin.success(`筛选完成，找到 ${filtered.length} 位候选人`);
    } catch (error) {
      console.error('Filter error:', error);
      MessagePlugin.error('筛选失败，请稍后重试');
    } finally {
      setResultsLoading(false);
    }
  }, [filters]);

  // 处理分页变化
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    // TODO: 加载新页数据
  };

  // 处理每页数量变化
  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1);
    // TODO: 加载新页数据
  };

  // 处理建议点击
  const handleSuggestionClick = (suggestion: string) => {
    console.log('Suggestion clicked:', suggestion);
  };

  // 处理简历选择
  const handleSelect = useCallback((id: string, selected: boolean) => {
    setSelectedIds(prev =>
      selected ? [...prev, id] : prev.filter(i => i !== id)
    );
  }, []);

  // 处理简历操作
  const handleAction = useCallback((action: { type: string; id: string }) => {
    console.log('Action:', action);
    switch (action.type) {
      case 'view':
        MessagePlugin.info(`查看简历 ${action.id}`);
        break;
      case 'download':
        MessagePlugin.info(`下载简历 ${action.id}`);
        break;
      case 'interview':
        MessagePlugin.info(`发送面试邀请 ${action.id}`);
        break;
      case 'add':
        MessagePlugin.success(`已加入人才库 ${action.id}`);
        break;
    }
  }, []);

  // 处理重置筛选
  const handleResetFilters = () => {
    setFilters({});
    setResults(mockTalents);
    setTotal(mockTalents.length);
    setPage(1);
    MessagePlugin.success('已重置筛选条件');
  };

  // 切换排序
  const handleSort = (sortType: string) => {
    setSortBy(sortType);
    // TODO: 根据排序类型重新排序结果
    MessagePlugin.info(`按${sortType === 'match' ? '匹配度' : sortType === 'newest' ? '最新' : '活跃度'}排序`);
  };

  return (
    <div className="talent-market">
      {/* 搜索区 */}
      <div className="search-section">
        <SearchBox
          onSearch={handleSearch}
          onSuggestionClick={handleSuggestionClick}
          loading={searchLoading}
        />
        
        {/* 筛选条件 */}
        <div className="filters-section">
          <SearchFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onSearch={handleApplyFilters}
            onReset={handleResetFilters}
            loading={resultsLoading}
            collapsed={false}
          />
        </div>
      </div>

      {/* 结果区 */}
      <div className="results-section">
        {/* 排序选项 */}
        <div className="sort-bar">
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
              onClick={() => handleSort(item.key)}
            >
              {item.label}
            </Tag>
          ))}
        </div>

        {/* 搜索结果 */}
        <SearchResults
          results={results.slice((page - 1) * pageSize, page * pageSize)}
          total={total}
          page={page}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          loading={resultsLoading}
          selectable
          selectedIds={selectedIds}
          onSelect={handleSelect}
          onAction={handleAction}
        />
      </div>

      {/* 批量操作栏 */}
      {selectedIds.length > 0 && (
        <BatchActionBar
          selectedCount={selectedIds.length}
          totalCount={results.length}
          onSelectAll={(checked) => {
            if (checked) {
              setSelectedIds(results.map(r => r.id));
            } else {
              setSelectedIds([]);
            }
          }}
          onDownload={() => MessagePlugin.info('下载选中简历')}
          onSendInterview={() => MessagePlugin.info('发送面试邀请')}
          onAddToPool={() => MessagePlugin.success('已加入人才库')}
          onClearSelection={() => setSelectedIds([])}
          visible={true}
        />
      )}
    </div>
  );
}
