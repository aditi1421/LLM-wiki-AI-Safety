# AI Safety Knowledge Base — Schema

## Purpose

This is an LLM-maintained knowledge base on **AI safety** — alignment, existential risk, AI governance, economic impacts of advanced AI, and the broader landscape of efforts to ensure transformative AI benefits humanity. The LLM writes and maintains all files under `wiki/`. The human curates raw sources and directs queries. The human never edits wiki files directly.

## Directory Layout

- `raw/` — Immutable source documents (PDFs converted to markdown, clipped articles, transcripts, notes). **Never modify files in raw/.**
- `wiki/index.md` — Master catalog. Every wiki page must appear here.
- `wiki/log.md` — Append-only activity log.
- `wiki/dashboard.md` — Live Dataview queries for Obsidian (low-confidence pages, orphans, recent activity).
- `wiki/analytics.md` — Charts View visualizations for Obsidian (page distribution, confidence, tags).
- `wiki/flashcards.md` — Spaced repetition cards for the Obsidian Spaced Repetition plugin.
- `wiki/concepts/` — Technical ideas, frameworks, and strategies (alignment, mesa-optimization, corrigibility).
- `wiki/entities/` — People, organizations, labs, and tools (Anthropic, Paul Christiano, MIRI).
- `wiki/sources/` — One summary page per raw source document (paper, article, book, transcript).
- `wiki/debates/` — Two or more competing positions on an open question.
- `wiki/synthesis/` — The user's own evolving views and cross-cutting analyses.
- `wiki/maps/` — High-level overview of a subfield or research cluster.
- `wiki/journal/` — Research session journal entries.
- `wiki/presentations/` — Marp slide decks generated from wiki content.

## File Naming

- All lowercase, hyphens for word separation: `mesa-optimization.md`
- No spaces, no special characters, no uppercase
- Name should match the page title slug
- Source pages: `{author-surname}-{year}-{short-title}.md` (e.g. `hubinger-2019-risks-learned-optimization.md`)
- Debate pages: descriptive question form: `is-rlhf-sufficient-for-alignment.md`
- Synthesis pages: prefix with user perspective: `my-take-on-scalable-oversight.md`
- Map pages: prefix with `map-`: `map-interpretability.md`
- Journal pages: date prefix: `2026-04-14-session-name.md`
- Presentation pages: descriptive: `ai-safety-landscape-overview.md`

## Page Format

Every wiki page uses YAML frontmatter. All page types share these fields:

```yaml
---
title: "Page Title"
type: concept | entity | source | debate | synthesis | map | journal
aliases: [alternate names]
tags: [tag1, tag2, tag3]
created: YYYY-MM-DD
updated: YYYY-MM-DD
sources: [source-page-slugs that inform this page]
related: [other-page-slugs]
status: stub | draft | mature
confidence: high | medium | low
---
```

### Additional Fields by Page Type

**Source pages** (`wiki/sources/`):

```yaml
authors: [Author Name, ...]
year: NNNN
source_type: paper | article | book | transcript | note
url: https://...
raw_file: raw/filename.md
```

**Entity pages** (`wiki/entities/`):

```yaml
entity_type: person | org | lab | tool
affiliation: [org names]
```

**Debate pages** (`wiki/debates/`):

```yaml
positions: [short labels for each side]
```

**Journal pages** (`wiki/journal/`):

```yaml
date: YYYY-MM-DD
concepts_used: [concept-slugs]
result: "one-line outcome"
```

### Required Sections by Page Type

**Source pages** (`wiki/sources/`):
- `## Key Points` — Bulleted list of main claims and contributions
- `## Relevant Concepts` — Links to concept pages this source touches
- `## Source Metadata` — Type of source, author/speaker, date, URL

**Concept pages** (`wiki/concepts/`):
- `## Definition` — One-paragraph plain-English definition
- `## How It Works` — Mechanics, process, or structure of the concept
- `## Key Parameters` — Important variables, dimensions, or factors
- `## Risks & Pitfalls` — Known failure modes, common mistakes, limitations
- `## Related Concepts` — Wiki links to related pages
- `## Sources` — Which raw sources inform this page

**Entity pages** (`wiki/entities/`):
- `## Overview` — What this entity is
- `## Characteristics` — Key properties, attributes, research focus
- `## Key Contributions` — Links to concept/source pages for work associated with this entity
- `## Related Entities` — Links to related entity pages

**Debate pages** (`wiki/debates/`):
- `## Positions` — Each named position with supporting arguments and sources
- `## Key Evidence` — What evidence supports or undermines each side
- `## Related Concepts` — Links to concept pages
- `## Sources` — Which raw sources inform this debate

**Synthesis pages** (`wiki/synthesis/`):
- `## Comparison` — Table or structured comparison
- `## Analysis` — Cross-cutting insights and the user's own reasoning
- `## Recommendations` — When to prefer which approach
- `## Pages Compared` — Links to all pages involved

**Map pages** (`wiki/maps/`):
- `## Landscape` — High-level overview of the subfield
- `## Key Concepts` — Links to concept pages in this cluster
- `## Key Debates` — Links to open questions
- `## Key Entities` — Links to people, orgs, and labs working in this area

**Journal pages** (`wiki/journal/`):
- `## Setup` — What you were investigating and why
- `## Process` — Steps taken, decisions made, links to concept pages
- `## Result` — Outcome and what you learned
- `## What Went Well` — Bulleted list
- `## What Could Improve` — Bulleted list

**Presentation pages** (`wiki/presentations/`):
- Use [Marp](https://marp.app/) markdown format
- `---` separates slides
- First slide: title, subtitle, date
- Content slides: draw from wiki concept/debate/map pages
- Final slide: sources and links

## Status Meanings

- `stub` — Placeholder, minimal content. Created when a concept is referenced but not yet the focus of an ingest.
- `draft` — Has real content but incomplete. Typical after first source that covers this topic.
- `mature` — Well-developed, multiple sources integrated, cross-references solid.

## Confidence Levels

- **high** — Well-established idea, multiple corroborating sources, demonstrated with concrete examples.
- **medium** — Supported by sources but limited examples or single substantive source.
- **low** — Single mention, anecdotal, or speculative. Needs more sources to strengthen.

## Linking Conventions

- Use Obsidian-style wiki links: `[[page-name]]` or `[[page-name|display text]]`
- Link liberally. Every mention of a concept, person, or org that has (or should have) a wiki page should be a wikilink.
- If a page doesn't exist yet, link to it anyway — Obsidian shows these as unresolved links, useful for finding gaps.
- Every page must link to at least one other page (no orphans).
- When mentioning a concept that has a page, always link it.

## Tagging Taxonomy

Tags provide a structured vocabulary for categorizing wiki pages. Every page should have 2-5 tags drawn from these categories.

- **Domain**: `alignment`, `governance`, `existential-risk`, `interpretability`, `robustness`, `fairness`, `economic-impact`, `arms-race`
- **Mechanism**: `mesa-optimization`, `reward-hacking`, `deceptive-alignment`, `corrigibility`, `scalable-oversight`, `value-learning`, `cooperative-ai`
- **Scale**: `narrow-ai`, `agi`, `superintelligence`, `transformative-ai`
- **Actor**: `state`, `corporation`, `lab`, `individual`, `open-source`
- **Scope**: `foundational`, `advanced`, `experimental`
- **Epistemics**: `well-established`, `emerging`, `speculative`, `contested`

## Workflows

### Ingest

When the user says "ingest [source]" or adds a file to `raw/`:

1. **Read the source.** Read the full file from `raw/`.
2. **Report to the user.** Give a brief summary (3-5 sentences): what the source is, its key contributions, and which wiki pages you plan to create or update. Wait for the user to approve or redirect before proceeding.
3. **Create/update pages:**
   - Create a **source page** in `wiki/sources/` with a structured summary: key claims, methodology, conclusions, and how it relates to other work in the wiki.
   - Create or update **concept pages** for every significant technical idea in the source. If the concept page exists, integrate the new source's perspective. If it contradicts existing content, note the contradiction explicitly with citations to both sides.
   - Create or update **entity pages** for authors and organizations.
   - Update any relevant **debate pages** — add the source's position to the appropriate side.
   - Update any relevant **map pages** if the source shifts the landscape.
   - For concepts mentioned but not central to this source, create `stub` pages with minimal content.
4. **Assign confidence.** Set confidence based on source coverage: `high` if multiple sources corroborate, `medium` if single substantive source, `low` if only mentioned in passing.
5. **Assign tags.** Use the tagging taxonomy above. Every page should have 2-5 tags.
6. **Update wiki-index.md.** Add entries for any new pages. Update statistics.
7. **Append to log.md.** Format:
   ```
   ## [YYYY-MM-DD] ingest | Source Title
   Source: raw/filename.md
   Pages created: page1, page2, page3
   Pages updated: page4, page5
   ```
8. **Update dashboard and analytics.** Refresh statistics in `wiki/analytics.md`.
9. **Commit.** Stage all changed files and commit with message: `ingest: {source title}`.

### Query

When the user asks a question about AI safety:

1. Read `wiki-index.md` to identify relevant pages.
2. Read those pages. Follow wikilinks if deeper context is needed.
3. Synthesize an answer grounded in wiki content. Use `[[wikilinks]]` as inline citations.
4. If the wiki lacks coverage, say so explicitly: "The wiki doesn't have much on X. Want me to create a stub, or do you have a source to ingest?"
5. If the answer is substantial and worth preserving, offer: "Want me to file this as a synthesis page?"

### Think/Write

When the user wants to develop their own ideas:

1. Read relevant wiki pages for context.
2. Have a back-and-forth with the user to develop the argument.
3. Write the result as a synthesis page in `wiki/synthesis/`.
4. Link to all supporting concepts and sources.
5. Update `wiki-index.md` and `log.md`.
6. Commit with message: `synthesis: {page title}`.

### Lint

When the user says "lint" or "health check":

1. Read all wiki pages.
2. Check for:
   - **Contradictions** — pages making conflicting claims without acknowledging the disagreement
   - **Stale stubs** — stubs that could be fleshed out from existing sources
   - **Orphans** — pages with no inbound links from other pages
   - **Missing pages** — concepts referenced via `[[wikilinks]]` that don't have pages yet
   - **Missing cross-references** — pages that should link to each other but don't
   - **Stale claims** — claims that newer sources have superseded
   - **Low-confidence pages** — pages that could be strengthened with existing sources
   - **Missing tags** — pages without tags or with tags outside the taxonomy
3. Fix what can be fixed automatically.
4. Report issues that need human judgment.
5. Suggest new sources or topics to investigate.
6. Append to `log.md`:
   ```
   ## [YYYY-MM-DD] lint | Health check
   Issues found: N
   Top issues: brief list
   ```
7. Update dashboard and analytics statistics.

## Quality Standards

- **Cite sources.** Every factual claim on a concept or entity page should trace back to a source page. Use format: `([[source-slug]])` after the claim.
- **Flag contradictions.** When sources disagree, don't silently pick a side. Note the disagreement explicitly and link to both source pages.
- **Maintain neutrality on concept/entity/source pages.** These are reference material. The user's own views go in synthesis pages.
- **Keep summaries concise.** Source pages should be 200-500 words. Concept pages grow with sources but stay focused. No filler.
- **Update timestamps.** When modifying a page, update the `updated` field in frontmatter.
- **Assign confidence honestly.** When in doubt, set confidence to `low` and note the uncertainty.

## PDF Conversion

To convert a PDF to markdown before ingesting:
```bash
node convert-pdf.mjs path/to/paper.pdf
```
This creates a markdown file in `raw/`. Then ingest it normally.

## Rules

1. **Never** modify files in `raw/`. They are immutable sources of truth.
2. **Always** update `wiki-index.md` when creating new pages.
3. **Always** append to `log.md` on ingest, filed query, or lint.
4. **Always** use wikilinks `[[page-name]]` when referencing other wiki pages.
5. **Always** include frontmatter on every wiki page.
6. **Always** include `confidence` and `tags` fields in frontmatter.
7. **Always** commit after completing an ingest, filing a synthesis page, or lint pass.
8. When in doubt about whether to create a new page or update an existing one, check the index first.
9. Prefer updating existing pages over creating duplicates.
10. Keep pages focused — one concept per page, split if a page gets too long.
11. Use plain English — define jargon on first use in each page.
12. All dates in ISO 8601 format: YYYY-MM-DD.
13. When a source provides specific examples, include them with concrete details.
