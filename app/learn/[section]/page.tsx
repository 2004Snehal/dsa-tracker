import Link from "next/link";
import { notFound } from "next/navigation";
import { SECTIONS, sectionById } from "@/content/taxonomy";
import { problems } from "@/lib/data";
import { loadNote } from "@/lib/markdown";
import { DiffBadge } from "@/components/ui";

export const generateStaticParams = () => SECTIONS.map((s) => ({ section: s.id }));
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ section: string }> }) {
  return { title: `${sectionById((await params).section)?.name} notes · DSA Tracker` };
}

export default async function LearnSection({ params }: { params: Promise<{ section: string }> }) {
  const s = sectionById((await params).section);
  if (!s) notFound();
  const overview = await loadNote(s.id, "index");
  const patterns = await Promise.all(
    s.patterns.map(async (pt) => ({
      ...pt,
      note: await loadNote(s.id, pt.id),
      solved: problems.filter((p) => p.section === s.id && p.pattern === pt.id),
    })),
  );

  return (
    <div className="lg:grid lg:grid-cols-[14rem_1fr] lg:gap-10">
      <aside className="hidden lg:block">
        <nav className="sticky top-20 space-y-1 text-sm">
          <Link href="/learn" className="block text-ink-3 hover:text-ink mb-3">← All topics</Link>
          {patterns.map((pt) => (
            <a key={pt.id} href={`#${pt.id}`} className="flex justify-between gap-2 py-1 text-ink-2 hover:text-ink">
              <span>{pt.name}</span>
              {pt.solved.length > 0 && <span className="text-ink-3 tabular-nums">{pt.solved.length}</span>}
            </a>
          ))}
        </nav>
      </aside>
      <article className="min-w-0 max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight">{s.name}</h1>
        {overview ? (
          <div className="prose-note mt-4" dangerouslySetInnerHTML={{ __html: overview.html }} />
        ) : (
          <p className="text-ink-3 mt-4">Notes for this topic aren't written yet. Your problems are grouped below.</p>
        )}
        {patterns.map((pt) => (
          <section key={pt.id} id={pt.id} className="scroll-mt-20 mt-12 border-t border-line pt-8">
            <h2 className="text-xl font-semibold tracking-tight text-ink">{pt.name}</h2>
            {pt.note && <div className="prose-note" dangerouslySetInnerHTML={{ __html: pt.note.html }} />}
            <div className="mt-6 rounded-xl border border-line bg-panel p-4">
              <div className="text-sm font-medium mb-2">
                You've solved <span className="tabular-nums">{pt.solved.length}</span>
              </div>
              {pt.solved.length ? (
                <ul className="space-y-1.5 text-sm">
                  {pt.solved.map((p) => (
                    <li key={p.slug} className="flex flex-wrap items-center gap-x-3">
                      <Link href={`/problems/${p.slug}`} className="hover:text-accent">{p.id}. {p.title}</Link>
                      <DiffBadge d={p.difficulty} />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-ink-3">None yet. Try one of the classics above.</p>
              )}
            </div>
          </section>
        ))}
      </article>
    </div>
  );
}
