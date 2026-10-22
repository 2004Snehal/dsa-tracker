import { problems, fmtDate } from "@/lib/data";
import { SECTIONS, patternName, sectionById } from "@/content/taxonomy";
import { ProblemTable, type Row } from "@/components/ProblemTable";

export const metadata = { title: "Problems · DSA Tracker" };

export default function ProblemsPage() {
  const rows: Row[] = problems.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    difficulty: p.difficulty,
    section: p.section,
    sectionName: sectionById(p.section)?.name ?? p.section,
    patternName: patternName(p.section, p.pattern),
    firstSolvedAt: p.firstSolvedAt,
    sources: p.sources,
    date: fmtDate(p.firstSolvedAt),
    submissions: p.submissions,
    revisit: p.revisit,
    oa: p.oa,
  }));
  const used = SECTIONS.filter((s) => problems.some((p) => p.section === s.id));
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight mb-6">Problems</h1>
      <ProblemTable rows={rows} sections={used.map(({ id, name }) => ({ id, name }))} />
    </div>
  );
}
