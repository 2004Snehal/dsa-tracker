"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { Difficulty } from "@/lib/data";
import { DiffBadge } from "@/components/ui";

export type Row = {
  id: number;
  slug: string;
  title: string;
  difficulty: Difficulty;
  section: string;
  sectionName: string;
  patternName: string | null;
  firstSolvedAt: string;
  date: string;
  submissions: number;
  revisit: boolean;
  oa: boolean;
};

const sel = "rounded-lg border border-line bg-panel px-3 py-2 text-sm text-ink";

export function ProblemTable({ rows, sections }: { rows: Row[]; sections: { id: string; name: string }[] }) {
  const [q, setQ] = useState("");
  const [section, setSection] = useState("");
  const [diff, setDiff] = useState("");
  const [sort, setSort] = useState<"new" | "old" | "id" | "tries">("new");
  const [flag, setFlag] = useState("");

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const out = rows.filter(
      (r) =>
        (!needle || r.title.toLowerCase().includes(needle) || String(r.id) === needle || r.patternName?.toLowerCase().includes(needle)) &&
        (!section || r.section === section) &&
        (!diff || r.difficulty === diff) &&
        (!flag || (flag === "revisit" ? r.revisit : r.oa)),
    );
    const cmp = {
      new: (a: Row, b: Row) => b.firstSolvedAt.localeCompare(a.firstSolvedAt),
      old: (a: Row, b: Row) => a.firstSolvedAt.localeCompare(b.firstSolvedAt),
      id: (a: Row, b: Row) => a.id - b.id,
      tries: (a: Row, b: Row) => b.submissions - a.submissions,
    }[sort];
    return out.sort(cmp);
  }, [rows, q, section, diff, sort, flag]);

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search title, number, pattern…"
          className={`${sel} flex-1 min-w-48`}
        />
        <select value={section} onChange={(e) => setSection(e.target.value)} className={sel}>
          <option value="">All sections</option>
          {sections.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
        <select value={diff} onChange={(e) => setDiff(e.target.value)} className={sel}>
          <option value="">All difficulties</option>
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>
        <select value={flag} onChange={(e) => setFlag(e.target.value)} className={sel}>
          <option value="">Any flag</option>
          <option value="revisit">Revisit</option>
          <option value="oa">OA practice</option>
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className={sel}>
          <option value="new">Newest first</option>
          <option value="old">Oldest first</option>
          <option value="id">Problem number</option>
          <option value="tries">Most submissions</option>
        </select>
      </div>
      <div className="text-xs text-ink-3 mb-2">{list.length} problems</div>
      <div className="rounded-xl border border-line bg-panel overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-xs text-ink-3 border-b border-line">
            <tr>
              <th className="px-4 py-2.5 font-medium w-14">#</th>
              <th className="px-2 py-2.5 font-medium">Title</th>
              <th className="px-2 py-2.5 font-medium">Section · Pattern</th>
              <th className="px-2 py-2.5 font-medium">Difficulty</th>
              <th className="px-2 py-2.5 font-medium text-right">Subs</th>
              <th className="px-4 py-2.5 font-medium text-right">Solved</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {list.map((r) => (
              <tr key={r.slug} className="hover:bg-bg">
                <td className="px-4 py-2.5 tabular-nums text-ink-3">{r.id}</td>
                <td className="px-2 py-2.5">
                  <Link href={`/problems/${r.slug}`} className="font-medium hover:text-accent">{r.title}</Link>
                  {r.revisit && <span className="ml-2 text-xs text-ink-3">↻ revisit</span>}
                  {r.oa && <span className="ml-2 text-xs text-ink-3">OA</span>}
                </td>
                <td className="px-2 py-2.5 text-ink-2 whitespace-nowrap">
                  {r.sectionName}
                  {r.patternName && <span className="text-ink-3"> · {r.patternName}</span>}
                </td>
                <td className="px-2 py-2.5"><DiffBadge d={r.difficulty} /></td>
                <td className="px-2 py-2.5 text-right tabular-nums text-ink-2">{r.submissions}</td>
                <td className="px-4 py-2.5 text-right tabular-nums text-ink-3 whitespace-nowrap">{r.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
