# 🚀 新开发者快速入门

> **5 分钟上手猎脉项目开发**

---

## ⚡ 5 分钟快速开始

### 1️⃣ 克隆项目（30 秒）

```bash
git clone https://github.com/Liman-fully/huntlink.git
cd huntlink
```

### 2️⃣ 安装依赖（2 分钟）

```bash
# 后端
cd backend && npm install

# 前端
cd ../frontend-web && npm install
```

### 3️⃣ 配置环境（1 分钟）

```bash
# 后端
cp backend/.env.example backend/.env
# 编辑 backend/.env 配置数据库连接

# 前端
cp frontend-web/.env.example frontend-web/.env
```

### 4️⃣ 启动服务（30 秒）

```bash
# 终端 1 - 后端
cd backend && npm run start:dev

# 终端 2 - 前端
cd frontend-web && npm run dev
```

### 5️⃣ 访问应用

- **前端**: http://localhost:5173
- **后端 API**: http://localhost:3000/api

---

## ✅ 完成！

现在你可以：
- ✅ 查看代码
- ✅ 修改功能
- ✅ 运行测试

---

## 📚 下一步

### 阅读文档

1. **[AI 协作开发规范](AI-COLLABORATION.md)** - 必读！
2. **[部署文档](DEPLOYMENT.md)** - 部署相关
3. **[README.md](README.md)** - 项目概览

### 开始第一个任务

1. 查看 [Issues](https://github.com/Liman-fully/huntlink/issues)
2. 选择一个适合的任务
3. 创建功能分支开始开发

---

## 🆘 遇到问题？

### 常见问题

**Q: npm install 失败**
```bash
# 清除缓存重试
npm cache clean --force
npm install
```

**Q: 数据库连接失败**
```bash
# 检查 MySQL 是否运行
# 检查 .env 配置是否正确
# 确认数据库已创建
```

**Q: 端口被占用**
```bash
# 修改 .env 中的端口配置
# 或者关闭占用端口的服务
```

### 获取帮助

- 查看 [故障排查](AI-COLLABORATION.md#10-故障排查)
- 在 Issues 中提问
- 联系项目负责人

---

## 🎯 开发清单

开始开发前，确保：

- [ ] 已阅读 [AI 协作开发规范](AI-COLLABORATION.md)
- [ ] 开发环境配置完成
- [ ] 能正常访问本地应用
- [ ] 了解 Git 协作流程
- [ ] 了解代码规范和提交规范

---

**祝你开发顺利！** 🚀

**最后更新**: 2026-03-27
