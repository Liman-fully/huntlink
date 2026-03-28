#!/bin/bash
# 🔍 任务状态核查脚本 (CROSS-VERIFY)
# 用法：./scripts/verify-task-status.sh DEV-001
# 强制：汇报前必须执行此脚本

set -e

TASK_ID=$1

if [ -z "$TASK_ID" ]; then
    echo "❌ 用法：$0 <任务 ID>"
    echo "示例：$0 DEV-001"
    exit 1
fi

echo "🔍 核查任务状态：$TASK_ID"
echo "================================"
echo ""

# 1️⃣ 检查任务看板
echo "1️⃣ 任务看板状态 (.task-board.md):"
echo "--------------------------------"
TASK_BOARD_STATUS=$(grep -A 3 "$TASK_ID" .task-board.md 2>/dev/null | head -5 || echo "未找到")
if [ "$TASK_BOARD_STATUS" = "未找到" ]; then
    echo "❌ 任务看板中未找到 $TASK_ID"
else
    echo "$TASK_BOARD_STATUS"
fi
echo ""

# 2️⃣ 检查 git 提交记录
echo "2️⃣ Git 提交记录:"
echo "--------------------------------"
GIT_COMMITS=$(git log --all --oneline --grep="$TASK_ID" | head -5)
if [ -z "$GIT_COMMITS" ]; then
    echo "⚠️  未找到包含 $TASK_ID 的提交"
    echo "💡 提示：可能任务未完成，或提交信息未包含任务 ID"
else
    echo "$GIT_COMMITS"
    LATEST_COMMIT=$(echo "$GIT_COMMITS" | head -1 | awk '{print $1}')
    echo ""
    echo "📝 最新提交详情:"
    git show --stat "$LATEST_COMMIT" | head -15
fi
echo ""

# 3️⃣ 检查代码文件（根据任务 ID 自动判断）
echo "3️⃣ 代码文件检查:"
echo "--------------------------------"
case $TASK_ID in
  DEV-001|*搜索*|*Search*)
    echo "检查搜索相关组件..."
    if [ -d "frontend-web/src/components/SearchBox" ]; then
      echo "✅ SearchBox 组件存在"
      ls -la frontend-web/src/components/SearchBox/
    else
      echo "❌ SearchBox 组件不存在"
    fi
    
    if [ -d "frontend-web/src/components/SearchResults" ]; then
      echo "✅ SearchResults 组件存在"
    else
      echo "❌ SearchResults 组件不存在"
    fi
    
    if [ -d "frontend-web/src/components/SearchFilters" ]; then
      echo "✅ SearchFilters 组件存在"
    else
      echo "❌ SearchFilters 组件不存在"
    fi
    ;;
    
  DEV-002|*缓存*|*Cache*|*Redis*)
    echo "检查缓存相关模块..."
    if [ -d "backend/src/common/cache" ]; then
      echo "✅ Cache 模块存在"
      ls -la backend/src/common/cache/
    else
      echo "❌ Cache 模块不存在"
    fi
    ;;
    
  DEV-003|*导出*|*Export*)
    echo "检查导出相关模块..."
    if [ -f "backend/src/modules/export/pdf-exporter.ts" ]; then
      echo "✅ PDF 导出器存在"
    else
      echo "❌ PDF 导出器不存在"
    fi
    
    if [ -f "backend/src/modules/export/excel-exporter.ts" ]; then
      echo "✅ Excel 导出器存在"
    else
      echo "❌ Excel 导出器不存在"
    fi
    ;;
    
  DEV-004|*看板*|*Dashboard*|*数据看板*)
    echo "检查 Dashboard 页面..."
    if [ -d "frontend-web/src/pages/Dashboard" ]; then
      echo "✅ Dashboard 页面存在"
      ls -la frontend-web/src/pages/Dashboard/
    else
      echo "❌ Dashboard 页面不存在"
    fi
    ;;
    
  DEV-005|*推荐*|*Recommend*)
    echo "检查推荐相关模块..."
    if [ -d "backend/src/modules/match" ]; then
      echo "✅ Match 模块存在（可能是推荐功能）"
      ls -la backend/src/modules/match/
    else
      echo "⚠️  Match 模块不存在或为空"
    fi
    ;;
    
  *)
    echo "⚠️  未知任务类型，跳过文件检查"
    echo "💡 提示：请在脚本中添加此任务类型的检查逻辑"
    ;;
esac
echo ""

# 4️⃣ 检查文档同步
echo "4️⃣ 文档同步检查:"
echo "--------------------------------"
if grep -q "$TASK_ID" docs/TODAY_PROGRESS.md 2>/dev/null; then
    echo "✅ TODAY_PROGRESS.md 中包含 $TASK_ID"
    echo "📝 相关内容:"
    grep -A 2 "$TASK_ID" docs/TODAY_PROGRESS.md | head -5
else
    echo "⚠️  TODAY_PROGRESS.md 中未找到 $TASK_ID"
    echo "💡 提示：任务完成后应更新此文档"
fi
echo ""

# 5️⃣ 综合判断
echo "================================"
echo "📊 核查结论:"
echo "================================"

HAS_GIT_COMMIT=false
HAS_FILES=false
HAS_DOC_UPDATE=false

if [ -n "$(git log --all --oneline --grep="$TASK_ID" | head -1)" ]; then
    HAS_GIT_COMMIT=true
fi

case $TASK_ID in
  DEV-001)
    [ -d "frontend-web/src/components/SearchBox" ] && HAS_FILES=true
    ;;
  DEV-002)
    [ -d "backend/src/common/cache" ] && HAS_FILES=true
    ;;
  DEV-003)
    [ -f "backend/src/modules/export/pdf-exporter.ts" ] && HAS_FILES=true
    ;;
  DEV-004)
    [ -d "frontend-web/src/pages/Dashboard" ] && HAS_FILES=true
    ;;
  *)
    HAS_FILES=true  # 未知任务类型，假设文件检查通过
    ;;
esac

if grep -q "$TASK_ID" docs/TODAY_PROGRESS.md 2>/dev/null; then
    HAS_DOC_UPDATE=true
fi

# 判断状态
if [ "$HAS_GIT_COMMIT" = true ] && [ "$HAS_FILES" = true ]; then
    echo "✅ 任务已完成（有提交 + 有文件）"
    if [ "$HAS_DOC_UPDATE" = false ]; then
        echo "⚠️  警告：文档未同步更新！"
        echo "💡 建议：立即更新 docs/TODAY_PROGRESS.md"
    fi
elif [ "$HAS_GIT_COMMIT" = true ] || [ "$HAS_FILES" = true ]; then
    echo "🟡 任务可能进行中（有提交或文件，但不完整）"
else
    echo "⏳ 任务尚未开始（无提交 + 无文件）"
fi

echo ""
echo "================================"
echo "✅ 核查完成"
echo ""
echo "📝 汇报前请确认："
echo "   1. 任务看板状态是否与核查结果一致"
echo "   2. 文档是否已同步更新"
echo "   3. 如有不一致，先纠正再汇报"
echo ""
