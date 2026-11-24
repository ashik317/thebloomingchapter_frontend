"use client";

import clsx from "clsx";
import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";

export function Spinner({ className }: { className?: string }) {
  return <Loader2 aria-label="Loading" className={clsx("animate-spin text-forest", className ?? "h-6 w-6")} />;
}

export function PageLoader() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <Spinner className="h-8 w-8" />
    </div>
  );
}

export function Empty({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="card flex flex-col items-center gap-3 px-6 py-14 text-center">
      <p className="h-display text-xl">{title}</p>
      {children && <div className="text-sm text-ink/60">{children}</div>}
    </div>
  );
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  unpaid: "bg-amber-100 text-amber-800",
  initiated: "bg-amber-100 text-amber-800",
  paid: "bg-emerald-100 text-emerald-800",
  success: "bg-emerald-100 text-emerald-800",
  completed: "bg-emerald-100 text-emerald-800",
  delivered: "bg-emerald-100 text-emerald-800",
  processing: "bg-sky-100 text-sky-800",
  ready: "bg-sky-100 text-sky-800",
  shipped: "bg-indigo-100 text-indigo-800",
  cancelled: "bg-stone-200 text-stone-700",
  failed: "bg-red-100 text-red-800",
  refunded: "bg-stone-200 text-stone-700",
};

export function Badge({ value, label }: { value: string; label?: string }) {
  return (
    <span className={clsx("inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium", STATUS_COLORS[value] ?? "bg-cream-dark text-ink")}>
      {label ?? value.replace(/_/g, " ")}
    </span>
  );
}

export function Pager({ page, hasNext, hasPrev, onChange }: { page: number; hasNext: boolean; hasPrev: boolean; onChange: (p: number) => void }) {
  if (!hasNext && !hasPrev) return null;
  return (
    <div className="mt-8 flex items-center justify-center gap-3">
      <button className="btn-outline btn-sm" disabled={!hasPrev} onClick={() => onChange(page - 1)}>
        Previous
      </button>
      <span className="text-sm text-ink/60">Page {page}</span>
      <button className="btn-outline btn-sm" disabled={!hasNext} onClick={() => onChange(page + 1)}>
        Next
      </button>
    </div>
  );
}

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-ink/50">{hint}</span>}
    </label>
  );
}

export function StatCard({ label, value, icon }: { label: string; value: ReactNode; icon?: ReactNode }) {
  return (
    <div className="card flex items-center gap-4 p-5">
      {icon && <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-forest/10 text-forest">{icon}</div>}
      <div>
        <p className="text-xs uppercase tracking-wider text-ink/50">{label}</p>
        <p className="font-display text-2xl text-forest">{value}</p>
      </div>
    </div>
  );
}

export function Cover({ src, alt, className }: { src: string | null; alt: string; className?: string }) {
  if (src) return <img src={src} alt={alt} className={clsx("object-cover", className)} />;
  return (
    <div className={clsx("flex items-center justify-center bg-forest p-3 text-center font-display text-cream", className)}>
      <span className="line-clamp-3 text-sm">{alt}</span>
    </div>
  );
}
