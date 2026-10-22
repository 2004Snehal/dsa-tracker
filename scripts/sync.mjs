// Appends new accepted LeetCode problems to data/problems.json.
//
//   npm run sync        recent 20 accepted (public; adds code if a session cookie is set)
//   npm run backfill    every solved problem (needs LEETCODE_SESSION + LEETCODE_CSRF)
import { readFile, writeFile } from "node:fs/promises";
import * as lc from "./lc.mjs";

const FILE = new URL("../data/problems.json", import.meta.url);
const full = process.argv.includes("--full") || process.env.npm_lifecycle_event === "backfill";
const username = process.env.LEETCODE_USERNAME;
if (!username) throw new Error("LEETCODE_USERNAME is not set");
if (full && !lc.authed) throw new Error("backfill needs LEETCODE_SESSION and LEETCODE_CSRF");

const iso = (t) => new Date(Number(t) * 1000).toISOString();
const byslug = new Map();
try {
  for (const p of JSON.parse(await readFile(FILE, "utf8"))) byslug.set(p.slug, p);
} catch {}

// Slugs to (re)fetch, with the latest accepted timestamp seen in the public feed.
const todo = new Map();
if (full) {
  for (const slug of await lc.solvedSlugs()) todo.set(slug, null);
} else {
  for (const { titleSlug, timestamp } of await lc.recentAccepted(username)) {
    const known = byslug.get(titleSlug);
    if (known && iso(timestamp) <= known.lastSolvedAt) continue;
    const ts = todo.get(titleSlug);
    if (!ts || timestamp > ts) todo.set(titleSlug, timestamp);
  }
}

for (const [slug, recentTs] of todo) {
  const prev = byslug.get(slug);
  const q = await lc.question(slug);
  await lc.sleep(300);
  const p = {
    id: Number(q.questionFrontendId),
    slug,
    title: q.title,
    difficulty: q.difficulty,
    tags: q.topicTags.map((t) => t.slug),
    firstSolvedAt: prev?.firstSolvedAt ?? iso(recentTs),
    lastSolvedAt: iso(recentTs ?? 0),
    submissions: prev?.submissions ?? 1,
    accepted: (prev?.accepted ?? 0) + 1,
    solution: prev?.solution ?? null,
  };
  if (lc.authed) {
    const subs = await lc.submissions(slug);
    const ac = subs.filter((s) => s.statusDisplay === "Accepted").sort((a, b) => a.timestamp - b.timestamp);
    if (ac.length) {
      p.firstSolvedAt = iso(ac[0].timestamp);
      p.lastSolvedAt = iso(ac.at(-1).timestamp);
      p.submissions = subs.length;
      p.accepted = ac.length;
      if (p.solution?.submissionId !== ac.at(-1).id) p.solution = await lc.submissionDetail(ac.at(-1).id);
    }
    await lc.sleep(300);
  }
  byslug.set(slug, p);
  console.log(`${prev ? "updated" : "added"}: ${p.id}. ${p.title}`);
}

const problems = [...byslug.values()].sort((a, b) => b.firstSolvedAt.localeCompare(a.firstSolvedAt));
await writeFile(FILE, JSON.stringify(problems, null, 2) + "\n");
console.log(`${todo.size} changed, ${problems.length} total`);
