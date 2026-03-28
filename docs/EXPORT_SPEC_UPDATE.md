# 📄 简历导出规范更新

**更新时间**: 2026-03-29 00:42  
**更新人**: 左护法（天策府主官）  
**优先级**: P0 - 立即执行

---

## 🔄 规范变更说明

### 原规范
- 格式：保持原格式（.pdf/.doc/.docx）
- 命名：`姓名_手机号_期望职位_下载日期.pdf`

### 新规范（立即实施）

| 项目 | 新规范 | 说明 |
|------|--------|------|
| **导出格式** | 统一为 PDF | 所有简历导出统一为 PDF 格式 |
| **默认命名** | `职位_姓名_手机号_日期.pdf` | 职位前置首位 |
| **自定义命名** | 支持用户自定义 | 下载时可选择修改文件名 |
| **不修改** | 使用默认方案 | 用户不修改则用默认命名 |

---

## 📋 默认命名规则

### 格式
```
{期望职位}_{姓名}_{手机号脱敏}_{下载日期}.pdf

示例:
Java 开发工程师_张三_138****8000_20260329.pdf
产品经理_李四_139****9000_20260329.pdf
```

### 规则详情

| 字段 | 规则 | 示例 |
|------|------|------|
| 期望职位 | 前置首位，10 字内 | `Java 开发工程师` |
| 姓名 | 真实姓名，2-10 字 | `张三` |
| 手机号 | 11 位，中间 4 位脱敏 | `138****8000` |
| 下载日期 | YYYYMMDD 格式 | `20260329` |
| 文件扩展名 | 统一为 `.pdf` | `.pdf` |

### 特殊字符处理
```typescript
// 清理非法字符（Windows 文件名限制）
const cleanString = (str: string) => {
  return str
    .replace(/[\\/:*?"<>|]/g, '_')  // 非法字符转下划线
    .replace(/\s+/g, '_')            // 空格转下划线
    .substring(0, 50);               // 长度限制
};
```

---

## 🎨 用户自定义流程

### 前端交互设计

```
┌─────────────────────────────────────────┐
│  📥 下载简历                             │
├─────────────────────────────────────────┤
│                                         │
│  默认文件名：                            │
│  Java 开发工程师_张三_138****8000_20260329.pdf  │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ 自定义文件名（可选）：             │ │
│  │ [_______________________________] │ │
│  │                                   │ │
│  │ 💡 提示：不修改则使用默认文件名    │ │
│  └───────────────────────────────────┘ │
│                                         │
│     [取消]          [确认下载]          │
│                                         │
└─────────────────────────────────────────┘
```

### 技术实现

**1. 前端组件（DownloadDialog.tsx）**
```typescript
// frontend-web/src/components/DownloadDialog/index.tsx
interface DownloadDialogProps {
  candidate: Candidate;
  visible: boolean;
  onCancel: () => void;
  onConfirm: (customFileName?: string) => void;
}

const DownloadDialog: React.FC<DownloadDialogProps> = ({
  candidate,
  visible,
  onCancel,
  onConfirm,
}) => {
  const [customFileName, setCustomFileName] = useState('');

  // 生成默认文件名
  const defaultFileName = useMemo(() => {
    const position = cleanString(candidate.expectedPosition || '未填写');
    const name = cleanString(candidate.name);
    const phone = candidate.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    
    return `${position}_${name}_${phone}_${date}.pdf`;
  }, [candidate]);

  const handleConfirm = () => {
    const fileName = customFileName.trim() || defaultFileName;
    
    // 确保以.pdf 结尾
    const finalName = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;
    
    onConfirm(finalName);
  };

  return (
    <Modal visible={visible} title="下载简历" onCancel={onCancel}>
      <div className="download-dialog">
        <p className="default-name">
          默认文件名：{defaultFileName}
        </p>
        
        <div className="custom-input">
          <label>自定义文件名（可选）：</label>
          <Input
            value={customFileName}
            onChange={(e) => setCustomFileName(e.target.value)}
            placeholder="留空则使用默认文件名"
          />
          <p className="hint">💡 提示：不修改则使用默认文件名</p>
        </div>
        
        <div className="actions">
          <Button onClick={onCancel}>取消</Button>
          <Button type="primary" onClick={handleConfirm}>
            确认下载
          </Button>
        </div>
      </div>
    </Modal>
  );
};
```

**2. 后端导出服务（export.service.ts）**
```typescript
// backend/src/modules/export/export.service.ts
@Injectable()
export class ExportService {
  /**
   * 生成默认文件名（职位前置）
   */
  generateDefaultFileName(candidate: Candidate): string {
    const position = this.cleanString(candidate.expectedPosition || '未填写');
    const name = this.cleanString(candidate.name);
    const phone = candidate.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    
    return `${position}_${name}_${phone}_${date}.pdf`;
  }

  /**
   * 验证自定义文件名
   */
  validateCustomFileName(fileName: string): { valid: boolean; error?: string } {
    // 检查长度
    if (fileName.length > 100) {
      return { valid: false, error: '文件名过长（最大 100 字符）' };
    }

    // 检查非法字符
    if (/[\\/:*?"<>|]/.test(fileName)) {
      return { valid: false, error: '文件名包含非法字符' };
    }

    // 确保以.pdf 结尾
    if (!fileName.toLowerCase().endsWith('.pdf')) {
      return { valid: false, error: '文件名必须以.pdf 结尾' };
    }

    return { valid: true };
  }

  /**
   * 导出简历（统一 PDF 格式）
   */
  async exportToPdf(candidateId: string, customFileName?: string): Promise<ExportResult> {
    const candidate = await this.candidateRepo.findOne(candidateId);
    
    // 确定文件名
    const fileName = customFileName 
      ? this.validateCustomFileName(customFileName)
      : this.generateDefaultFileName(candidate);

    // 统一导出为 PDF
    const pdfBuffer = await this.pdfGenerator.generate(candidate);

    return {
      fileName,
      buffer: pdfBuffer,
      contentType: 'application/pdf',
    };
  }

  private cleanString(str: string): string {
    return str
      .replace(/[\\/:*?"<>|]/g, '_')
      .replace(/\s+/g, '_')
      .substring(0, 10);
  }
}
```

**3. 导出接口（export.controller.ts）**
```typescript
// backend/src/modules/export/export.controller.ts
@Controller('export')
export class ExportController {
  @Post('resumes/:id')
  async exportResume(
    @Param('id') id: string,
    @User() user: User,
    @Body('fileName') fileName?: string, // 可选的自定义文件名
  ) {
    // 检查下载频率限制
    await this.downloadLimitService.checkLimit(user.id);

    // 导出简历（统一 PDF）
    const result = await this.exportService.exportToPdf(id, fileName);

    // 记录下载日志
    await this.downloadLogService.record({
      userId: user.id,
      candidateId: id,
      fileName: result.fileName,
      ip: this.getRequestIp(),
    });

    // 返回文件
    return new Response(result.buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${result.fileName}"`,
      },
    });
  }
}
```

---

## ✅ 实施清单

### 后端任务
- [ ] 更新 `export.service.ts` 的 `generateDefaultFileName` 方法（职位前置）
- [ ] 添加 `validateCustomFileName` 方法（验证自定义文件名）
- [ ] 更新 `export.controller.ts` 支持可选的 `fileName` 参数
- [ ] 统一导出为 PDF 格式（移除 DOC/DOCX 支持）
- [ ] 编写测试脚本

### 前端任务
- [ ] 创建 `DownloadDialog` 组件（下载确认对话框）
- [ ] 更新 `TalentMarket/index.tsx` 调用下载对话框
- [ ] 移除 `BatchActionBar` 的下载按钮（已完成）
- [ ] 添加自定义输入框和默认文件名显示

### 测试任务
- [ ] 测试默认文件名生成（职位前置）
- [ ] 测试自定义文件名功能
- [ ] 测试文件名验证（非法字符、长度限制）
- [ ] 测试 PDF 导出格式

---

## 📊 优先级

| 任务 | 优先级 | 预计时间 | 状态 |
|------|--------|---------|------|
| 后端更新 | P0 | 20min | ⏳ 待执行 |
| 前端更新 | P0 | 30min | ⏳ 待执行 |
| 测试验证 | P1 | 10min | ⏳ 待执行 |

**总预计时间**: 60 分钟

---

## 🔗 相关文档

- `docs/TASK_UPDATE_RIGHT_GUARD.md` - 右护法任务更新
- `docs/TODAY_PROGRESS.md` - 今日进展

---

**文档位置**: `docs/EXPORT_SPEC_UPDATE.md`  
**最后更新**: 2026-03-29 00:42  
**下次更新**: 实施完成后
