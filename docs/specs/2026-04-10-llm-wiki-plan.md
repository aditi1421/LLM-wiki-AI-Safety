# AI Safety LLM Wiki — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the full scaffolding for a Claude Code-maintained AI safety research wiki — directory structure, CLAUDE.md schema, PDF converter, index/log, .gitignore, and Obsidian config — so that the user can immediately start ingesting sources and querying.

**Architecture:** A standalone git repo at `~/ai-safety-wiki/`. The "app" is the CLAUDE.md schema file that teaches the LLM how to maintain the wiki. Supporting files: a PDF-to-markdown converter script, seed index/log files, and Obsidian vault config. No server, no database, no build step.

**Tech Stack:** Node.js (mjs), `pdf-parse` (PDF extraction), Obsidian (viewer), Git (version control), Markdown + YAML frontmatter.

---

## File Structure

| File | Responsibility |
|------|---------------|
| `CLAUDE.md` | Schema — all conventions, page types, frontmatter specs, workflow instructions |
| `convert-pdf.mjs` | CLI script: takes PDF path, outputs structured markdown to `raw/` |
| `package.json` | Dependencies (`pdf-parse`) |
| `index.md` | Master catalog of all wiki pages, organized by type |
| `log.md` | Chronological append-only operation log |
| `.gitignore` | Ignore `.obsidian/`, `node_modules/`, OS files |
| `.obsidian/app.json` | Obsidian vault settings (attachment path, wikilinks) |
| `raw/.gitkeep` | Ensure raw/ exists in git |
| `raw/assets/.gitkeep` | Ensure assets dir exists |
| `wiki/concepts/.gitkeep` | Ensure dir exists |
| `wiki/entities/.gitkeep` | Ensure dir exists |
| `wiki/sources/.gitkeep` | Ensure dir exists |
| `wiki/debates/.gitkeep` | Ensure dir exists |
| `wiki/synthesis/.gitkeep` | Ensure dir exists |
| `wiki/maps/.gitkeep` | Ensure dir exists |

---

### Task 1: Directory Structure and .gitignore

**Files:**
- Create: `raw/.gitkeep`, `raw/assets/.gitkeep`, `wiki/concepts/.gitkeep`, `wiki/entities/.gitkeep`, `wiki/sources/.gitkeep`, `wiki/debates/.gitkeep`, `wiki/synthesis/.gitkeep`, `wiki/maps/.gitkeep`
- Create: `.gitignore`

- [ ] **Step 1: Create all directories with .gitkeep files**

```bash
cd ~/ai-safety-wiki
mkdir -p raw/assets wiki/concepts wiki/entities wiki/sources wiki/debates wiki/synthesis wiki/maps
touch raw/.gitkeep raw/assets/.gitkeep wiki/concepts/.gitkeep wiki/entities/.gitkeep wiki/sources/.gitkeep wiki/debates/.gitkeep wiki/synthesis/.gitkeep wiki/maps/.gitkeep
```

- [ ] **Step 2: Create .gitignore**

Write `.gitignore`:

```
# Obsidian
.obsidian/

# Node
node_modules/

# OS
.DS_Store
Thumbs.db

# Temporary
*.tmp
```

- [ ] **Step 3: Commit**

```bash
git add .gitignore raw/ wiki/
git commit -m "scaffold: directory structure and .gitignore"
```

---

### Task 2: Obsidian Vault Config

**Files:**
- Create: `.obsidian/app.json`

- [ ] **Step 1: Create Obsidian config**

Create `.obsidian/app.json` — this pre-configures the vault so Obsidian uses wikilinks and stores attachments in `raw/assets/`:

```json
{
  "useMarkdownLinks": false,
  "attachmentFolderPath": "raw/assets",
  "newFileLocation": "current",
  "showUnsupportedFiles": false,
  "alwaysUpdateLinks": true
}
```

Note: `.obsidian/` is gitignored because Obsidian writes workspace state and plugin caches there. But we create this seed config so the user doesn't have to configure manually. The user should:
1. Open `~/ai-safety-wiki/` as a vault in Obsidian
2. The `app.json` will be picked up automatically

Since `.obsidian/` is gitignored, this file won't be tracked after the initial setup. That's fine — it's a one-time seed.

- [ ] **Step 2: Verify Obsidian can open the vault**

Manual step for the user: Open Obsidian → "Open folder as vault" → select `~/ai-safety-wiki/`. Confirm it opens without errors and that Settings → Files and links shows "Attachment folder path" as `raw/assets`.

---

### Task 3: Index and Log Files

**Files:**
- Create: `index.md`
- Create: `log.md`

- [ ] **Step 1: Create index.md**

Write `index.md`:

```markdown
# Wiki Index

Master catalog of all pages. Updated by Claude on every ingest.

---

## Concepts

_No pages yet._

## Entities

_No pages yet._

## Sources

_No pages yet._

## Debates

_No pages yet._

## Synthesis

_No pages yet._

## Maps

_No pages yet._
```

- [ ] **Step 2: Create log.md**

Write `log.md`:

```markdown
# Wiki Log

Chronological record of all operations — ingests, queries filed, lint passes.

---

## [2026-04-10] init | Wiki initialized
Empty wiki scaffolded. Ready for first source ingest.
```

- [ ] **Step 3: Commit**

```bash
git add index.md log.md
git commit -m "add: empty index and log files"
```

---

### Task 4: PDF Conversion Script

**Files:**
- Create: `package.json`
- Create: `convert-pdf.mjs`

- [ ] **Step 1: Initialize package.json and install pdf-parse**

```bash
cd ~/ai-safety-wiki
npm init -y
npm install pdf-parse
```

Then edit `package.json` to set `"type": "module"` (for ESM imports):

```json
{
  "name": "ai-safety-wiki",
  "version": "1.0.0",
  "type": "module",
  "description": "AI safety research wiki maintained by Claude Code",
  "dependencies": {
    "pdf-parse": "^1.1.1"
  }
}
```

- [ ] **Step 2: Write convert-pdf.mjs**

Write `convert-pdf.mjs`:

```javascript
#!/usr/bin/env node

// Usage: node convert-pdf.mjs <path-to-pdf> [--output <filename>]
// Converts a PDF to markdown and saves it in raw/
// Example: node convert-pdf.mjs ~/papers/hubinger-2019.pdf
// Output:  raw/hubinger-2019.md

import { readFile, writeFile } from "node:fs/promises";
import { basename, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import pdf from "pdf-parse/lib/pdf-parse.js";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const RAW_DIR = resolve(__dirname, "raw");

function usage() {
  console.log("Usage: node convert-pdf.mjs <path-to-pdf> [--output <filename>]");
  console.log("");
  console.log("Converts a PDF to markdown and saves it in raw/");
  console.log("");
  console.log("Options:");
  console.log("  --output <name>  Output filename (without .md extension)");
  console.log("");
  console.log("Examples:");
  console.log("  node convert-pdf.mjs ~/papers/hubinger-2019.pdf");
  console.log("  node convert-pdf.mjs paper.pdf --output hubinger-2019-risks");
  process.exit(1);
}

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/\.pdf$/i, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function structureText(rawText) {
  // Clean up common PDF artifacts
  const lines = rawText.split("\n");
  const cleaned = [];

  for (const line of lines) {
    const trimmed = line.trim();
    // Skip empty lines in sequence (collapse to single blank line)
    if (trimmed === "" && cleaned.length > 0 && cleaned[cleaned.length - 1] === "") {
      continue;
    }
    cleaned.push(trimmed);
  }

  return cleaned.join("\n").trim();
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) usage();

  let pdfPath = null;
  let outputName = null;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--output" && i + 1 < args.length) {
      outputName = args[++i];
    } else if (!pdfPath) {
      pdfPath = args[i];
    } else {
      usage();
    }
  }

  if (!pdfPath) usage();

  const resolvedPath = resolve(pdfPath);
  const slug = outputName || slugify(basename(resolvedPath));
  const outputPath = resolve(RAW_DIR, `${slug}.md`);

  console.log(`Reading: ${resolvedPath}`);

  const buffer = await readFile(resolvedPath);
  const data = await pdf(buffer);

  const markdown = [
    `# ${data.info?.Title || basename(resolvedPath, ".pdf")}`,
    "",
    `> Converted from PDF on ${new Date().toISOString().split("T")[0]}`,
    `> Pages: ${data.numpages}`,
    "",
    "---",
    "",
    structureText(data.text),
  ].join("\n");

  await writeFile(outputPath, markdown, "utf-8");
  console.log(`Written: ${outputPath}`);
  console.log(`Pages: ${data.numpages}`);
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
```

- [ ] **Step 3: Test the script with a sample PDF**

If a PDF is available:
```bash
node convert-pdf.mjs ~/some-paper.pdf
cat raw/some-paper.md | head -20
```

If no PDF available, test the help output:
```bash
node convert-pdf.mjs
```

Expected: prints usage instructions and exits with code 1.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json convert-pdf.mjs
git commit -m "add: PDF to markdown conversion script"
```

---

### Task 5: CLAUDE.md Schema

**Files:**
- Create: `CLAUDE.md`

This is the most important file in the repo — it teaches Claude Code how to maintain the wiki.

- [ ] **Step 1: Write CLAUDE.md**

Write `CLAUDE.md`:

```markdown
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
```

- [ ] **Step 2: Read it back and verify completeness against the spec**

Check that CLAUDE.md covers every requirement from the design spec:
- [x] Page types (all 6)
- [x] Directory structure
- [x] Frontmatter specs (standard + source-specific + entity + debate)
- [x] Linking conventions (wikilinks)
- [x] Ingest workflow (all 6 steps)
- [x] Query workflow (all 5 steps)
- [x] Think/write workflow (all 5 steps)
- [x] Lint workflow (all checks)
- [x] Quality standards
- [x] PDF conversion instructions
- [x] Immutability of raw/
- [x] Index and log maintenance
- [x] Git commit conventions

- [ ] **Step 3: Commit**

```bash
git add CLAUDE.md
git commit -m "add: CLAUDE.md schema — wiki conventions, workflows, quality standards"
```

---

### Task 6: Final Commit and Verification

- [ ] **Step 1: Verify full directory structure**

```bash
find ~/ai-safety-wiki -not -path '*/.git/*' -not -path '*/node_modules/*' | sort
```

Expected output should show:
```
ai-safety-wiki/
├── .gitignore
├── .obsidian/app.json
├── CLAUDE.md
├── convert-pdf.mjs
├── docs/specs/2026-04-10-llm-wiki-design.md
├── index.md
├── log.md
├── package.json
├── package-lock.json
├── raw/.gitkeep
├── raw/assets/.gitkeep
├── wiki/concepts/.gitkeep
├── wiki/entities/.gitkeep
├── wiki/sources/.gitkeep
├── wiki/debates/.gitkeep
├── wiki/synthesis/.gitkeep
├── wiki/maps/.gitkeep
```

- [ ] **Step 2: Verify convert-pdf.mjs runs**

```bash
cd ~/ai-safety-wiki && node convert-pdf.mjs
```

Expected: usage message, exit code 1.

- [ ] **Step 3: Verify CLAUDE.md is readable by Claude Code**

Open a new Claude Code session in `~/ai-safety-wiki/` and confirm CLAUDE.md is loaded. Ask: "What page types does this wiki have?" — should answer from the schema.

- [ ] **Step 4: User opens vault in Obsidian**

Manual step: Open Obsidian → "Open folder as vault" → `~/ai-safety-wiki/`. Confirm:
- Attachment folder path is `raw/assets`
- `index.md` and `log.md` are visible
- Graph view shows the two files (minimal, but working)

---

## Done

After all tasks complete, the wiki is ready for use. The user can:
1. Drop a PDF into `raw/` (or run `node convert-pdf.mjs paper.pdf`)
2. Open Claude Code in `~/ai-safety-wiki/` and say "ingest raw/paper-name.md"
3. Browse the results in Obsidian
4. Ask questions, develop synthesis, run lint checks
