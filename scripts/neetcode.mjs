// Pulls NeetCode submissions from the GitHub repo NeetCode's "GitHub Sync" writes to,
// and resolves each problem to its LeetCode metadata. Writes data/neetcode.json.
//
//   npm run neetcode
//
// Dates come from per-submission commits ("Add: <slug> - submission-<n>"). Files that
// arrived in a "Bulk sync" commit have no real date, so they're stored as null.
import { readFile, writeFile } from "node:fs/promises";
import { question, sleep } from "./lc.mjs";

const REPO = process.env.NEETCODE_REPO ?? "2004Snehal/neetcode-submissions";
const FILE = new URL("../data/neetcode.json", import.meta.url);
const MAP = JSON.parse(await readFile(new URL("../data/neetcode-map.json", import.meta.url), "utf8"));
const LANG = { cpp: "cpp", py: "python3", java: "java", js: "javascript", ts: "typescript", c: "c", go: "golang", rs: "rust", cs: "csharp", kt: "kotlin", swift: "swift" };

async function gh(path) {
  const headers = { accept: "application/vnd.github+json", "user-agent": "dsa-tracker" };
  if (process.env.GITHUB_TOKEN) headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const res = await fetch(`https://api.github.com/repos/${REPO}/${path}`, { headers });
  if (!res.ok) throw new Error(`GitHub ${res.status} on ${path}: ${(await res.text()).slice(0, 200)}`);
  return res.json();
}

// 1. Every submission file: <topic>/<slug>/submission-<n>.<ext>
const tree = await gh("git/trees/HEAD?recursive=1");
const files = new Map();
for (const { path, type } of tree.tree) {
  const m = type === "blob" && path.match(/^[^/]+\/([^/]+)\/submission-(\d+)\.(\w+)$/);
  if (!m) continue;
  const [, slug, n, ext] = m;
  if (!files.has(slug)) files.set(slug, []);
  files.get(slug).push({ path, n: Number(n), ext });
}

// 2. Dates from per-submission commit messages.
const dates = new Map(); // slug -> ISO dates of its Add commits
for (let page = 1; ; page++) {
  const commits = await gh(`commits?per_page=100&page=${page}`);
  for (const c of commits) {
    const m = c.commit.message.match(/^Add: (\S+) - submission-\d+/);
    if (m) dates.set(m[1], [...(dates.get(m[1]) ?? []), c.commit.author.date]);
  }
  if (commits.length < 100) break;
}

// 3. Resolve each problem, reusing cached metadata/code when nothing changed.
const cache = new Map();
try {
  for (const p of JSON.parse(await readFile(FILE, "utf8"))) cache.set(p.ncSlug, p);
} catch {}

const out = [];
for (const [ncSlug, subs] of [...files].sort()) {
  subs.sort((a, b) => a.n - b.n);
  const latest = subs.at(-1);
  const lcSlug = MAP[ncSlug] ?? ncSlug;
  const prev = cache.get(ncSlug);
  const d = (dates.get(ncSlug) ?? []).sort();

  let meta = prev?.lcSlug === lcSlug ? prev : null;
  if (!meta) {
    const q = await question(lcSlug);
    await sleep(300);
    if (!q) {
      console.warn(`! ${ncSlug}: no LeetCode problem "${lcSlug}". Add it to data/neetcode-map.json`);
      continue;
    }
    meta = { id: Number(q.questionFrontendId), title: q.title, difficulty: q.difficulty, tags: q.topicTags.map((t) => t.slug) };
  }

  let solution = prev?.solution?.file === latest.path ? prev.solution : null;
  if (!solution) {
    const url = `https://raw.githubusercontent.com/${REPO}/HEAD/${latest.path.split("/").map(encodeURIComponent).join("/")}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`raw ${res.status} on ${latest.path}`);
    solution = { file: latest.path, lang: LANG[latest.ext] ?? latest.ext, code: await res.text() };
  }

  out.push({
    ncSlug,
    lcSlug,
    id: meta.id,
    title: meta.title,
    difficulty: meta.difficulty,
    tags: meta.tags,
    firstSolvedAt: d[0] ?? null,
    lastSolvedAt: d.at(-1) ?? null,
    submissions: latest.n + 1,
    accepted: subs.length,
    solution,
  });
  if (!prev) console.log(`added: ${ncSlug} -> ${meta.id}. ${meta.title}`);
}

await writeFile(FILE, JSON.stringify(out, null, 2) + "\n");
console.log(`${out.length} NeetCode problems`);
