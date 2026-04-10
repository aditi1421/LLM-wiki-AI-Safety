# AI Safety Wiki

A personal research wiki on AI safety, built using the [LLM Wiki](https://x.com/karpathy/status/1909382594482061490) pattern — where an LLM incrementally builds and maintains a structured, interlinked knowledge base from raw sources.

You curate sources and ask questions. The LLM does all the grunt work — summarizing, cross-referencing, filing, and bookkeeping.

## How It Works

```
Raw Sources (you collect)  →  LLM (Claude Code)  →  Wiki (markdown pages)
   papers, articles,            reads, summarizes,       concepts, entities,
   transcripts, notes           cross-references         debates, synthesis
```

**Three layers:**

- **`raw/`** — Immutable source files. Papers, articles, transcripts. The LLM reads these but never modifies them.
- **`wiki/`** — LLM-generated and LLM-maintained markdown pages. Structured summaries, concept pages, debate trackers, and your own synthesis. This is the persistent, compounding artifact.
- **`CLAUDE.md`** — The schema. Teaches the LLM how to maintain the wiki — page types, frontmatter conventions, ingest workflows, quality standards.

## Page Types

| Type | What It Captures |
|------|-----------------|
| **Concept** | Technical ideas and frameworks — alignment, mesa-optimization, corrigibility |
| **Entity** | People, organizations, and labs — Anthropic, Paul Christiano, MIRI |
| **Source** | Summary of one ingested paper, article, or book |
| **Debate** | Competing positions on an open question |
| **Synthesis** | Your own evolving views and analysis |
| **Map** | High-level overview of a subfield |

Every page has YAML frontmatter and uses `[[wikilinks]]` for cross-references, making it compatible with Obsidian's graph view and backlinks.

## Workflows

### Ingest
Drop a source into `raw/` and tell the LLM to process it. It reads the source, reports key takeaways, then creates/updates 5-15 wiki pages — source summaries, concept pages, entity pages, debate positions. One source enriches the entire wiki.

### Query
Ask a question. The LLM reads the index, finds relevant pages, and synthesizes an answer grounded in wiki content with citations. If the answer is valuable, it can be filed back as a synthesis page.

### Lint
Periodic health check. Finds contradictions, stale stubs, orphan pages, missing cross-references, and concepts that need their own page.

## Getting Started

### Prerequisites
- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) (or any LLM agent that reads `CLAUDE.md`)
- Node.js 18+ (for PDF conversion)
- [Obsidian](https://obsidian.md/) (optional — for graph view and browsing)

### Setup

```bash
git clone https://github.com/aditi1421/LLM-wiki-AI-Safety.git
cd LLM-wiki-AI-Safety
npm install
```

Open Claude Code in this directory. The `CLAUDE.md` schema is loaded automatically.

### Your First Ingest

1. Add a source to `raw/` (or convert a PDF):
   ```bash
   node convert-pdf.mjs ~/papers/some-paper.pdf
   ```

2. Tell Claude Code:
   > "Ingest raw/some-paper.md"

3. The LLM reads the source, reports what it found, and — with your approval — creates wiki pages, updates the index, and commits.

### Browsing with Obsidian

Open this folder as a vault in Obsidian. Press `Cmd+G` for the graph view. Filter to `path:wiki OR file:index` for a clean view of just wiki pages.

## The Pattern

This wiki implements [Andrej Karpathy's LLM Wiki concept](https://x.com/karpathy/status/1909382594482061490): instead of retrieving from raw documents at query time (RAG), the LLM **compiles** knowledge once into a persistent wiki and keeps it current. Cross-references are already there. Contradictions are already flagged. The synthesis already reflects everything ingested.

The key insight: LLMs handle the tedious part of knowledge management — updating cross-references, maintaining consistency, noting contradictions across dozens of pages. The wiki stays maintained because the cost of maintenance is near zero.

> "Obsidian is the IDE; the LLM is the programmer; the wiki is the codebase."

## Current Coverage

The wiki is in its early stages. Current sources and topics include:

- **The Intelligence Curse** (Drago, 2025) — AGI as resource rather than tool, rentier state dynamics, economic displacement
- Concepts: intelligence curse, resource curse, rentier states, economic displacement by AI, intent alignment
- Debates: Will AGI benefit ordinary people?

## Contributing

This is a personal research wiki, but the pattern is reusable. Fork it, replace the sources and schema with your own domain, and build your own LLM Wiki.

## License

MIT
