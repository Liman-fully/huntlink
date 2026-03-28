#!/bin/bash
# scripts/task-retrospective.sh
# 任务复盘自动化脚本

set -e

TASK_ID=$1
ROLE=$2

# 检查参数
if [ -z "$TASK_ID" ] || [ -z "$ROLE" ]; then
  echo "❌ 用法：./task-retrospective.sh [任务 ID] [ROLE]"
  echo "示例：./task-retrospective.sh BE-002 BUILDER"
  exit 1
fi

# 复盘文件
RETRO_FILE="docs/experiences/$ROLE/retrospectives/$TASK_ID.md"

# 创建目录
mkdir -p docs/experiences/$ROLE/retrospectives

# 生成复盘模板
cat > "$RETRO_FILE" << EOF
# 任务复盘：$TASK_ID

**任务 ID**: $TASK_ID
**角色**: $ROLE
**完成时间**: $(date +%Y-%m-%d\ %H:%M)

---

## ✅ 做得好的

- [ ] 
- [ ] 
- [ ] 

## ⚠️ 需要改进的

- [ ] 
- [ ] 

## 💡 经验教训

- [ ] 
- [ ] 

## 📋 下一步行动

- [ ] 
- [ ] 

---

**复盘时间**: $(date +%Y-%m-%d\ %H:%M)
**复盘者**: $ROLE
EOF

echo "✅ 复盘模板已生成：$RETRO_FILE"
echo ""
echo "📝 请填写复盘内容，然后："
echo "1. 更新任务看板状态为 ✅ 已完成"
echo "2. 通知 @协调者 验收"
echo ""

# 自动更新任务看板
TASK_BOARD=".task-board.md"
if [ -f "$TASK_BOARD" ]; then
  echo "⚠️ 请手动更新任务看板："
  echo "   将任务状态改为：✅ 已完成"
  echo "   添加完成时间：$(date +%Y-%m-%d)"
fi
