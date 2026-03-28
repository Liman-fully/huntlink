# 腾讯云 COS 密钥配置指南

**文档目的**: BUG-002 修复指南  
**创建时间**: 2026-03-28 23:45  
**执行者**: 左护法（需司命大人配合）

---

## 📋 配置步骤

### 步骤 1: 获取腾讯云密钥

1. **访问腾讯云控制台**
   - URL: https://console.cloud.tencent.com/cam/capi
   - 使用项目腾讯云账号登录

2. **创建访问密钥**
   - 点击「访问管理」→「访问密钥」
   - 点击「新建密钥」
   - 系统会生成一对密钥：
     - `SecretId` (以 AKID 开头)
     - `SecretKey` (32 位字符串)

3. **复制密钥**
   - ⚠️ **重要**: SecretKey 只显示一次，请立即复制保存
   - 建议保存到安全的密码管理器中

---

### 步骤 2: 配置环境变量

#### 方式一：服务器生产环境

SSH 登录服务器后编辑：
```bash
ssh root@150.158.51.199

# 编辑后端环境变量
nano /var/www/huntlink/backend/.env
```

添加以下配置：
```bash
# ==================== 腾讯云 COS 配置 ====================
COS_SECRET_ID=AKIDxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
COS_SECRET_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
COS_BUCKET=huntlink-1306109984
COS_REGION=ap-guangzhou
COS_DOMAIN=huntlink-1306109984.cos.ap-guangzhou.myqcloud.com
```

保存后重启后端服务：
```bash
cd /var/www/huntlink
docker-compose restart backend
```

#### 方式二：本地开发环境

编辑 `backend/.env` 文件：
```bash
# 复制示例文件
cp backend/.env.example backend/.env

# 编辑配置
nano backend/.env
```

添加 COS 配置（同上）。

---

### 步骤 3: 验证配置

#### 运行连接测试脚本

```bash
cd /var/www/huntlink/backend

# 运行测试脚本
npx ts-node scripts/test-cos-connection.ts
```

**预期输出**:
```
✅ COS 连接成功！
配置信息:
  存储桶：huntlink-1306109984
  地域：ap-guangzhou
  域名：huntlink-1306109984.cos.ap-guangzhou.myqcloud.com
```

#### 手动测试上传

```typescript
// 创建测试文件 test-cos-upload.ts
import { COSStorageService } from './src/common/storage/cos.service';

async function testUpload() {
  const storage = new COSStorageService();
  
  // 测试上传
  const result = await storage.uploadFile({
    filename: 'test.txt',
    buffer: Buffer.from('Hello COS!'),
    contentType: 'text/plain'
  });
  
  console.log('上传成功:', result);
  console.log('文件 URL:', result.url);
}

testUpload();
```

---

## 🔒 安全注意事项

### 密钥保护

1. **不要提交到 Git**
   - 确保 `.env` 在 `.gitignore` 中
   - 不要将密钥硬编码到代码中

2. **使用 GitHub Secrets（推荐）**
   - 访问：https://github.com/Liman-fully/huntlink/settings/secrets/actions
   - 添加 Secrets:
     - `COS_SECRET_ID`
     - `COS_SECRET_KEY`
   - GitHub Actions 会自动使用这些密钥

3. **定期轮换密钥**
   - 建议每 3-6 个月轮换一次
   - 旧密钥禁用前确保新密钥已生效

### 权限最小化

创建 CAM 策略，限制 COS 访问权限：
```json
{
  "version": "2.0",
  "statement": [
    {
      "effect": "allow",
      "action": [
        "name/cos:PutObject",
        "name/cos:GetObject",
        "name/cos:DeleteObject"
      ],
      "resource": [
        "qcs::cos:ap-guangzhou:uid/1234567890:huntlink-1306109984/*"
      ]
    }
  ]
}
```

---

## ⚠️ 常见问题

### Q1: 密钥无效？

**A**: 
1. 检查密钥是否复制完整（无空格、无换行）
2. 检查密钥是否已启用（CAM 控制台）
3. 检查密钥是否已过期

### Q2: 连接超时？

**A**:
1. 检查服务器网络是否可访问腾讯云
2. 检查防火墙设置
3. 检查 COS 存储桶是否允许公网访问

### Q3: 权限拒绝？

**A**:
1. 检查 CAM 策略是否包含 COS 操作权限
2. 检查存储桶权限设置
3. 检查密钥是否有关联的策略

### Q4: 上传失败？

**A**:
1. 检查存储空间是否充足
2. 检查文件大小是否超限
3. 检查文件类型是否被允许
4. 查看后端日志：`docker-compose logs backend`

---

## 📞 联系支持

| 事项 | 联系人 |
|------|--------|
| 密钥获取 | @司命大人 |
| 配置问题 | @左护法 |
| 技术问题 | @右护法 / @都统 |

---

## ✅ 验收标准

BUG-002 修复完成的标志：

- [ ] COS_SECRET_ID 已配置
- [ ] COS_SECRET_KEY 已配置
- [ ] 连接测试通过
- [ ] 文件上传测试通过
- [ ] 密钥未提交到 Git

---

**文档位置**: `docs/COS_SETUP_INSTRUCTIONS.md`  
**状态**: ⏳ 等待司命大人提供密钥  
**预计完成**: 密钥提供后 10 分钟内
