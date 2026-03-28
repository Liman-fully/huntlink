import React from 'react';
import { Pagination, Empty, Loading } from 'tdesign-react';
import ResumeCard from '../ResumeCard';
import './SearchResults.css';

export interface Candidate {
  id: string;
  name: string;
  currentTitle: string;
  currentCompany: string;
  experience: string;
  education: string;
  school?: string;
  location: string;
  expectedSalary: string;
  skills: string[];
  avatar?: string;
  lastActive: string;
  matchScore?: number;
  personalScore?: number;
}

export interface SearchResultsProps {
  results: Candidate[];
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  loading?: boolean;
  selectable?: boolean;
  selectedIds?: string[];
  onSelect?: (id: string, selected: boolean) => void;
  onAction?: (action: { type: string; id: string }) => void;
  emptyText?: string;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  results = [],
  total = 0,
  page = 1,
  pageSize = 20,
  onPageChange,
  onPageSizeChange,
  loading = false,
  selectable = false,
  selectedIds = [],
  onSelect,
  onAction,
  emptyText = '暂无搜索结果',
}) => {
  // 处理分页变化
  const handlePageChange = (pageInfo: { current?: number; pageSize?: number }) => {
    if (pageInfo.current) {
      onPageChange(pageInfo.current);
      // 滚动到顶部
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // 处理每页数量变化
  const handlePageSizeChange = (newPageSize: number) => {
    onPageSizeChange?.(newPageSize);
    // 重置到第一页
    onPageChange(1);
  };

  // 加载状态
  if (loading) {
    return (
      <div className="search-results search-results--loading">
        <div className="loading-container">
          <Loading size="large" />
          <p className="loading-text">正在搜索候选人...</p>
        </div>
      </div>
    );
  }

  // 空状态
  if (results.length === 0) {
    return (
      <div className="search-results search-results--empty">
        <Empty
          image="https://tdesign.gtimg.com/site/empty.png"
          description={emptyText}
        />
      </div>
    );
  }

  return (
    <div className="search-results">
      {/* 结果统计 */}
      <div className="results-header">
        <div className="results-info">
          找到 <strong className="results-count">{total}</strong> 位候选人
          {total > 0 && (
            <span className="results-range">
              （第 {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, total)} 条）
            </span>
          )}
        </div>
      </div>

      {/* 结果列表 */}
      <div className="results-list">
        {results.map((candidate) => (
          <div key={candidate.id} className="result-item">
            <ResumeCard
              data={candidate}
              variant="default"
              selectable={selectable}
              selected={selectedIds.includes(candidate.id)}
              onSelect={onSelect}
              onAction={onAction}
            />
          </div>
        ))}
      </div>

      {/* 分页 */}
      {total > pageSize && (
        <div className="results-pagination">
          <Pagination
            current={page}
            total={total}
            pageSize={pageSize}
            onChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            pageSizeOptions={[10, 20, 50, 100]}
            showJumper
          />
        </div>
      )}
    </div>
  );
};

export default SearchResults;
