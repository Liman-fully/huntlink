#!/bin/bash
# 🎯 模拟汇报演练脚本
# 用法：./scripts/training-drill.sh
# 用途：团队培训时进行模拟汇报演练

set -e

echo "🎯 信息同步规范 V2.0 - 模拟汇报演练"
echo "================================"
echo ""

# 场景 1：任务完成后汇报
echo "📋 场景 1: 任务完成后汇报"
echo "--------------------------------"
echo "场景：你刚完成 DEV-001（搜索功能前端对接）"
echo ""
echo "请按以下步骤操作："
echo "1. 运行核查脚本：./scripts/verify-task-status.sh DEV-001"
echo "2. 检查三者一致性"
echo "3. 使用模板汇报"
echo ""
read -p "按回车继续..."

# 运行核查
echo "🔍 运行核查脚本..."
./scripts/verify-task-status.sh DEV-001
echo ""

echo "✅ 正确汇报模板:"
echo ""
cat << 'EOF'
## 📊 DEV-001 搜索功能前端对接 状态

**核查结果**:
- [x] 任务看板：✅ 已完成
- [x] git 提交：✅ 找到提交 `e147dd9`
- [x] 代码文件：✅ 文件存在（frontend-web/src/components/SearchBox/）
- [x] 文档同步：✅ TODAY_PROGRESS 已更新

**结论**: 功能已完成，提交者：左护法，时间：3/28 23:52
EOF
echo ""
echo "--------------------------------"
echo ""

# 场景 2：发现不一致
echo "📋 场景 2: 发现不一致时的处理"
echo "--------------------------------"
echo "场景：核查发现看板显示'待开始'，但 git 有提交"
echo ""
echo "请按以下步骤操作："
echo "1. 立即停止汇报"
echo "2. 通知执行者更新看板"
echo "3. 等待看板更新"
echo "4. 重新核查"
echo "5. 然后汇报"
echo ""
read -p "按回车继续..."

echo "✅ 正确处理流程:"
echo ""
cat << 'EOF'
# 1. 核查发现不一致
./scripts/verify-task-status.sh DEV-XXX
# 输出：⚠️ 任务看板显示"待开始"，但 git 有提交

# 2. 通知执行者
@执行者 DEV-XXX 看板状态与 git 不一致，请更新

# 3. 等待更新后重新核查
./scripts/verify-task-status.sh DEV-XXX
# 输出：✅ 三者一致

# 4. 然后汇报
EOF
echo ""
echo "--------------------------------"
echo ""

# 场景 3：每日进度汇报
echo "📋 场景 3: 每日进度汇报"
echo "--------------------------------"
echo "场景：每日站会汇报今日进展"
echo ""
echo "请按以下步骤操作："
echo "1. 运行汇报前检查：./scripts/pre-report-check.sh"
echo "2. 基于输出汇报"
echo ""
read -p "按回车继续..."

# 运行汇报前检查
echo "🚨 运行汇报前检查..."
./scripts/pre-report-check.sh
echo ""

echo "✅ 正确汇报模板:"
echo ""
cat << 'EOF'
## 📊 今日进展汇报

**今日完成**:
- DEV-001 搜索前端 (e147dd9)
- DEV-002 Redis 缓存 (c58ee10)
- DEV-003 批量导出 (6edc6f1)

**正在进行**:
- DEV-004 数据看板 (预计 12:00 完成)

**核查状态**:
✅ 所有汇报已通过三源验证
EOF
echo ""
echo "--------------------------------"
echo ""

# 小测试
echo "📝 小测试（口头回答）"
echo "================================"
echo ""
echo "问题 1: 三源验证是哪三个信息源？"
echo "答案：1) 任务看板 2) git 提交 3) 代码文件"
echo ""
echo "问题 2: 发现不一致时如何处理？"
echo "答案：1) 停止汇报 2) 通知执行者 3) 更新看板 4) 重新核查 5) 然后汇报"
echo ""
echo "问题 3: 汇报前必须执行哪个脚本？"
echo "答案：./scripts/pre-report-check.sh"
echo ""
echo "--------------------------------"
echo ""

echo "🎉 演练完成！"
echo ""
echo "💡 关键要点:"
echo "   - 汇报前必须执行核查脚本"
echo "   - 禁止仅依赖单一信息源"
echo "   - 发现不一致先纠正再汇报"
echo "   - 使用标准汇报模板"
echo ""
echo "📚 参考资料:"
echo "   - docs/SYNC_SPEC_V2.md"
echo "   - docs/QUICK_REF_SYNC_V2.md"
echo ""
