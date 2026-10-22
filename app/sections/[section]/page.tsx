import Link from "next/link";
import { notFound } from "next/navigation";
import { problems, countByDifficulty, DIFFICULTIES } from "@/lib/data";
import { SECTIONS, sectionById } from "@/content/taxonomy";
import { Card, DIFF_VAR, ProblemList } from "@/components/ui";

export const generateStaticParams = () => SECTIONS.map((s) => ({ section: s.id }));
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ section: string }> }) {
  return { title: `${sectionById((await params).section)?.name} · DSA Tracker` };
}

export default async function SectionPage({ params }: { params: Promise<{ section: string }> }) {
  const s = sectionById((await params).section);
  if (!s) notFound();
  const list = problems.filter((p) => p.section === s.id);
  const diff = countByDifficulty(list);
  const groups = [
    ...s.patterns.map((pt) => ({ id: pt.id, name: pt.name, list: list.filter((p) => p.pattern === pt.id) })),
    { id: "_", name: "Unassigned pattern", list: list.filter((p) => !p.pattern) },
  ].filter((g) => g.list.length);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{s.name}</h1>
          <div className="mt-2 flex gap-4 text-sm text-ink-2">
            <span><span className="text-ink tabular-nums font-medium">{list.length}</span> solved</span>
            {DIFFICULTIES.map((d) => (
              <span key={d} className="inline-flex items-center gap-1.5">
                <span className="size-2 rounded-full" style={{ background: DIFF_VAR[d] }} />
                {d} <span className="text-ink tabular-nums">{diff[d]}</span>
              </span>
            ))}
          </div>
        </div>
        <Link href={`/learn/${s.id}`} className="rounded-lg border border-line bg-panel px-4 py-2 text-sm hover:border-ink-3">
          Notes & templates →
        </Link>
      </div>
      {groups.length === 0 && <p className="text-ink-3">Nothing solved here yet.</p>}
      {groups.map((g) => (
        <Card key={g.id}>
          <div className="flex items-baseline justify-between">
            <h2 className="font-semibold">{g.name} <span className="text-ink-3 font-normal tabular-nums">{g.list.length}</span></h2>
            {g.id !== "_" && <Link href={`/learn/${s.id}#${g.id}`} className="text-xs text-accent">Pattern notes →</Link>}
          </div>
          <ProblemList list={g.list} showSection={false} />
        </Card>
      ))}
    </div>
  );
}
