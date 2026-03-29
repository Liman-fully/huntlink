# 🔄 信息同步规范 V2.0 - 防失误机制

**创建时间**: 2026-03-29  
**触发事件**: 右护法汇报错误事件（DEV-001~005 状态误判）  
**核心目标**: **杜绝任何类似信息同步失误**

---

## 🚨 问题根源分析

### 事件回顾
右护法在汇报开发进度时，出现以下错误：
- ❌ 仅依赖任务看板状态（显示"待领取"）
- ❌ 未核查 git 提交记录（实际已完成）
- ❌ 未检查代码文件（Dashboard 页面已存在）
- ❌ 导致错误汇报：DEV-001/004 标记为"未完成"

### 根本原因

| 问题 | 描述 | 影响 |
|------|------|------|
| **单一信息源** | 只看任务看板，未交叉验证 | 信息滞后/错误 |
| **无强制核查** | 汇报前无强制检查清单 | 依赖个人自觉 |
| **文档更新延迟** | 任务完成后未及时更新看板 | 状态不同步 |
| **无自动化验证** | 无脚本自动同步状态 | 人工操作易出错 |

---

## 📋 新同步机制（V2.0）

### 核心原则：**三源验证 + 强制核查 + 自动同步**

```
┌─────────────────────────────────────────────────────────┐
│                    任务状态汇报                          │
├─────────────────────────────────────────────────────────┤
│  1️⃣ 任务看板 (.task-board.md)                           │
│  2️⃣ git 提交记录 (git log)                               │
│  3️⃣ 代码文件检查 (ls/find)                               │
└─────────────────────────────────────────────────────────┘
                        ↓
            【三者一致】→ 可汇报
            【三者不一致】→ 先核查再汇报
```

---

## 🔧 强制核查清单（每次汇报前必做）

### 📌 汇报前检查清单（CROSS-VERIFY）

**C - Check git log（检查提交记录）**
```bash
# 必须执行
git log --oneline -10
git log --all --oneline --grep="任务 ID" | head -5
```

**R - Read task board（读取任务看板）**
```bash
# 必须执行
cat .task-board.md | grep "任务 ID"
cat docs/TODAY_PROGRESS.md | grep "任务 ID"
```

**O - Observe code files（检查代码文件）**
```bash
# 必须执行
ls -la frontend-web/src/pages/Dashboard/ 2>/dev/null || echo "文件不存在"
ls -la backend/src/modules/[模块名]/ 2>/dev/null || echo "模块不存在"
```

**S - Synchronize documents（同步文档）**
```bash
# 必须执行：确保文档状态与代码一致
# 如果不一致，立即更新文档
```

**S - Verify with team（与团队确认）**
```bash
# 如有疑问，@相关成员确认
# 不要假设，不要猜测
```

---

## 📊 状态汇报模板（强制使用）

### ✅ 正确模板

```markdown
## 📊 [功能名] 状态

**核查结果**:
- [x] 任务看板：✅ 已完成
- [x] git 提交：✅ 找到提交 `e147dd9`
- [x] 代码文件：✅ 文件存在（路径：xxx）
- [x] 文档同步：✅ TODAY_PROGRESS 已更新

**结论**: 功能已完成，提交者：左护法，时间：3/28 23:52
```

### ❌ 错误模板（禁止使用）

```markdown
## 📊 [功能名] 状态

**状态**: ⏳ 待开始（任务看板显示）

（❌ 未核查 git 和代码文件）
```

---

## 🤖 自动化同步脚本（必须创建）

### 脚本 1: `scripts/verify-task-status.sh`

```bash
#!/bin/bash
# 任务状态核查脚本
# 用法：./scripts/verify-task-status.sh DEV-001

TASK_ID=$1

echo "🔍 核查任务状态：$TASK_ID"
echo "================================"

# 1. 检查任务看板
echo "1️⃣ 任务看板状态:"
grep -A 2 "$TASK_ID" .task-board.md | head -5

# 2. 检查 git 提交
echo -e "\n2️⃣ Git 提交记录:"
git log --all --oneline --grep="$TASK_ID" | head -5

# 3. 检查代码文件（根据任务类型）
echo -e "\n3️⃣ 代码文件检查:"
case $TASK_ID in
  DEV-001)
    ls -la frontend-web/src/components/SearchBox/ 2>/dev/null && echo "✅ 文件存在" || echo "❌ 文件不存在"
    ;;
  DEV-002)
    ls -la backend/src/common/cache/ 2>/dev/null && echo "✅ 文件存在" || echo "❌ 文件不存在"
    ;;
  DEV-003)
    ls -la backend/src/modules/export/ 2>/dev/null && echo "✅ 文件存在" || echo "❌ 文件不存在"
    ;;
  DEV-004)
    ls -la frontend-web/src/pages/Dashboard/ 2>/dev/null && echo "✅ 文件存在" || echo "❌ 文件不存在"
    ;;
  *)
    echo "未知任务 ID"
    ;;
esac

echo -e "\n================================"
echo "✅ 核查完成"
```

### 脚本 2: `scripts/sync-task-board.sh`

```bash
#!/bin/bash
# 自动同步任务看板状态
# 用法：./scripts/sync-task-board.sh DEV-001 completed

TASK_ID=$1
STATUS=$2  # completed / in-progress / todo

# 自动更新 .task-board.md
# 自动更新 docs/TODAY_PROGRESS.md
# 自动 git commit + push

echo "📝 同步任务状态：$TASK_ID -> $STATUS"
# ... 实现自动更新逻辑
```

### 脚本 3: `scripts/pre-report-check.sh`

```bash
#!/bin/bash
# 汇报前强制检查脚本
# 用法：./scripts/pre-report-check.sh

echo "🚨 汇报前强制检查"
echo "================================"

# 1. 检查今日进展文档是否最新
LAST_UPDATE=$(grep "最后更新" docs/TODAY_PROGRESS.md | tail -1)
echo "1️⃣ 今日进展最后更新：$LAST_UPDATE"

# 2. 检查最新 git 提交
LATEST_COMMIT=$(git log --oneline -1)
echo "2️⃣ 最新提交：$LATEST_COMMIT"

# 3. 检查任务看板是否同步
echo "3️⃣ 任务看板状态检查..."
# 比较 git 提交和任务看板，发现不一致则告警

# 4. 生成汇报摘要
echo -e "\n📊 汇报摘要:"
git log --since="24 hours ago" --oneline | wc -l | xargs echo "今日提交数:"

echo -e "\n✅ 检查完成，可以汇报"
```

---

## 📝 文档更新规则（强制）

### 规则 1: 提交前必须更新文档

```bash
# 错误做法 ❌
git commit -m "feat: 完成 DEV-001"
# 然后忘记更新文档

# 正确做法 ✅
# 1. 先更新 docs/TODAY_PROGRESS.md
# 2. 更新 .task-board.md
# 3. 然后 git commit
git add docs/TODAY_PROGRESS.md .task-board.md
git commit -m "feat: 完成 DEV-001 + 更新文档"
```

### 规则 2: 文档必须包含提交 ID

```markdown
### 天策府（左护法）

| 时间 | 进展 | 配置/问题 |
|------|------|----------|
| 23:52 | ✅ DEV-001 完成 | 提交：`e147dd9` |
```

### 规则 3: 离开前强制同步

```bash
# 离开前必须执行
./scripts/pre-leave-check.sh

# 检查清单：
# - [ ] 代码已 push
# - [ ] TODAY_PROGRESS.md 已更新（含提交 ID）
# - [ ] .task-board.md 已更新
# - [ ] 通知@协调者
```

---

## 🎯 角色职责

### 执行者职责
- ✅ 任务完成后**立即**更新文档（含提交 ID）
- ✅ 离开前**强制**同步所有文档
- ✅ 汇报前**必须**执行三源验证

### 协调者职责（左护法）
- ✅ 定期检查文档同步状态
- ✅ 发现不一致时**立即**纠正
- ✅ 维护自动化脚本

### 审查者职责（右护法）
- ✅ 汇报前**必须**执行核查清单
- ✅ 发现疑点**必须**交叉验证
- ✅ **禁止**仅依赖单一信息源

---

## 🚨 违规处理

### 一级违规（警告）
- 未执行三源验证就汇报
- 文档更新延迟 < 1 小时

**处理**: 立即纠正 + 口头警告

### 二级违规（严重）
- 文档更新延迟 > 1 天
- 重复出现相同错误

**处理**: 团队通报 + 复盘会议

### 三级违规（极严重）
- 故意不更新文档
- 导致重大决策失误

**处理**: 重新评估协作资格

---

## 📊 监控指标

| 指标 | 目标值 | 当前值 | 状态 |
|------|--------|--------|------|
| 文档同步及时率 | 100% | - | 🟡 监控中 |
| 汇报准确率 | 100% | - | 🟡 监控中 |
| 自动化脚本覆盖率 | 100% | - | 🟡 监控中 |

---

## 🔄 持续改进

### 每周复盘
- 检查是否有信息同步失误
- 优化自动化脚本
- 更新核查清单

### 每月审查
- 审查文档结构是否合理
- 审查流程是否高效
- 收集团队反馈

---

## 📞 快速参考

### 汇报前必做（30 秒）
```bash
# 1. 检查 git 提交
git log --oneline -5

# 2. 检查任务看板
cat .task-board.md | grep "今日任务" -A 20

# 3. 检查代码文件
ls -la frontend-web/src/pages/[相关页面]/
```

### 发现不一致时
```bash
# 1. 立即通知执行者
@执行者 任务看板显示 DEV-001 待开始，但 git 显示已完成，请确认

# 2. 更新文档
# 以 git 提交为准，更新任务看板

# 3. 记录问题
# 记录到 docs/ISSUES.md
```

---

## ✅ 实施清单

- [ ] 创建自动化脚本（verify-task-status.sh）
- [ ] 创建自动化脚本（sync-task-board.sh）
- [ ] 创建自动化脚本（pre-report-check.sh）
- [ ] 团队培训（三源验证机制）
- [ ] 第一次演练（模拟汇报）
- [ ] 每周复盘机制启动

---

**文档位置**: `docs/SYNC_SPEC_V2.md`  
**生效时间**: 立即生效  
**维护者**: 左护法（天策府主官）  
**审查者**: 全体成员

---

## 💡 核心理念

> **信任但要验证 (Trust but Verify)**
> 
> - 信任团队成员的汇报
> - 但必须通过三源验证
> - 自动化 > 人工操作
> - 文档即代码（同步更新）

> **宁可慢三分，不可错一分**
> 
> - 汇报前多花 30 秒核查
> - 避免错误信息传播
> - 提高团队决策质量
