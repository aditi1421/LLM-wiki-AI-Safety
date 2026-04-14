---
title: "Analytics"
type: dashboard
tags: [meta]
updated: 2026-04-14
---

# Analytics

Visual analytics powered by the [Charts View](https://github.com/caronchen/obsidian-chartsview-plugin) Obsidian plugin.

## Page Distribution by Type

```chartsview
type: pie
options:
  legend:
    display: true
    position: right
data:
  - label: Concepts
    value: 10
  - label: Entities
    value: 0
  - label: Sources
    value: 3
  - label: Debates
    value: 2
  - label: Maps
    value: 1
  - label: Syntheses
    value: 0
```

## Confidence Distribution

```chartsview
type: bar
options:
  legend:
    display: false
  indexAxis: y
data:
  - label: High
    value: 3
    backgroundColor: "#4caf50"
  - label: Medium
    value: 8
    backgroundColor: "#ff9800"
  - label: Low
    value: 5
    backgroundColor: "#f44336"
```

## Top Tags

```chartsview
type: wordcloud
options:
  maxRotation: 0
  minRotation: 0
data:
  - tag: economic-impact
    value: 7
  - tag: existential-risk
    value: 5
  - tag: agi
    value: 8
  - tag: foundational
    value: 9
  - tag: well-established
    value: 5
  - tag: superintelligence
    value: 4
  - tag: alignment
    value: 1
  - tag: governance
    value: 2
  - tag: emerging
    value: 3
  - tag: contested
    value: 3
  - tag: speculative
    value: 2
  - tag: transformative-ai
    value: 3
```
