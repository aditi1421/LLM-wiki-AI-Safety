# AI Safety LLM Wiki — Design Spec

**Date:** 2026-04-10
**Domain:** AI Safety Research
**Pattern:** LLM Wiki (Karpathy)
**Status:** Approved

---

## Overview

A standalone git repo of interlinked markdown files, maintained by Claude Code, browsed in Obsidian. The LLM incrementally builds and maintains a persistent wiki — structured summaries, entity pages, concept pages, debate trackers, and personal synthesis — that compounds with every source ingested and every question asked.

No infrastructure beyond markdown, git, and a CLAUDE.md schema file.

## Goals

1. **Structured reference** — map the AI safety field: concepts, researchers, orgs, key papers, and how they connect
2. **Thesis-building** — develop and refine personal views on AI safety over time, grounded in sources
3. **Practical application** — connect AI safety knowledge to real engineering work (building safer AI systems)

## Architecture

Three layers:

- **Raw sources** (`raw/`) — immutable input files. Papers (converted to markdown), clipped articles, book chapters, transcripts, personal notes. The LLM reads from these but never modifies them.
- **The wiki** (`wiki/`) — LLM-generated and LLM-maintained markdown pages. The persistent, compounding artifact.
- **The schema** (`CLAUDE.md`) — teaches the LLM the wiki's conventions, page types, workflows, and quality standards.

## Directory Structure

```
ai-safety-wiki/
├── .obsidian/           # Obsidian config (auto-created when vault is opened)
├── raw/                 # Immutable source files
│   └── assets/          # Images downloaded from sources
├── wiki/                # LLM-maintained pages
│   ├── concepts/        # Technical ideas and frameworks
│   ├── entities/        # People, orgs, labs
│   ├── sources/         # One summary per ingested source
│   ├── debates/         # Competing positions on open questions
│   ├── synthesis/       # Your own evolving views and analysis
│   └── maps/            # High-level overviews of subfields
├── index.md             # Master catalog of all wiki pages (LLM-maintained)
├── log.md               # Chronological record of operations
├── CLAUDE.md            # The schema
├── convert-pdf.mjs      # PDF to markdown conversion script
└── .gitignore
```

## Page Types

| Type | Purpose | Example |
|------|---------|---------|
| **concept** | A technical idea or framework | `alignment.md`, `mesa-optimization.md`, `corrigibility.md` |
| **entity** | A person, org, or lab | `anthropic.md`, `paul-christiano.md`, `miri.md` |
| **source** | Summary of one ingested paper/article/book/transcript | `amodei-2016-concrete-problems.md` |
| **debate** | Two or more competing positions on a question | `is-rlhf-sufficient-for-alignment.md` |
| **synthesis** | Your own evolving views and analysis | `my-take-on-scalable-oversight.md` |
| **map** | High-level overview of a subfield or cluster | `map-interpretability.md` |

## Frontmatter

Every wiki page has YAML frontmatter for Obsidian and Dataview compatibility.

**Standard frontmatter (all page types):**

```yaml
---
type: concept
title: Mesa-Optimization
aliases: [inner alignment, mesa-optimizer]
created: 2026-04-10
updated: 2026-04-10
sources: [hubinger-2019-risks-learned-optimization]
related: [alignment, deceptive-alignment, objective-robustness]
status: stub           # stub | draft | mature
---
```

**Source pages get additional fields:**

```yaml
---
type: source
title: "Risks from Learned Optimization in Advanced ML Systems"
authors: [Evan Hubinger, Chris van Merwijk, Vladimir Mikulik, Joar Skalse, Scott Garrabrant]
year: 2019
source_type: paper     # paper | article | book | transcript | note
url: https://arxiv.org/abs/1906.01820
raw_file: raw/hubinger-2019-risks-learned-optimization.md
tags: [mesa-optimization, inner-alignment, deceptive-alignment]
created: 2026-04-10
updated: 2026-04-10
---
```

**Status progression:**
- **stub** — page exists, minimal content (placeholder created during ingest)
- **draft** — has real content but may be incomplete
- **mature** — well-developed, multiple sources integrated

## Linking Convention

Obsidian wikilinks throughout: `[[alignment]]`, `[[paul-christiano]]`. This powers Obsidian's graph view and backlinks panel. The LLM uses wikilinks whenever referencing another wiki page.

## Workflows

### Ingest

Triggered when a new source is added to `raw/`.

1. **Convert** (if needed) — PDFs converted to markdown via `convert-pdf.mjs`. Web articles clipped or pasted. Notes dropped directly as `.md`.
2. **Report** — LLM reads the source and gives a brief summary: key contributions, which pages will be created/updated. User approves or redirects.
3. **Write/update pages** — LLM creates a source summary page, creates or updates concept pages, entity pages, and any relevant debate or map pages. Contradictions with existing wiki content are noted explicitly.
4. **Bookkeeping** — update `index.md` with new pages, append entry to `log.md`.

A single source typically touches 5-15 wiki pages.

### Query

Triggered when you ask a question.

1. LLM reads `index.md` to find relevant pages
2. Reads those pages, follows links if needed
3. Synthesizes an answer with `[[wikilinks]]` as citations
4. If the wiki has a gap, says so and suggests creating a stub or finding a source
5. If the answer is valuable, offers to file it as a synthesis page

### Think/Write

Triggered when you want to develop your own ideas.

1. LLM pulls relevant wiki context
2. Back-and-forth conversation to develop the argument
3. Writes result as a synthesis page in `wiki/synthesis/`
4. Links to supporting concepts and sources

Synthesis pages are first-class — other pages link to them, future ingests can update them.

### Lint

Triggered on demand ("lint the wiki").

Checks for:
- Contradictions between pages
- Stubs that should be fleshed out
- Orphan pages (no inbound links)
- Concepts mentioned but lacking their own page
- Stale claims superseded by newer sources
- Missing cross-references

Reports a punch list to work through together.

## Obsidian Setup

1. Open `~/ai-safety-wiki/` as a vault in Obsidian
2. Settings → Files and links → set "Attachment folder path" to `raw/assets/`
3. Obsidian auto-creates `.obsidian/` config

**What you get:**
- Graph view — see how concepts, sources, entities, and debates connect
- Backlinks panel — click any page, see everything that references it
- Live updates — as Claude edits files, Obsidian refreshes in real time

**Optional plugins (later):**
- Dataview — dynamic tables from frontmatter (e.g. "all papers from 2024", "all stubs")
- Graph Analysis — find clusters and central nodes

## Index and Log

**`index.md`** — content-oriented catalog. Every wiki page listed with a link, one-line summary, and metadata. Organized by page type. LLM updates on every ingest. Used as the entry point for queries.

**`log.md`** — chronological, append-only. Records ingests, queries, lint passes with consistent format:

```markdown
## [2026-04-10] ingest | Risks from Learned Optimization
Source: raw/hubinger-2019-risks-learned-optimization.md
Pages created: mesa-optimization, deceptive-alignment, objective-robustness
Pages updated: alignment, inner-alignment
```

## PDF Conversion

A `convert-pdf.mjs` script in the repo root. Takes a PDF path, outputs markdown to `raw/`. Uses a PDF-to-text library (e.g. `pdf-parse`). The converted markdown preserves headings, paragraphs, and structure as much as possible. Images are extracted to `raw/assets/` where feasible.

## Git

The wiki is a git repo. Every ingest, lint pass, or significant edit gets committed. This gives:
- Full version history of the wiki's evolution
- Ability to diff what changed on any ingest
- Branching if you want to explore alternative synthesis directions

## Future Upgrades (Not in Scope Now)

- **Search server** — MCP-based semantic search when wiki outgrows the index (~100+ pages)
- **Dataview queries** — dynamic tables once frontmatter is rich enough
- **Marp slide decks** — generate presentations from wiki content
- **Batch ingest** — process multiple sources at once with less supervision
