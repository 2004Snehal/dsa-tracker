import Link from "next/link";
import { notFound } from "next/navigation";
import { problems, problemBySlug, fmtDate } from "@/lib/data";
import { patternName, sectionById } from "@/content/taxonomy";
import { highlight, renderMarkdown } from "@/lib/markdown";
import { Card, Chip, DiffBadge } from "@/components/ui";

export const generateStaticParams = () => problems.map((p) => ({ slug: p.slug }));
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const p = problemBySlug((await params).slug);
  return { title: p ? `${p.id}. ${p.title} · DSA Tracker` : "Not found" };
}

export default async function ProblemPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = problemBySlug((await params).slug);
  if (!p) notFound();
  const section = sectionById(p.section);
  const pName = patternName(p.section, p.pattern);
  const code = p.solution ? await highlight(p.solution.code, p.solution.lang) : null;
  const notes = p.notes ? await renderMarkdown(p.notes) : null;
  const siblings = problems.filter((x) => x.section === p.section && x.pattern === p.pattern && x.slug !== p.slug && p.pattern);

  return (
    <div className="space-y-6">
      <div>
        <Link href="/problems" className="text-sm text-ink-3 hover:text-ink">← Problems</Link>
        <h1 className="text-2xl font-semibold tracking-tight mt-2">
          <span className="text-ink-3 tabular-nums">{p.id}.</span> {p.title}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
          <DiffBadge d={p.difficulty} />
          <Link href={`/sections/${p.section}`} className="text-ink-2 hover:text-ink">{section?.name}</Link>
          {pName && (
            <Link href={`/learn/${p.section}#${p.pattern}`} className="text-accent hover:underline">
              {pName} notes →
            </Link>
          )}
          <a href={p.url} target="_blank" rel="noreferrer" className="text-ink-2 hover:text-ink">LeetCode ↗</a>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <Card><div className="text-xs text-ink-3">First solved</div><div className="mt-1 font-medium">{fmtDate(p.firstSolvedAt)}</div></Card>
        <Card><div className="text-xs text-ink-3">Last accepted</div><div className="mt-1 font-medium">{fmtDate(p.lastSolvedAt)}</div></Card>
        <Card><div className="text-xs text-ink-3">Submissions</div><div className="mt-1 font-medium tabular-nums">{p.submissions} <span className="text-ink-3 font-normal">({p.accepted} accepted)</span></div></Card>
        <Card><div className="text-xs text-ink-3">Runtime · Memory</div><div className="mt-1 font-medium">{p.solution ? `${p.solution.runtime} · ${p.solution.memory}` : "—"}</div></Card>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {p.tags.map((t) => <Chip key={t}>{t.replaceAll("-", " ")}</Chip>)}
      </div>

      {notes && (
        <Card>
          <h2 className="font-semibold mb-2">My notes</h2>
          <div className="prose-note" dangerouslySetInnerHTML={{ __html: notes }} />
        </Card>
      )}

      {code && (
        <div>
          <h2 className="font-semibold mb-2">
            My solution <span className="text-sm font-normal text-ink-3">({p.solution!.lang})</span>
          </h2>
          <div dangerouslySetInnerHTML={{ __html: code }} />
        </div>
      )}

      {siblings.length > 0 && (
        <Card>
          <h2 className="font-semibold mb-2">Same pattern</h2>
          <ul className="space-y-1.5 text-sm">
            {siblings.map((s) => (
              <li key={s.slug} className="flex items-center gap-3">
                <Link href={`/problems/${s.slug}`} className="hover:text-accent">{s.id}. {s.title}</Link>
                <DiffBadge d={s.difficulty} />
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
