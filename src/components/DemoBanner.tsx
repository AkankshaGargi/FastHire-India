export function DemoBanner({ children }: { children?: React.ReactNode }) {
  return (
    <p className="rounded-xl border border-dashed border-border bg-muted/40 p-4 text-xs leading-relaxed text-muted-foreground">
      <strong className="text-foreground">Simulated demo data.</strong>{" "}
      {children ??
        "All figures, registry results and government datasets shown here are generated for demonstration only. They are not live lookups of GST, MCA, PFMS or any official database. Connect live integrations before relying on any number."}
    </p>
  );
}

export function PageHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <header className="mb-8">
      <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
        <span className="size-2 rounded-full bg-emerald-500" />
        {eyebrow} · demo mode
      </div>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">{title}</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">{subtitle}</p>
    </header>
  );
}

export function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-bold text-foreground">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
