# 猎脉项目部署指南

**服务器**: 腾讯轻量云 150.158.51.199
**部署时间**: 2026-03-27

---

## 📋 部署方式

### 方式一：手动部署（推荐，快速）

#### 1. SSH 登录服务器
```bash
ssh root@150.158.51.199
# 输入密码：]p85Nyx|9v.B[V
```

#### 2. 安装必要工具（如果还没有）
```bash
# 安装 Git
apt update && apt install -y git

# 安装 Docker
curl -fsSL https://get.docker.com | sh

# 安装 Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
```

#### 3. 克隆项目
```bash
mkdir -p /var/www/huntlink
cd /var/www/huntlink
git clone https://github.com/Liman-fully/huntlink.git .
```

#### 4. 配置环境变量
```bash
# 后端环境
cp backend/.env.example backend/.env
# 编辑 backend/.env 配置数据库密码

# 前端环境
cp frontend-web/.env.example frontend-web/.env
```

#### 5. 运行部署脚本
```bash
chmod +x deploy.sh
./deploy.sh
```

#### 6. 验证部署
```bash
# 查看容器状态
docker-compose ps

# 查看后端日志
docker-compose logs backend

# 查看前端日志
docker-compose logs frontend

# 测试后端 API
curl http://localhost:3000/api

# 测试前端
curl http://localhost
```

---

### 方式二：GitHub Actions 自动部署（需要配置 Secrets）

#### 1. 配置 GitHub Secrets
访问：https://github.com/Liman-fully/huntlink/settings/secrets/actions

添加以下 Secrets：
- `SERVER_HOST`: `150.158.51.199`
- `SERVER_USER`: `root`
- `SERVER_SSH_KEY`: [SSH 私钥内容]
- `MYSQL_ROOT_PASSWORD`: [数据库 root 密码]
- `MYSQL_PASSWORD`: [数据库用户密码]
- `JWT_SECRET`: [JWT 密钥]

#### 2. 配置 SSH 密钥认证
在服务器上执行：
```bash
mkdir -p ~/.ssh
# 将 GitHub Actions 的公钥添加到 ~/.ssh/authorized_keys
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

#### 3. 触发部署
推送代码到 main 分支会自动触发部署。

---

## 🔧 数据库配置

### 使用 Docker Compose 自动创建（推荐）
```yaml
# docker-compose.yml 已配置
# MySQL 会自动创建 huntlink 数据库
```

### 手动配置（如果已有 MySQL）
```bash
# 登录 MySQL
mysql -u root -p

# 创建数据库
CREATE DATABASE huntlink CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 创建用户
CREATE USER 'huntlink'@'localhost' IDENTIFIED BY 'huntlink_user_password_2026';
GRANT ALL PRIVILEGES ON huntlink.* TO 'huntlink'@'localhost';
FLUSH PRIVILEGES;
```

---

## 🚀 常用命令

### 查看服务状态
```bash
docker-compose ps
```

### 查看日志
```bash
# 所有服务
docker-compose logs -f

# 单个服务
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mysql
```

### 重启服务
```bash
docker-compose restart
```

### 重新部署
```bash
cd /var/www/huntlink
git pull origin master
docker-compose down
docker-compose up -d --build
```

### 数据库迁移
```bash
docker-compose exec backend npm run typeorm migration:run
```

---

## 🔍 健康检查

### 后端健康检查
```bash
curl http://150.158.51.199:3000/api/health
```

### 前端健康检查
```bash
curl http://150.158.51.199
```

### 数据库连接检查
```bash
docker-compose exec mysql mysql -u huntlink -p -e "SELECT 1"
```

---

## ⚠️ 故障排查

### 后端无法启动
```bash
# 查看日志
docker-compose logs backend

# 检查数据库连接
docker-compose exec backend ping mysql
```

### 前端无法访问
```bash
# 检查 Nginx 配置
docker-compose exec frontend nginx -t

# 查看日志
docker-compose logs frontend
```

### 数据库连接失败
```bash
# 检查 MySQL 状态
docker-compose ps mysql

# 测试连接
docker-compose exec backend mysql -h mysql -u huntlink -p
```

---

## 📊 部署状态

| 组件 | 状态 | 端口 |
|------|------|------|
| MySQL | 🟢 运行中 | 3306 |
| Backend | 🟢 运行中 | 3000 |
| Frontend | 🟢 运行中 | 80 |

---

## 🔐 安全建议

1. **修改默认密码**
   - 数据库 root 密码
   - JWT_SECRET
   - 服务器 SSH 密码（建议改用 SSH 密钥）

2. **配置防火墙**
   ```bash
   # 只开放必要端口
   ufw allow 22/tcp    # SSH
   ufw allow 80/tcp    # HTTP
   ufw allow 443/tcp   # HTTPS (如果需要)
   ufw enable
   ```

3. **配置 HTTPS**（推荐）
   - 使用 Let's Encrypt 免费证书
   - 配置 Nginx SSL

4. **定期备份**
   ```bash
   # 备份数据库
   docker-compose exec mysql mysqldump -u root huntlink > backup-$(date +%Y%m%d).sql
   ```

---

**部署完成时间**: [待填写]
**部署者**: 左护法 AI 团队
**最后更新**: 2026-03-27
