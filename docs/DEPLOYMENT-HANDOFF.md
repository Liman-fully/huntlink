# 部署 Agent 工作交接文档

**创建时间**: 2026-03-28 00:15  
**创建者**: 左护法 AI 团队  
**适用对象**: 负责部署的 Agent

---

## 📋 当前状态

### ✅ 已完成
- [x] 代码已推送到 GitHub
- [x] 自动部署配置已优化
- [x] Docker 配置已完善
- [x] 环境变量模板已创建

### 🔴 问题
- GitHub Actions 部署失败（7 次尝试）
- 需要排查具体原因

---

## 🎯 你的任务

### 选项 A: 修复 GitHub Actions（推荐）

**步骤**:

1. **查看失败日志**
   ```
   访问：https://github.com/Liman-fully/huntlink/actions
   点击最新的失败运行（#7 或 #8）
   查看具体错误信息
   ```

2. **检查 Secrets 配置**
   ```
   访问：https://github.com/Liman-fully/huntlink/settings/secrets/actions
   
   确认以下 Secrets 已正确配置：
   - SERVER_HOST: 150.158.51.199
   - SERVER_USER: root
   - SERVER_SSH_KEY: [完整的 SSH 私钥]
   ```

3. **验证 SSH 密钥**
   - 确保私钥格式正确（包括 BEGIN/END 行）
   - 确保服务器接受该密钥

4. **修复后触发部署**
   ```bash
   git commit --allow-empty -m "chore: 触发部署测试"
   git push origin master
   ```

---

### 选项 B: 手动部署（备选）

如果 GitHub Actions 一直失败，可以手动部署：

```bash
# 1. 登录服务器
ssh root@150.158.51.199

# 2. 进入部署目录
cd /var/www/huntlink

# 3. 拉取最新代码
git pull origin master

# 4. 重启服务
docker-compose down
docker-compose up -d --build

# 5. 验证
docker-compose ps
```

---

## 📚 相关文档

| 文档 | 路径 |
|------|------|
| 部署指南 | DEPLOYMENT.md |
| AI 协作规范 | AI-COLLABORATION.md |
| 故障排查 | .github/actions-troubleshooting.md |
| 工作流配置 | .github/workflows/ci.yml |

---

## 🔧 常见问题

### Q1: SSH 连接失败
**检查**:
- Secrets 中的 SSH 密钥是否完整
- 服务器是否接受该密钥
- 防火墙是否开放 22 端口

### Q2: Docker 命令失败
**检查**:
- Docker 是否已安装
- docker-compose 是否已安装
- 权限是否正确

### Q3: 服务启动失败
**检查**:
- 端口是否被占用
- 环境变量是否正确
- 数据库连接是否正常

---

## 📞 联系方式

- **协调者**: 左护法
- **项目负责人**: Liman
- **Issues**: https://github.com/Liman-fully/huntlink/issues

---

## ✅ 验收标准

部署成功的标志：

- [ ] GitHub Actions 显示绿色勾
- [ ] 可以访问 http://150.158.51.199
- [ ] 后端 API 响应正常
- [ ] Docker 容器运行正常

---

**最后更新**: 2026-03-28 00:15  
**维护者**: 左护法 AI 团队
