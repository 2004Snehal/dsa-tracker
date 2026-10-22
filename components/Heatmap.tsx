"use client";
import { useState } from "react";

type Cell = { day: string; count: number; titles: string[] };

const level = (n: number) => (n === 0 ? 0 : n === 1 ? 1 : n === 2 ? 2 : n <= 4 ? 3 : 4);
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** weeks: columns of 7 days (Sun..Sat); null pads days outside the range. */
export function Heatmap({ weeks }: { weeks: (Cell | null)[][] }) {
  const [tip, setTip] = useState<{ cell: Cell; x: number; y: number } | null>(null);

  return (
    <div className="relative">
      <div className="overflow-x-auto pb-1">
        <div className="inline-flex flex-col gap-1">
          <div className="flex gap-[3px] text-[10px] text-ink-3 h-3">
            {weeks.map((w, i) => {
              const first = w.find((c) => c && c.day.endsWith("-01")) ?? (i === 0 ? w.find(Boolean) : null);
              return (
                <div key={i} className="w-[11px] overflow-visible whitespace-nowrap">
                  {first ? MONTHS[+first.day.slice(5, 7) - 1] : ""}
                </div>
              );
            })}
          </div>
          <div className="flex gap-[3px]" onMouseLeave={() => setTip(null)}>
            {weeks.map((w, i) => (
              <div key={i} className="flex flex-col gap-[3px]">
                {w.map((c, j) =>
                  c ? (
                    <div
                      key={j}
                      className="size-[11px] rounded-[2px] outline-offset-1 hover:outline-2 hover:outline-ink-3"
                      style={{ background: `var(--heat-${level(c.count)})` }}
                      onMouseEnter={(e) => {
                        const r = e.currentTarget.getBoundingClientRect();
                        const p = e.currentTarget.closest(".relative")!.getBoundingClientRect();
                        setTip({ cell: c, x: r.left - p.left + 5, y: r.top - p.top });
                      }}
                    />
                  ) : (
                    <div key={j} className="size-[11px]" />
                  ),
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-2 flex items-center gap-1.5 text-[11px] text-ink-3">
        Less
        {[0, 1, 2, 3, 4].map((l) => (
          <span key={l} className="size-[11px] rounded-[2px]" style={{ background: `var(--heat-${l})` }} />
        ))}
        More
      </div>
      {tip && (
        <div
          className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-full rounded-lg border border-line bg-panel px-3 py-2 text-xs shadow-lg max-w-64"
          style={{ left: tip.x, top: tip.y - 6 }}
        >
          <div className="font-medium text-ink">
            {tip.cell.count} solved ·{" "}
            {new Date(tip.cell.day + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
          </div>
          {tip.cell.titles.slice(0, 5).map((t) => (
            <div key={t} className="text-ink-2 truncate">{t}</div>
          ))}
          {tip.cell.titles.length > 5 && <div className="text-ink-3">+{tip.cell.titles.length - 5} more</div>}
        </div>
      )}
    </div>
  );
}
