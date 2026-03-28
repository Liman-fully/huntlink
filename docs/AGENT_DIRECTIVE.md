# 招聘中台 Agent 核心指令集 (2026版)

> **所有参与猎脉开发的 Agent 必须将本文档作为底层约束严格执行。**
> 违反以下任何一条准则都可能导致生产环境宕机或数据不一致。

---

## 第一阶段：架构哲学与资源防御

### 内存准则（2G RAM Constraint）

- **禁止在线构建**：严禁在生产环境执行 `npm run build`。必须采用"本地/CI 构建 -> 产物打包 -> 远程部署"模式。
- **连接池收敛**：DB 连接池 `max` 必须限制在 20 以内，防止 Node.js 句柄泄露。
- **流式处理**：处理简历附件或导出报表时，严禁 `fs.readFile` 全量读入内存，必须使用 Stream。
- **禁止 Docker Compose 自动部署**：2G 内存用 Docker Compose 会 OOM。使用直接 Node 运行 + PM2 管理。

### IM 与实时性（Boss 模式）

- **消息不丢不重**：实现消息 ID 的单调递增（如 Snowflake），采用 ACK 机制。
- **心跳与风暴防御**：客户端重连必须包含指数退避算法（Exponential Backoff），防止服务器重启后的瞬时"信令风暴"。
- **取消已读回执**：采用"用户活跃状态"替代"消息已读"，规避信任危机。

---

## 第二阶段：业务一致性与状态机

### 招聘管线事务性（Pipeline ACID）

- **ACID 强一致性**：每一次状态变更（投递 -> 面试 -> 录用）必须在数据库事务中完成。
- **幂等性设计**：所有操作必须支持幂等，API 层实现 `request_id` 校验。
- **事务内禁连外部 API**：先提交 DB 事务，再在 `afterCommit` 钩子中处理外部调用。

### 三端数据隔离（Multi-Tenancy）

- **Row-Level Security**：所有 SQL 查询的 `WHERE` 子句必须包含 `company_id`。
- **隐私脱敏**：默认查询简历时不显示手机号/微信号，仅在"达成意向"后通过独立权限接口获取明文。
- **防冲突锁**：使用 `UNIQUE INDEX (candidate_id, company_id)` 防止重复投递。

---

## 第三阶段：文件处理与存储

### COS 前端直传（Client-Side Direct Upload）

**所有文件上传逻辑禁止经过 Node.js 内存。**

- 使用腾讯云 COS SDK 实现前端预签名上传
- 后端仅负责生成签名 URL，处理字符串元数据
- 静态资源（前端构建产物）直接部署到 COS + CDN

### 简历解析异步化

- 使用 BullMQ（基于 Redis），`concurrency: 1`
- 先占位后解析：DB 创建 `status: PENDING` 记录
- AI 深度解析按需触发（会员权益/HR 点击查看）
- 解析超时 30 秒兜底：标记为"仅支持附件查看"

### 多格式处理

- PDF/Docx：pdf-parse/mammoth，严禁加载整个文件到 Buffer
- 图片/扫描件：腾讯云 OCR API，严禁安装 Tesseract
- 网页/邮件：剥离 HTML 噪音，仅保留正文

---

## 第四阶段：搜索与性能

### 全文检索

- **2G 内存禁止 Elasticsearch**
- 使用 PostgreSQL `pg_trgm` + `tsvector` + GIN 索引
- **严禁** `LIKE '%keyword%'`（全表扫描）
- 搜索冷热分离：仅对最近 3 个月活跃简历建立全文索引

### 数据库保护

- 所有查询必须包含 `LIMIT`（默认 20）
- 批量写入分批（每 50 条一个批次）
- 严禁在无索引字段上 `ORDER BY`

---

## 第五阶段：CI/CD 与代码质量

### 预检指令（Pre-flight Check）

- `git push` 前：`npx tsc --noEmit` — 类型报错不解决，禁止提交
- 使用 `npm ci`（非 `npm install`），防止依赖漂移
- GitHub Actions 流程：`npm ci` -> `tsc --noEmit` -> `build`

### 优雅停机（Graceful Shutdown）

- 后端必须监听 `SIGTERM`
- 先停止接收 API 请求，等待数据库事务处理完后再退出
- 使用 PM2 管理进程（`kill_timeout: 30000`）

### 内存限制

- CI 构建期：`NODE_OPTIONS="--max-old-space-size=4096"`
- 生产运行期：`NODE_OPTIONS="--max-old-space-size=1536"`
- Redis：`maxmemory 256mb` + `allkeys-lru`

---

## 第六阶段：Token 优化策略

- **基础投递**：仅正则提取姓名/电话（不消耗 Token）
- **深度解析**：仅在用户触发会员权益或 HR 点击查看时执行
- **批量导入 1 万份以上**：仅对前 500 字符初筛，深度总结留待按需触发
- **触发式更新**：简历 AI 总结在 HR 真正点开时才消耗 Token

---

## Agent 自检清单（每次 Push 前必须通过）

1. `npx tsc --noEmit` — 无类型错误
2. 无 `fs.readFileSync` / `fs.readFile`（应用 Stream）
3. 无事务内调用外部 API
4. 查询包含 LIMIT
5. 文件上传走 COS 预签名（不经后端内存）
6. 新增状态变更走状态机（非裸写 if/else）

---

*本文档基于 TheLab 架构师复盘、多 Agent 协作实战经验提炼。*
*最后更新：2026-03-29*
