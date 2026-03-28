#!/bin/bash
# scripts/before-leave.sh
# 离开前同步脚本

set -e

DEVICE_ID="device-$(hostname)-$(whoami)"
PROGRESS_FILE="docs/progress/devices/$DEVICE_ID.md"
BROADCAST_DIR="docs/progress/broadcasts"

echo "🚨 离开前检查..."

# 1. 检查代码是否 push
if [ -n "$(git status --porcelain)" ]; then
  echo "❌ 代码未 push，请先提交"
  echo "   运行：git add . && git commit -m '保存进度' && git push origin master"
  exit 1
fi
echo "✅ 代码已提交"

# 2. 更新进度
echo "**$(date +%H:%M)** 离开，下次同步：[填写时间]" >> "$PROGRESS_FILE"

# 3. 广播离开
BROADCAST_FILE="$BROADCAST_DIR/$(date +%Y-%m-%d-%H-%M)-leave.md"
cat > "$BROADCAST_FILE" << EOF
# 离开广播

**设备**: $DEVICE_ID
**时间**: $(date)
**状态**: 🔴 离开
**下次同步**: [填写时间]
**当前进度**: [填写当前进度]
**待办事项**: 
- [ ] [待办 1]
- [ ] [待办 2]

**注意事项**:
- [注意 1]
- [注意 2]
EOF

# 4. 提交
git add "$PROGRESS_FILE" "$BROADCAST_FILE"
git commit -m "progress: $DEVICE_ID 离开"
git push origin master

echo "✅ 离开同步完成"
echo "📍 设备 ID: $DEVICE_ID"
echo "📄 进度文件：$PROGRESS_FILE"
echo "📢 广播文件：$BROADCAST_FILE"
echo ""
echo "👋 再见！记得下次同步时查看最新进展"
