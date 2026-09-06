import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { UploadCloud } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { DemoBanner, PageHeader, Stat } from "@/components/DemoBanner";
import { BULK_TASKS, inr, type BulkTask } from "@/lib/demo-data";

export const Route = createFileRoute("/enterprise")({
  head: () => ({
    meta: [
      { title: "Enterprise Portal — Bulk Field Task Management | FastHire" },
      {
        name: "description",
        content:
          "Upload bulk field task batches, allocate verified workers across cities and monitor SLA, budget burn and completion in the FastHire enterprise dashboard.",
      },
      { property: "og:title", content: "Enterprise Portal — Bulk Field Task Management" },
      {
        property: "og:description",
        content: "Upload batches, allocate verified field workers and track budgets and SLAs.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EnterprisePortal,
});

const CITIES = ["Mumbai", "Bengaluru", "Delhi", "Jaipur", "Patna", "Chennai"];

function EnterprisePortal() {
  const [tasks, setTasks] = useState<BulkTask[]>(BULK_TASKS);
  const [batch, setBatch] = useState("");
  const [city, setCity] = useState<string>(CITIES[0]!);
  const [workers, setWorkers] = useState(40);
  const [rate, setRate] = useState(7500);
  const [uploading, setUploading] = useState(false);

  const totalWorkers = tasks.reduce((s, t) => s + t.workers, 0);
  const assigned = tasks.reduce((s, t) => s + t.assigned, 0);
  const budget = tasks.reduce((s, t) => s + t.budget, 0);
  const fill = Math.round((assigned / totalWorkers) * 100);

  const chart = tasks.map((t) => ({
    name: t.id,
    assigned: t.assigned,
    open: t.workers - t.assigned,
  }));

  async function upload() {
    if (!batch.trim() || uploading) return;
    setUploading(true);
    await new Promise((r) => setTimeout(r, 900));
    setTasks((prev) => [
      {
        id: "BT-" + Math.floor(7040 + Math.random() * 60),
        batch: batch.trim(),
        city,
        workers,
        assigned: Math.floor(workers * (0.15 + Math.random() * 0.3)),
        budget: workers * rate,
        sla: "7 days",
        status: "Scheduled",
      },
      ...prev,
    ]);
    setBatch("");
    setUploading(false);
  }

  function allocate(id: string) {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              assigned: Math.min(t.workers, t.assigned + Math.ceil(t.workers * 0.15)),
              status: t.assigned + Math.ceil(t.workers * 0.15) >= t.workers ? "Live" : t.status,
            }
          : t,
      ),
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-5 py-10">
        <PageHeader
          eyebrow="Enterprise Portal"
          title="Bulk field tasks, allocated to verified workers"
          subtitle="Meridian Retail Services Pvt Ltd · CIN U74999MH2019PTC334120 (simulated registry record)"
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Active batches" value={String(tasks.filter((t) => t.status !== "Closed").length)} />
          <Stat label="Workers required" value={String(totalWorkers)} hint={`${assigned} allocated`} />
          <Stat label="Fill rate" value={`${fill}%`} hint="Across all batches" />
          <Stat label="Committed budget" value={inr(budget)} hint="Demo figures" />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.3fr]">
          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground">Upload a task batch</h2>
            <div className="mt-4 space-y-4">
              <label className="block">
                <span className="text-xs font-medium text-muted-foreground">Batch description</span>
                <input
                  value={batch}
                  onChange={(e) => setBatch(e.target.value)}
                  placeholder="e.g. Shelf compliance audit — 180 outlets"
                  className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                />
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-xs font-medium text-muted-foreground">City</span>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                  >
                    {CITIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="text-xs font-medium text-muted-foreground">Workers needed</span>
                  <input
                    type="number"
                    min={1}
                    value={workers}
                    onChange={(e) => setWorkers(Math.max(1, Number(e.target.value)))}
                    className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                  />
                </label>
              </div>
              <label className="block">
                <span className="text-xs font-medium text-muted-foreground">
                  Budget per worker (₹)
                </span>
                <input
                  type="number"
                  min={500}
                  step={500}
                  value={rate}
                  onChange={(e) => setRate(Math.max(500, Number(e.target.value)))}
                  className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                />
              </label>
              <p className="rounded-xl bg-muted/40 p-3 text-xs text-muted-foreground">
                Estimated batch value:{" "}
                <span className="font-semibold text-foreground">{inr(workers * rate)}</span>
              </p>
              <button
                onClick={upload}
                disabled={!batch.trim() || uploading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
              >
                <UploadCloud className="size-4" />
                {uploading ? "Uploading batch…" : "Upload batch"}
              </button>
            </div>
          </section>

          <div className="space-y-6">
            <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-foreground">Allocation by batch</h2>
              <div className="mt-4 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chart}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
                    <YAxis tick={{ fontSize: 12 }} stroke="var(--color-muted-foreground)" width={32} />
                    <Tooltip />
                    <Bar dataKey="assigned" stackId="a" fill="#4f46e5" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="open" stackId="a" fill="#c7d2fe" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-foreground">Task batches</h2>
              <ul className="mt-3 divide-y divide-border">
                {tasks.map((t) => (
                  <li key={t.id} className="py-3">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-foreground">{t.batch}</p>
                        <p className="text-xs text-muted-foreground">
                          {t.id} · {t.city} · SLA {t.sla} · {inr(t.budget)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                            t.status === "Live"
                              ? "bg-emerald-500/10 text-emerald-700"
                              : t.status === "Scheduled"
                                ? "bg-amber-500/10 text-amber-700"
                                : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {t.status}
                        </span>
                        <button
                          onClick={() => allocate(t.id)}
                          disabled={t.assigned >= t.workers}
                          className="rounded-lg border border-input px-3 py-1.5 text-xs font-medium text-foreground transition hover:bg-accent disabled:opacity-40"
                        >
                          Allocate workers
                        </button>
                      </div>
                    </div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                        style={{ width: `${(t.assigned / t.workers) * 100}%` }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {t.assigned}/{t.workers} verified workers allocated
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>

        <div className="mt-8">
          <DemoBanner>
            Batch records, worker pools, budgets and company registry identifiers are simulated for
            this prototype.
          </DemoBanner>
        </div>
      </div>
    </main>
  );
}
