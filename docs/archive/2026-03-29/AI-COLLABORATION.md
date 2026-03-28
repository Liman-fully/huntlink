# 猎脉 HuntLink - AI 协作开发规范

> **版本**: v1.0  
> **最后更新**: 2026-03-27  
> **适用对象**: 所有参与猎脉项目开发的 AI Agent 和人类开发者

---

## 📖 目录

1. [项目简介](#1-项目简介)
2. [技术栈](#2-技术栈)
3. [开发环境配置](#3-开发环境配置)
4. [Git 协作规范](#4-git-协作规范)
5. [代码规范](#5-代码规范)
6. [提交规范](#6-提交规范)
7. [测试规范](#7-测试规范)
8. [AI 协作流程](#8-ai-协作流程)
9. [部署流程](#9-部署流程)
10. [故障排查](#10-故障排查)

---

## 1. 项目简介

**猎脉 (HuntLink)** 是一个面向招聘者（企业 HR、猎头）的高效率招聘社交平台，支持三端同步（Web、移动端、小程序）。

### 核心功能
- 🎯 **人才广场** - 公域简历库，发现优秀人才
- 🔍 **高级搜索** - 20+ 筛选维度，布尔逻辑支持
- 📁 **简历库** - 邮箱自动导入、批量上传、AI 解析
- 💬 **消息中心** - 即时沟通，高效协作
- 💎 **积分体系** - 简历更新、下载、高级搜索

### 项目地址
- **GitHub**: https://github.com/Liman-fully/huntlink
- **生产环境**: http://150.158.51.199

---

## 2. 技术栈

| 层级 | 技术 | 版本 |
|------|------|------|
| **后端** | NestJS + TypeScript + TypeORM | v10.x |
| **数据库** | MySQL | 8.0+ |
| **前端 Web** | React 18 + TDesign + Vite | v18.x |
| **移动端** | uni-app (Vue3) + Pinia + TDesign | v3.x |
| **AI** | 阿里 SmartResume 简历解析引擎 | - |
| **部署** | Docker + Docker Compose | - |
| **CI/CD** | GitHub Actions | - |

---

## 3. 开发环境配置

### 3.1 必需软件

```bash
# Node.js 20+
node -v  # 检查版本

# MySQL 8.0+
mysql --version

# Docker & Docker Compose
docker -v
docker-compose -v

# Git
git --version
```

### 3.2 克隆项目

```bash
git clone https://github.com/Liman-fully/huntlink.git
cd huntlink
```

### 3.3 安装依赖

```bash
# 后端
cd backend && npm install

# 前端
cd ../frontend-web && npm install
```

### 3.4 配置环境变量

```bash
# 后端配置
cd backend
cp .env.example .env
# 编辑 .env 填入数据库连接信息、JWT 密钥等

# 前端配置
cd ../frontend-web
cp .env.example .env
```

### 3.5 启动开发服务器

```bash
# 后端 (端口 3000)
cd backend && npm run start:dev

# 前端 (端口 5173)
cd frontend-web && npm run dev
```

---

## 4. Git 协作规范

### 4.1 分支命名

```
main              # 生产环境，只能从 develop merge
develop           # 开发主线，所有 feature 分支合并到这里
feature/xxx       # 新功能（开发者或 AI 创建）
fix/xxx           # Bug 修复
hotfix/xxx        # 生产环境紧急修复
```

### 4.2 开发流程

```bash
# 1. 从 develop 创建功能分支
git checkout develop
git pull origin develop
git checkout -b feature/xxx

# 2. 开发完成后合并到 develop
git checkout develop
git merge feature/xxx

# 3. 推送到 GitHub
git push origin develop

# 4. 创建 Pull Request
# 在 GitHub 上创建 PR，等待审查后 merge
```

### 4.3 代码审查

- 所有 PR 必须经过至少 1 个 reviewer 审查
- CI 测试必须通过
- 代码覆盖率不低于 80%

---

## 5. 代码规范

### 5.1 TypeScript 规范

```typescript
// ✅ 好的：清晰的类型定义
interface User {
  id: number;
  name: string;
  email: string;
}

// ❌ 坏的：使用 any
const user: any = {};
```

### 5.2 命名规范

```typescript
// 类名：PascalCase
class UserService {}

// 函数/变量：camelCase
const getUserInfo = () => {};
let userName = '';

// 常量：UPPER_SNAKE_CASE
const MAX_RETRY_COUNT = 3;

// 文件名：kebab-case
user-service.ts
resume-card.tsx
```

### 5.3 注释规范

```typescript
/**
 * 用户服务类
 * 处理用户相关的业务逻辑
 */
@Injectable()
export class UserService {
  /**
   * 根据 ID 获取用户信息
   * @param userId 用户 ID
   * @returns 用户信息
   * @throws NotFoundException 用户不存在时抛出
   */
  async getUserById(userId: number): Promise<User> {
    // 实现代码
  }
}
```

---

## 6. 提交规范

### 6.1 Commit Message 格式

遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 6.2 Type 类型

| Type | 说明 | 示例 |
|------|------|------|
| `feat` | 新功能 | `feat: 添加简历批量导出功能` |
| `fix` | Bug 修复 | `fix: 修复支付回调超时问题` |
| `docs` | 文档更新 | `docs: 更新 API 文档` |
| `style` | 代码格式（不影响功能） | `style: 格式化代码` |
| `refactor` | 重构（既不是新功能也不是修复） | `refactor: 优化数据库查询` |
| `test` | 测试相关 | `test: 添加单元测试` |
| `chore` | 构建/工具/配置 | `chore: 更新依赖版本` |

### 6.3 提交示例

```bash
# 新功能
git commit -m "feat: 添加简历批量导出功能

- 支持导出为 PDF/Excel 格式
- 添加导出进度显示
- 优化大文件导出性能

Closes #123"

# Bug 修复
git commit -m "fix: 修复支付回调超时问题

- 添加 5 秒超时控制
- 增加重试机制
- 完善错误日志

Fixes #456"
```

---

## 7. 测试规范

### 7.1 测试类型

```bash
# 单元测试
npm run test

# E2E 测试
npm run test:e2e

# 覆盖率报告
npm run test:cov
```

### 7.2 测试覆盖率要求

- **整体覆盖率**: ≥ 80%
- **核心模块**: ≥ 90%
- **新增代码**: 必须包含测试

### 7.3 测试文件命名

```
*.spec.ts       # 单元测试
*.e2e-spec.ts   # E2E 测试
```

### 7.4 测试示例

```typescript
// user.service.spec.ts
describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return user by id', async () => {
    const user = await service.getUserById(1);
    expect(user.id).toBe(1);
  });
});
```

---

## 8. AI 协作流程

### 8.1 AI Agent 团队配置

| Agent | 部门 | 职责 | 工作范围 |
|-------|------|------|----------|
| **掌印大人** | - | 战略决策、最终验收 | 全流程 |
| **左护法** | 天策府 | 最高级别综合管理部门：全流程执行 + 战略/决策/产品/运营/设计/审查/验收/团队管理 | 全流程 |
| **都统** | 神机营 | 执行团队成员，负责全流程工作 | 全流程 |
| **右护法** | 镇抚司 | 执行团队成员，负责全流程工作 | 全流程 |
| **其他 Agent** | 镇抚司/神机营 | 执行团队成员，负责全流程工作 | 全流程 |

**核心原则**：
- 掌印大人 = 司命大人 = Liman，最高管理者，战略决策和最终验收
- 天策府（左护法）= **最高级别综合管理部门**，既具备全流程执行能力（开发-审查-测试-优化），又承担战略、决策、产品、运营、设计、审查、最终验收、团队管理等额外职责
- 镇抚司（右护法）= 执行团队，负责**全流程工作**（开发-审查-测试-优化）
- 神机营（都统）= 执行团队，负责**全流程工作**（开发-审查-测试-优化）
- **没有专门的"审查部门"**，审查是全流程的一部分
- 所有执行团队（镇抚司/神机营）都参与全流程，不是分工

### 8.2 任务分配

#### 产品需求类任务

```markdown
## Issue #123: 添加简历批量导出功能

**产品负责人**: 掌印大人

**任务拆解**:
- [x] 掌印大人: 编写需求和验收标准
- [ ] 左护法（天策府）: 任务分配、技术方案设计、进度监控、审查、验收
- [ ] 都统（神机营）: 全流程工作（开发-审查-测试-优化）
- [ ] 右护法（镇抚司）: 全流程工作（开发-审查-测试-优化）
```

#### 技术开发类任务

```markdown
## Issue #124: 优化搜索性能

**产品负责人**: 掌印大人

**任务拆解**:
- [x] 掌印大人: 定义性能目标（<1 秒）和验收标准
- [ ] 左护法（天策府）: 技术方案设计、任务分配、进度监控
- [ ] 都统（神机营）: 全流程工作（开发-审查-测试-优化）
- [ ] 右护法（镇抚司）: 全流程工作（开发-审查-测试-优化）
```

### 8.3 状态同步

**文件**: `.ai-collab-status.md`

```markdown
# AI 协作状态

## 当前任务
| Agent | 部门 | 任务 | 状态 | 预计完成 |
|-------|------|------|------|----------|
| 左护法 | 天策府 | 任务协调 | 🟢 进行中 | - |
| 都统 | 神机营 | 全流程工作 | 🟢 进行中 | - |
| 右护法 | 镇抚司 | 全流程工作 | 🟢 进行中 | - |

## 阻塞项
无

## 最近完成
- [x] #122 用户登录 Bug 修复 (2026-03-27 21:30)
- [x] 简历批量导出功能 (都统 + 右护法)

## 待审查 PR
- #123 feat: 简历批量导出
```

### 8.4 经验沉淀

**目录**: `.workbuddy/memory/YYYY-MM-DD.md`

```markdown
# 工作记忆 - 2026-03-27

## 今日完成
- [x] 修复支付回调超时问题（都统 + 右护法全流程工作）
- [x] 添加超时控制中间件

## 遇到的问题
- 第三方支付回调可能延迟，导致超时

## 解决方案
- 添加 5 秒超时控制
- 实现重试队列机制

## 待办事项
- [ ] 优化重试策略
- [ ] 添加监控告警

## 经验教训
- 天策府（左护法）是最高级别综合管理部门，既具备全流程执行能力，又承担战略、决策、产品、运营、设计、审查、最终验收、团队管理等额外职责
- 执行团队（镇抚司/神机营）负责全流程工作，包括开发、审查、测试、优化
- 不是分工，而是全流程参与
```

---

## 9. 部署流程

### 9.1 自动部署（推荐）

**推送代码到 main 分支自动触发**：

```bash
git push origin main
```

**GitHub Actions 流程**：
1. 运行后端测试
2. 运行前端测试
3. 构建项目
4. SSH 连接服务器
5. 拉取最新代码
6. Docker 构建并启动
7. 健康检查

### 9.2 手动部署

```bash
# 登录服务器
ssh root@150.158.51.199

# 进入部署目录
cd /var/www/huntlink

# 拉取代码
git pull origin main

# 重启服务
docker-compose down
docker-compose up -d --build

# 查看状态
docker-compose ps
```

### 9.3 回滚

```bash
# 回滚到上一个版本
git reset --hard HEAD~1
git push origin main --force

# 或者恢复特定版本
git checkout <commit-hash>
git push origin main --force
```

---

## 10. 故障排查

### 10.1 常见问题

#### 问题 1: CI/CD 失败

**检查**：
```bash
# 查看 GitHub Actions 日志
https://github.com/Liman-fully/huntlink/actions

# 本地运行测试
cd backend && npm run test
```

#### 问题 2: 服务无法访问

**检查**：
```bash
# 查看容器状态
docker-compose ps

# 查看日志
docker-compose logs backend
docker-compose logs frontend

# 检查端口
netstat -tlnp | grep 3000
netstat -tlnp | grep 80
```

#### 问题 3: 数据库连接失败

**检查**：
```bash
# 测试数据库连接
docker-compose exec backend mysql -h mysql -u huntlink -p

# 查看 MySQL 状态
docker-compose ps mysql
```

### 10.2 日志位置

```bash
# 后端日志
docker-compose logs backend

# 前端日志
docker-compose logs frontend

# MySQL 日志
docker-compose logs mysql
```

### 10.3 紧急联系

- **项目负责人**: Liman
- **AI 协调员**: 左护法
- **紧急程度**: P0 (立即) / P1 (1 小时) / P2 (24 小时)

---

## 📚 附录

### A. 常用命令速查

```bash
# 开发
npm run start:dev      # 启动开发服务器
npm run build          # 构建生产版本
npm run lint           # 代码检查

# 测试
npm run test           # 单元测试
npm run test:e2e       # E2E 测试
npm run test:cov       # 覆盖率报告

# 部署
docker-compose up -d   # 启动服务
docker-compose down    # 停止服务
docker-compose ps      # 查看状态
docker-compose logs -f # 查看日志
```

### B. 相关链接

- [GitHub 仓库](https://github.com/Liman-fully/huntlink)
- [GitHub Actions](https://github.com/Liman-fully/huntlink/actions)
- [Issues](https://github.com/Liman-fully/huntlink/issues)
- [部署文档](DEPLOYMENT.md)

### C. 版本历史

| 版本 | 日期 | 说明 |
|------|------|------|
| v1.0 | 2026-03-27 | 初始版本，AI 协作规范建立 |

---

**最后更新**: 2026-03-27 23:36  
**维护者**: 左护法 AI 团队
