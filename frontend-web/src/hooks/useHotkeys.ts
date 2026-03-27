import { useEffect, useCallback } from 'react';

export interface HotkeyConfig {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  handler: () => void;
  description?: string;
}

export const useHotkeys = (hotkeys: HotkeyConfig[]) => {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      for (const config of hotkeys) {
        const {
          key,
          ctrl = false,
          shift = false,
          alt = false,
          meta = false,
          handler,
        } = config;

        const isMatch =
          event.key.toLowerCase() === key.toLowerCase() &&
          event.ctrlKey === ctrl &&
          event.shiftKey === shift &&
          event.altKey === alt &&
          event.metaKey === meta;

        if (isMatch) {
          event.preventDefault();
          handler();
          break;
        }
      }
    },
    [hotkeys]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
};

// 快捷键帮助组件
export const HOTKEY_HELP = [
  { key: 'Ctrl + K', description: '快速搜索' },
  { key: 'Ctrl + N', description: '新建简历' },
  { key: 'Ctrl + E', description: '导出报表' },
  { key: 'Ctrl + /', description: '显示快捷键帮助' },
  { key: 'Escape', description: '关闭弹窗/取消选择' },
  { key: 'Ctrl + A', description: '全选' },
  { key: 'Delete', description: '删除选中项' },
];
