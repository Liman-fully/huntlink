import React, { useState } from 'react';
import { Input, Button, Tag, Card } from 'tdesign-react';
import { SearchIcon, FilterIcon } from 'tdesign-icons-react';
import './SearchHero.css';

export interface QuickFilter {
  label: string;
  value: string;
  active?: boolean;
}

export interface SearchHeroProps {
  placeholder?: string;
  quickFilters?: QuickFilter[];
  onSearch?: (keyword: string, filters: string[]) => void;
  onFilterClick?: () => void;
  loading?: boolean;
}

const SearchHero: React.FC<SearchHeroProps> = ({
  placeholder = '搜索人才姓名、技能、公司、职位...',
  quickFilters = [],
  onSearch,
  onFilterClick,
  loading = false,
}) => {
  const [keyword, setKeyword] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const handleSearch = () => {
    onSearch?.(keyword, activeFilters);
  };

  const handleKeypress = (_value: string, context: { e: React.KeyboardEvent }) => {
    if (context.e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleQuickFilter = (filter: QuickFilter) => {
    const newFilters = activeFilters.includes(filter.value)
      ? activeFilters.filter(f => f !== filter.value)
      : [...activeFilters, filter.value];
    setActiveFilters(newFilters);
  };

  return (
    <Card className="search-hero" bordered={false}>
      <div className="search-wrapper">
        <Input
          size="large"
          placeholder={placeholder}
          prefixIcon={<SearchIcon />}
          value={keyword}
          onChange={(value) => setKeyword(value as string)}
          onKeypress={handleKeypress}
          className="search-input"
          clearable
        />
        <Button
          theme="primary"
          size="large"
          onClick={handleSearch}
          loading={loading}
          className="search-button"
        >
          搜索
        </Button>
        <Button
          variant="outline"
          size="large"
          icon={<FilterIcon />}
          onClick={onFilterClick}
          className="filter-button"
        >
          高级筛选
        </Button>
      </div>

      {quickFilters.length > 0 && (
        <div className="quick-filters">
          <span className="filters-label">快捷筛选：</span>
          {quickFilters.map((filter) => (
            <Tag
              key={filter.value}
              variant={activeFilters.includes(filter.value) ? 'dark' : 'outline'}
              theme={activeFilters.includes(filter.value) ? 'primary' : 'default'}
              className="quick-filter-tag"
              onClick={() => handleQuickFilter(filter)}
            >
              {filter.label}
            </Tag>
          ))}
        </div>
      )}
    </Card>
  );
};

export default SearchHero;
