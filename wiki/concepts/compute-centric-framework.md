---
type: concept
title: Compute-Centric Framework
aliases: [compute-centric model, Bio Anchors framework]
created: 2026-04-10
updated: 2026-04-10
sources: [davidson-2023-compute-centric-takeoff]
related: [ai-takeoff-speeds, intelligence-explosion, superintelligence]
status: draft
confidence: medium
tags: [agi, transformative-ai, advanced, emerging]
---

# Compute-Centric Framework

A framework for forecasting AI capabilities and timelines in which progress is modeled as a function of three factors: training compute, algorithmic efficiency, and hardware improvement. Originated with the Bio Anchors report (Ajeya Cotra, Open Philanthropy) and extended by Davidson ([[davidson-2023-compute-centric-takeoff]]).

## The Three-Factor Model

1. **Compute required** — How many FLOP are needed to train AGI given current algorithms. This is a probability distribution, not a point estimate.
2. **Algorithmic progress** — Rate at which new ideas reduce training requirements. Davidson models this via semi-endogenous growth models rather than assuming steady exponential improvement.
3. **Training run scale** — Rate at which compute used on training runs grows, driven by better hardware and more spending.

AGI arrives when algorithmic progress and training run scale together exceed the compute threshold.

## Davidson's Extensions

Two major additions to the Bio Anchors framework:

**1. Endogenous growth dynamics.** Progress in hardware and algorithms responds to investment, which accelerates as AGI approaches. This replaces Bio Anchors' assumption of steady exponential growth.

**2. Pre-AGI automation effects.** AI systems automating economic and R&D tasks before AGI creates feedback loops — AI helps develop better AI, shortening timelines. Measured via the "effective FLOP gap" between 20%-AI and 100%-AI.

## Key Metric: Effective FLOP

"Effective FLOP" combines raw compute with algorithmic efficiency. As algorithms improve, the same computation achieves more. Davidson estimates effective compute on training runs could rise 5-100X per year during the takeoff period.

## Limitations

- Treats AI capabilities as scaling continuously with compute — may miss qualitative breakthroughs
- The framework is a model, not a prediction — results are sensitive to parameter choices
- Doesn't capture all forms of discontinuity in AI progress
