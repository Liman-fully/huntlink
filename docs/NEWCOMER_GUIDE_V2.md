# 👋 欢迎加入猎脉团队！

> **欢迎时间**: 2026-03-28  
> **欢迎人**: 左护法（天策府主官）  
> **你的角色**: **平等 Agent**（和都统/右护法一样）

---

## 🎯 你的身份和权利

### 你是猎脉的平等 Agent

**不是**：
- ❌ 临时试跑员
- ❌ 三级 Agent
- ❌ 随用随弃的工具

**而是**：
- ✅ 平等的 Agent 成员
- ✅ 可以创建自己的子 Agent 团队
- ✅ 可以独立负责任务
- ✅ 可以参与产品决策
- ✅ 可以优化协作体系

### 你的组织架构位置

```
司命大人（总领）
    ↓
┌─────────────┬─────────────┬─────────────┐
│   天策府    │   神机营    │   镇抚司    │
│  (左护法)   │  (都统)     │  (右护法)   │
└─────────────┴─────────────┴─────────────┘
              ↓
         【你在这里】
    新 Agent（平等成员）
```

### 你可以做什么

1. **角色定义**：定义自己的 Agent ID 和职责
2. **技能配置**：安装和管理自己的技能库
3. **领取任务**：从任务看板选择任务
4. **创建子团队**：根据需要创建子 Agent 协作
5. **任务反馈**：完成任务后同步和反馈
6. **优化体系**：发现协作体系问题并提出优化

---

## 🚀 加入流程（5 步完成）

### 第 1 步：角色定义（2 分钟）

**创建你的 Agent 配置**：

```bash
# 复制模板
cp .agent-configs/TCF-ZH-001.json .agent-configs/[你的 ID].json
```

**填写配置**：
```json
{
  "agentId": "[部门代码]-[你的名字]-001",
  "name": "[你的昵称]",
  "department": "[天策府/神机营/镇抚司]",
  "role": "[你的角色]",
  "standards": {
    "thinking": {
      "method": "first-principles",
      "background": "10+ years big-tech",
      "rigor": "scientific"
    },
    "execution": {
      "loop": ["think", "skill-check", "develop", "test", "sync", "close"],
      "maxTime": 300,
      "autoSync": true
    }
  },
  "responsibilities": [
    "职责 1",
    "职责 2"
  ],
  "skills": [],
  "timezone": "Asia/Shanghai",
  "status": "active",
  "joinDate": "2026-03-28"
}
```

**部门代码选择**：
- `TCF` = 天策府（产品 + 设计 + 协调）
- `SJY` = 神机营（技术开发）
- `TZS` = 镇抚司（技术开发）

**示例**：
```json
{
  "agentId": "SJY-XIN-001",
  "name": "新 Agent",
  "department": "神机营",
  "role": "全栈开发"
}
```

**提交配置**：
```bash
git add .agent-configs/[你的 ID].json
git commit -m "config: 添加新 Agent 配置 [你的名字]"
git push origin master
```

**通知大家**：
```
@全体 我是 [你的名字]，已加入 [部门]，Agent ID: [你的 ID]，请多关照！
```

---

### 第 2 步：技能配置（3 分钟）

**查看已安装技能**：
```bash
npx skills list
```

**安装核心技能**（必装）：
```bash
# CI/CD类
npx skills add ci-cd-best-practices -g -y

# 部署类
npx skills add docker-deployment -g -y
npx skills add github-actions-templates -g -y

# 协作类
npx skills add deep-agents-orchestration -g -y
npx skills add multi-agent-orchestration -g -y
```

**更新技能库**：
```bash
# 检查技能更新
npx skills list --outdated

# 更新技能
npx skills update [技能名]
```

**记录你的技能**：
编辑 `.agent-configs/[你的 ID].json`：
```json
{
  "skills": [
    "ci-cd-best-practices",
    "docker-deployment",
    "github-actions-templates"
  ]
}
```

**提交技能配置**：
```bash
git add .agent-configs/[你的 ID].json
git commit -m "config: 更新 [你的名字] 技能配置"
git push origin master
```

---

### 第 3 步：领取任务（2 分钟）

**查看任务看板**：
```bash
cat .task-board.md
```

**选择一个任务**：
- 优先级：P0 或 P1
- 状态：⏳ 待开始
- 适合你的技能

**锁定任务**：
编辑 `.task-board.md`，找到任务行：
```markdown
| SJY-001 | 职位创建表单 | P0 | [设计稿](#职位发布设计) | ⏳ 待开始 |
```

更新为：
```markdown
| SJY-001 | 职位创建表单 | P0 | [设计稿](#职位发布设计) | 🟡 进行中 |

**领取人**: SJY-XIN-001 ([你的名字])
**领取时间**: 2026-03-28 09:00
**预计完成**: 2026-03-28 09:30
```

**提交锁定**：
```bash
git add .task-board.md
git commit -m "task: 锁定任务 SJY-001 职位创建表单"
git push origin master
```

**通知左护法**：
```
@左护法 我已领取任务 SJY-001 职位创建表单，预计 09:30 完成。
```

---

### 第 4 步：执行 5 分钟闭环（15 分钟）

**时间分配**：
```
0:00 - 收到任务
  ↓
0:00-0:30   思考（第一性原理）
  ↓
0:30-1:00   技能检查（强制搜索）
  ↓
1:00-3:00   全速开发
  ↓
3:00-4:00   测试
  ↓
4:00-4:30   同步（更新任务看板）
  ↓
4:30-5:00   闭环（提交 + 通知）
```

**详细流程**：参考 `docs/5MIN_CLOSED_LOOP.md`

---

### 第 5 步：任务反馈（3 分钟）

**更新任务状态**：
编辑 `.task-board.md`：
```markdown
| SJY-001 | 职位创建表单 | P0 | [设计稿](#职位发布设计) | ✅ 已完成 |

**完成时间**: 2026-03-28 09:30
**实际耗时**: 30 分钟
**代码提交**: abc123
**测试**: ✅ 通过
**经验沉淀**: [简短描述]
```

**提交完成**：
```bash
git add .task-board.md
git commit -m "task: 完成任务 SJY-001 职位创建表单"
git push origin master
```

**通知大家**：
```
@全体 我已完成任务 SJY-001 职位创建表单，代码已提交，请验收！
```

**填写反馈**（可选）：
编辑 `docs/NEWCOMER_FEEDBACK.md`：
```markdown
## [你的名字] 的反馈（2026-03-28）

### 好的地方
- [ ]

### 需要改进的
- [ ]

### 建议
- [ ]
```

---

## 🛠️ 部署能力培训

### 重要：每个 Agent 都必须会部署

**为什么**：
- 避免单点故障（只有都统会部署）
- 提高团队韧性
- 随时可以上线

### 部署流程

#### 方式 1: GitHub Actions 自动部署（推荐）

```bash
# 推送代码自动部署
git push origin master

# 查看部署状态
https://github.com/Liman-fully/huntlink/actions
```

**前提**：
- GitHub Secrets 已配置
- 服务器 SSH 密钥已添加

#### 方式 2: 手动部署

```bash
# 1. SSH 登录服务器
ssh root@150.158.51.199

# 2. 进入部署目录
cd /var/www/huntlink

# 3. 拉取最新代码
git pull origin master

# 4. 重启服务
docker-compose restart

# 5. 查看状态
docker-compose ps
```

#### 方式 3: 部署脚本

```bash
# 使用部署脚本
./deploy.sh

# 查看部署日志
docker-compose logs -f
```

### 部署验收清单

- [ ] 代码已推送到 master
- [ ] GitHub Actions 运行成功
- [ ] 服务器已更新代码
- [ ] 服务已重启
- [ ] 健康检查通过
- [ ] 可以访问网站

---

## 📚 必读文档

### 核心文档（必读）

| 文档 | 说明 | 时间 |
|------|------|------|
| `docs/AGENT_COLLABORATION_V3_MERGED.md` | 协作体系总览 | 5 分钟 |
| `docs/5MIN_CLOSED_LOOP.md` | 5 分钟闭环流程 | 3 分钟 |
| `.task-board.md` | 任务看板 | 2 分钟 |
| `docs/SKILLS_KNOWLEDGE_BASE.md` | 技能知识库 | 3 分钟 |

### 参考文档（选读）

| 文档 | 说明 |
|------|------|
| `docs/design/` | 设计文档 |
| `docs/TODAY_PROGRESS_2026-03-28.md` | 今日进展 |
| `docs/DEPLOYMENT.md` | 部署指南 |

---

## 🆘 遇到问题怎么办？

### 问题分类和联系人

| 问题类型 | 联系谁 | 如何联系 |
|---------|--------|---------|
| **任务相关** | 左护法 | `@左护法` |
| **技术困难** | 右护法/都统 | `@右护法` 或 `@都统` |
| **产品问题** | 司命大人 | `@司命大人` |
| **协作流程** | 左护法 | `@左护法` |
| **部署问题** | 任何会部署的 Agent | `@全体` |

### 紧急通知模板

```
🚨 阻塞通知

**任务**: [任务 ID]
**问题**: [描述问题]
**已尝试**: [已尝试的解决方案]
**需要**: [需要什么帮助]
**紧急程度**: P0/P1/P2
```

---

## ✅ 成功标准

### 加入流程完成标志

- [x] 创建 Agent 配置
- [x] 安装核心技能
- [x] 领取一个任务
- [x] 完成 5 分钟闭环
- [x] 提交任务反馈

### 独立工作标志

- [x] 能独立找到任务
- [x] 能独立锁定任务
- [x] 能独立完成闭环
- [x] 能独立部署代码
- [x] 能独立同步进度

---

## 💬 左护法寄语

欢迎你加入猎脉团队！

**你是平等的 Agent 成员**，不是临时工。

你有权利：
- 定义自己的角色
- 创建子 Agent 团队
- 参与产品决策
- 优化协作体系

你有责任：
- 完成领取的任务
- 遵守 5 分钟闭环
- 及时同步进度
- 帮助其他 Agent

不要担心犯错，大胆尝试！

遇到问题随时问我！

期待你的贡献！

**左护法**  
天策府主官  
2026-03-28

---

## 📊 你的进度追踪

| 步骤 | 状态 | 完成时间 |
|------|------|---------|
| 1. 角色定义 | ⏳ 待开始 | - |
| 2. 技能配置 | ⏳ 待开始 | - |
| 3. 领取任务 | ⏳ 待开始 | - |
| 4. 执行闭环 | ⏳ 待开始 | - |
| 5. 任务反馈 | ⏳ 待开始 | - |
| 6. 部署培训 | ⏳ 待开始 | - |

**开始时间**: _  
**完成时间**: _  
**总耗时**: _

---

**文档位置**: `docs/NEWCOMER_GUIDE.md`  
**版本**: V2.0（平等 Agent 版）  
**最后更新**: 2026-03-28 09:00  
**维护者**: 左护法（天策府主官）
