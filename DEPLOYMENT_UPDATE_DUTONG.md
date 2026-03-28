# 都统部署任务更新 - 搜索功能 + COS 集成

**更新时间**: 2026-03-28 11:32  
**更新人**: 右护法（镇抚司主官）  
**优先级**: P0

---

## 一、新增部署内容

### 1.1 简历搜索功能

**新增文件**:
- `backend/src/modules/candidate/candidate.service.ts`
- `backend/src/modules/candidate/candidate.controller.ts`
- `backend/src/modules/candidate/candidate.entity.ts`
- `backend/src/modules/candidate/candidate.module.ts`

**API 接口**:
| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/candidates/search` | GET | 搜索候选人 |
| `/api/candidates/search/suggestions` | GET | 搜索建议 |
| `/api/candidates/search/stats` | GET | 搜索统计 |
| `/api/candidates/:id/highlight` | GET | 高亮显示 |

**数据库要求**:
- PostgreSQL 15+（必须）
- GIN 索引（必须）
- tsvector 支持（必须）

---

### 1.2 腾讯云 COS 集成

**新增文件**:
- `backend/src/common/storage/cos.service.ts`
- `backend/src/common/storage/cos.module.ts`

**配置要求**:
```bash
# .env 文件
COS_SECRET_ID=AKIDxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
COS_SECRET_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
COS_BUCKET=huntlink-1306109984
COS_REGION=ap-guangzhou
```

**获取密钥步骤**:
1. 访问：https://console.cloud.tencent.com/cam/capi
2. 登录腾讯云账号
3. 点击「访问管理」→「访问密钥」
4. 点击「新建密钥」
5. 复制 SecretId 和 SecretKey
6. 粘贴到 `.env` 文件

---

## 二、部署步骤更新

### 2.1 数据库初始化

```bash
# 1. 创建数据库
sudo -u postgres psql -c "CREATE DATABASE huntlink;"
sudo -u postgres psql -c "CREATE USER huntlink WITH PASSWORD '你的密码';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE huntlink TO huntlink;"

# 2. 运行初始化脚本
cd /var/www/huntlink/backend
npx ts-node scripts/init-database.ts
```

**初始化内容**:
- candidates 表创建
- GIN 索引创建
- 触发器创建（自动更新 search_context）

---

### 2.2 COS 连接测试

```bash
# 测试 COS 连接
npx ts-node scripts/test-cos-connection.ts

# 预期输出
✅ COS 连接成功！
配置信息:
  存储桶：huntlink-1306109984
  地域：ap-guangzhou
  域名：huntlink-1306109984.cos.ap-guangzhou.myqcloud.com
```

---

### 2.3 搜索功能测试

```bash
# 1. 启动服务
npm run start:dev

# 2. 测试搜索接口（使用 Postman 或 curl）
curl -X GET "http://localhost:3000/api/candidates/search?keyword=Java&city=北京" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# 3. 测试搜索建议
curl -X GET "http://localhost:3000/api/candidates/search/suggestions?q=北" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# 4. 测试搜索统计
curl -X GET "http://localhost:3000/api/candidates/search/stats?keyword=Java" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 三、验证清单

### 3.1 环境验证

- [ ] PostgreSQL 15+ 已安装
- [ ] Node.js 20+ 已安装
- [ ] Redis 7+ 已安装
- [ ] 2G 内存可用
- [ ] 20G 磁盘可用

### 3.2 数据库验证

- [ ] huntlink 数据库已创建
- [ ] huntlink 用户已创建
- [ ] candidates 表已创建
- [ ] GIN 索引已创建
- [ ] 触发器已创建

### 3.3 COS 验证

- [ ] .env 文件已配置
- [ ] COS_SECRET_ID 已填写
- [ ] COS_SECRET_KEY 已填写
- [ ] COS 连接测试通过
- [ ] 文件上传测试通过

### 3.4 搜索功能验证

- [ ] 搜索接口可用
- [ ] 搜索建议接口可用
- [ ] 搜索统计接口可用
- [ ] 高亮显示接口可用
- [ ] 响应时间 < 500ms

---

## 四、常见问题

### Q1: PostgreSQL 版本不对？

**A**: 必须使用 PostgreSQL 15+，低版本不支持 tsvector 和 GIN 索引。

```bash
# 检查版本
postgres --version

# 升级（Ubuntu）
sudo apt update
sudo apt install postgresql-15
```

### Q2: COS 连接失败？

**A**: 
1. 检查密钥是否正确（无空格）
2. 检查存储桶名称是否正确
3. 检查地域是否正确（ap-guangzhou）
4. 检查防火墙是否开放外网访问

### Q3: GIN 索引创建失败？

**A**: 
```bash
# 检查 pg_trgm 扩展
sudo -u postgres psql -d huntlink -c "CREATE EXTENSION IF NOT EXISTS pg_trgm;"

# 检查权限
sudo -u postgres psql -d huntlink -c "GRANT ALL ON SCHEMA public TO huntlink;"
```

### Q4: 搜索无结果？

**A**: 
1. 检查 candidates 表是否有数据
2. 检查 search_context 字段是否有值
3. 手动触发触发器更新：
   ```sql
   UPDATE candidates SET name = name WHERE id = 1;
   ```

---

## 五、性能基准

### 5.1 预期性能（10 万数据）

| 接口 | 预期响应 | 说明 |
|------|----------|------|
| 搜索候选人 | 50-300ms | GIN 索引 |
| 搜索建议 | 20-50ms | 简单查询 |
| 搜索统计 | 200-500ms | 多 GROUP BY |
| 高亮显示 | 100-250ms | ts_headline |

### 5.2 性能优化

如果性能不达标：
1. 检查 GIN 索引是否创建
2. 检查查询计划（EXPLAIN ANALYZE）
3. 检查内存配置（shared_buffers）
4. 检查连接数（max_connections）

---

## 六、联系支持

**问题反馈**: 
- GitHub Issues: https://github.com/Liman-fully/huntlink/issues
- 文档：`backend/docs/CANDIDATE_SEARCH.md`

**紧急联系**: 右护法（镇抚司主官）

---

**都统** | 神机营主官  
请确认收到更新并开始部署！

部署完成后请在 GitHub Issues 中回复确认！
