# DSA Tracker

Personal LeetCode tracker. It groups solved problems by section and pattern, and includes DP / Graph / Binary Search notes with C++ templates linked to the problems you've solved.

Fully static Next.js. Data lives in `data/` as JSON, so there's no database and no runtime secrets.

## Deploy to Vercel

1. Push this folder to a GitHub repo.
2. In Vercel: **Add New → Project → Import** that repo → **Deploy**. No settings or env vars needed.

## Keeping it updated

`.github/workflows/sync.yml` runs daily at 00:00 IST. It pulls your latest accepted submissions, commits `data/problems.json`, and Vercel redeploys on its own.

- **Manual sync:** GitHub → **Actions → Sync LeetCode → Run workflow**.
- **Username:** set the repo variable `LEETCODE_USERNAME` (defaults to `Snehal004`).
- **Optional secrets** `LEETCODE_SESSION` and `LEETCODE_CSRF` add your solution code and exact attempt counts to synced problems. Without them sync still works through LeetCode's public feed, which shows the last 20 accepted submissions. The session cookie expires after about 2 weeks, so the public mode is the low-maintenance default.

Locally:

```sh
npm install
npm run sync        # recent 20 accepted (public)
npm run backfill    # full history + code; needs LEETCODE_SESSION / LEETCODE_CSRF in .env.local
npm run dev
```

`.env.local` is gitignored:

```
LEETCODE_USERNAME=Snehal004
LEETCODE_SESSION=...
LEETCODE_CSRF=...
```

## Editing

| What | Where |
|---|---|
| A problem's section, pattern, notes, OA flag, revisit flag | `data/overrides.json` (keyed by slug) |
| Sections, patterns, and auto-classification rules for new problems | `content/taxonomy.ts` |
| Notes | `content/learn/<section>/index.md` (overview) and `content/learn/<section>/<pattern>.md` |

A new problem with no override is classified from its LeetCode tags by the first matching rule in `taxonomy.ts`. If it lands in the wrong place, add an override.

A notes file only needs to exist to show up. Sections without one list your problems under each pattern heading.
