---
name: "🐛 Bug 报告"
description: "报告一个 Bug 帮助我们改进"
title: "[Bug]: "
labels: ["bug", "triage"]
body:
  - type: markdown
    attributes:
      value: |
        感谢你的反馈！请尽可能详细地描述问题。
  - type: input
    id: description
    attributes:
      label: "Bug 描述"
      description: "简要描述问题"
      placeholder: "例如：登录时点击按钮没有反应"
    validations:
      required: true
  - type: textarea
    id: reproduction
    attributes:
      label: "复现步骤"
      description: "如何复现这个 Bug？"
      placeholder: |
        1. 打开 '...'
        2. 点击 '....'
        3. 滚动到 '....'
        4. 发现问题
    validations:
      required: true
  - type: textarea
    id: expected
    attributes:
      label: "期望行为"
      description: "你期望发生什么？"
    validations:
      required: true
  - type: textarea
    id: actual
    attributes:
      label: "实际行为"
      description: "实际发生了什么？"
    validations:
      required: true
  - type: input
    id: environment
    attributes:
      label: "环境信息"
      description: "浏览器/操作系统/设备"
      placeholder: "Chrome 120 / Windows 11 / 桌面"
  - type: input
    id: version
    attributes:
      label: "版本号"
      description: "Git commit hash 或版本号"
  - type: textarea
    id: logs
    attributes:
      label: "日志/截图"
      description: "如有错误日志或截图，请粘贴"
      render: shell
