# 部署能力全员化培训

> **培训时间**: 2026-03-28  
> **培训师**: 左护法（天策府主官）  
> **目标**: 每个 Agent 都能独立部署  
> **版本**: V2.0（整合右护法优化方案）

---

## 🎯 为什么需要部署能力全员化？

### 当前风险

```
❌ 只有都统会部署
   ↓
如果都统不在/太累/离职
   ↓
❌ 无人能部署
   ↓
❌ 项目无法上线
```

### 目标状态

```
✅ 每个 Agent 都会部署
   ↓
任何 Agent 都可以上线
   ↓
✅ 团队韧性提升
   ↓
✅ 随时可以上线
```

---

## 📚 部署方式（3 种）

### 🎯 当前状态

**GitHub Actions 部署**：
- ✅ 已配置（左护法测试中）
- ✅ 自动化部署
- ✅ 有回滚机制

**手动部署**：
- ✅ 可用（备用方案）
- ✅ 右护法优化方案已实施

### 📋 右护法优化方案

**重要文档**：`DOCKER_OPTIMIZATION_PLAN.md`

**核心优化**：
1. **多阶段构建** - 镜像体积减少 60%
2. **健康检查** - Backend/Frontend 都有
3. **资源限制** - 防止资源耗尽
4. **日志管理** - 每服务 100MB 限制
5. **回滚机制** - 部署失败自动回滚

**使用优化配置**：
```bash
# 使用优化后的配置
cp docker-compose.optimized.yml docker-compose.yml
cp backend/Dockerfile.optimized backend/Dockerfile
cp frontend-web/Dockerfile.optimized frontend-web/Dockerfile

# 部署
./deploy.optimized.sh
```

### 方式 1: GitHub Actions 自动部署（最简单）

**原理**：
```
推送代码 → GitHub Actions → 自动部署到服务器
```

**步骤**：

1. **推送代码**
   ```bash
   git add .
   git commit -m "feat: 完成功能"
   git push origin master
   ```

2. **查看部署状态**
   ```bash
   # 访问 GitHub Actions
   https://github.com/Liman-fully/huntlink/actions
   ```

3. **等待完成**
   ```
   通常 2-5 分钟完成
   ```

4. **验证部署**
   ```bash
   # 访问网站
   http://150.158.51.199
   ```

**优点**：
- ✅ 最简单（只需 git push）
- ✅ 自动化（无需手动操作）
- ✅ 可追溯（有部署日志）

**缺点**：
- ⚠️ 需要配置 GitHub Secrets
- ⚠️ 依赖网络

**适用场景**：
- ✅ 日常开发部署
- ✅ 功能上线
- ✅ Bug 修复

---

### 方式 2: SSH 手动部署（最灵活）

**原理**：
```
SSH 登录服务器 → 拉取代码 → 重启服务
```

**步骤**：

1. **SSH 登录服务器**
   ```bash
   ssh root@150.158.51.199
   # 输入密码：]p85Nyx|9v.B[V
   ```

2. **进入部署目录**
   ```bash
   cd /var/www/huntlink
   ```

3. **拉取最新代码**
   ```bash
   git pull origin master
   ```

4. **重启服务**
   ```bash
   docker-compose restart
   ```

5. **查看状态**
   ```bash
   docker-compose ps
   ```

6. **查看日志**（如有问题）
   ```bash
   docker-compose logs -f
   ```

**优点**：
- ✅ 最灵活（可以执行任意命令）
- ✅ 快速（直接操作服务器）
- ✅ 调试方便（可以实时查看日志）

**缺点**：
- ⚠️ 需要 SSH 密钥
- ⚠️ 需要服务器密码
- ⚠️ 操作风险（可能误操作）

**适用场景**：
- ✅ 紧急修复
- ✅ 调试问题
- ✅ 查看服务器状态

---

### 方式 3: 部署脚本（最规范）

**原理**：
```
运行部署脚本 → 自动完成所有步骤
```

**步骤**：

1. **运行部署脚本**
   ```bash
   ./deploy.sh
   ```

2. **查看输出**
   ```
   🚀 开始部署猎脉 HuntLink...
   📦 更新代码...
   ⚙️  配置环境变量...
   🐳 启动服务...
   ✅ 部署完成！
   ```

3. **验证部署**
   ```bash
   docker-compose ps
   ```

**优点**：
- ✅ 最规范（标准化流程）
- ✅ 可重复（每次一样）
- ✅ 降低风险（脚本已测试）

**缺点**：
- ⚠️ 需要维护脚本
- ⚠️ 灵活性低

**适用场景**：
- ✅ 标准部署
- ✅ 新人部署
- ✅ 批量部署

---

## 🔧 部署前置条件

### 1. GitHub Secrets 配置

**必须配置的 Secrets**：

| Secret 名称 | 值 | 说明 |
|-----------|-----|------|
| `SERVER_HOST` | `150.158.51.199` | 服务器 IP |
| `SERVER_USER` | `root` | SSH 用户名 |
| `SERVER_SSH_KEY` | [SSH 私钥] | SSH 密钥 |
| `MYSQL_ROOT_PASSWORD` | [密码] | MySQL root 密码 |
| `MYSQL_PASSWORD` | [密码] | MySQL 用户密码 |
| `JWT_SECRET` | [密钥] | JWT 签名密钥 |

**配置位置**：
```
https://github.com/Liman-fully/huntlink/settings/secrets/actions
```

### 2. SSH 密钥配置

**生成 SSH 密钥**：
```bash
ssh-keygen -t ed25519 -f ~/.ssh/huntlink-deploy -C "huntlink-deploy"
```

**添加公钥到服务器**：
```bash
ssh-copy-id -i ~/.ssh/huntlink-deploy.pub root@150.158.51.199
```

**添加私钥到 GitHub Secrets**：
```bash
cat ~/.ssh/huntlink-deploy
# 复制输出，添加到 SERVER_SSH_KEY
```

### 3. 服务器权限配置

**确保部署用户有权限**：
```bash
# SSH 登录服务器
ssh root@150.158.51.199

# 检查 Docker 权限
docker ps

# 检查 Git 权限
cd /var/www/huntlink
git pull origin master
```

---

## 📋 部署验收清单

### 部署前检查

- [ ] 代码已推送到 master
- [ ] 本地测试通过
- [ ] 设计文档已更新
- [ ] 任务看板已更新

### 部署中检查

- [ ] GitHub Actions 运行成功
- [ ] 服务器已更新代码
- [ ] 服务已重启
- [ ] 没有报错

### 部署后验证

- [ ] 可以访问网站
- [ ] 核心功能正常
- [ ] 数据正常
- [ ] 性能正常

---

## 🚨 部署问题排查

### 问题 1: GitHub Actions 失败

**症状**：
```
❌ Deploy failed
```

**排查步骤**：
```bash
# 1. 查看 GitHub Actions 日志
https://github.com/Liman-fully/huntlink/actions

# 2. 找到失败的运行
# 3. 点击查看详情
# 4. 查看错误信息

# 5. 常见错误：
# - SSH 连接失败 → 检查 Secrets 配置
# - Docker 构建失败 → 查看 Dockerfile
# - 服务启动失败 → 查看服务器日志
```

### 问题 2: SSH 连接失败

**症状**：
```
Permission denied (publickey,password).
```

**排查步骤**：
```bash
# 1. 检查 SSH 密钥
ls -la ~/.ssh/

# 2. 检查密钥权限
chmod 600 ~/.ssh/huntlink-deploy

# 3. 检查服务器公钥
ssh root@150.158.51.199 "cat ~/.ssh/authorized_keys"

# 4. 重新添加公钥
ssh-copy-id -i ~/.ssh/huntlink-deploy.pub root@150.158.51.199
```

### 问题 3: 服务启动失败

**症状**：
```
Error: service failed to start
```

**排查步骤**：
```bash
# 1. 查看服务状态
docker-compose ps

# 2. 查看错误日志
docker-compose logs backend

# 3. 常见问题：
# - 端口被占用 → lsof -i :3000
# - 数据库连接失败 → 检查环境变量
# - 内存不足 → free -h
```

---

## 🎯 部署能力考核

### 考核标准

**每个 Agent 必须通过**：

1. **理论考核**（5 分钟）
   - [ ] 知道 3 种部署方式
   - [ ] 知道部署前置条件
   - [ ] 知道部署验收清单

2. **实操考核**（10 分钟）
   - [ ] 能独立推送代码
   - [ ] 能查看部署状态
   - [ ] 能验证部署成功
   - [ ] 能排查常见问题

### 考核流程

```
1. 左护法讲解（5 分钟）
   ↓
2. 新人实操（10 分钟）
   ↓
3. 左护法验收（5 分钟）
   ↓
4. 颁发"部署资格证"
```

### 部署资格证

```
┌─────────────────────────────────────┐
│   猎脉部署资格证                     │
│                                     │
│  持证人：[Agent 名字]               │
│  Agent ID: [你的 ID]                │
│  获得时间：2026-03-28               │
│                                     │
│  认证能力：                         │
│  ✅ GitHub Actions 部署             │
│  ✅ SSH 手动部署                    │
│  ✅ 部署脚本使用                    │
│                                     │
│  左护法签名：___________            │
└─────────────────────────────────────┘
```

---

## 📊 部署能力统计

| Agent | GitHub Actions | SSH 手动 | 部署脚本 | 状态 |
|-------|---------------|---------|---------|------|
| 都统 | ✅ | ✅ | ✅ | 已认证 |
| 右护法 | ⏳ | ⏳ | ⏳ | 培训中 |
| 新人 | ⏳ | ⏳ | ⏳ | 待培训 |

**目标**：全员 100% 通过

---

## 💬 常见问题

### Q1: 为什么需要学会部署？

**A**: 避免单点故障，提高团队韧性。如果只有都统会部署，都统不在时项目无法上线。

### Q2: 部署很难吗？

**A**: 不难！GitHub Actions 只需 `git push`，其他两种方式也有详细文档。

### Q3: 部署搞砸了怎么办？

**A**: 有自动回滚机制，部署失败会自动回滚到上一个版本。

### Q4: 多久需要部署一次？

**A**: 每日至少一次（日清日毕），功能完成后立即部署。

---

**文档位置**: `docs/DEPLOYMENT_TRAINING.md`  
**版本**: V1.0  
**最后更新**: 2026-03-28 09:00  
**维护者**: 左护法（天策府主官）
