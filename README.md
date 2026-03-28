# 🚀 猎脉组织 - 一键激活

> **版本**: V3.0（终极精简版）  
> **最后更新**: 2026-03-28  
> **核心原则**: **1 个文档搞定所有**

---

## 👋 快速激活

**司命大人说**：`"你来做 [角色]"`

**你自动执行**：

### 1️⃣ 选择角色（30 秒）

| 角色 | 职责 | 点击激活 |
|------|------|---------|
| **协调者** | 任务分配 + 进度监控 | [激活](#协调者) |
| **建设者** | 技术实现 + 产品开发 | [激活](#建设者) |
| **审查者** | 质量审查 + 性能优化 | [激活](#审查者) |

---

## 🤖 角色详情

### 协调者

**核心职责**：
1. 任务分配
2. 进度监控
3. 质量验收

**激活后自动执行**：
```bash
# 1. 继承经验
cp docs/experiences/COORDINATOR/handover.md \
   docs/experiences/COORDINATOR/inherited.md

# 2. 开启记忆
cat > docs/experiences/COORDINATOR/accumulated.md << EOF
# 协调者经验

**开始**: $(date)
**今日目标**: 完成 10 个任务闭环
EOF

# 3. 查看任务
cat .task-board.md
```

**日常工作**：
- 早上 9:00：分配任务 → 更新 `.task-board.md`
- 中午 12:00：检查进度 → 更新 `.task-board.md`
- 晚上 20:00：验收任务 → 记录经验

**经验记录模板**：
```markdown
### [时间] [任务标题]
**场景**: [什么情况]
**做法**: [怎么做]
**效果**: [结果]
```

---

### 建设者

**核心职责**：
1. 技术实现
2. 产品开发
3. 部署上线

**激活后自动执行**：
```bash
# 1. 继承经验
cp docs/experiences/BUILDER/handover.md \
   docs/experiences/BUILDER/inherited.md

# 2. 开启记忆
cat > docs/experiences/BUILDER/accumulated.md << EOF
# 建设者经验

**开始**: $(date)
**今日目标**: 完成 5 个功能开发
EOF

# 3. 领取任务
# 查看 .task-board.md，选择"待开始"任务
```

**5 分钟闭环流程**：
```
0:00  收到任务
0:30  技能检查（npx skills search）
1:00  全速开发
3:00  测试
4:00  同步（更新任务看板）
4:30  闭环（提交 + 通知）
```

**经验记录模板**：
```markdown
### [时间] [任务标题]
**技术栈**: [用了什么]
**难点**: [遇到什么困难]
**解决**: [怎么解决]
**复盘**: [下次如何更好]
```

---

### 审查者

**核心职责**：
1. 代码审查
2. 质量检查
3. 性能优化

**激活后自动执行**：
```bash
# 1. 继承经验
cp docs/experiences/REVIEWER/handover.md \
   docs/experiences/REVIEWER/inherited.md

# 2. 开启记忆
cat > docs/experiences/REVIEWER/accumulated.md << EOF
# 审查者经验

**开始**: $(date)
**今日目标**: 审查 10 个 PR
EOF

# 3. 查看待审查
# 查看 .task-board.md，选择"待审查"任务
```

**审查清单**：
- [ ] TypeScript 编译通过
- [ ] ESLint 检查通过
- [ ] 测试通过
- [ ] 无安全漏洞
- [ ] 代码规范

**经验记录模板**：
```markdown
### [时间] [审查任务]
**问题**: [发现什么问题]
**建议**: [怎么改进]
**结果**: [是否采纳]
```

---

## 📋 核心工具

### 工具 1: 任务看板

**位置**: `.task-board.md`

**用途**：
- 查看任务
- 领取任务
- 更新状态

**状态说明**：
- `⏳` 待开始
- `🟡` 进行中
- `✅` 已完成

---

### 工具 2: 经验系统

**位置**: `docs/experiences/[ROLE]/accumulated.md`

**用途**：
- 记录每日经验
- 自动积累
- 继任者继承

**自动记录**：
```bash
# 任务完成后自动执行
./scripts/log-experience.sh [ROLE] "[标题]" "[场景]" "[做法]" "[效果]"
```

---

### 工具 3: 今日进展

**位置**: `docs/TODAY_PROGRESS.md`

**用途**：
- 记录今日完成
- 记录进行中
- 记录问题和计划

**自动更新**：
```bash
# 每晚 23:00 自动执行
./scripts/update-today-progress.sh
```

---

## 🎯 快速参考

### 常用命令

```bash
# 激活角色
./scripts/activate-role.sh [ROLE]

# 记录经验
./scripts/log-experience.sh [ROLE] "[标题]" "[场景]" "[做法]" "[效果]"

# 任务复盘
./scripts/task-retrospective.sh [TASK_ID] [ROLE]

# 查看经验
cat docs/experiences/[ROLE]/accumulated.md

# 查看任务
cat .task-board.md
```

### 常用链接

| 文档 | 用途 | 链接 |
|------|------|------|
| 组织总览 | 了解架构 | [ORGANIZATION.md](ORGANIZATION.md) |
| 5 分钟闭环 | 快速开发 | [docs/5MIN_CLOSED_LOOP.md](docs/5MIN_CLOSED_LOOP.md) |
| 部署培训 | 学习部署 | [docs/DEPLOYMENT_TRAINING.md](docs/DEPLOYMENT_TRAINING.md) |
| 技能库 | 查找技能 | [docs/SKILLS_KNOWLEDGE_BASE.md](docs/SKILLS_KNOWLEDGE_BASE.md) |

---

## 💬 常见问题

### Q: 如何开始工作？

**A**: 
1. 司命大人说："你来做 [角色]"
2. 你点击对应角色链接
3. 自动激活，开始工作

### Q: 如何记录经验？

**A**: 
1. 任务完成后
2. 复制经验模板
3. 粘贴到 `docs/experiences/[ROLE]/accumulated.md`
4. 或使用 `./scripts/log-experience.sh`

### Q: 找不到文档？

**A**: 
1. 只看这个 README.md
2. 按需点击链接
3. 找不到就问 @协调者

---

## 📊 组织健康度

| 指标 | 今日 | 本周 | 目标 |
|------|------|------|------|
| 完成任务 | 0 | 0 | 10/天 |
| 新增经验 | 0 | 0 | 30/天 |
| 部署成功 | 0 | 0 | 1/天 |

---

**文档位置**: `README.md`  
**版本**: V3.0（终极精简版）  
**最后更新**: 2026-03-28  
**维护者**: 协调者  
**反馈**: @协调者

---

## 🚀 立即开始

**司命大人**：说 `"你来做 [角色]"`  
**你**：点击对应角色链接，自动激活！
