import React, { useState } from 'react';
import { Card, Select, InputNumber, Button, Tag, Space } from 'tdesign-react';
import { RefreshIcon } from 'tdesign-icons-react';
import './AdvancedFilter.css';

export interface FilterOption {
  label: string;
  value: string | number;
}

export interface FilterField {
  key: string;
  label: string;
  type: 'select' | 'multi-select' | 'number' | 'number-range';
  options?: FilterOption[];
  placeholder?: string;
}

export interface AdvancedFilterProps {
  fields: FilterField[];
  values: Record<string, any>;
  onChange: (values: Record<string, any>) => void;
  onReset?: () => void;
  onApply?: () => void;
  collapsed?: boolean;
  onCollapseChange?: (collapsed: boolean) => void;
}

const AdvancedFilter: React.FC<AdvancedFilterProps> = ({
  fields,
  values,
  onChange,
  onReset,
  onApply,
  collapsed = true,
  onCollapseChange,
}) => {
  const [localValues, setLocalValues] = useState<Record<string, any>>(values);

  const handleChange = (key: string, value: any) => {
    const newValues = { ...localValues, [key]: value };
    setLocalValues(newValues);
    onChange(newValues);
  };

  const handleReset = () => {
    setLocalValues({});
    onChange({});
    onReset?.();
  };

  const activeFilterCount = Object.values(localValues).filter(
    v => v !== undefined && v !== null && v !== '' && (Array.isArray(v) ? v.length > 0 : true)
  ).length;

  if (collapsed) {
    return null;
  }

  return (
    <Card className="advanced-filter" bordered={false}>
      <div className="filter-header">
        <span className="filter-title">高级筛选</span>
        {activeFilterCount > 0 && (
          <Tag theme="primary" variant="light">
            已选 {activeFilterCount} 项
          </Tag>
        )}
      </div>

      <div className="filter-fields">
        {fields.map((field) => (
          <div key={field.key} className="filter-field">
            <label className="field-label">{field.label}</label>
            {field.type === 'select' && (
              <Select
                value={localValues[field.key]}
                onChange={(value) => handleChange(field.key, value)}
                options={field.options}
                placeholder={field.placeholder || `请选择${field.label}`}
                clearable
                style={{ width: '100%' }}
              />
            )}
            {field.type === 'multi-select' && (
              <Select
                value={localValues[field.key]}
                onChange={(value) => handleChange(field.key, value)}
                options={field.options}
                placeholder={field.placeholder || `请选择${field.label}`}
                multiple
                clearable
                style={{ width: '100%' }}
              />
            )}
            {field.type === 'number' && (
              <InputNumber
                value={localValues[field.key]}
                onChange={(value) => handleChange(field.key, value)}
                placeholder={field.placeholder}
                style={{ width: '100%' }}
              />
            )}
            {field.type === 'number-range' && (
              <Space direction="horizontal" style={{ width: '100%' }}>
                <InputNumber
                  value={localValues[`${field.key}_min`]}
                  onChange={(value) => handleChange(`${field.key}_min`, value)}
                  placeholder="最小值"
                  style={{ width: '48%' }}
                />
                <span className="range-separator">-</span>
                <InputNumber
                  value={localValues[`${field.key}_max`]}
                  onChange={(value) => handleChange(`${field.key}_max`, value)}
                  placeholder="最大值"
                  style={{ width: '48%' }}
                />
              </Space>
            )}
          </div>
        ))}
      </div>

      <div className="filter-actions">
        <Button variant="outline" icon={<RefreshIcon />} onClick={handleReset}>
          重置
        </Button>
        <Button theme="primary" onClick={onApply}>
          应用筛选
        </Button>
        <Button variant="text" onClick={() => onCollapseChange?.(true)}>
          收起
        </Button>
      </div>
    </Card>
  );
};

export default AdvancedFilter;
