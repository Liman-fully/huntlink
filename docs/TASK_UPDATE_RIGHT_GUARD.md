# 🔒 右护法任务更新 - 平台资产保护与标准化

**更新时间**: 2026-03-29 00:32  
**更新人**: 左护法（天策府主官）  
**优先级**: P0 - 立即执行

---

## 📋 任务调整说明

### 原任务
- ~~DEV-005: 人才推荐算法调研~~ ✅ 已完成（6f32be6）

### 新任务方向
基于平台资产保护原则，重新调整右护法工作重点：

1. **简历下载标准化** - 市场最优实践调研 + 实施
2. **批量导出限制** - 原则上禁止，保护平台核心资产
3. **简历邮箱导入** - 市场最优实践调研 + 实施

---

## 🔴 P0 - 立即执行

### TASK-001: 简历下载标准化流程

**优先级**: P0  
**预计时间**: 40 分钟  
**状态**: ⏳ 待开始

#### 背景
当前简历下载文件名混乱，缺乏统一标准，需要建立标准化流程。

#### 市场最优实践调研

**主流招聘平台做法**:

| 平台 | 命名格式 | 格式说明 |
|------|---------|---------|
| 猎聘 | `姓名_职位_手机号_日期.pdf` | 核心信息完整 |
| BOSS 直聘 | `姓名_期望职位_工作年限.pdf` | 突出求职意向 |
| 智联招聘 | `姓名_手机号_简历 ID.pdf` | 唯一标识 |
| LinkedIn | `FirstName-LastName-Resume.pdf` | 简洁国际化 |

**推荐方案**:
```
格式：姓名_手机号_期望职位_下载日期.pdf
示例：张三_13800138000_Java 开发工程师_20260329.pdf

规则:
1. 姓名：真实姓名（2-10 字）
2. 手机号：11 位数字，中间 4 位用*隐藏（下载后可显示）
3. 期望职位：用户填写的期望职位（10 字内）
4. 下载日期：YYYYMMDD 格式
5. 文件扩展名：保持原格式（.pdf/.doc/.docx）
```

#### 技术方案

**1. 更新导出服务**
```typescript
// backend/src/modules/export/export.service.ts
export class ExportService {
  // 标准化文件名生成
  generateStandardFileName(candidate: Candidate, user: User): string {
    const name = candidate.name;
    const phone = candidate.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
    const position = candidate.expectedPosition?.substring(0, 10) || '未填写';
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    
    // 清理非法字符
    const cleanName = name.replace(/[\\/:*?"<>|]/g, '_');
    const cleanPosition = position.replace(/[\\/:*?"<>|]/g, '_');
    
    return `${cleanName}_${phone}_${cleanPosition}_${date}.pdf`;
  }
}
```

**2. 下载记录追踪**
```typescript
// backend/src/modules/download/download-record.entity.ts
@Entity('download_records')
export class DownloadRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string; // 下载者

  @Column('uuid')
  candidateId: string; // 被下载的候选人

  @Column()
  fileName: string; // 标准化文件名

  @Column()
  downloadTime: Date;

  @Column({ default: 0 })
  viewCount: number; // 查看次数
}
```

#### 验收标准
- [ ] 文件名符合标准格式
- [ ] 特殊字符已清理
- [ ] 下载记录已追踪
- [ ] 隐私保护（手机号脱敏）

---

### TASK-002: 批量导出限制实施

**优先级**: P0  
**预计时间**: 20 分钟  
**状态**: ⏳ 待开始

#### 背景
简历和用户是平台最大的资产，原则上不允许批量导出和批量下载，防止资产流失。

#### 限制策略

**1. 禁止批量导出**
- 移除前端批量导出按钮
- 后端接口限制单次最多导出 1 份简历
- 导出需要二次确认

**2. 下载频率限制**
```typescript
// backend/src/common/guards/download-limit.guard.ts
@Injectable()
export class DownloadLimitGuard implements CanActivate {
  private readonly LIMITS = {
    perMinute: 5,      // 每分钟最多下载 5 份
    perHour: 50,       // 每小时最多下载 50 份
    perDay: 200,       // 每天最多下载 200 份
  };

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user.id;
    
    // 检查下载频率
    const recentDownloads = await this.downloadRecordRepo.count({
      where: {
        userId,
        downloadTime: MoreThan(new Date(Date.now() - 60 * 1000)), // 1 分钟内
      },
    });

    if (recentDownloads >= this.LIMITS.perMinute) {
      throw new TooManyRequestsException('下载频率过高，请稍后再试');
    }

    return true;
  }
}
```

**3. 导出审批流程**（特殊情况）
```
批量导出申请流程:
1. 用户提交申请（说明用途、数量）
2. 平台管理员审批
3. 审批通过后临时开放权限
4. 导出后记录审计日志
```

#### 技术方案

**1. 移除批量导出功能**
```typescript
// backend/src/modules/export/export.controller.ts
// ❌ 删除批量导出接口
// @Post('candidates/batch') 

// ✅ 保留单个导出接口
@Post('candidates/:id')
async exportSingleCandidate(
  @Param('id') id: string,
  @User() user: User,
) {
  // 检查下载频率
  await this.downloadLimitService.checkLimit(user.id);
  
  // 记录下载日志
  await this.downloadRecordService.record({
    userId: user.id,
    candidateId: id,
  });
  
  return this.exportService.export(id);
}
```

**2. 前端移除批量操作**
```typescript
// frontend-web/src/pages/TalentMarket/index.tsx
// ❌ 移除批量导出按钮
// <Button onClick={handleBatchExport}>批量导出</Button>

// ✅ 保留单个下载按钮
<Button 
  onClick={() => handleDownload(candidate.id)}
  disabled={!downloadLimitService.canDownload()}
>
  下载简历
</Button>
```

#### 验收标准
- [ ] 批量导出功能已移除
- [ ] 下载频率限制生效
- [ ] 下载记录已追踪
- [ ] 审计日志完整

---

### TASK-003: 简历邮箱导入最佳实践

**优先级**: P1  
**预计时间**: 60 分钟  
**状态**: ⏳ 待开始

#### 背景
研究市场最优实践，实现简历邮箱导入功能，提升用户体验。

#### 市场最优实践调研

**主流招聘平台做法**:

| 平台 | 导入方式 | 特点 |
|------|---------|------|
| 猎聘 | 转发简历到指定邮箱 | 自动解析、去重 |
| BOSS 直聘 | 邮箱绑定 + 自动导入 | 支持主流邮箱 |
| 智联招聘 | 邮件客户端插件 | 一键导入 |
| Moka | 专属邮箱地址 | 自动入库 |

**推荐方案**:

**方案一：专属邮箱地址（推荐）**
```
为每个用户生成专属导入邮箱：
格式：resume_{userId}@huntlink.com
示例：resume_550e8400-e29b-41d4-a716-446655440000@huntlink.com

流程:
1. 用户转发简历到专属邮箱
2. 系统自动解析邮件附件
3. 提取简历信息并入库
4. 发送导入成功通知
```

**方案二：邮箱绑定 + IMAP 导入**
```
流程:
1. 用户绑定邮箱（支持 QQ、163、Gmail 等）
2. 授权访问收件箱
3. 系统定期扫描带附件的邮件
4. 自动解析并导入简历
```

#### 技术方案

**1. 专属邮箱服务**
```typescript
// backend/src/modules/email-import/email-import.service.ts
@Injectable()
export class EmailImportService {
  // 生成专属邮箱
  generateUniqueEmail(userId: string): string {
    return `resume_${userId}@huntlink.com`;
  }

  // 处理邮件
  async processEmail(email: EmailMessage): Promise<void> {
    // 1. 解析邮件
    const attachments = email.attachments;
    const from = email.from;
    
    // 2. 验证发件人
    const user = await this.userRepo.findOne({ where: { email: from } });
    if (!user) throw new UnauthorizedException();
    
    // 3. 解析简历
    for (const attachment of attachments) {
      const candidate = await this.resumeParser.parse(attachment);
      candidate.userId = user.id;
      await this.candidateRepo.save(candidate);
    }
    
    // 4. 发送通知
    await this.notificationService.sendImportSuccess(user.id);
  }
}
```

**2. 邮件服务器配置**
```typescript
// backend/src/common/config/mail.config.ts
export const mailConfig = {
  // 接收邮件（用于导入）
  incoming: {
    host: 'imap.huntlink.com',
    port: 993,
    secure: true,
  },
  
  // 发送邮件（用于通知）
  outgoing: {
    host: 'smtp.huntlink.com',
    port: 587,
    secure: false,
  },
};
```

**3. 简历解析服务**
```typescript
// backend/src/modules/resume-parser/resume-parser.service.ts
@Injectable()
export class ResumeParserService {
  async parse(file: File): Promise<Candidate> {
    // 支持格式：PDF, DOC, DOCX, TXT
    const content = await this.extractText(file);
    
    // 使用 NLP 提取信息
    const info = await this.nlpService.extract({
      name: this.extractName(content),
      phone: this.extractPhone(content),
      email: this.extractEmail(content),
      skills: this.extractSkills(content),
      experience: this.extractExperience(content),
    });
    
    return info;
  }
}
```

#### 验收标准
- [ ] 专属邮箱生成成功
- [ ] 邮件接收正常
- [ ] 简历解析准确（>90%）
- [ ] 导入通知发送成功

---

## 📊 任务优先级

| 任务 | 优先级 | 预计时间 | 状态 |
|------|--------|---------|------|
| TASK-001 简历下载标准化 | P0 | 40min | ⏳ 待开始 |
| TASK-002 批量导出限制 | P0 | 20min | ⏳ 待开始 |
| TASK-003 简历邮箱导入 | P1 | 60min | ⏳ 待开始 |

**总预计时间**: 120 分钟

---

## 🔒 平台资产保护原则

### 核心原则
1. **简历和用户是平台最大资产** - 严格保护，防止流失
2. **标准化流程** - 所有操作可追溯、可审计
3. **最小权限** - 用户只能访问必要的数据
4. **频率限制** - 防止批量爬取

### 实施措施
| 措施 | 说明 | 状态 |
|------|------|------|
| 下载标准化 | 统一文件名格式 | ⏳ 实施中 |
| 批量导出限制 | 原则上禁止 | ⏳ 实施中 |
| 下载频率限制 | 防爬取 | ⏳ 实施中 |
| 审计日志 | 所有操作可追溯 | ⏳ 实施中 |
| 邮箱导入 | 安全导入渠道 | ⏳ 规划中 |

---

## 📞 联系方式

| 事项 | 联系人 |
|------|--------|
| 任务分配 | @左护法 |
| 后端问题 | @右护法 |
| 前端问题 | @左护法 |
| 产品问题 | @司命大人 |

---

**文档位置**: `docs/TASK_UPDATE_RIGHT_GUARD.md`  
**最后更新**: 2026-03-29 00:32  
**下次更新**: 任务完成后立即更新
