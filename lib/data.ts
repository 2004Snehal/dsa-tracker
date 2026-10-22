import rawProblems from "@/data/problems.json";
import rawOverrides from "@/data/overrides.json";
import { classify } from "@/content/taxonomy";

export type Difficulty = "Easy" | "Medium" | "Hard";

type Raw = {
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

type Override = { section?: string; pattern?: string; notes?: string; oa?: boolean; revisit?: boolean };

export type Problem = Raw & {
  section: string;
  pattern: string | null;
  notes: string | null;
  oa: boolean;
  revisit: boolean;
  url: string;
};

const overrides = rawOverrides as unknown as Record<string, Override>;

export const problems: Problem[] = (rawProblems as Raw[]).map((p) => {
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
});

export const problemBySlug = (slug: string) => problems.find((p) => p.slug === slug);

export const DIFFICULTIES: Difficulty[] = ["Easy", "Medium", "Hard"];

export function countByDifficulty(list: Problem[]) {
  return Object.fromEntries(DIFFICULTIES.map((d) => [d, list.filter((p) => p.difficulty === d).length])) as Record<Difficulty, number>;
}

/** Local date key (YYYY-MM-DD) in IST, since that's where solving happens. */
export const dayKey = (iso: string) => new Date(iso).toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });

export function solvesPerDay(list: Problem[]) {
  const m = new Map<string, number>();
  for (const p of list) m.set(dayKey(p.firstSolvedAt), (m.get(dayKey(p.firstSolvedAt)) ?? 0) + 1);
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

export const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" });
