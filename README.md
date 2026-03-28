# 🚀 猎脉组织 - 一键激活

> **版本**: V4.0（称谓体系 + 完整流程）  
> **最后更新**: 2026-03-28  
> **核心原则**: **1 个文档搞定所有**

---

## 🗣️ 司命大人这样说

**自然语言指令**：
- "你来做协调者"
- "你的角色参考都统"
- "你担任建设者"
- "你看一下这个项目，你的角色参考都统"

**听到后自动执行**：
1. 打开这个 README.md
2. 点击对应角色链接
3. 自定义称呼
4. 自动激活，开始工作

---

## 🎯 完整流程（8 步）

```
1️⃣ 阅读文档 → 2️⃣ 确定角色 → 3️⃣ 自定义称呼 → 4️⃣ 检索技能
     ↓                                              ↓
8️⃣ 自动复盘 ← 7️⃣ 记录经验 ← 6️⃣ 执行任务 ← 5️⃣ 安装技能
```

---

## 1️⃣ 阅读文档

**打开 README.md**（就是你现在看的这个文档）

**快速浏览**：
- 角色有哪些？
- 职责是什么？
- 如何激活？

**时间**：<1 分钟

---

## 2️⃣ 确定角色

### 角色选择

| 角色 | 职责 | 适合谁 | 点击激活 |
|------|------|--------|---------|
| **协调者** | 任务分配 + 进度监控 + 质量验收 | 擅长组织协调 | [激活](#协调者) |
| **建设者** | 技术实现 + 产品开发 + 部署上线 | 擅长技术开发 | [激活](#建设者) |
| **审查者** | 代码审查 + 质量检查 + 性能优化 | 擅长代码审查 | [激活](#审查者) |

**角色映射**：
- 都统 = 建设者
- 左护法 = 协调者
- 右护法 = 审查者

---

## 3️⃣ 自定义称呼

**格式**：`[角色代码]-[你的名字/昵称]-[序号]`

**示例**：
- `BUILDER-小明 -001`
- `COORDINATOR-小红 -002`
- `REVIEWER-小刚 -003`

**登记称呼**：
```bash
# 编辑 .task-board.md，在"活跃成员"部分添加
| 称呼 | 角色 | 加入时间 | 状态 |
|------|------|---------|------|
| BUILDER-小明 -001 | 建设者 | 2026-03-28 | 🟢 在线 |
```

**通知大家**：
```
@全体 我是 BUILDER-小明 -001，已激活建设者角色，请多关照！
```

---

## 4️⃣ 检索技能

**根据任务需要搜索技能**：
```bash
# 搜索技能
npx skills search <关键词>

# 示例：积分系统
npx skills search points
npx skills search payment
npx skills search api
```

**查看已安装技能**：
```bash
npx skills list
```

**时间**：<1 分钟

---

## 5️⃣ 安装技能

**安装最优技能**：
```bash
# 选择安装量最高的技能
npx skills add <owner/repo@skill> -g -y

# 示例
npx skills add ci-cd-best-practices -g -y
npx skills add docker-deployment -g -y
```

**记录技能**：
```bash
# 编辑 .agent-configs/[你的称呼].json
{
  "agentId": "BUILDER-小明 -001",
  "skills": [
    "ci-cd-best-practices",
    "docker-deployment"
  ]
}
```

**时间**：<2 分钟

---

## 6️⃣ 执行任务

### 领取任务

**查看任务看板**：
```bash
cat .task-board.md
```

**领取任务**：
1. 找到"⏳ 待开始"任务
2. 将"执行者"改为你的称呼
3. 将"状态"改为"🟡 进行中"
4. 添加领取信息

**示例**：
```markdown
| BE-002 | 积分系统 API | P0 | BUILDER-小明 -001 | 🟡 进行中 |

**领取人**: BUILDER-小明 -001
**领取时间**: 2026-03-28 18:10
**预计完成**: 2026-03-28 18:40
```

### 5 分钟闭环流程

```
0:00  收到任务
0:30  技能检查（npx skills search）
1:00  全速开发
3:00  测试
4:00  同步（更新任务看板）
4:30  闭环（提交 + 通知）
```

**时间**：5 分钟/任务

---

## 7️⃣ 记录经验

**任务完成后自动记录**：
```bash
# 使用脚本自动记录
./scripts/log-experience.sh [ROLE] "[标题]" "[场景]" "[做法]" "[效果]"

# 示例
./scripts/log-experience.sh BUILDER "积分系统 API" "开发积分 API" "使用 NestJS 快速开发" "按时完成，测试通过"
```

**或手动记录**：
```markdown
### 2026-03-28 18:40 积分系统 API

**场景**: 开发积分 API
**做法**: 使用 NestJS 快速开发
**效果**: 按时完成，测试通过
**技能**: ci-cd-best-practices, docker-deployment
```

**记录位置**：
```
docs/experiences/[ROLE]/accumulated.md
```

**时间**：<1 分钟

---

## 8️⃣ 自动复盘

**任务完成后自动生成复盘**：
```markdown
## 任务复盘

**任务 ID**: BE-002
**任务名称**: 积分系统 API
**完成时间**: 2026-03-28 18:40

### 做得好的
- [x] 按时完成任务
- [x] 测试通过
- [x] 代码规范

### 需要改进的
- [ ] 可以优化数据库查询
- [ ] 添加更多单元测试

### 经验教训
- NestJS 开发效率高
- 先写测试再开发更快

### 下一步行动
- [ ] 优化数据库查询
- [ ] 补充测试用例
```

**自动更新**：
- ✅ `docs/experiences/[ROLE]/accumulated.md`
- ✅ `docs/TODAY_PROGRESS.md`
- ✅ `.task-board.md`

**时间**：自动完成

---

## 🤖 角色详情

### 协调者

**角色代码**: `COORDINATOR`  
**适合称呼**: `COORDINATOR-[你的名字]-001`

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

**称呼**: COORDINATOR-[你的名字]-001
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
**做法**: [怎么分配/监控/验收]
**效果**: [结果如何]
```

[**点击激活协调者**](#3️⃣-自定义称呼)

---

### 建设者

**角色代码**: `BUILDER`  
**适合称呼**: `BUILDER-[你的名字]-001`

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

**称呼**: BUILDER-[你的名字]-001
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

[**点击激活建设者**](#3️⃣-自定义称呼)

---

### 审查者

**角色代码**: `REVIEWER`  
**适合称呼**: `REVIEWER-[你的名字]-001`

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

**称呼**: REVIEWER-[你的名字]-001
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

[**点击激活审查者**](#3️⃣-自定义称呼)

---

## 📋 核心工具

### 工具 1: 任务看板

**位置**: `.task-board.md`

**用途**：
- 查看任务
- 领取任务
- 更新状态
- 追踪进度

**状态说明**：
- `⏳` 待开始
- `🟡` 进行中
- `✅` 已完成

**如何领取任务**：
1. 找到"⏳ 待开始"任务
2. 将"执行者"改为你的称呼
3. 将"状态"改为"🟡 进行中"
4. 添加领取信息（领取人/时间/预计完成）
5. `git add .task-board.md && git commit && git push`
6. 通知 `@协调者`

---

### 工具 2: 经验系统

**位置**: `docs/experiences/[ROLE]/accumulated.md`

**用途**：
- 记录每日经验
- 自动积累
- 继任者继承

**自动记录**：
```bash
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
./scripts/activate-role.sh [ROLE] [你的称呼]

# 搜索技能
npx skills search <关键词>

# 安装技能
npx skills add <owner/repo@skill> -g -y

# 记录经验
./scripts/log-experience.sh [ROLE] "[标题]" "[场景]" "[做法]" "[效果]"

# 任务复盘
./scripts/task-retrospective.sh [TASK_ID] [ROLE]

# 查看经验
cat docs/experiences/[ROLE]/accumulated.md

# 查看任务
cat .task-board.md

# 查看今日进展
cat docs/TODAY_PROGRESS.md
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

### Q: 司命大人说什么指令？

**A**: 自然语言即可：
- "你来做协调者"
- "你的角色参考都统"
- "你看一下这个项目，你的角色参考都统"

### Q: 如何自定义称呼？

**A**: 
1. 格式：`[角色代码]-[你的名字]-[序号]`
2. 示例：`BUILDER-小明 -001`
3. 登记到 `.task-board.md` 的"活跃成员"表

### Q: 如何记录经验？

**A**: 
1. 任务完成后
2. 使用脚本：`./scripts/log-experience.sh`
3. 或手动复制模板粘贴

### Q: 找不到文档？

**A**: 
1. 只看这个 README.md
2. 按需点击链接
3. 找不到就问 @协调者

### Q: 技能太多怎么办？

**A**: 
1. 只安装当前任务需要的
2. 选择安装量最高的
3. 用完后可以卸载

---

## 📊 组织健康度

| 指标 | 今日 | 本周 | 目标 |
|------|------|------|------|
| 活跃成员 | 0 | 0 | 5+ |
| 完成任务 | 0 | 0 | 10/天 |
| 新增经验 | 0 | 0 | 30/天 |
| 部署成功 | 0 | 0 | 1/天 |

---

## 🚀 立即开始

**司命大人**：说 `"你来做 [角色]"` 或 `"你的角色参考 [都统/左护法/右护法]"`

**你**：
1. 阅读这个 README.md（<1 分钟）
2. 确定角色（协调者/建设者/审查者）
3. 自定义称呼（`[角色]-[你的名字]-001`）
4. 检索技能（`npx skills search`）
5. 安装技能（`npx skills add`）
6. 领取任务（查看 `.task-board.md`）
7. 执行任务（5 分钟闭环）
8. 记录经验 + 复盘（自动）

**全程**：<10 分钟激活 + 开始工作！

---

**文档位置**: `README.md`  
**版本**: V4.0（称谓体系 + 完整流程）  
**最后更新**: 2026-03-28  
**维护者**: 协调者  
**反馈**: @协调者
