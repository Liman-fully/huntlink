import React from 'react';
import { Card, Button, Checkbox, Space } from 'tdesign-react';
import { DownloadIcon, UserAddIcon, ChatIcon } from 'tdesign-icons-react';
import './BatchActionBar.css';

export interface BatchActionBarProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll?: (checked: boolean) => void;
  onDownload?: () => void;
  onSendInterview?: () => void;
  onAddToPool?: () => void;
  onClearSelection?: () => void;
  visible?: boolean;
}

const BatchActionBar: React.FC<BatchActionBarProps> = ({
  selectedCount,
  totalCount,
  onSelectAll,
  onDownload,
  onSendInterview,
  onAddToPool,
  onClearSelection,
  visible = true,
}) => {
  if (!visible || selectedCount === 0) {
    return null;
  }

  const isAllSelected = selectedCount === totalCount;

  return (
    <Card className="batch-action-bar" bordered={false}>
      <div className="batch-content">
        <div className="batch-left">
          <Checkbox
            checked={isAllSelected}
            indeterminate={selectedCount > 0 && !isAllSelected}
            onChange={onSelectAll}
          >
            全选
          </Checkbox>
          <span className="selected-count">
            已选择 <strong>{selectedCount}</strong> 人
          </span>
          <Button variant="text" size="small" onClick={onClearSelection}>
            取消选择
          </Button>
        </div>
        <div className="batch-right">
          <Space>
            <Button
              variant="outline"
              icon={<DownloadIcon />}
              onClick={onDownload}
            >
              下载简历
            </Button>
            <Button
              variant="outline"
              icon={<ChatIcon />}
              onClick={onSendInterview}
            >
              发送面试
            </Button>
            <Button
              theme="primary"
              icon={<UserAddIcon />}
              onClick={onAddToPool}
            >
              加入人才库
            </Button>
          </Space>
        </div>
      </div>
    </Card>
  );
};

export default BatchActionBar;
