import fs from "fs";
import path from "path";

type Heading = { level: number; text: string; anchor: string };

type SectionSummary = {
  section: string;
  title: string;
  routes: string[];
  entities: string[];
};

type SectionData = {
  dir: string;
  summary: SectionSummary;
  headings: Heading[];
  changelog: string[];
};

function listSectionDirs(root: string): string[] {
  if (!fs.existsSync(root)) {
    return [];
  }
  return fs
    .readdirSync(root)
    .filter(entry => fs.statSync(path.join(root, entry)).isDirectory())
    .sort((a, b) => a.localeCompare(b));
}

function loadSummary(filePath: string): SectionSummary {
  const raw = fs.readFileSync(filePath, "utf8");
  const summary = JSON.parse(raw);
  return {
    section: summary.section,
    title: summary.title,
    routes: summary.routes,
    entities: summary.entities,
  };
}

function parseHeadings(content: string): Heading[] {
  const lines = content.split(/\r?\n/);
  const headings: Heading[] = [];
  for (const line of lines) {
    const match = /^(#{1,6})\s+(.*)$/.exec(line.trim());
    if (!match) continue;
    const level = match[1].length;
    if (level < 1) continue;
    const text = match[2].trim();
    const anchor = slugify(text);
    headings.push({ level, text, anchor });
  }
  return headings;
}

function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function extractChangelog(content: string): string[] {
  const lines = content.split(/\r?\n/);
  const changelogIndex = lines.findIndex(line => line.trim().toLowerCase().startsWith("# 14. changelog"));
  if (changelogIndex === -1) return [];
  const entries: string[] = [];
  for (let i = changelogIndex + 1; i < lines.length; i += 1) {
    const line = lines[i];
    if (/^#/.test(line.trim())) {
      break;
    }
    const match = /^-\s+(.*)$/.exec(line.trim());
    if (match) {
      entries.push(match[1].trim());
    }
  }
  return entries.slice(0, 3);
}

function buildMaster(sections: SectionData[]): string {
  const now = new Date().toISOString();
  const lines: string[] = [];
  lines.push("# Master Master Index");
  lines.push(`_Last updated: ${now}_`);
  lines.push("");
  lines.push("## Table of Contents");
  sections.forEach(section => {
    const sectionAnchor = slugify(section.summary.title);
    lines.push(`- [${section.summary.title}](#${sectionAnchor})`);
    section.headings
      .filter(heading => heading.level === 1 || heading.level === 2)
      .forEach(heading => {
        const link = `docs/sections/${section.dir}/MASTER.md#${heading.anchor}`;
        lines.push(`  - [${heading.text}](${link})`);
      });
  });
  lines.push("");

  sections.forEach(section => {
    lines.push(`## ${section.summary.title}`);
    lines.push(`**Routes:** ${section.summary.routes.join(", ")}`);
    const primaryEntities = section.summary.entities.slice(0, 3);
    lines.push(`**Primary entities:** ${primaryEntities.join(", ")}`);
    lines.push("");
    lines.push("### Headings");
    section.headings.forEach(heading => {
      const link = `docs/sections/${section.dir}/MASTER.md#${heading.anchor}`;
      const indent = "  ".repeat(Math.max(0, heading.level - 1));
      lines.push(`${indent}- [${heading.text}](${link})`);
    });
    lines.push("");
    lines.push("### Latest Changelog");
    if (section.changelog.length === 0) {
      lines.push("- _No entries_");
    } else {
      section.changelog.forEach(entry => {
        lines.push(`- ${entry}`);
      });
    }
    lines.push("");
  });

  return lines.join("\n");
}

function main() {
  const sectionsRoot = path.join(process.cwd(), "docs", "sections");
  const masterPath = path.join(process.cwd(), "docs", "MASTER_MASTER.md");
  const sectionDirs = listSectionDirs(sectionsRoot);
  const sections: SectionData[] = sectionDirs.map(dir => {
    const summaryPath = path.join(sectionsRoot, dir, "summary.json");
    const masterPathLocal = path.join(sectionsRoot, dir, "MASTER.md");
    const summary = loadSummary(summaryPath);
    const content = fs.readFileSync(masterPathLocal, "utf8");
    const headings = parseHeadings(content);
    const changelog = extractChangelog(content);
    return { dir, summary, headings, changelog };
  });
  const output = buildMaster(sections);
  const current = fs.existsSync(masterPath) ? fs.readFileSync(masterPath, "utf8") : "";
  if (current !== output) {
    fs.writeFileSync(masterPath, output, "utf8");
  }
}

main();
