# AI Safety Wiki — Schema

You are maintaining a personal research wiki on AI safety. This file defines the conventions, page types, and workflows you must follow.

## Architecture

- `raw/` — immutable source files (PDFs converted to markdown, clipped articles, transcripts, notes). NEVER modify files in raw/.
- `wiki/` — LLM-maintained pages. You own this directory. Create, update, and interlink pages here.
- `index.md` — master catalog of all wiki pages. Update on every ingest.
- `log.md` — chronological operation log. Append on every ingest, filed query, or lint pass.

## Page Types

| Type | Directory | Purpose |
|------|-----------|---------|
| concept | `wiki/concepts/` | A technical idea or framework (alignment, mesa-optimization, corrigibility) |
| entity | `wiki/entities/` | A person, org, or lab (Anthropic, Paul Christiano, MIRI) |
| source | `wiki/sources/` | Summary of one ingested paper, article, book, or transcript |
| debate | `wiki/debates/` | Two or more competing positions on an open question |
| synthesis | `wiki/synthesis/` | The user's own evolving views and analysis |
| map | `wiki/maps/` | High-level overview of a subfield or research cluster |

## Filename Conventions

- Lowercase, hyphenated: `mesa-optimization.md`, `paul-christiano.md`
- Source pages: `{author-surname}-{year}-{short-title}.md` (e.g. `hubinger-2019-risks-learned-optimization.md`)
- Debate pages: descriptive question form: `is-rlhf-sufficient-for-alignment.md`
- Synthesis pages: prefix with user perspective: `my-take-on-scalable-oversight.md`
- Map pages: prefix with `map-`: `map-interpretability.md`

## Frontmatter

Every wiki page MUST have YAML frontmatter.

**All page types:**

```yaml
---
type: concept | entity | source | debate | synthesis | map
title: Human-Readable Title
aliases: [alternate names]
created: YYYY-MM-DD
updated: YYYY-MM-DD
sources: [source-page-slugs that inform this page]
related: [other-page-slugs]
status: stub | draft | mature
---
```

**Additional fields for source pages:**

```yaml
authors: [Author Name, ...]
year: NNNN
source_type: paper | article | book | transcript | note
url: https://...
raw_file: raw/filename.md
tags: [topic-tags]
```

**Additional fields for entity pages:**

```yaml
entity_type: person | org | lab
affiliation: [org names]
```

**Additional fields for debate pages:**

```yaml
positions: [short labels for each side]
```

**Status meanings:**
- `stub` — placeholder, minimal content. Created when a concept is referenced but not yet the focus of an ingest.
- `draft` — has real content but incomplete. Typical after first source that covers this topic.
- `mature` — well-developed, multiple sources integrated, cross-references solid.

## Linking

Use Obsidian wikilinks: `[[page-name]]` or `[[page-name|display text]]`.

Link liberally. Every mention of a concept, person, or org that has (or should have) a wiki page should be a wikilink. If a page doesn't exist yet, link to it anyway — Obsidian shows these as unresolved links, which is useful for finding gaps.

## Workflows

### Ingest

When the user asks you to ingest a source (or drops a file in `raw/`):

1. **Read the source.** Read the full file from `raw/`.
2. **Report to the user.** Give a brief summary (3-5 sentences): what the source is, its key contributions, and which wiki pages you plan to create or update. Wait for the user to approve or redirect before proceeding.
3. **Create/update pages:**
   - Create a **source page** in `wiki/sources/` with a structured summary: key claims, methodology, conclusions, and how it relates to other work in the wiki.
   - Create or update **concept pages** for every significant technical idea in the source. If the concept page exists, integrate the new source's perspective. If it contradicts existing content, note the contradiction explicitly with citations to both sides.
   - Create or update **entity pages** for authors and organizations.
   - Update any relevant **debate pages** — add the source's position to the appropriate side.
   - Update any relevant **map pages** if the source shifts the landscape.
   - For concepts mentioned but not central to this source, create `stub` pages with minimal content.
4. **Update index.md.** Add entries for any new pages. Each entry: `- [[page-name]] — one-line summary`.
5. **Append to log.md.** Format:
   ```
   ## [YYYY-MM-DD] ingest | Source Title
   Source: raw/filename.md
   Pages created: page1, page2, page3
   Pages updated: page4, page5
   ```
6. **Commit.** Stage all changed files and commit with message: `ingest: {source title}`.

### Query

When the user asks a question about AI safety:

1. Read `index.md` to identify relevant pages.
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
5. Update `index.md` and `log.md`.
6. Commit with message: `synthesis: {page title}`.

### Lint

When the user says "lint the wiki" or "health check":

1. Read `index.md` and scan all wiki pages.
2. Check for:
   - **Contradictions** — pages making conflicting claims without acknowledging the disagreement
   - **Stale stubs** — stubs that could be fleshed out from existing sources
   - **Orphans** — pages with no inbound links from other pages
   - **Missing pages** — concepts referenced via `[[wikilinks]]` that don't have pages yet
   - **Missing cross-references** — pages that should link to each other but don't
   - **Stale claims** — claims that newer sources have superseded
3. Report a prioritized punch list.
4. Append to `log.md`:
   ```
   ## [YYYY-MM-DD] lint | Health check
   Issues found: N
   Top issues: brief list
   ```

## Quality Standards

- **Cite sources.** Every factual claim on a concept or entity page should trace back to a source page. Use format: `([[source-slug]])` after the claim.
- **Flag contradictions.** When sources disagree, don't silently pick a side. Note the disagreement explicitly and link to both source pages.
- **Maintain neutrality on concept/entity/source pages.** These are reference material. The user's own views go in synthesis pages.
- **Keep summaries concise.** Source pages should be 200-500 words. Concept pages grow with sources but stay focused. No filler.
- **Update timestamps.** When modifying a page, update the `updated` field in frontmatter.

## PDF Conversion

To convert a PDF to markdown before ingesting:
```bash
node convert-pdf.mjs path/to/paper.pdf
```
This creates a markdown file in `raw/`. Then ingest it normally.

## Important Rules

1. NEVER modify files in `raw/`. They are immutable sources of truth.
2. ALWAYS update `index.md` when creating new pages.
3. ALWAYS append to `log.md` on ingest, filed query, or lint.
4. ALWAYS use wikilinks `[[page-name]]` when referencing other wiki pages.
5. ALWAYS include frontmatter on every wiki page.
6. ALWAYS commit after completing an ingest, filing a synthesis page, or lint pass.
7. When in doubt about whether to create a new page or update an existing one, check the index first.
