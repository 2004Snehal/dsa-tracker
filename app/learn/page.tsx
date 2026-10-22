import Link from "next/link";
import { existsSync } from "node:fs";
import path from "node:path";
import { SECTIONS } from "@/content/taxonomy";
import { problems } from "@/lib/data";

export const metadata = { title: "Learn · DSA Tracker" };

const hasNotes = (id: string) => existsSync(path.join(process.cwd(), "content", "learn", id, "index.md"));

export default function LearnIndex() {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Learn</h1>
      <p className="text-ink-2 mt-1 mb-6">Pattern notes and C++ templates, linked to the problems you've solved.</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SECTIONS.map((s) => {
          const notes = hasNotes(s.id);
          const n = problems.filter((p) => p.section === s.id).length;
          return (
            <Link
              key={s.id}
              href={`/learn/${s.id}`}
              className="rounded-xl border border-line bg-panel p-5 hover:border-ink-3 transition-colors"
            >
              <div className="flex items-baseline justify-between">
                <h2 className="font-semibold">{s.name}</h2>
                <span className="text-xs text-ink-3 tabular-nums">{n} solved</span>
              </div>
              <p className="text-sm text-ink-2 mt-2 line-clamp-2">{s.patterns.map((p) => p.name).join(" · ")}</p>
              <div className={`mt-3 text-xs ${notes ? "text-accent" : "text-ink-3"}`}>{notes ? "Notes ready" : "Notes coming"}</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
