# 分布式进度同步系统

> **版本**: V1.0  
> **创建时间**: 2026-03-28  
> **目的**: 多设备协作，实时同步，避免冲突

---

## 🏗️ 架构设计

### 文件结构

```
docs/progress/
├── SUMMARY.md                    # 总进度汇总（自动合并）
├── devices/                      # 设备进度（每人一个）
│   ├── device-A-都统.md         # 设备 A 的进度
│   ├── device-B-右护法.md       # 设备 B 的进度
│   └── device-C-新人.md         # 设备 C 的进度
└── broadcasts/                   # 进度广播（实时通知）
    ├── 2026-03-28-09-00.md      # 09:00 的广播
    ├── 2026-03-28-09-05.md      # 09:05 的广播
    └── ...
```

### 同步流程

```
设备 A 开发
    ↓
更新 docs/progress/devices/device-A.md
    ↓
广播到 docs/progress/broadcasts/时间戳.md
    ↓
自动合并到 docs/progress/SUMMARY.md
    ↓
其他设备收到广播 → git pull → 看到最新进度
```

---

## 📋 使用指南

### 新人加入

**步骤 1: 查看总进度**
```bash
cat docs/progress/SUMMARY.md
```

**步骤 2: 查看各设备进度**
```bash
ls docs/progress/devices/
cat docs/progress/devices/device-*.md
```

**步骤 3: 查看最新广播**
```bash
ls -lt docs/progress/broadcasts/ | head -5
cat docs/progress/broadcasts/最新时间戳.md
```

**步骤 4: 创建自己的进度文件**
```bash
# 生成设备指纹
DEVICE_ID="device-$(hostname)-$(whoami)"

# 创建进度文件
cat > docs/progress/devices/$DEVICE_ID.md << EOF
# $DEVICE_ID 进度

**加入时间**: $(date)
**今日目标**: [填写]

## 当前任务
- [ ] 任务 1

## 最新进展
- $(date +%H:%M) 开始任务 1
EOF

# 提交
git add docs/progress/devices/$DEVICE_ID.md
git commit -m "progress: $DEVICE_ID 加入"
git push origin master
```

**步骤 5: 订阅广播**
```bash
# 每 5 分钟自动拉取
while true; do
  git pull origin master
  sleep 300
done
```

---

### 开发中同步

**每 5 分钟自动同步**：
```bash
# 脚本：scripts/auto-sync.sh
#!/bin/bash

DEVICE_ID="device-$(hostname)-$(whoami)"
PROGRESS_FILE="docs/progress/devices/$DEVICE_ID.md"

# 更新进度
echo "**$(date +%H:%M)** 开发中..." >> $PROGRESS_FILE

# 广播进度
BROADCAST_FILE="docs/progress/broadcasts/$(date +%Y-%m-%d-%H-%M).md"
cat > $BROADCAST_FILE << EOF
# 进度广播

**设备**: $DEVICE_ID
**时间**: $(date)
**进展**: [填写当前进展]
**下一步**: [填写下一步]
EOF

# 提交
git add $PROGRESS_FILE $BROADCAST_FILE
git commit -m "progress: $DEVICE_ID 进展"
git push origin master

echo "✅ 进度已同步"
```

**自动执行**：
```bash
# 每 5 分钟执行一次
*/5 * * * * /path/to/scripts/auto-sync.sh
```

---

### 离开前同步

**检查清单**：
```bash
# 脚本：scripts/before-leave.sh
#!/bin/bash

DEVICE_ID="device-$(hostname)-$(whoami)"
PROGRESS_FILE="docs/progress/devices/$DEVICE_ID.md"

echo "🚨 离开前检查..."

# 1. 检查代码是否 push
if [ -n "$(git status --porcelain)" ]; then
  echo "❌ 代码未 push，请先提交"
  exit 1
fi

# 2. 更新进度
echo "**$(date +%H:%M)** 离开，下次同步：[时间]" >> $PROGRESS_FILE

# 3. 广播离开
BROADCAST_FILE="docs/progress/broadcasts/$(date +%Y-%m-%d-%H-%M)-leave.md"
cat > $BROADCAST_FILE << EOF
# 离开广播

**设备**: $DEVICE_ID
**时间**: $(date)
**状态**: 离开
**下次同步**: [时间]
**当前进度**: [填写]
**待办事项**: [填写]
EOF

# 4. 提交
git add $PROGRESS_FILE $BROADCAST_FILE
git commit -m "progress: $DEVICE_ID 离开"
git push origin master

echo "✅ 离开同步完成"
```

---

## 📊 进度查看

### 查看总进度

```bash
cat docs/progress/SUMMARY.md
```

**内容**：
```markdown
# 总进度汇总

**最后更新**: 2026-03-28 21:30
**活跃设备**: 3

## 设备 A（都统）
- 最新进展：开发功能 X
- 状态：🟡 进行中
- 最后同步：21:30

## 设备 B（右护法）
- 最新进展：审查代码
- 状态：🟡 进行中
- 最后同步：21:25

## 设备 C（新人）
- 最新进展：熟悉项目
- 状态：🟢 在线
- 最后同步：21:28
```

### 查看特定设备进度

```bash
cat docs/progress/devices/device-A-都统.md
```

### 查看最新广播

```bash
# 查看最近 5 条广播
ls -lt docs/progress/broadcasts/ | head -5

# 查看最新广播
cat $(ls -t docs/progress/broadcasts/ | head -1)
```

---

## 🚨 防掉线机制

### 心跳检测

**每 5 分钟心跳**：
```bash
# 脚本：scripts/heartbeat.sh
#!/bin/bash

DEVICE_ID="device-$(hostname)-$(whoami)"
HEARTBEAT_FILE="docs/progress/heartbeats/$DEVICE_ID.heartbeat"

# 更新心跳
echo "$(date)" > $HEARTBEAT_FILE

# 提交
git add $HEARTBEAT_FILE
git commit -m "heartbeat: $DEVICE_ID"
git push origin master
```

**监控脚本**：
```bash
# 脚本：scripts/monitor-heartbeats.sh
#!/bin/bash

THRESHOLD=15  # 15 分钟无心跳视为掉线

for heartbeat in docs/progress/heartbeats/*.heartbeat; do
  DEVICE_ID=$(basename $heartbeat .heartbeat)
  LAST_UPDATE=$(cat $heartbeat)
  
  # 计算时间差
  CURRENT_TIME=$(date +%s)
  LAST_TIME=$(date -d "$LAST_UPDATE" +%s)
  DIFF=$(( (CURRENT_TIME - LAST_TIME) / 60 ))
  
  if [ $DIFF -gt $THRESHOLD ]; then
    echo "🚨 $DEVICE_ID 掉线（${DIFF}分钟无心跳）"
    # 广播掉线通知
    cat > docs/progress/broadcasts/$(date +%Y-%m-%d-%H-%M)-offline.md << EOF
# 掉线通知

**设备**: $DEVICE_ID
**最后心跳**: $LAST_UPDATE
**掉线时长**: ${DIFF}分钟
**状态**: 🔴 掉线
EOF
  fi
done
```

---

## 📋 最佳实践

### 实践 1: 设备命名规范

**格式**：`device-[设备名]-[用户名]`

**示例**：
- `device-macbook-都统`
- `device-pc-右护法`
- `device-laptop-新人`

### 实践 2: 广播频率

- **开发中**: 每 5 分钟广播一次
- **完成任务**: 立即广播
- **遇到问题**: 立即广播
- **离开**: 立即广播

### 实践 3: 进度更新

**简洁原则**：
```markdown
## 21:30
- 开始开发功能 X

## 21:35
- 完成功能 X 的 50%

## 21:40
- 完成功能 X，开始测试
```

### 实践 4: 冲突解决

**如果多人同时编辑**：
```bash
# 1. git pull 获取最新
git pull origin master

# 2. 手动合并冲突
# 编辑冲突文件，保留双方内容

# 3. 提交合并
git add .
git commit -m "merge: 合并进度冲突"
git push origin master
```

---

## 📊 监控面板

### 活跃设备

| 设备 | 最后心跳 | 状态 | 当前任务 |
|------|---------|------|---------|
| device-macbook-都统 | 21:30 | 🟢 在线 | 功能 X |
| device-pc-右护法 | 21:25 | 🟢 在线 | 代码审查 |
| device-laptop-新人 | 21:28 | 🟢 在线 | 熟悉项目 |

### 今日广播统计

| 时间 | 设备 | 类型 | 内容 |
|------|------|------|------|
| 21:30 | 都统 | 进展 | 完成功能 X |
| 21:25 | 右护法 | 进展 | 开始审查 |
| 21:20 | 新人 | 加入 | 加入项目 |

---

**文档位置**: `docs/PROGRESS_SYSTEM.md`  
**版本**: V1.0  
**最后更新**: 2026-03-28  
**维护者**: 协调者
