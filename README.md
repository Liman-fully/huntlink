# 猎脉 HuntLink - 招聘社交平台

[![CI/CD](https://github.com/YOUR_USERNAME/huntlink/workflows/CI%2FCD/badge.svg)](https://github.com/YOUR_USERNAME/huntlink/actions)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 项目简介

猎脉(HuntLink)是一个面向招聘者（企业HR、猎头）的高效率招聘社交平台，支持三端同步（Web、移动端、小程序）。

### 核心功能
- 🎯 **人才广场** - 公域简历库，发现优秀人才
- 🔍 **高级搜索** - 20+筛选维度，布尔逻辑支持
- 📁 **简历库** - 邮箱自动导入、批量上传、AI解析
- 💬 **消息中心** - 即时沟通，高效协作
- 💎 **积分体系** - 简历更新、下载、高级搜索

### 技术栈
- **后端**: NestJS + TypeScript + TypeORM + MySQL
- **前端**: React 18 + TDesign + Vite
- **移动端**: uni-app (Vue3) + Pinia + TDesign
- **AI**: 阿里 SmartResume 简历解析引擎
- **部署**: Docker + Docker Compose + 腾讯云

---

## 多电脑协作开发指南

### 1. 环境准备

每台电脑需要安装：
- Node.js 20+
- MySQL 8.0+
- Docker & Docker Compose
- Git

### 2. 克隆项目

```bash
git clone https://github.com/YOUR_USERNAME/huntlink.git
cd huntlink
```

### 3. 安装依赖

```bash
# 后端
cd backend && npm install

# 前端
cd ../frontend-web && npm install
```

### 4. 配置环境变量

```bash
# 后端配置
cp backend/.env.example backend/.env
# 编辑 .env 填入数据库连接信息、JWT密钥等

# 前端配置
cp frontend-web/.env.example frontend-web/.env
```

### 5. 启动开发服务器

```bash
# 后端 (端口 3000)
cd backend && npm run start:dev

# 前端 (端口 5173)
cd frontend-web && npm run dev
```

---

## 提交前检查清单 ⚠️

**每台电脑在提交前必须完成**：

### 1. 经验沉淀
- [ ] 记录本次修改解决的问题
- [ ] 记录关键代码变更点
- [ ] 记录踩坑经历和解决方案
- [ ] 更新 `.workbuddy/memory/YYYY-MM-DD.md`

### 2. 代码质量
```bash
# 运行检查
npm run lint && npm run test && npm run build
```

### 3. 提交规范
```
<type>(<scope>): <subject>

<body>

<footer>
```

### 4. 问题总结
- 记录本机特有问题
- 标注是否影响其他电脑
- 更新 README（如有必要）

---

## 版本迭代清理

每个版本发布前，运行清理脚本：

### Windows
```powershell
.\scripts\cleanup.ps1
```

### Linux/macOS
```bash
chmod +x scripts/cleanup.sh
./scripts/cleanup.sh
```

清理内容包括：
- node_modules 重新安装
- dist/build 目录清理
- 测试缓存清理
- 日志文件清理

---

## 测试

### 后端测试
```bash
cd backend
npm run test        # 单元测试
npm run test:e2e    # E2E测试
npm run test:cov    # 覆盖率报告
```

### 前端测试
```bash
cd frontend-web
npm run test        # 单元测试
npm run test:e2e    # E2E测试 (Cypress)
```

---

## CI/CD

项目使用 GitHub Actions 自动化：

- **Push to main**: 自动部署到生产服务器
- **Pull Request**: 自动运行测试和构建
- **Daily**: 自动清理旧构建产物

---

## 项目结构

```
huntlink/
├── backend/                # NestJS 后端
│   ├── src/
│   │   ├── modules/       # 功能模块
│   │   ├── common/        # 公共模块
│   │   └── migrations/    # 数据库迁移
│   └── test/              # 测试文件
│
├── frontend-web/          # React Web 前端
│   ├── src/
│   │   ├── pages/         # 页面组件
│   │   ├── components/    # 公共组件
│   │   └── layouts/       # 布局组件
│   └── test/              # 测试文件
│
├── .github/workflows/     # CI/CD 配置
├── scripts/               # 工具脚本
└── .workbuddy/            # 经验沉淀
    └── memory/            # 工作记忆
```

---

## 多电脑协作最佳实践

### 1. 每日开始前
```bash
git pull origin main
npm install  # 确保依赖最新
```

### 2. 开发过程中
- 频繁提交小改动
- 写清楚 commit message
- 及时推送代码

### 3. 每日结束时
```bash
# 运行检查
npm run lint && npm run test

# 提交经验
# 编辑 .workbuddy/memory/YYYY-MM-DD.md

# 推送代码
git add . && git commit && git push
```

### 4. 遇到冲突时
1. 先 `git pull` 合并远程变更
2. 解决冲突
3. 本地测试
4. 再推送

---

## 文档

- [产品规划 v3.0](../HuntLink-产品规划_v3.0.md)
- [简历卡片视觉设计规范](../HuntLink-简历卡片视觉设计规范.md)
- [多Agent协作体系说明](docs/MULTI_AGENT_COLLABORATION.md) ⭐
- [提交前检查清单](.pre-commit-checklist.md)

---

## License

MIT © 2026 HuntLink Team
