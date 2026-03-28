import React, { useState, useCallback } from 'react';
import { Select, Slider, Button, TagInput } from 'tdesign-react';
import { FilterIcon, RefreshIcon } from 'tdesign-icons-react';
import './SearchFilters.css';

export interface SearchFiltersData {
  city?: string;
  experience?: string;
  education?: string;
  skills?: string[];
  salaryMin?: number;
  salaryMax?: number;
  lastActive?: string;
}

export interface FilterOption {
  label: string;
  value: string;
}

export interface SearchFiltersProps {
  filters: SearchFiltersData;
  onFilterChange: (filters: SearchFiltersData) => void;
  onReset?: () => void;
  onSearch?: () => void;
  loading?: boolean;
  collapsed?: boolean;
}

// 城市选项
const CITY_OPTIONS: FilterOption[] = [
  { label: '全部城市', value: '' },
  { label: '北京', value: '北京' },
  { label: '上海', value: '上海' },
  { label: '深圳', value: '深圳' },
  { label: '广州', value: '广州' },
  { label: '杭州', value: '杭州' },
  { label: '成都', value: '成都' },
  { label: '南京', value: '南京' },
  { label: '武汉', value: '武汉' },
  { label: '西安', value: '西安' },
];

// 经验选项
const EXPERIENCE_OPTIONS: FilterOption[] = [
  { label: '全部经验', value: '' },
  { label: '应届生', value: '应届生' },
  { label: '1-3 年', value: '1-3 年' },
  { label: '3-5 年', value: '3-5 年' },
  { label: '5-10 年', value: '5-10 年' },
  { label: '10 年以上', value: '10 年以上' },
];

// 学历选项
const EDUCATION_OPTIONS: FilterOption[] = [
  { label: '全部学历', value: '' },
  { label: '高中及以下', value: '高中及以下' },
  { label: '大专', value: '大专' },
  { label: '本科', value: '本科' },
  { label: '硕士', value: '硕士' },
  { label: '博士', value: '博士' },
];

// 活跃时间选项
const ACTIVE_OPTIONS: FilterOption[] = [
  { label: '全部时间', value: '' },
  { label: '刚刚活跃', value: '刚刚活跃' },
  { label: '1 小时内', value: '1 小时内' },
  { label: '今天', value: '今天' },
  { label: '3 天内', value: '3 天内' },
  { label: '1 周内', value: '1 周内' },
];

const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters = {},
  onFilterChange,
  onReset,
  onSearch,
  loading = false,
  collapsed = false,
}) => {
  const [localFilters, setLocalFilters] = useState<SearchFiltersData>(filters);
  const [isExpanded, setIsExpanded] = useState(!collapsed);

  // 处理筛选条件变化
  const handleFilterChange = useCallback(
    (key: keyof SearchFiltersData, value: any) => {
      const newFilters = { ...localFilters, [key]: value };
      setLocalFilters(newFilters);
      onFilterChange(newFilters);
    },
    [localFilters, onFilterChange]
  );

  // 处理重置
  const handleReset = () => {
    const resetFilters: SearchFiltersData = {};
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
    onReset?.();
  };

  // 处理搜索
  const handleSearch = () => {
    onSearch?.();
  };

  // 切换展开/收起
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // 检查是否有激活的筛选条件
  const hasActiveFilters = Object.values(localFilters).some(
    (value) => value !== undefined && value !== '' && (!Array.isArray(value) || value.length > 0)
  );

  return (
    <div className="search-filters">
      {/* 筛选器头部 */}
      <div className="filters-header">
        <div className="filters-title">
          <FilterIcon className="filters-icon" />
          <span>筛选条件</span>
          {hasActiveFilters && (
            <div className="active-filters-tag">
              <TagInput
                size="small"
                value={['已激活']}
                readonly
              />
            </div>
          )}
        </div>
        <div className="filters-actions">
          <Button
            theme="default"
            variant="outline"
            size="small"
            icon={<RefreshIcon />}
            onClick={handleReset}
            disabled={!hasActiveFilters || loading}
          >
            重置
          </Button>
          <Button
            theme="primary"
            size="small"
            onClick={handleSearch}
            loading={loading}
          >
            应用筛选
          </Button>
          <Button
            theme="default"
            variant="text"
            size="small"
            onClick={toggleExpand}
          >
            {isExpanded ? '收起' : '展开'}
          </Button>
        </div>
      </div>

      {/* 筛选器内容 */}
      {isExpanded && (
        <div className="filters-content">
          <div className="filters-row">
            {/* 城市筛选 */}
            <div className="filter-item">
              <label className="filter-label">工作地点</label>
              <Select
                value={localFilters.city || ''}
                options={CITY_OPTIONS}
                onChange={(value) => handleFilterChange('city', value as string)}
                placeholder="请选择城市"
                size="medium"
                className="filter-select"
                clearable
              />
            </div>

            {/* 经验筛选 */}
            <div className="filter-item">
              <label className="filter-label">工作经验</label>
              <Select
                value={localFilters.experience || ''}
                options={EXPERIENCE_OPTIONS}
                onChange={(value) => handleFilterChange('experience', value as string)}
                placeholder="请选择经验"
                size="medium"
                className="filter-select"
                clearable
              />
            </div>

            {/* 学历筛选 */}
            <div className="filter-item">
              <label className="filter-label">学历要求</label>
              <Select
                value={localFilters.education || ''}
                options={EDUCATION_OPTIONS}
                onChange={(value) => handleFilterChange('education', value as string)}
                placeholder="请选择学历"
                size="medium"
                className="filter-select"
                clearable
              />
            </div>
          </div>

          <div className="filters-row">
            {/* 薪资范围 */}
            <div className="filter-item filter-item--wide">
              <label className="filter-label">期望薪资 (K/月)</label>
              <div className="salary-slider">
                <Slider
                  value={[localFilters.salaryMin || 0, localFilters.salaryMax || 100]}
                  min={0}
                  max={100}
                  step={5}
                  range
                  onChange={(value) => {
                    if (Array.isArray(value)) {
                      handleFilterChange('salaryMin', value[0]);
                      handleFilterChange('salaryMax', value[1]);
                    }
                  }}
                  className="filter-slider"
                />
                <div className="salary-values">
                  <span>{localFilters.salaryMin || 0}K</span>
                  <span>-</span>
                  <span>{localFilters.salaryMax || 100}K+</span>
                </div>
              </div>
            </div>

            {/* 活跃时间 */}
            <div className="filter-item">
              <label className="filter-label">活跃时间</label>
              <Select
                value={localFilters.lastActive || ''}
                options={ACTIVE_OPTIONS}
                onChange={(value) => handleFilterChange('lastActive', value as string)}
                placeholder="请选择时间"
                size="medium"
                className="filter-select"
                clearable
              />
            </div>

            {/* 技能标签 */}
            <div className="filter-item filter-item--wide">
              <label className="filter-label">技能要求</label>
              <TagInput
                value={localFilters.skills || []}
                onChange={(value) => handleFilterChange('skills', value as string[])}
                placeholder="输入技能，按回车添加"
                size="medium"
                className="filter-tag-input"
                clearable
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;
