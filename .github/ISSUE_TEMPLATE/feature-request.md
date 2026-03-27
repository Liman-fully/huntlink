---
name: "✨ 功能需求"
description: "提出一个新功能或改进建议"
title: "[Feature]: "
labels: ["enhancement", "triage"]
body:
  - type: markdown
    attributes:
      value: |
        感谢你的建议！请详细描述你的需求。
  - type: input
    id: summary
    attributes:
      label: "功能概述"
      description: "用一句话描述这个功能"
      placeholder: "例如：添加简历批量导出功能"
    validations:
      required: true
  - type: textarea
    id: problem
    attributes:
      label: "相关问题"
      description: "这个功能解决了什么问题？"
    validations:
      required: true
  - type: textarea
    id: proposal
    attributes:
      label: "功能方案"
      description: "你希望如何实现这个功能？"
    validations:
      required: true
  - type: textarea
    id: alternatives
    attributes:
      label: "替代方案"
      description: "有没有其他可行的方案？"
  - type: textarea
    id: context
    attributes:
      label: "补充信息"
      description: "任何额外的背景信息、设计稿、参考链接等"
