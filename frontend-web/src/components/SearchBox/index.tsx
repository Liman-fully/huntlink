import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Input, Button, Loading } from 'tdesign-react';
import { SearchIcon, CloseIcon } from 'tdesign-icons-react';
import './SearchBox.css';

export interface SearchBoxProps {
  placeholder?: string;
  onSearch: (keyword: string) => void;
  onSuggestionClick?: (suggestion: string) => void;
  loading?: boolean;
  disabled?: boolean;
}

// 防抖函数
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

const SearchBox: React.FC<SearchBoxProps> = ({
  placeholder = '搜索候选人（姓名、技能、公司、职位...）',
  onSearch,
  onSuggestionClick,
  loading = false,
  disabled = false,
}) => {
  const [keyword, setKeyword] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionLoading, setSuggestionLoading] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // 模拟搜索建议 API 调用
  const fetchSuggestions = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setSuggestionLoading(true);
    try {
      // TODO: 替换为实际的后端 API
      // const res = await fetch(`/api/candidates/search/suggestions?q=${encodeURIComponent(query)}`);
      // const data = await res.json();
      // setSuggestions(data.suggestions || []);
      
      // 模拟数据
      const mockSuggestions = [
        `${query} 工程师`,
        `${query} 经理`,
        `${query} 总监`,
        `高级${query}`,
        `资深${query}`,
      ].filter((_, i) => i < Math.floor(Math.random() * 3) + 2);
      
      setSuggestions(mockSuggestions);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
      setSuggestions([]);
    } finally {
      setSuggestionLoading(false);
    }
  }, []);

  // 防抖搜索建议（300ms）
  const debouncedFetchSuggestions = useCallback(
    debounce(fetchSuggestions, 300),
    [fetchSuggestions]
  );

  // 处理输入变化
  const handleInputChange = (value: string) => {
    setKeyword(value);
    debouncedFetchSuggestions(value);
  };

  // 处理搜索
  const handleSearch = () => {
    if (keyword.trim()) {
      onSearch(keyword.trim());
      setShowSuggestions(false);
    }
  };

  // 处理键盘事件
  const handleKeyPress = (_value: string, context: { e: React.KeyboardEvent }) => {
    if (context.e.key === 'Enter') {
      handleSearch();
    }
  };

  // 处理建议点击
  const handleSuggestionClick = (suggestion: string) => {
    setKeyword(suggestion);
    onSuggestionClick?.(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
  };

  // 点击外部关闭建议
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 清空搜索
  const handleClear = () => {
    setKeyword('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <div className="search-box-wrapper" ref={suggestionsRef}>
      <div className="search-box">
        <Input
          size="large"
          placeholder={placeholder}
          value={keyword}
          onChange={handleInputChange}
          onKeypress={handleKeyPress}
          prefixIcon={<SearchIcon />}
          suffixIcon={
            keyword && !loading ? (
              <CloseIcon className="clear-icon" onClick={handleClear} />
            ) : loading ? (
              <Loading size="small" />
            ) : undefined
          }
          className="search-input"
          clearable={false}
          disabled={disabled}
        />
        <Button
          theme="primary"
          size="large"
          onClick={handleSearch}
          loading={loading}
          className="search-button"
          disabled={disabled}
        >
          搜索
        </Button>
      </div>

      {/* 搜索建议下拉框 */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="suggestions-dropdown">
          {suggestionLoading && (
            <div className="suggestions-loading">
              <Loading size="small" />
              <span>加载中...</span>
            </div>
          )}
          {!suggestionLoading && (
            <ul className="suggestions-list">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <SearchIcon className="suggestion-icon" />
                  <span className="suggestion-text">{suggestion}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBox;
