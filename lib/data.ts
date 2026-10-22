import rawLeetcode from "@/data/problems.json";
import rawNeetcode from "@/data/neetcode.json";
import rawOverrides from "@/data/overrides.json";
import { classify } from "@/content/taxonomy";

export type Difficulty = "Easy" | "Medium" | "Hard";
export type Source = "leetcode" | "neetcode";
export const SOURCE_NAME: Record<Source, string> = { leetcode: "LeetCode", neetcode: "NeetCode" };

type LeetcodeRaw = {
  id: number;
  slug: string;
  title: string;
  difficulty: Difficulty;
  tags: string[];
  firstSolvedAt: string;
  lastSolvedAt: string;
  submissions: number;
  accepted: number;
  solution: { submissionId: string; lang: string; code: string; runtime: string; memory: string } | null;
};

type NeetcodeRaw = {
  ncSlug: string;
  lcSlug: string;
  id: number;
  title: string;
  difficulty: Difficulty;
  tags: string[];
  firstSolvedAt: string | null;
  lastSolvedAt: string | null;
  submissions: number;
  accepted: number;
  solution: { file: string; lang: string; code: string };
};

type Override = { section?: string; pattern?: string; notes?: string; oa?: boolean; revisit?: boolean };

export type Solution = { source: Source; lang: string; code: string; runtime?: string; memory?: string };

export type Problem = {
  id: number;
  slug: string;
  title: string;
  difficulty: Difficulty;
  tags: string[];
  /** null when the solve date is unknown (NeetCode bulk sync). */
  firstSolvedAt: string | null;
  lastSolvedAt: string | null;
  submissions: number;
  accepted: number;
  sources: Source[];
  solutions: Solution[];
  ncSlug: string | null;
  section: string;
  pattern: string | null;
  notes: string | null;
  oa: boolean;
  revisit: boolean;
  url: string;
};

const overrides = rawOverrides as unknown as Record<string, Override>;

const minDate = (a: string | null, b: string | null) => (!a ? b : !b ? a : a < b ? a : b);
const maxDate = (a: string | null, b: string | null) => (!a ? b : !b ? a : a > b ? a : b);

const merged = new Map<string, Omit<Problem, "section" | "pattern" | "notes" | "oa" | "revisit" | "url">>();

for (const p of rawLeetcode as LeetcodeRaw[]) {
  const { solution, ...rest } = p;
  merged.set(p.slug, {
    ...rest,
    sources: ["leetcode"],
    solutions: solution ? [{ source: "leetcode", lang: solution.lang, code: solution.code, runtime: solution.runtime, memory: solution.memory }] : [],
    ncSlug: null,
  });
}

for (const n of rawNeetcode as NeetcodeRaw[]) {
  const sol: Solution = { source: "neetcode", lang: n.solution.lang, code: n.solution.code };
  const prev = merged.get(n.lcSlug);
  if (prev) {
    prev.sources.push("neetcode");
    prev.solutions.push(sol);
    prev.firstSolvedAt = minDate(prev.firstSolvedAt, n.firstSolvedAt);
    prev.lastSolvedAt = maxDate(prev.lastSolvedAt, n.lastSolvedAt);
    prev.submissions += n.submissions;
    prev.accepted += n.accepted;
    prev.ncSlug = n.ncSlug;
  } else {
    merged.set(n.lcSlug, {
      id: n.id,
      slug: n.lcSlug,
      title: n.title,
      difficulty: n.difficulty,
      tags: n.tags,
      firstSolvedAt: n.firstSolvedAt,
      lastSolvedAt: n.lastSolvedAt,
      submissions: n.submissions,
      accepted: n.accepted,
      sources: ["neetcode"],
      solutions: [sol],
      ncSlug: n.ncSlug,
    });
  }
}

/** Newest first; problems with unknown dates go last, by problem number. */
export const byNewest = (a: { firstSolvedAt: string | null; id: number }, b: { firstSolvedAt: string | null; id: number }) =>
  a.firstSolvedAt && b.firstSolvedAt
    ? b.firstSolvedAt.localeCompare(a.firstSolvedAt)
    : a.firstSolvedAt
      ? -1
      : b.firstSolvedAt
        ? 1
        : a.id - b.id;

export const problems: Problem[] = [...merged.values()]
  .map((p) => {
    const o = overrides[p.slug] ?? {};
    const auto = classify(p.tags);
    const section = o.section ?? auto.section;
    return {
      ...p,
      section,
      pattern: o.pattern ?? (o.section && o.section !== auto.section ? null : auto.pattern),
      notes: o.notes ?? null,
      oa: o.oa ?? false,
      revisit: o.revisit ?? false,
      url: `https://leetcode.com/problems/${p.slug}/`,
    };
  })
  .sort(byNewest);

export const problemBySlug = (slug: string) => problems.find((p) => p.slug === slug);

export const neetcodeUrl = (ncSlug: string) => `https://neetcode.io/problems/${ncSlug}`;

export const DIFFICULTIES: Difficulty[] = ["Easy", "Medium", "Hard"];

export function countByDifficulty(list: Problem[]) {
  return Object.fromEntries(DIFFICULTIES.map((d) => [d, list.filter((p) => p.difficulty === d).length])) as Record<Difficulty, number>;
}

export function countBySource(list: Problem[]) {
  return {
    leetcode: list.filter((p) => p.sources.includes("leetcode")).length,
    neetcode: list.filter((p) => p.sources.includes("neetcode")).length,
  } as Record<Source, number>;
}

/** Local date key (YYYY-MM-DD) in IST, since that's where solving happens. */
export const dayKey = (iso: string) => new Date(iso).toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });

export const dated = (list: Problem[]) => list.filter((p): p is Problem & { firstSolvedAt: string } => !!p.firstSolvedAt);

export function solvesPerDay(list: Problem[]) {
  const m = new Map<string, number>();
  for (const p of dated(list)) m.set(dayKey(p.firstSolvedAt), (m.get(dayKey(p.firstSolvedAt)) ?? 0) + 1);
  return m;
}

/** Current and longest streaks of consecutive days with at least one new solve. */
export function streaks(list: Problem[], today = new Date()) {
  const days = [...solvesPerDay(list).keys()].sort();
  const toNum = (k: string) => Date.UTC(+k.slice(0, 4), +k.slice(5, 7) - 1, +k.slice(8, 10)) / 864e5;
  let longest = 0, run = 0, prev = -2;
  for (const d of days.map(toNum)) {
    run = d === prev + 1 ? run + 1 : 1;
    longest = Math.max(longest, run);
    prev = d;
  }
  const t = toNum(dayKey(today.toISOString()));
  const current = prev === t || prev === t - 1 ? run : 0;
  return { current, longest };
}

export const fmtDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" }) : "—";
