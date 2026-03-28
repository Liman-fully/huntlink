# 招聘端个人中心优化 — 分工方案

> **版本**: V1.0
> **创建时间**: 2026-03-28
> **目标**: 完成招聘端 P0 核心功能的完整实现
> **总工期**: 6-8 周（阶段一 2-3 周 + 阶段二 2-3 周 + 阶段三 2 周）

---

## 一、整体技术架构

### 1.1 分层架构概览

```
┌─────────────────────────────────────────────────────────┐
│                    前端（React + TDesign）               │
│  Profile页  │ ResumeLibrary页 │ Dashboard页 │ Messages页 │
└──────────────┬────────────────┬────────────────────────┘
               │  REST API      │
┌──────────────▼────────────────▼────────────────────────┐
│                  NestJS Backend                       │
│  ┌─────────────────────────────────────────────────┐   │
│  │           招聘端 API 控制器层                    │   │
│  │  CandidateController / JobController            │   │
│  │  InterviewController / TeamController           │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │           招聘端 Service 业务逻辑层              │   │
│  │  CandidateService / JobService                   │   │
│  │  InterviewService / StatisticsService            │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │           数据访问层（TypeORM + PostgreSQL）      │   │
│  │  Candidate / Job / Interview / Team Member      │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### 1.2 现有基础设施利用

| 组件 | 状态 | 用途 |
|------|------|------|
| TypeORM + PostgreSQL | ✅ 已就绪 | 持久化存储 |
| Redis | ✅ 已就绪 | 缓存、Session |
| Auth Module | ✅ 已就绪 | JWT 认证 |
| User Module | ✅ 已就绪 | 用户管理 |
| Candidate Entity | ✅ 已定义 | 候选人基础字段 |
| Job Controller | ⚠️ 仅有壳 | 需扩展完整 CRUD |
| Statistics Module | ⚠️ 仅有壳 | 需实现统计逻辑 |
| Resume Module | ✅ 较完整 | 可复用于简历管理 |

---

## 二、技术复杂度评估

### 2.1 各模块复杂度一览

| 模块 | 技术复杂度 | 工程量 | 依赖关系 | 优先级 | 备注 |
|------|-----------|--------|---------|--------|------|
| 简历库管理 | ⭐⭐ 中 | 中 | Resume Module | P0 | 扩展现有简历模块 |
| 候选人管理 | ⭐⭐⭐ 高 | 大 | Candidate Entity | P0 | 新建全套CRUD+标签 |
| 职位管理 | ⭐⭐⭐ 高 | 大 | Job Module（空壳） | P0 | Job Entity + Service |
| 面试管理 | ⭐⭐⭐⭐ 很高 | 很大 | 候选人/职位 | P0 | 新建完整面试流程 |
| 招聘数据统计 | ⭐⭐⭐ 高 | 中大 | 全局数据 | P0 | SQL聚合+可视化 |
| 团队协作 | ⭐⭐⭐⭐ 很高 | 大 | Auth/权限 | P1 | 权限体系复杂 |
| 权限管理 | ⭐⭐⭐⭐ 很高 | 中大 | Auth Module | P1 | RBAC体系 |
| 候选人评分 | ⭐⭐ 中 | 中 | 候选人管理 | P1 | 复用Score模块 |
| 招聘漏斗分析 | ⭐⭐⭐ 高 | 中 | 面试+统计 | P1 | 数据聚合 |
| 账号安全增强 | ⭐⭐ 中 | 中 | Auth Module | P1 | MFA/绑定 |

### 2.2 详细复杂度说明

#### 🔴 候选人管理（最高优先级 P0）
- **复杂度原因**: 标签体系 + 分组 + 备注 + 与简历/职位的多对多关联
- **工程量**: 需要新建完整 Service、Controller、Entity 扩展
- **现有基础**: `CandidateEntity` 仅定义基础字段，无标签/分组/备注字段
- **预估**: 2-3 人天

#### 🔴 职位管理（最高优先级 P0）
- **复杂度原因**: 职位发布/编辑/上下架 + 职位与候选人的匹配
- **工程量**: Job Entity（目前缺失）、Job Service、Job Controller
- **现有基础**: `JobController` 仅存在壳，无 Entity/Service
- **预估**: 3-4 人天

#### 🔴 面试管理（最高优先级 P0）
- **复杂度原因**: 状态机（待确认→已确认→面试中→已完成）+ 多方参与
- **工程量**: Interview Entity、Interview Service、Interview Controller
- **依赖**: 依赖候选人管理和职位管理
- **预估**: 3-4 人天

#### 🟡 简历库管理（高优先级 P0）
- **复杂度原因**: 简历与候选人的关联、文件夹管理、批量操作
- **工程量**: 扩展现有 ResumeModule，增加招聘端专属功能
- **现有基础**: `ResumeModule` 和 `ResumeEntity` 已较完整
- **预估**: 1-2 人天（主要在 UI 集成）

#### 🟡 招聘数据统计（高优先级 P0）
- **复杂度原因**: SQL 聚合查询 + 漏斗数据 + 趋势图
- **工程量**: StatisticsService 完整实现、Dashboard 页面
- **现有基础**: `StatisticsModule` 仅壳，需完全重写
- **预估**: 2-3 人天

---

## 三、分工方案

### 3.1 镇抚司（右护法）— 前端主导

**角色定位**: 负责招聘端所有前端页面和组件开发

**负责模块**:

#### 模块 1: 简历库管理 UI（1-2 人天）
```
职责:
- 优化 ResumeLibrary 页面，从静态改为动态
- 实现简历列表的 API 集成（GET /resumes）
- 实现简历筛选（按时间/来源/状态）
- 实现简历预览弹窗
- 实现简历下载/删除功能

交付物:
- frontend-web/src/pages/ResumeLibrary/index.tsx（重构）
- frontend-web/src/pages/ResumeLibrary/components/ResumeDetailModal.tsx
```

#### 模块 2: 候选人管理 UI（2-3 人天）
```
职责:
- 新建 CandidateListPage 候选人列表页
- 实现标签筛选（多选标签筛选）
- 实现候选人分组管理
- 实现候选人详情侧滑面板
- 实现候选人备注编辑

交付物:
- frontend-web/src/pages/CandidateList/index.tsx（新建）
- frontend-web/src/pages/CandidateList/components/CandidateDetail.tsx
- frontend-web/src/components/TagFilter.tsx
```

#### 模块 3: 职位管理 UI（2-3 人天）
```
职责:
- 新建 JobManagement 完整页面
- 实现职位列表（发布中/草稿/已下架）
- 实现职位发布/编辑表单
- 实现职位上下架操作
- 实现职位预览

交付物:
- frontend-web/src/pages/JobManagement/index.tsx（重构+扩展）
- frontend-web/src/pages/JobManagement/components/JobForm.tsx
- frontend-web/src/pages/JobManagement/components/JobPreview.tsx
```

#### 模块 4: 面试管理 UI（2-3 人天）
```
职责:
- 新建 InterviewPage 面试管理页
- 实现面试日历视图
- 实现面试状态看板
- 实现面试详情弹窗（候选人+职位信息）
- 实现面试反馈录入

交付物:
- frontend-web/src/pages/Interview/index.tsx（新建）
- frontend-web/src/pages/Interview/components/InterviewCalendar.tsx
- frontend-web/src/pages/Interview/components/InterviewDetail.tsx
```

#### 模块 5: 招聘数据统计 UI（2 人天）
```
职责:
- 重构 Dashboard 页面（从静态改为动态）
- 实现招聘漏斗图
- 实现趋势折线图
- 实现关键指标卡片（候选人总数/面试次数/成功率）
- 实现数据导出按钮

交付物:
- frontend-web/src/pages/Dashboard/index.tsx（重构）
- frontend-web/src/components/RecruitmentFunnel.tsx
- frontend-web/src/components/TrendChart.tsx
```

#### 模块 6: 团队协作 UI（P1，2 人天）
```
职责:
- 新建 TeamManagementPage 团队管理页
- 实现成员列表
- 实现权限配置面板
- 实现邀请成员功能

交付物:
- frontend-web/src/pages/TeamManagement/index.tsx（新建）
```

---

### 3.2 神机营（都统）— 后端主导

**角色定位**: 负责招聘端所有后端 API 和数据库设计

**负责模块**:

#### 模块 1: 候选人管理 API（2-3 人天）
```
职责:
- 扩展 CandidateEntity（新增 tags/groupId/notes/score/status 字段）
- 新建 CandidateService（CRUD + 标签管理 + 分组管理 + 搜索）
- 新建 CandidateController（REST API）
- 实现候选人统计接口

API 端点:
GET    /api/candidates          # 列表（分页+筛选）
GET    /api/candidates/:id      # 详情
POST   /api/candidates          # 创建
PUT    /api/candidates/:id      # 更新
DELETE /api/candidates/:id      # 删除
POST   /api/candidates/:id/tags # 添加标签
DELETE /api/candidates/:id/tags/:tagId # 删除标签
POST   /api/candidates/batch   # 批量操作

交付物:
- backend/src/modules/candidate/candidate.entity.ts（扩展）
- backend/src/modules/candidate/candidate.service.ts（新建）
- backend/src/modules/candidate/candidate.controller.ts（扩展）
- 数据库迁移文件
```

#### 模块 2: 职位管理 API（3-4 人天）
```
职责:
- 新建 JobEntity（职位完整字段）
- 新建 JobService（CRUD + 发布/下架 + 刷新）
- 完善 JobController（现有壳扩展）
- 实现职位与候选人的匹配接口

API 端点:
GET    /api/jobs                # 列表
GET    /api/jobs/:id            # 详情
POST   /api/jobs                # 创建
PUT    /api/jobs/:id            # 更新
PATCH  /api/jobs/:id/status     # 修改状态（草稿/发布/下架）
DELETE /api/jobs/:id            # 删除

交付物:
- backend/src/modules/job/job.entity.ts（新建）
- backend/src/modules/job/job.service.ts（新建）
- backend/src/modules/job/job.controller.ts（完善）
- 数据库迁移文件
```

#### 模块 3: 面试管理 API（3-4 人天）
```
职责:
- 新建 InterviewEntity（面试完整字段：候选人/职位/时间/状态/反馈/评分）
- 新建 InterviewService（状态机 + 反馈录入 + 评分）
- 新建 InterviewController
- 实现面试统计接口

API 端点:
GET    /api/interviews              # 列表
GET    /api/interviews/:id          # 详情
POST   /api/interviews              # 创建面试
PATCH  /api/interviews/:id/status  # 更新状态
PATCH  /api/interviews/:id/feedback # 录入反馈
GET    /api/interviews/stats        # 统计数据

交付物:
- backend/src/modules/interview/interview.entity.ts（新建）
- backend/src/modules/interview/interview.service.ts（新建）
- backend/src/modules/interview/interview.controller.ts（新建）
- backend/src/modules/interview/interview.module.ts（新建）
- 数据库迁移文件
```

#### 模块 4: 招聘数据统计 API（2 人天）
```
职责:
- 完善 StatisticsService（实现统计逻辑）
- 实现招聘漏斗数据接口
- 实现趋势数据接口
- 实现候选人来源分析接口

API 端点:
GET    /api/statistics/overview     # 总览指标
GET    /api/statistics/funnel       # 招聘漏斗
GET    /api/statistics/trend        # 趋势数据（月度）
GET    /api/statistics/source       # 来源分析

交付物:
- backend/src/modules/statistics/statistics.service.ts（完善）
- backend/src/modules/statistics/statistics.controller.ts（新建）
```

#### 模块 5: 团队协作 & 权限 API（P1，3 人天）
```
职责:
- 新建 TeamMemberEntity
- 新建 TeamService（成员管理 + 权限配置）
- 实现权限检查中间件
- 实现团队统计数据

交付物:
- backend/src/modules/team/*.ts（新建整个模块）
```

---

### 3.3 天策府（左护法）— 协调 & 审查

**角色定位**: 全流程统筹协调、技术方案把关、最终验收

**协调职责**:

#### 1. 技术方案制定
- 审批候选人标签/分组的数据模型设计
- 审批面试状态机设计
- 审批招聘漏斗的数据口径定义
- 制定 API 规范和错误码

#### 2. 进度协调
- 维护任务看板 `TASK_BOARD.md`
- 协调镇抚司和神机营的交付节奏
- 处理跨模块依赖问题（如面试需要先有候选人和职位）
- 每日 standup 同步（通过企业微信）

#### 3. 代码审查
- 审查镇抚司的 React 组件代码
- 审查神机营的 NestJS 服务代码
- 审查数据库迁移脚本
- 确保代码风格统一

#### 4. 质量验收
- 单元测试覆盖率检查（>70%）
- API 接口测试
- 前端功能验收
- 集成测试（前后端联调）

#### 5. 文档管理
- 维护 API 文档
- 维护数据库 schema 文档
- 维护部署文档

---

## 四、任务分配矩阵

| 任务 | 镇抚司（前端） | 神机营（后端） | 天策府（协调） |
|------|--------------|--------------|--------------|
| 候选人 Entity 扩展 | - | ✅ | 审查 |
| 候选人 Service/Controller | - | ✅ | 审查 |
| 候选人列表页 | ✅ | - | 审查 |
| 候选人详情面板 | ✅ | - | 审查 |
| 职位 Entity/Service | - | ✅ | 审查 |
| 职位管理页 | ✅ | - | 审查 |
| 职位表单/预览 | ✅ | - | 审查 |
| 面试 Entity/Service/Controller | - | ✅ | 审查 |
| 面试日历页 | ✅ | - | 审查 |
| 面试详情/反馈 | ✅ | - | 审查 |
| 统计 Service 完善 | - | ✅ | 审查 |
| Dashboard 重构 | ✅ | - | 审查 |
| 招聘漏斗组件 | ✅ | - | 审查 |
| 团队成员 API（P1） | - | ✅ | 审查 |
| 团队管理页（P1） | ✅ | - | 审查 |

---

## 五、时间表和里程碑

### 阶段一：核心功能（第 1-3 周）

#### Week 1: 候选人 + 职位基础

| 天 | 镇抚司 | 神机营 | 天策府 |
|----|--------|-------|--------|
| Day 1 | 候选人列表页框架 | 候选人 Entity 扩展 | 审批 Entity 设计 |
| Day 2 | 候选人详情面板 | 候选人 Service 开发 | - |
| Day 3 | 职位列表页框架 | 职位 Entity 设计 | 审批 Entity |
| Day 4 | 职位表单组件 | 职位 Service 开发 | API 规范制定 |
| Day 5 | 前后端联调候选人 | 候选人 Controller 完成 | 第一次联调 |

**里程碑**: ✅ 候选人列表/详情/职位列表/表单可运行

#### Week 2: 职位完善 + 简历库

| 天 | 镇抚司 | 神机营 | 天策府 |
|----|--------|-------|--------|
| Day 6 | 职位上下架 UI | 职位状态管理 | - |
| Day 7 | ResumeLibrary API 集成 | 简历 API 优化 | API 审查 |
| Day 8 | 简历预览弹窗 | 简历详情接口 | - |
| Day 9 | 简历筛选功能 | 简历统计接口 | 数据口径定义 |
| Day 10 | 第二次联调 | 联调支持 | 集成测试 |

**里程碑**: ✅ 简历库动态化，职位完整 CRUD

#### Week 3: 面试管理

| 天 | 镇抚司 | 神机营 | 天策府 |
|----|--------|-------|--------|
| Day 11 | 面试 Entity 评审 | 面试状态机设计 | 状态机审批 |
| Day 12 | 面试日历 UI | Interview Entity/Service | - |
| Day 13 | 面试状态看板 | Interview Controller | API 审查 |
| Day 14 | 面试反馈表单 | 面试反馈接口 | - |
| Day 15 | 第三次联调 | 联调支持 | 阶段一验收 |

**里程碑**: ✅ 面试管理完整可用

### 阶段二：流程完善（第 4-6 周）

#### Week 4-5: 招聘数据统计

| 天 | 镇抚司 | 神机营 | 天策府 |
|----|--------|-------|--------|
| Day 16-17 | Dashboard 重构框架 | 统计 SQL 编写 | 数据口径确认 |
| Day 18-19 | 漏斗图组件 | Overview/Trend API | API 审查 |
| Day 20-21 | 趋势图组件 | Source 分析 API | - |
| Day 22-23 | 完整 Dashboard | 数据聚合优化 | 性能审查 |
| Day 24-25 | 第四次联调 | 联调支持 | 阶段二验收 |

**里程碑**: ✅ 招聘数据统计完整

#### Week 6: 沟通记录优化

| 天 | 镇抚司 | 神机营 | 天策府 |
|----|--------|-------|--------|
| Day 26-27 | Messages 页面重构 | 消息分类 API | - |
| Day 28-29 | 消息状态管理 | 消息统计接口 | - |
| Day 30 | 第五次联调 | 联调支持 | 阶段二验收 |

**里程碑**: ✅ 沟通记录结构化

### 阶段三：协作增强（第 7-8 周，P1）

| 周 | 镇抚司 | 神机营 | 天策府 |
|----|--------|-------|--------|
| Week 7 | 团队管理页 | TeamMember Entity | 权限体系设计 |
| Week 8 | 权限配置面板 | RBAC 中间件 | 集成测试 |

**里程碑**: ✅ 团队协作功能可用

---

## 六、关键依赖关系

```
候选人管理 ──┬──→ 面试管理（依赖候选人）
             └──→ 招聘统计（依赖候选人数量）

职位管理 ────┬──→ 面试管理（依赖职位）
             └──→ 招聘统计（依赖职位数据）

面试管理 ────┬──→ 招聘统计（依赖面试数据）
             └──→ 招聘漏斗（依赖面试状态）

团队协作 ────└──→ 权限管理（依赖 Auth Module）
```

**执行顺序**: 候选人 → 职位 → 面试 → 统计 → 团队

---

## 七、质量标准

| 指标 | 目标 | 检查方式 |
|------|------|---------|
| 代码风格 | ESLint + Prettier 通过 | CI 自动检查 |
| 单元测试覆盖率 | >70% | Jest coverage |
| API 文档 | Swagger/OpenAPI 100% | 自动生成 |
| 前后端联调 | 每次迭代后 100% 通过 | 手动测试 |
| 数据库迁移 | 可回滚 | 迁移脚本审查 |
| 性能 | 接口响应 <200ms | Lighthouse + APM |

---

## 八、风险与对策

| 风险 | 概率 | 影响 | 对策 |
|------|------|------|------|
| 神机营后端工期延误 | 中 | 高 | 镇抚司先做静态页面，神机营分批交付 API |
| 面试状态机设计变更 | 高 | 中 | 天策府提前介入，每周评审一次 |
| 前端组件复用率低 | 中 | 低 | 抽取公共组件库，统一 TDesign 主题 |
| 数据库迁移冲突 | 低 | 高 | 统一迁移脚本格式，禁止手动改 DB |
| 联调周期过长 | 高 | 中 | 每日 standup 同步，提前 mock API |

---

## 九、交付检查清单

### 神机营交付物检查
- [ ] CandidateEntity 扩展字段完成
- [ ] CandidateService CRUD + 标签 + 分组完成
- [ ] JobEntity + JobService + JobController 完成
- [ ] InterviewEntity + InterviewService + InterviewController 完成
- [ ] StatisticsService 统计逻辑完成
- [ ] TeamMemberEntity + TeamService 完成（P1）
- [ ] 所有 API 有 Swagger 文档
- [ ] 数据库迁移脚本可回滚
- [ ] 单元测试 >70%

### 镇抚司交付物检查
- [ ] 候选人列表页 + 详情面板完成
- [ ] 职位管理页 + 表单 + 预览完成
- [ ] ResumeLibrary API 集成完成
- [ ] 面试日历 + 看板 + 反馈表单完成
- [ ] Dashboard 重构 + 图表完成
- [ ] 团队管理页完成（P1）
- [ ] 所有页面有 loading/error/empty 状态
- [ ] 响应式布局适配移动端

### 天策府验收检查
- [ ] 代码审查完成
- [ ] API 接口测试通过
- [ ] 前端功能验收通过
- [ ] 集成测试通过
- [ ] 文档更新完成

---

**文档位置**: `docs/RECRUITER_PROFILE_WORKPLAN.md`
**版本**: V1.0
**创建时间**: 2026-03-28
**维护者**: 天策府
