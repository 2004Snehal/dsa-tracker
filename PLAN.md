# DSA Tracker — Plan (v1)

Personal tracker for LeetCode DSA / OA practice, grouped by topic, with built-in pattern notes and templates. Deploys to Vercel with no custom server.

---

## 1. Goals for v1

1. **Track solved problems.** Store each problem's title, link, difficulty, topics, date solved, pattern, notes, and revisit flag.
2. **Group by section.** Show DP, Graphs, Trees, Binary Search, and so on, with progress per section and per difficulty.
3. **Sync from LeetCode.** Append new accepted submissions automatically. Import your existing tracker once.
4. **Pattern notes.** For each topic: short theory, common sub-patterns, special tricks, and C++ templates. Example: LIS with DP is O(n²); patience sorting with `lower_bound` is O(n log n).
5. **Easy deploy.** Import the GitHub repo into Vercel, add one storage integration, set env vars, deploy.

Out of scope for v1: other platforms (Codeforces, GFG), multi-user accounts, spaced-repetition scheduling.

---

## 2. Tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 15 (App Router) + TypeScript | Native on Vercel. Pages and API routes in one project. |
| Styling | Tailwind CSS + shadcn/ui | Fast, clean UI without design overhead. |
| Charts | Recharts | Topic bars, difficulty split, activity heatmap. |
| Notes | MDX files in the repo | Write theory and templates as Markdown with code blocks. Versioned in git. |
| Code highlighting | Shiki (via `rehype-pretty-code`) | Good C++ highlighting at build time. |
| Database | **Neon Postgres** via Vercel Marketplace (free tier) | One click in Vercel adds `DATABASE_URL`. Serverless driver works in functions. |
| ORM | Drizzle | Small, typed, good for serverless. |
| Sync | Vercel Cron → `/api/sync` | Runs daily on the Hobby plan. No server needed. |
| Auth | Single password in env (`ADMIN_PASSWORD`) + signed cookie | Only you edit. Reading can be public or locked, your choice. |

Alternative if you want zero database: store problems in `data/problems.json` in the repo. Sync then runs as a GitHub Action that commits the file, and Vercel redeploys. Simpler, but no editing from the site. **Recommendation: Neon.** Editing notes and flags from the site matters for daily use.

---

## 3. Getting data from LeetCode

LeetCode has an unofficial GraphQL endpoint: `https://leetcode.com/graphql`.

| Need | Query | Auth needed? |
|---|---|---|
| Recent accepted submissions | `recentAcSubmissionList(username, limit: 20)` | No |
| Problem details (difficulty, topic tags) | `question(titleSlug)` → `difficulty`, `topicTags` | No |
| Overall stats | `matchedUser(username)` → `submitStatsGlobal`, `tagProblemCounts` | No |
| Full submission history | `/api/submissions/?offset=&limit=` | Yes — `LEETCODE_SESSION` cookie |

**Plan:**

1. **One-time backfill.** Two inputs, both supported:
   - Your existing tracker. You send it (CSV, Excel, Notion export, or Sheet). I write an import script for its format.
   - Optional full history. A local script uses your `LEETCODE_SESSION` cookie to pull every accepted submission. The cookie stays on your machine. It never goes to Vercel.
2. **Ongoing sync.** Daily Vercel Cron calls `/api/sync`. It fetches the last 20 accepted submissions, skips known ones, fetches tags for new ones, and inserts them.
   - Limit: the public query returns only the last 20. If you solve more than 20 in a day, use the **Sync now** button in the UI, which calls the same route.
3. **Topic mapping.** LeetCode tags are broad. A problem can carry `Array`, `Hash Table`, `DP`. You pick one **primary section** per problem, and I suggest it from a priority list (DP > Graph > Tree > … > Array). You also set an optional **pattern** (for example `DP / LIS`, `Graph / Topo sort`).

Risk: the GraphQL API is unofficial and can change. All LeetCode calls live in one file, `lib/leetcode.ts`, so a fix touches one place.

---

## 4. Data model

```ts
problems
  id              serial pk
  slug            text unique        // "longest-increasing-subsequence"
  number          int                // 300
  title           text
  difficulty      enum(Easy, Medium, Hard)
  lc_tags         text[]             // raw LeetCode tags
  section         text               // primary section, e.g. "DP"
  pattern         text null          // e.g. "LIS"
  source          enum(sync, import, manual)
  first_solved_at timestamptz
  last_solved_at  timestamptz
  attempts        int default 1
  status          enum(solved, revisit, struggled)
  is_oa           boolean default false   // marks OA-style practice
  notes           text null          // your own notes, Markdown
  created_at      timestamptz

sync_runs
  id, ran_at, fetched, inserted, error
```

Sections and patterns come from a config file, `content/taxonomy.ts`, so notes pages and problems share the same names.

---

## 5. Pages

| Route | What it shows |
|---|---|
| `/` | Dashboard: total solved, Easy/Medium/Hard split, streak, activity heatmap, progress bar per section, last 10 solved. |
| `/sections/[section]` | Problems in one section, filterable by pattern, difficulty, and status. Link to that section's notes. |
| `/problems` | Full searchable table. Filters for section, difficulty, date range, OA flag, revisit. |
| `/problems/[slug]` | Problem detail: tags, your notes (editable), solve history, link to LeetCode, link to its pattern note. |
| `/learn` | Index of topic notes. |
| `/learn/[topic]` | Theory, sub-patterns, templates, and **your solved problems for each pattern**, pulled from the DB. |
| `/admin` | Login, Sync now, import, manual add, sync log. |

The key link: every pattern note lists the problems you solved with that pattern. Every problem links back to its pattern note.

---

## 6. Learning content (MDX)

One file per topic in `content/learn/`. Each file follows the same shape:

1. **When to use it** — signals in the problem statement.
2. **Core theory** — short. You know DSA already, so no basics.
3. **Sub-patterns** — each with recognition cue, state/transition, complexity, template, and 2–3 classic problems.
4. **Special tricks** — the non-obvious upgrades.
5. **Common mistakes.**

Starting topics and the tricks each will cover:

| Topic | Sub-patterns / tricks |
|---|---|
| **DP** | 1D linear, 2D grid, 0/1 and unbounded knapsack, LIS (O(n²) and O(n log n) patience sort with `lower_bound`, reconstruction, Russian doll envelopes), LCS / edit distance, interval DP, partition DP, bitmask DP, digit DP, tree DP, DP on stocks (state machine), memo → tabulation → space optimisation |
| **Binary Search** | lower/upper bound, search on answer (min-max), rotated arrays, binary search on real values |
| **Graphs** | BFS/DFS, multi-source BFS, 0-1 BFS, Dijkstra, Bellman-Ford, Floyd-Warshall, topo sort (Kahn + DFS), DSU with rank + path compression, MST (Kruskal/Prim), bipartite check, Tarjan bridges / articulation points |
| **Trees** | traversals, LCA (and binary lifting), diameter, rerooting, BST properties, serialisation |
| **Two Pointers / Sliding Window** | fixed window, variable window, "at most K" trick for "exactly K" |
| **Stack / Monotonic Stack / Deque** | next greater element, largest rectangle in histogram, sliding window max |
| **Heap** | top-K, two heaps for median, K-way merge |
| **Prefix Sum / Hashing** | subarray sum = K, 2D prefix, difference arrays |
| **Greedy** | interval scheduling, exchange argument |
| **Backtracking** | subsets, permutations, pruning |
| **Trie, Bit Manipulation, Segment Tree / BIT** | templates mainly |

I start with DP in full detail, then Graphs and Binary Search. Others get filled in v1.1. Templates are in C++ by default (your `cpp/` folder suggests C++). Tell me if you want another language.

---

## 7. Folder structure

```
dsa-tracker/
  app/
    page.tsx                 dashboard
    sections/[section]/      section view
    problems/                table + detail
    learn/[topic]/           MDX notes + linked problems
    admin/                   login, sync, import
    api/
      sync/route.ts          cron + manual sync
      problems/route.ts      CRUD (auth required)
  components/                charts, tables, heatmap
  content/
    taxonomy.ts              sections + patterns
    learn/*.mdx              notes
  db/
    schema.ts                Drizzle schema
    migrations/
  lib/
    leetcode.ts              all LeetCode GraphQL calls
    auth.ts
  scripts/
    import-tracker.ts        your existing tracker -> DB
    backfill-history.ts      full history via LEETCODE_SESSION (local only)
  vercel.json                cron config
  .env.example
  README.md                  deploy steps
```

---

## 8. Deploy steps (target: a few clicks)

1. Push `dsa-tracker` to a GitHub repo.
2. In Vercel: **Add New → Project → Import** the repo.
3. In the project: **Storage → Neon → Create**. This adds `DATABASE_URL`.
4. Add env vars: `LEETCODE_USERNAME`, `ADMIN_PASSWORD`, `CRON_SECRET`.
5. Deploy. The build runs DB migrations. Cron starts from `vercel.json`.

I will also add a **Deploy to Vercel** button to the README. It pre-fills the env var prompts.

---

## 9. Build order

| Step | Work | Result |
|---|---|---|
| 1 | Scaffold Next.js, Tailwind, Drizzle, Neon schema | App runs locally |
| 2 | `lib/leetcode.ts` + `/api/sync` | New solves land in the DB |
| 3 | Import script for your tracker | Your history is in |
| 4 | Dashboard, sections, problems table | Core tracking works |
| 5 | MDX pipeline + DP notes + linked problems | Learning section works |
| 6 | Admin: login, edit notes/section/pattern, Sync now | Edit from the site |
| 7 | Cron, README, Deploy button, test deploy | Live on Vercel |
| 8 | Graphs + Binary Search notes | v1 complete |

---

## 10. Questions for you

1. **Tracker format.** What format is your current tracker in (CSV, Excel, Google Sheet, Notion)? Please share it or its columns.
2. **LeetCode username.** Which username should sync use? Is your profile public?
3. **Full history.** Do you want the full-history backfill with your session cookie, or only the tracker import plus sync from now on?
4. **Visibility.** Should the site be public (read-only, like a portfolio) or fully password-locked?
5. **Template language.** C++ for templates, or another language?
6. **OA tracking.** How do you want to mark OA practice? Options: a flag on each problem, or a separate list for company OA sets (company, date, problems, score).
