# 5 分钟快速闭环流程

> **版本**: V5.0  
> **生效时间**: 2026-03-28  
> **适用范围**: 全体 Agent

---

## ⏱️ 5 分钟时间分配

```
0:00 - 收到任务
  ↓
0:00-0:30   思考（第一性原理）
  ↓
0:30-1:00   技能检查（强制搜索）
  ↓
1:00-3:00   全速开发
  ↓
3:00-4:00   测试
  ↓
4:00-4:30   同步（更新任务看板）
  ↓
4:30-5:00   闭环（提交 + 通知）
```

---

## 📋 详细流程

### 1. 收到任务（0:00）

**输入**: 任务描述  
**输出**: 任务理解

**检查清单**:
- [ ] 任务目标明确
- [ ] 交付物清晰
- [ ] 约束条件已知

---

### 2. 思考（0:00-0:30）

**方法**: 第一性原理

**思考框架**:
```
1. 问题的本质是什么？
2. 有没有现成的解决方案？
3. 最优路径是什么？
4. 潜在风险有哪些？
```

**输出**: 解决方案草图

---

### 3. 技能检查（0:30-1:00）

**强制规则**:
- ⚠️ **必须搜索技能**
- ⚠️ **禁止不搜索就开发**
- ⏱️ **时间上限：30 秒**

**检查流程**:
```bash
# 1. 搜索技能
npx skills search <关键词>

# 2. 对比已安装技能
npx skills list

# 3. 安装最优技能（如需要）
npx skills add <owner/repo@skill> -g -y

# 4. 更新技能库
编辑 docs/SKILLS_KNOWLEDGE_BASE.md
```

**输出**: 技能选择决策

---

### 4. 全速开发（1:00-3:00）

**原则**:
- ✅ 专注核心功能
- ✅ 避免过度设计
- ✅ 使用最佳实践

**输出**: 可工作的代码

---

### 5. 测试（3:00-4:00）

**测试清单**:
- [ ] 功能测试通过
- [ ] TypeScript 编译通过
- [ ] ESLint 检查通过
- [ ] 无安全漏洞

**输出**: 测试报告

---

### 6. 同步（4:00-4:30）

**同步内容**:
```json
{
  "taskId": "任务 ID",
  "status": "completed",
  "agentId": "Agent ID",
  "codeCommit": "提交 hash",
  "testResult": "通过/失败",
  "skillsUsed": ["技能列表"],
  "experience": "经验沉淀"
}
```

**同步渠道**:
- 更新 `.task-board.json`
- 推送广播通知
- 记录工作记忆

---

### 7. 闭环（4:30-5:00）

**闭环动作**:
```bash
# 1. 提交代码
git add .
git commit -m "feat: 任务完成"
git push origin master

# 2. 通知相关人员
发送通知（P1/P2）

# 3. 更新任务状态
.task-board.json 标记为 completed

# 4. 记录经验
.workbuddy/memory/YYYY-MM-DD.md
```

**输出**: 任务完成报告

---

## 🚨 防重复造轮子机制

### 任务锁定

```typescript
// 领取任务
async function claimTask(taskId: string, agentId: string) {
  const task = getTask(taskId);
  
  // 检查是否已被锁定
  if (task.locked && task.assignee !== agentId) {
    throw new Error(`任务已被 ${task.assignee} 锁定！`);
  }
  
  // 锁定任务
  task.locked = true;
  task.assignee = agentId;
  task.startedAt = new Date().toISOString();
  
  // 广播通知
  broadcast({
    type: 'TASK_LOCKED',
    taskId,
    agentId
  });
}
```

### 实时看板

**位置**: `.task-board.json`

**更新频率**: 实时

**查看命令**:
```bash
# 查看当前任务
cat .task-board.json | jq '.tasks[] | select(.status == "in-progress")'

# 查看我的任务
cat .task-board.json | jq '.tasks[] | select(.assignee == "我的 Agent ID")'
```

---

## 📊 监控指标

| 指标 | 目标值 | 监控方式 |
|------|--------|---------|
| 闭环时间 | ≤5 分钟 | 任务时间戳 |
| 技能使用率 | 100% | 技能检查日志 |
| 测试通过率 | 100% | 测试报告 |
| 同步及时率 | 100% | 任务看板更新 |
| 重复开发率 | 0% | 任务锁定检查 |

---

## 🎯 成功标准

**单个任务成功**:
- ✅ 5 分钟内完成
- ✅ 使用了技能
- ✅ 测试通过
- ✅ 已同步
- ✅ 经验沉淀

**团队成功**:
- ✅ 无重复造轮子
- ✅ 信息实时同步
- ✅ 技能库持续更新
- ✅ 日清日毕

---

**版本**: V5.0  
**维护者**: 左护法（协作架构师）  
**生效时间**: 2026-03-28
