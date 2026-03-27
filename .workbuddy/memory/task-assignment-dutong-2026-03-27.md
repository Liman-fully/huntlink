# 右护法 → 都统 任务分配单

**分配时间**: 2026-03-27 19:13  
**分配人**: 右护法（镇抚司主官）  
**接收人**: 都统（神机营主官）

---

## 任务清单

### P0 - 紧急任务

#### 1. 人才广场 API 实现

**优先级**: P0（最高）  
**预计时间**: 2 小时  
**截止时间**: 21:30

**需求详情**:
- 实现 GET /talents 接口
- 支持 20+ 筛选维度（location, experience, education, skills, company, expectedSalary, jobStatus 等）
- 支持分页（page, pageSize）
- 响应时间 < 500ms
- Swagger 文档完整

**技术实现**:
```typescript
// GET /talents?location=北京&experience=3-5 年&education=本科&page=1&pageSize=20
@Get('talents')
async getTalents(@Query() query: TalentFilterDto) {
  return this.talentService.getTalents(query);
}
```

**DTO 设计**:
```typescript
export class TalentFilterDto {
  @IsOptional()
  location?: string;
  
  @IsOptional()
  experience?: string;
  
  @IsOptional()
  education?: string;
  
  @IsOptional()
  skills?: string;
  
  @IsOptional()
  company?: string;
  
  @IsOptional()
  expectedSalary?: string;
  
  @IsOptional()
  page?: number = 1;
  
  @IsOptional()
  pageSize?: number = 20;
}
```

**验收标准**:
- [ ] API 接口实现
- [ ] 筛选功能正常
- [ ] 分页功能正常
- [ ] 响应时间 < 500ms
- [ ] Swagger 文档可访问
- [ ] TypeScript 编译通过

**文件位置**:
- `backend/src/modules/talent/talent.controller.ts`
- `backend/src/modules/talent/talent.service.ts`
- `backend/src/modules/talent/dto/talent.dto.ts`

---

### P1 - 重要任务

#### 2. 搜索性能优化

**优先级**: P1  
**预计时间**: 3 小时  
**截止时间**: 22:30

**需求详情**:
- 当前搜索响应时间：3 秒
- 目标响应时间：< 1 秒
- 优化倍数：3 倍+

**技术方案**:
1. **数据库查询优化**
   - 分析 SQL 执行计划（EXPLAIN）
   - 添加必要索引（location, experience, education 等）
   - 避免 N+1 查询

2. **缓存策略**
   - 热门搜索词缓存（Redis）
   - 查询结果缓存（5 分钟 TTL）

3. **Elasticsearch（可选）**
   - 如果 MySQL 优化不达标，考虑引入 ES

**验收标准**:
- [ ] 搜索响应时间 < 1 秒
- [ ] 数据库索引优化完成
- [ ] Redis 缓存实现
- [ ] 性能测试报告

**文件位置**:
- `backend/src/modules/talent/talent.service.ts`
- `backend/src/modules/search/` (可选新建)

---

#### 3. 简历批量导出

**优先级**: P1  
**预计时间**: 4 小时  
**截止时间**: 23:30

**需求详情**:
- 支持 PDF 格式导出
- 支持 Excel 格式导出
- 支持批量选择（10+ 简历）
- 异步任务处理

**技术方案**:
1. **安装依赖**
   ```bash
   npm install pdfkit exceljs
   npm install --save-dev @types/pdfkit
   ```

2. **API 设计**
   ```typescript
   // POST /resumes/export
   @Post('export')
   async exportResumes(
     @Body() body: { resumeIds: string[]; format: 'pdf' | 'excel' },
     @Request() req
   ) {
     return this.resumeService.exportResumes(
       req.user.id,
       body.resumeIds,
       body.format
     );
   }
   ```

3. **异步处理**
   - 使用队列处理导出任务
   - 返回任务 ID
   - GET /export/status/:id 查询进度

**验收标准**:
- [ ] PDF 导出功能正常
- [ ] Excel 导出功能正常
- [ ] 支持批量选择（10+ 简历）
- [ ] 异步任务处理
- [ ] 导出进度查询

**文件位置**:
- `backend/src/modules/resume/resume.controller.ts`
- `backend/src/modules/resume/resume.service.ts`
- `backend/src/modules/export/` (可选新建)

---

## 协作流程

### 1. 任务确认
都统收到任务后，在 `.ai-collab-status.md` 中回复确认。

### 2. 开发流程
```bash
# 创建功能分支
git checkout -b feature/talent-api

# 开发功能
# ... 编写代码 ...

# 自测
cd backend && ./node_modules/.bin/tsc --noEmit

# 提交代码
git add .
git commit -m "feat: 实现人才广场 API"

# 推送
git push origin feature/talent-api
```

### 3. 代码审查
提交后 @右护法 进行代码审查。

### 4. 合并部署
审查通过后合并到 master，自动部署。

---

## 联系方式

**协作文档**: `.ai-collab-status.md`  
**经验沉淀**: `.workbuddy/memory/YYYY-MM-DD.md`  
**Git 仓库**: https://github.com/Liman-fully/huntlink

---

## 时间线

```
19:13 ─ 右护法分配任务
19:30 ─ 都统确认任务（预期）
21:30 ─ 人才广场 API 完成（预期）
22:30 ─ 搜索性能优化完成（预期）
23:30 ─ 简历批量导出完成（预期）
```

---

**右护法** | 镇抚司主官  
分配时间：2026-03-27 19:13

**请都统确认任务分配，如有问题随时沟通！**
