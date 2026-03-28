# 文档清理计划

> **执行时间**: 2026-03-28  
> **目标**: 删除垃圾、冗余、旧内容  
> **原则**: 文档在精不在多

---

## 📊 当前状态

**文档总数**: 22 个  
**目标数量**: 10 个以内  
**删除比例**: >50%

---

## 🗑️ 删除清单

### 立即删除（冗余/旧内容）

| 文档 | 原因 | 替代文档 |
|------|------|---------|
| `AGENT_COLLABORATION_V2.md` | 旧版本 | `ORGANIZATION.md` |
| `AGENT_COLLABORATION_V3_MERGED.md` | 旧版本 | `ORGANIZATION.md` |
| `NEWCOMER_GUIDE.md` | 旧版本 | `README.md` |
| `NEWCOMER_GUIDE_V2.md` | 旧版本 | `README.md` |
| `DEPLOYMENT-HANDOFF.md` | 不再需要 | `docs/DEPLOYMENT_TRAINING.md` |
| `DEVELOPMENT_STATUS.md` | 临时文档 | `docs/TODAY_PROGRESS.md` |
| `MULTI_AGENT_COLLABORATION.md` | 旧版本 | `ORGANIZATION.md` |
| `UI_REDESIGN_REPORT.md` | 临时报告 | `docs/design/UI_UX_DESIGN_V1.md` |
| `TODAY_PROGRESS_2026-03-28.md` | 日期限定 | `docs/TODAY_PROGRESS.md` |

### 合并整理

| 原文档 | 合并到 | 说明 |
|--------|--------|------|
| `LEFT_HANDOVER_MANUAL.md` | `docs/ROLE_HANDOVER_TEMPLATE.md` | 使用模板 |
| `PROJECT_MEMORY.md` | `docs/EXPERIENCE_SYSTEM.md` | 经验系统包含 |
| `SKILLS_KNOWLEDGE_BASE.md` | 保留 | 独立文档 |
| `5MIN_CLOSED_LOOP.md` | 保留 | 核心流程 |
| `DEPLOYMENT_TRAINING.md` | 保留 | 核心培训 |

### 保留核心

| 文档 | 说明 | 状态 |
|------|------|------|
| `README.md` | 导航中心 | ✅ 保留 |
| `ORGANIZATION.md` | 组织总览 | ✅ 保留 |
| `docs/ROLE_ACTIVATION.md` | 角色激活 | ✅ 新建 |
| `docs/EXPERIENCE_SYSTEM.md` | 经验系统 | ✅ 新建 |
| `docs/ROLE_HANDOVER_TEMPLATE.md` | 交接模板 | ✅ 保留 |
| `docs/5MIN_CLOSED_LOOP.md` | 核心流程 | ✅ 保留 |
| `docs/DEPLOYMENT_TRAINING.md` | 部署培训 | ✅ 保留 |
| `docs/SKILLS_KNOWLEDGE_BASE.md` | 技能库 | ✅ 保留 |
| `.task-board.md` | 任务看板 | ✅ 保留 |
| `docs/TODAY_PROGRESS.md` | 今日进展 | ✅ 保留 |

---

## 📋 清理后结构

```
huntlink/
├── README.md                          # 导航中心（唯一入口）
├── ORGANIZATION.md                    # 组织总览
├── .task-board.md                     # 任务看板
│
├── docs/
│   ├── ROLE_ACTIVATION.md            # 角色激活系统
│   ├── EXPERIENCE_SYSTEM.md          # 经验系统
│   ├── ROLE_HANDOVER_TEMPLATE.md     # 交接模板
│   ├── 5MIN_CLOSED_LOOP.md           # 核心流程
│   ├── DEPLOYMENT_TRAINING.md        # 部署培训
│   ├── SKILLS_KNOWLEDGE_BASE.md      # 技能库
│   ├── TODAY_PROGRESS.md             # 今日进展
│   ├── design/                       # 设计文档
│   └── experiences/                  # 角色经验
│       ├── LEADER/
│       ├── COORDINATOR/
│       ├── BUILDER/
│       └── REVIEWER/
│
└── scripts/
    ├── activate-role.sh              # 角色激活
    ├── log-experience.sh             # 经验记录
    └── task-retrospective.sh         # 任务复盘
```

---

## 🚀 执行步骤

### 步骤 1: 删除旧文档

```bash
# 删除冗余文档
rm docs/AGENT_COLLABORATION_V2.md
rm docs/AGENT_COLLABORATION_V3_MERGED.md
rm docs/NEWCOMER_GUIDE.md
rm docs/NEWCOMER_GUIDE_V2.md
rm docs/DEPLOYMENT-HANDOFF.md
rm docs/DEVELOPMENT_STATUS.md
rm docs/MULTI_AGENT_COLLABORATION.md
rm docs/UI_REDESIGN_REPORT.md
rm docs/TODAY_PROGRESS_2026-03-28.md
```

### 步骤 2: 合并文档

```bash
# LEFT_HANDOVER_MANUAL.md 内容合并到 ROLE_HANDOVER_TEMPLATE.md
cat docs/LEFT_HANDOVER_MANUAL.md >> docs/ROLE_HANDOVER_TEMPLATE.md

# PROJECT_MEMORY.md 内容合并到 EXPERIENCE_SYSTEM.md
cat docs/PROJECT_MEMORY.md >> docs/EXPERIENCE_SYSTEM.md
```

### 步骤 3: 创建标准化目录

```bash
# 创建角色经验目录
mkdir -p docs/experiences/{LEADER,COORDINATOR,BUILDER,REVIEWER}

# 创建脚本目录
mkdir -p scripts/
```

### 步骤 4: 更新导航

```bash
# 更新 README.md，指向新结构
# 已完成
```

---

## ✅ 清理后效果

| 指标 | 清理前 | 清理后 | 提升 |
|------|--------|--------|------|
| **文档总数** | 22 个 | 10 个 | 55%↓ |
| **核心文档** | 分散 | 集中 | 100%↑ |
| **查找时间** | 5-10 分钟 | <1 分钟 | 10 倍↑ |
| **冗余度** | 高 | 零 | 100%↓ |
| **清晰度** | 低 | 高 | 显著↑ |

---

**执行者**: 左护法  
**审核**: 司命大人  
**执行时间**: 2026-03-28 17:00
