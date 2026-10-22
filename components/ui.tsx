import Link from "next/link";
import type { Difficulty, Problem, Source } from "@/lib/data";
import { fmtDate } from "@/lib/data";
import { patternName, sectionById } from "@/content/taxonomy";

export const DIFF_VAR: Record<Difficulty, string> = { Easy: "var(--easy)", Medium: "var(--medium)", Hard: "var(--hard)" };

export function DiffBadge({ d }: { d: Difficulty }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-ink-2 whitespace-nowrap">
      <span className="size-2 rounded-full" style={{ background: DIFF_VAR[d] }} />
      {d}
    </span>
  );
}

const SOURCE_SHORT: Record<Source, string> = { leetcode: "LC", neetcode: "NC" };
const SOURCE_TITLE: Record<Source, string> = { leetcode: "Solved on LeetCode", neetcode: "Solved on NeetCode" };

export function SourceTags({ sources }: { sources: Source[] }) {
  return (
    <span className="inline-flex gap-1">
      {sources.map((s) => (
        <span key={s} title={SOURCE_TITLE[s]} className="rounded border border-line px-1 text-[10px] leading-4 font-medium text-ink-3">
          {SOURCE_SHORT[s]}
        </span>
      ))}
    </span>
  );
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-xl border border-line bg-panel p-5 ${className}`}>{children}</div>;
}

export function Chip({ href, children }: { href?: string; children: React.ReactNode }) {
  const cls = "inline-block rounded-md border border-line px-2 py-0.5 text-xs text-ink-2";
  return href ? (
    <Link href={href} className={`${cls} hover:text-ink hover:border-ink-3`}>
      {children}
    </Link>
  ) : (
    <span className={cls}>{children}</span>
  );
}

export function ProblemList({ list, showSection = true }: { list: Problem[]; showSection?: boolean }) {
  if (!list.length) return <p className="text-sm text-ink-3">None yet.</p>;
  return (
    <ul className="divide-y divide-line">
      {list.map((p) => (
        <li key={p.slug} className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2.5">
          <Link href={`/problems/${p.slug}`} className="font-medium hover:text-accent min-w-0 flex-1">
            <span className="text-ink-3 tabular-nums mr-2">{p.id}.</span>
            {p.title}
          </Link>
          {showSection && (
            <span className="text-xs text-ink-3">
              {sectionById(p.section)?.short}
              {p.pattern && ` · ${patternName(p.section, p.pattern)}`}
            </span>
          )}
          <SourceTags sources={p.sources} />
          <DiffBadge d={p.difficulty} />
          <span className="text-xs text-ink-3 tabular-nums w-24 text-right">{fmtDate(p.firstSolvedAt)}</span>
        </li>
      ))}
    </ul>
  );
}
