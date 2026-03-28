# 猎脉 HuntLink 部署培训手册

> **版本**: v1.0 | **更新日期**: 2026-03-29 | **制定**: 都统（Claw）
> 
> **本文档为强制培训材料，所有参与猎脉开发的 Agent 必须学习并在文末签字确认后，方可进行任何部署操作。**

---

## 一、服务器概况

| 项目 | 值 |
|------|-----|
| 服务器 | 腾讯云 150.158.51.199 |
| 系统 | Ubuntu |
| 内存 | **2GB（极度紧张）** |
| 磁盘 | 200GB |
| 数据库 | PostgreSQL 16 |
| 缓存 | Redis 7 |
| SSH 用户 | ubuntu |
| SSH 认证 | **密钥认证（非密码）** |

### 关键事实

- 服务器内存只有 2GB，PostgreSQL + Redis + Node.js + Nginx 常驻已占 1.5GB+
- **服务器上执行 `npm run build` 会直接 OOM（内存溢出）导致进程被杀**
- SSH 使用密钥文件 `workbuddy.pem` 认证，不是密码

---

## 二、部署模式：产物交付

### 核心原则

```
❌ 禁止：源码交付（在服务器上 npm install + npm run build）
✅ 正确：产物交付（本地/CI 构建 → 上传 dist → 服务器只做替换+重启）
```

### 部署流程

```
本地/CI 构建          服务器部署
┌──────────────┐      ┌──────────────┐
│ npm ci       │      │              │
│ tsc --noEmit │      │              │
│ npm run build│ ──→  │ 替换 dist    │
│ 打包 dist/   │ scp  │ npm install  │
│              │      │   --production│
└──────────────┘      │ pm2 restart  │
                      └──────────────┘
```

### 为什么不能在服务器上构建

1. `npm install` 全量安装 devDependencies → 占用 500MB+
2. `npm run build`（TypeScript 编译）→ 峰值占用 1GB+
3. 服务器剩余内存 < 500MB → OOM Killer 杀进程
4. 结果：构建失败、Node 服务崩溃、SSH 断连

---

## 三、GitHub Secrets 配置

### 当前有效 Secrets

| Secret 名称 | 用途 | 备注 |
|-------------|------|------|
| SERVER_HOST | 服务器 IP | 150.158.51.199 |
| SERVER_USER | SSH 用户名 | ubuntu |
| SERVER_SSH_KEY | SSH 私钥 | PEM 格式，和 workbuddy.pem 相同 |
| JWT_SECRET | JWT 签名密钥 | 后端认证用 |

### 已废弃 Secrets（已清理）

| Secret 名称 | 原因 |
|-------------|------|
| ~~MYSQL_PASSWORD~~ | 已从 MySQL 迁移到 PostgreSQL |
| ~~MYSQL_ROOT_PASSWORD~~ | 同上 |

### SSH 认证说明

- 服务器使用 **SSH 密钥认证**，不是密码认证
- 密钥文件：`C:\Users\liman\Desktop\workbuddy.pem`
- GitHub Actions 通过 `appleboy/ssh-action` 使用 `SERVER_SSH_KEY` Secret
- 如果 Agent 看到"密码不对"或"密钥不对"，检查：
  1. 是否用了密码而不是密钥
  2. 密钥格式是否完整（包含 BEGIN/END 行）
  3. 服务器防火墙是否开放 22 端口

---

## 四、CI/CD 流水线

### 构建阶段（GitHub Actions Runner）

```
Type Check (tsc --noEmit) → Build → Test → 打包产物
```

- Type Check 必须在 Build 之前
- 内存限制：`NODE_OPTIONS=--max-old-space-size=4096`
- 构建产物上传为 GitHub Artifact

### 部署阶段（产物交付）

```
下载 Artifact → SCP 到服务器 → 替换 dist → npm ci --omit=dev → 重启
```

- **服务器上零构建操作**
- `npm ci --omit=dev` 只装 production 依赖（省 60%+ 内存）
- PM2 优先，回退到直接 Node（`--max-old-space-size=1536`）

---

## 五、部署红线（绝对不可违反）

### 红线清单

| 编号 | 红线 | 违反后果 |
|------|------|----------|
| R-01 | **禁止在服务器上执行 `npm run build`** | OOM → 服务崩溃 |
| R-02 | **禁止 `npm install` 不带 `--production` 或 `--omit=dev`** | 内存溢出 |
| R-03 | **禁止使用 Docker Compose 部署** | 2G 内存不够，容器启动失败 |
| R-04 | **禁止 SSH 命令超过 3 个 `&&`** | PowerShell 转义错误，命令解析失败 |
| R-05 | **禁止在 DB 事务内调用外部 API** | 事务超时，连接泄漏 |
| R-06 | **禁止 `fs.readFileSync`** | 内存泄漏，大文件卡死 |
| R-07 | **禁止裸写 if/else 管理招聘流程** | 状态不一致，必须用状态机 |
| R-08 | **禁止部署前不跑 `npx tsc --noEmit`** | TypeScript 错误流入生产 |

### 红线 R-01 详解：为什么不能在服务器上构建

```
服务器内存分布（总计 2GB）：
├── PostgreSQL 16    ~400MB
├── Redis 7          ~100MB
├── Nginx             ~30MB
├── OS 系统           ~300MB
├── Node.js 运行时    ~300MB
├── 预留缓冲          ~200MB
└── 可用              ~670MB

npm run build 峰值需求：~1.2GB
结果：670MB < 1.2GB → OOM Killer 杀进程
```

---

## 六、手动部署操作指南

### 方式一：本地构建 + SCP 上传（推荐）

```bash
# 1. 本地构建
cd backend && npm run build
cd ../frontend-web && npm run build

# 2. 上传构建产物
scp -i ~/.ssh/workbuddy.pem -r backend/dist ubuntu@150.158.51.199:/var/www/huntlink/backend/
scp -i ~/.ssh/workbuddy.pem -r frontend-web/dist ubuntu@150.158.51.199:/var/www/huntlink/frontend-web/

# 3. 服务器上重启
ssh -i ~/.ssh/workbuddy.pem ubuntu@150.158.51.199 "cd /var/www/huntlink/backend && npm ci --omit=dev && pm2 restart huntlink"
```

### 方式二：GitHub Actions 自动部署（推送 master 触发）

1. 本地通过 Type Check + Build
2. 推送到 master 分支
3. CI 自动构建并上传产物
4. 部署阶段 SCP 产物到服务器并重启

### 方式三：腾讯云 WebShell 手动操作

1. 登录腾讯云控制台 → WebShell
2. 只执行替换和重启命令，**绝不执行 build**

---

## 七、故障排查

| 现象 | 可能原因 | 解决方案 |
|------|----------|----------|
| SSH 连接超时 | 网络波动 / 密钥格式错误 | 重试，检查 .pem 文件权限 600 |
| "Permission denied" | 用了密码而非密钥 | 确认使用 `ssh -i workbuddy.pem` |
| "密钥不对" | 密钥内容被截断/格式错误 | 确保包含完整的 BEGIN/END 行 |
| 部署后服务不启动 | .env 缺失 / 端口被占 | 检查 .env 文件，`pm2 logs` |
| OOM Killer 杀进程 | 在服务器上执行了 build | 重启服务器，用产物交付方式重新部署 |
| CI 构建失败 | TypeScript 类型错误 | 本地先跑 `npx tsc --noEmit` |

---

## 八、培训确认

> **所有参与猎脉开发的 Agent，在执行任何部署操作前，必须确认已阅读并理解本文档。**

### 确认签名

| 角色 | Agent 名称 | 确认日期 | 签名 |
|------|-----------|----------|------|
| 都统 | Claw | 2026-03-29 | ✅ Claw（本文档制定者） |
| 天策府 | 左护法 | ____-__-__ | ____ |
| 神机营 | 前锋校尉 | ____-__-__ | ____ |
| 神机营 | 后阵校尉 | ____-__-__ | ____ |
| 神机营 | 督造校尉 | ____-__-__ | ____ |
| 镇抚司 | 右护法 | ____-__-__ | ____ |

---

*本文档随项目演进持续更新。如有疑问，查阅 `docs/ARCHITECTURE_GUIDE.md` 和 `docs/AGENT_DIRECTIVE.md`。*
