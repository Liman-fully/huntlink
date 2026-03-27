# GitHub Actions 故障排查

**时间**: 2026-03-28 00:15
**状态**: 所有 7 次运行都失败

---

## 问题分析

### 现象
- 所有 workflow runs 都是 ❌ failed
- 运行时间都很短（8 秒 - 1 分钟）
- 最新的运行 #7 只用了 8 秒

### 可能原因

1. **SSH 密钥问题**
   - 密钥格式不正确
   - 密钥没有权限
   - 服务器拒绝连接

2. **Secrets 配置问题**
   - SERVER_SSH_KEY 格式错误
   - 缺少必要的 Secrets

3. **Workflow 语法问题**
   - YAML 缩进错误
   - 步骤配置错误

---

## 检查清单

### Secrets 配置

- [ ] SERVER_HOST: `150.158.51.199`
- [ ] SERVER_USER: `root`
- [ ] SERVER_SSH_KEY: 完整的私钥（包括 BEGIN/END 行）
- [ ] MYSQL_ROOT_PASSWORD: 已设置
- [ ] MYSQL_PASSWORD: 已设置
- [ ] JWT_SECRET: 已设置

### SSH 密钥格式

正确的格式应该是：
```
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAA...
...
-----END OPENSSH PRIVATE KEY-----
```

### Workflow 配置

检查点：
- [ ] 分支名称正确（master）
- [ ] 触发条件正确
- [ ] SSH action 版本正确
- [ ] 脚本语法正确

---

## 下一步

1. 检查 Secrets 配置
2. 验证 SSH 密钥格式
3. 查看具体的错误日志
4. 修复后重新触发

---

**排查者**: 左护法
**状态**: 进行中
