// Pulls accepted Codeforces submissions from the public API and writes data/codeforces.json.
//
//   npm run codeforces
//
// One request (user.status) returns the full submission history, so every run is a full
// rebuild. Solution code is not included: the API doesn't return it and submission pages
// sit behind Cloudflare.
import { writeFile } from "node:fs/promises";

const HANDLE = process.env.CODEFORCES_HANDLE ?? "freakedcoder";
const FILE = new URL("../data/codeforces.json", import.meta.url);

const res = await fetch(`https://codeforces.com/api/user.status?handle=${encodeURIComponent(HANDLE)}`);
const body = await res.json().catch(() => null);
if (body?.status !== "OK") throw new Error(`Codeforces ${res.status}: ${body?.comment ?? "bad response"}`);

const iso = (t) => new Date(t * 1000).toISOString();
const byKey = new Map(); // "2258C" -> submissions for that problem

for (const s of body.result) {
  const { contestId, index } = s.problem;
  if (!contestId) continue; // problemset-only (acmsguru) problems have no stable URL
  const key = `${contestId}${index}`;
  if (!byKey.has(key)) byKey.set(key, []);
  byKey.get(key).push(s);
}

const out = [];
for (const [key, subs] of byKey) {
  const ac = subs.filter((s) => s.verdict === "OK").sort((a, b) => a.creationTimeSeconds - b.creationTimeSeconds);
  if (!ac.length) continue;
  const { problem } = ac.at(-1);
  out.push({
    key,
    contestId: problem.contestId,
    index: problem.index,
    title: problem.name,
    rating: problem.rating ?? null,
    tags: problem.tags.map((t) => t.replaceAll(" ", "-")),
    firstSolvedAt: iso(ac[0].creationTimeSeconds),
    lastSolvedAt: iso(ac.at(-1).creationTimeSeconds),
    submissions: subs.length,
    accepted: ac.length,
    lang: ac.at(-1).programmingLanguage,
    submissionId: ac.at(-1).id,
  });
}

out.sort((a, b) => b.firstSolvedAt.localeCompare(a.firstSolvedAt));
await writeFile(FILE, JSON.stringify(out, null, 2) + "\n");
console.log(`${out.length} Codeforces problems (${HANDLE})`);
