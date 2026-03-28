# 都统部署任务单

**创建时间**: 2026-03-28 09:02  
**创建人**: 右护法（镇抚司主官）  
**优先级**: P0

---

## 一、部署任务

### 1.1 服务器环境搭建

**要求**:
- PostgreSQL 15+
- Node.js 20+
- Redis 7+
- 2G 内存
- 20G 磁盘

**命令**:
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install -y postgresql-15 nodejs npm redis-server

# 验证版本
postgres --version  # 应 >= 15
node --version      # 应 >= 20
redis-server --version  # 应 >= 7
```

---

### 1.2 代码部署

**步骤**:

1. **拉取代码**
   ```bash
   cd /var/www
   git clone https://github.com/Liman-fully/huntlink.git
   cd huntlink/backend
   ```

2. **配置环境变量**
   ```bash
   cp .env.example .env
   nano .env  # 编辑配置文件
   ```

   **必填配置**:
   ```bash
   # 数据库
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=huntlink
   DB_PASSWORD=你的数据库密码

   # 腾讯云 COS
   COS_SECRET_ID=AKIDxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   COS_SECRET_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   COS_BUCKET=huntlink-1306109984
   COS_REGION=ap-guangzhou

   # Redis
   REDIS_HOST=localhost
   REDIS_PORT=6379
   ```

3. **安装依赖**
   ```bash
   npm install
   ```

4. **初始化数据库**
   ```bash
   # 创建数据库
   sudo -u postgres psql -c "CREATE DATABASE huntlink;"
   sudo -u postgres psql -c "CREATE USER huntlink WITH PASSWORD '你的密码';"
   sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE huntlink TO huntlink;"

   # 运行初始化脚本
   npx ts-node scripts/init-database.ts
   ```

5. **测试 COS 连接**
   ```bash
   npx ts-node scripts/test-cos-connection.ts
   ```

6. **启动服务**
   ```bash
   # 开发环境
   npm run start:dev

   # 生产环境
   npm run start:prod

   # 或使用 PM2
   npm install -g pm2
   pm2 start npm --name "huntlink-backend" -- run start:prod
   pm2 save
   pm2 startup
   ```

---

### 1.3 验证部署

**健康检查**:
```bash
curl http://localhost:3000/api/health
```

**预期返回**:
```json
{"status": "ok"}
```

**测试 COS 上传**:
```bash
# 使用 Postman 或 curl 测试上传接口
curl -X POST http://localhost:3000/api/candidates/upload \
  -F "file=@test-resume.pdf" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 二、配置说明

### 2.1 密钥安全

- ✅ `.env` 文件已在 `.gitignore` 中
- ✅ 密钥不会提交到 GitHub
- ✅ 生产环境使用环境变量

### 2.2 获取密钥

1. 访问：https://console.cloud.tencent.com/cam/capi
2. 点击「新建密钥」
3. 复制 SecretId 和 SecretKey
4. 粘贴到 `.env` 文件

---

## 三、常见问题

### Q1: PostgreSQL 版本不对？

**A**: 必须使用 PostgreSQL 15+，低版本不支持某些特性。

### Q2: COS 连接失败？

**A**: 
1. 检查密钥是否正确
2. 检查存储桶名称是否正确
3. 检查地域是否正确（ap-guangzhou）

### Q3: 端口被占用？

**A**: 
```bash
# 查看占用端口的进程
lsof -i :3000

# 杀死进程
kill -9 <PID>
```

---

## 四、联系支持

**问题反馈**: 在 GitHub Issues 中创建 issue  
**紧急联系**: 右护法（镇抚司主官）

---

**都统** | 神机营主官  
请确认收到任务并开始部署！
