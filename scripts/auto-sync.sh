#!/bin/bash
# scripts/auto-sync.sh
# 自动进度同步脚本

set -e

# 生成设备指纹
DEVICE_ID="device-$(hostname)-$(whoami)"
PROGRESS_FILE="docs/progress/devices/$DEVICE_ID.md"
BROADCAST_DIR="docs/progress/broadcasts"
HEARTBEAT_FILE="docs/progress/heartbeats/$DEVICE_ID.heartbeat"

# 确保目录存在
mkdir -p docs/progress/devices
mkdir -p docs/progress/broadcasts
mkdir -p docs/progress/heartbeats

# 如果进度文件不存在，创建它
if [ ! -f "$PROGRESS_FILE" ]; then
  echo "📝 创建进度文件：$PROGRESS_FILE"
  cat > "$PROGRESS_FILE" << EOF
# $DEVICE_ID 进度

**加入时间**: $(date)
**今日目标**: [填写]

## 当前任务
- [ ] 任务 1

## 最新进展
- $(date +%H:%M) 开始任务 1
EOF
fi

# 更新进度
echo "**$(date +%H:%M)** 开发中..." >> "$PROGRESS_FILE"

# 创建广播
BROADCAST_FILE="$BROADCAST_DIR/$(date +%Y-%m-%d-%H-%M).md"
cat > "$BROADCAST_FILE" << EOF
# 进度广播

**设备**: $DEVICE_ID
**时间**: $(date)
**进展**: [请填写当前进展]
**下一步**: [请填写下一步]
**状态**: 🟡 进行中
EOF

# 更新心跳
echo "$(date)" > "$HEARTBEAT_FILE"

# 提交
git add "$PROGRESS_FILE" "$BROADCAST_FILE" "$HEARTBEAT_FILE" 2>/dev/null || true
if ! git diff --cached --quiet; then
  git commit -m "progress: $DEVICE_ID 同步"
  git push origin master
  echo "✅ 进度已同步到云端"
else
  echo "⚠️ 无变化，跳过提交"
fi

echo "📍 设备 ID: $DEVICE_ID"
echo "📄 进度文件：$PROGRESS_FILE"
echo "📢 广播文件：$BROADCAST_FILE"
echo "💓 心跳文件：$HEARTBEAT_FILE"
