#!/usr/bin/env node

// Usage: node convert-pdf.mjs <path-to-pdf> [--output <filename>]
// Converts a PDF to markdown and saves it in raw/
// Example: node convert-pdf.mjs ~/papers/hubinger-2019.pdf
// Output:  raw/hubinger-2019.md

import { readFile, writeFile } from "node:fs/promises";
import { basename, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { PDFParse } from "pdf-parse";

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
  const parser = new PDFParse({ data: buffer });
  const [textResult, infoResult] = await Promise.all([
    parser.getText(),
    parser.getInfo(),
  ]);

  const title = infoResult.info?.Title || basename(resolvedPath, ".pdf");
  const numpages = textResult.total;

  const markdown = [
    `# ${title}`,
    "",
    `> Converted from PDF on ${new Date().toISOString().split("T")[0]}`,
    `> Pages: ${numpages}`,
    "",
    "---",
    "",
    structureText(textResult.text),
  ].join("\n");

  await writeFile(outputPath, markdown, "utf-8");
  console.log(`Written: ${outputPath}`);
  console.log(`Pages: ${numpages}`);
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
