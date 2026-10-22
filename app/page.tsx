import Link from "next/link";
import { problems, countByDifficulty, dayKey, streaks, DIFFICULTIES } from "@/lib/data";
import { SECTIONS } from "@/content/taxonomy";
import { Card, DIFF_VAR, ProblemList } from "@/components/ui";
import { Heatmap } from "@/components/Heatmap";

function buildWeeks() {
  const byDay = new Map<string, string[]>();
  for (const p of problems) {
    const k = dayKey(p.firstSolvedAt);
    byDay.set(k, [...(byDay.get(k) ?? []), p.title]);
  }
  const today = new Date(dayKey(new Date().toISOString()) + "T00:00:00Z");
  const start = new Date(today);
  start.setUTCDate(start.getUTCDate() - 52 * 7 - today.getUTCDay());
  const weeks = [];
  for (const d = new Date(start); d <= today; ) {
    const week = [];
    for (let i = 0; i < 7; i++, d.setUTCDate(d.getUTCDate() + 1)) {
      const k = d.toISOString().slice(0, 10);
      week.push(d <= today ? { day: k, count: byDay.get(k)?.length ?? 0, titles: byDay.get(k) ?? [] } : null);
    }
    weeks.push(week);
  }
  return weeks;
}

// Rebuild hourly so the streak and heatmap roll over even on days with no new commits.
export const revalidate = 3600;

export default function Dashboard() {
  const diff = countByDifficulty(problems);
  const { current, longest } = streaks(problems);
  const weeks = buildWeeks();
  const lastYear = weeks.flat().reduce((s, c) => s + (c?.count ?? 0), 0);
  const thirtyAgo = new Date(Date.now() - 30 * 864e5).toISOString();
  const last30 = problems.filter((p) => p.firstSolvedAt >= thirtyAgo).length;

  const sections = SECTIONS.map((s) => {
    const list = problems.filter((p) => p.section === s.id);
    return { ...s, total: list.length, diff: countByDifficulty(list) };
  })
    .filter((s) => s.total > 0)
    .sort((a, b) => b.total - a.total);
  const max = Math.max(...sections.map((s) => s.total));

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <div className="text-sm text-ink-2">Solved</div>
          <div className="text-4xl font-semibold tabular-nums mt-1">{problems.length}</div>
          <div className="mt-2 flex gap-3 text-xs text-ink-2">
            {DIFFICULTIES.map((d) => (
              <span key={d} className="inline-flex items-center gap-1">
                <span className="size-2 rounded-full" style={{ background: DIFF_VAR[d] }} />
                {d[0]} <span className="text-ink tabular-nums">{diff[d]}</span>
              </span>
            ))}
          </div>
        </Card>
        <Card>
          <div className="text-sm text-ink-2">Last 30 days</div>
          <div className="text-4xl font-semibold tabular-nums mt-1">{last30}</div>
          <div className="mt-2 text-xs text-ink-3">new problems</div>
        </Card>
        <Card>
          <div className="text-sm text-ink-2">Current streak</div>
          <div className="text-4xl font-semibold tabular-nums mt-1">
            {current}
            <span className="text-base text-ink-3 font-normal"> d</span>
          </div>
          <div className="mt-2 text-xs text-ink-3">longest {longest} d</div>
        </Card>
        <Card>
          <div className="text-sm text-ink-2">Hard share</div>
          <div className="text-4xl font-semibold tabular-nums mt-1">
            {Math.round((diff.Hard / Math.max(problems.length, 1)) * 100)}
            <span className="text-base text-ink-3 font-normal">%</span>
          </div>
          <div className="mt-2 text-xs text-ink-3">{diff.Hard} hard problems</div>
        </Card>
      </section>

      <Card>
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="font-semibold">Activity</h2>
          <span className="text-xs text-ink-3">{lastYear} new problems in the past year</span>
        </div>
        <Heatmap weeks={weeks} />
      </Card>

      <div className="grid md:grid-cols-5 gap-6">
        <Card className="md:col-span-3">
          <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
            <h2 className="font-semibold">By section</h2>
            <div className="flex gap-3 text-xs text-ink-2">
              {DIFFICULTIES.map((d) => (
                <span key={d} className="inline-flex items-center gap-1.5">
                  <span className="size-2 rounded-sm" style={{ background: DIFF_VAR[d] }} />
                  {d}
                </span>
              ))}
            </div>
          </div>
          <ul className="space-y-2.5">
            {sections.map((s) => (
              <li key={s.id}>
                <Link href={`/sections/${s.id}`} className="group grid grid-cols-[8.5rem_1fr_2rem] items-center gap-3 text-sm">
                  <span className="truncate text-ink-2 group-hover:text-ink">{s.name}</span>
                  <span className="flex h-3.5 gap-[2px]" style={{ width: `${(s.total / max) * 100}%` }}>
                    {DIFFICULTIES.filter((d) => s.diff[d]).map((d) => (
                      <span
                        key={d}
                        title={`${s.diff[d]} ${d}`}
                        className="h-full first:rounded-l-[4px] last:rounded-r-[4px]"
                        style={{ flex: s.diff[d], background: DIFF_VAR[d] }}
                      />
                    ))}
                  </span>
                  <span className="text-right tabular-nums text-ink">{s.total}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
        <Card className="md:col-span-2">
          <div className="flex items-baseline justify-between mb-1">
            <h2 className="font-semibold">Recently solved</h2>
            <Link href="/problems" className="text-xs text-accent">All →</Link>
          </div>
          <ProblemList list={problems.slice(0, 8)} showSection={false} />
        </Card>
      </div>
    </div>
  );
}
