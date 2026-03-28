import { useState, useCallback, useEffect } from 'react';
import { Tag, MessagePlugin } from 'tdesign-react';
import SearchBox from '../../components/SearchBox';
import SearchResults from '../../components/SearchResults';
import SearchFilters, { SearchFiltersData } from '../../components/SearchFilters';
import BatchActionBar from '../../components/BatchActionBar';
import { searchCandidates, transformSearchResults, type SearchCandidateParams, type Candidate } from '../../services/searchApi';
import './TalentMarket.css';

// 将前端筛选条件转换为后端 API 参数
function buildSearchParams(filters: SearchFiltersData, keyword?: string, page?: number, pageSize?: number, sortBy?: string): SearchCandidateParams {
  const params: SearchCandidateParams = {
    page: page || 1,
    limit: pageSize || 20,
  };

  if (keyword) {
    params.keyword = keyword;
  }

  if (filters.city) {
    params.city = filters.city;
  }

  if (filters.education) {
    // 将学历文本转换为后端格式
    const educationMap: Record<string, number> = {
      '高中及以下': 5,
      '大专': 4,
      '本科': 1,
      '硕士': 2,
      '博士': 3,
    };
    params.educationLevel = educationMap[filters.education];
  }

  if (filters.experience) {
    // 将经验文本转换为工作年限范围
    const experienceMap: Record<string, { min: number; max: number }> = {
      '应届生': { min: 0, max: 0 },
      '1-3 年': { min: 1, max: 3 },
      '3-5 年': { min: 3, max: 5 },
      '5-10 年': { min: 5, max: 10 },
      '10 年以上': { min: 10, max: 99 },
    };
    const range = experienceMap[filters.experience];
    if (range) {
      params.workYearsMin = range.min;
      params.workYearsMax = range.max;
    }
  }

  if (filters.skills && filters.skills.length > 0) {
    params.skills = filters.skills;
  }

  if (filters.salaryMin !== undefined) {
    // 薪资可以作为过滤条件，但后端可能需要额外支持
    // params.salaryMin = filters.salaryMin;
  }

  if (filters.salaryMax !== undefined) {
    // params.salaryMax = filters.salaryMax;
  }

  if (sortBy) {
    if (sortBy === 'match') {
      params.sortBy = 'relevance';
      params.sortOrder = 'DESC';
    } else if (sortBy === 'newest') {
      params.sortBy = 'created_at';
      params.sortOrder = 'DESC';
    } else if (sortBy === 'active') {
      params.sortBy = 'updated_at';
      params.sortOrder = 'DESC';
    } else if (sortBy === 'experience') {
      params.sortBy = 'work_years';
      params.sortOrder = 'DESC';
    }
  }

  return params;
}

export default function TalentMarket() {
  // 搜索关键词
  const [keyword, setKeyword] = useState<string>('');
  
  // 筛选状态
  const [filters, setFilters] = useState<SearchFiltersData>({});
  
  // 结果状态
  const [results, setResults] = useState<Candidate[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [resultsLoading, setResultsLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  
  // 批量选择状态
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('match');

  // 组件挂载时加载初始数据
  useEffect(() => {
    executeSearch('', 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 执行搜索
  const executeSearch = useCallback(async (searchKeyword?: string, pageNum?: number) => {
    setResultsLoading(true);
    setSearchLoading(true);
    
    try {
      const searchParams = buildSearchParams(
        filters,
        searchKeyword !== undefined ? searchKeyword : keyword,
        pageNum || page,
        pageSize,
        sortBy
      );
      
      const searchResults = await searchCandidates(searchParams);
      const transformed = transformSearchResults(searchResults);
      
      setResults(transformed.data);
      setTotal(transformed.total);
      setPage(transformed.page);
      
      if (searchKeyword !== undefined) {
        setKeyword(searchKeyword);
      }
      
      MessagePlugin.success(`找到 ${transformed.total} 位候选人`);
    } catch (error) {
      console.error('Search error:', error);
      MessagePlugin.error('搜索失败，请稍后重试');
      setResults([]);
      setTotal(0);
    } finally {
      setResultsLoading(false);
      setSearchLoading(false);
    }
  }, [filters, keyword, page, pageSize, sortBy]);

  // 处理搜索
  const handleSearch = useCallback(async (searchKeyword: string) => {
    setKeyword(searchKeyword);
    setPage(1);
    await executeSearch(searchKeyword, 1);
  }, [executeSearch]);

  // 处理筛选条件变化
  const handleFilterChange = useCallback((newFilters: SearchFiltersData) => {
    setFilters(newFilters);
  }, []);

  // 处理筛选应用
  const handleApplyFilters = useCallback(async () => {
    setPage(1);
    await executeSearch(keyword, 1);
  }, [executeSearch, keyword]);

  // 处理分页变化
  const handlePageChange = useCallback(async (newPage: number) => {
    setPage(newPage);
    await executeSearch(keyword, newPage);
  }, [executeSearch, keyword]);

  // 处理每页数量变化
  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1);
    executeSearch(keyword, 1);
  }, [executeSearch, keyword]);

  // 处理建议点击
  const handleSuggestionClick = useCallback((suggestion: string) => {
    console.log('Suggestion clicked:', suggestion);
    handleSearch(suggestion);
  }, [handleSearch]);

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
    setPage(1);
    executeSearch(keyword, 1);
    MessagePlugin.success('已重置筛选条件');
  };

  // 切换排序
  const handleSort = useCallback(async (sortType: string) => {
    setSortBy(sortType);
    setPage(1);
    await executeSearch(keyword, 1);
    MessagePlugin.info(`按${sortType === 'match' ? '匹配度' : sortType === 'newest' ? '最新' : sortType === 'active' ? '活跃度' : '经验'}排序`);
  }, [executeSearch, keyword]);

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
            { key: 'experience', label: '经验' },
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
          results={results}
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
          totalCount={total}
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
