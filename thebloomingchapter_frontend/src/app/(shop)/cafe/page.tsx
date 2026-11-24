"use client";

import { useEffect, useMemo, useState } from "react";
import { api, rows } from "@/lib/api";
import type { MenuItem } from "@/lib/types";
import { MenuCard } from "@/components/Cards";
import { Empty, PageLoader } from "@/components/ui";

const KINDS = [
  ["", "Everything"],
  ["coffee", "Coffee"],
  ["tea", "Tea"],
  ["cold", "Cold drinks"],
  ["snack", "Snacks"],
  ["dessert", "Desserts"],
] as const;

export default function CafePage() {
  const [items, setItems] = useState<MenuItem[] | null>(null);
  const [kind, setKind] = useState("");

  useEffect(() => {
    setItems(null);
    api.get(`/cafe/items/${kind ? `?kind=${kind}` : ""}`).then((r) => setItems(rows(r.data))).catch(() => setItems([]));
  }, [kind]);

  const grouped = useMemo(() => {
    const g: Record<string, MenuItem[]> = {};
    (items ?? []).forEach((i) => (g[i.category_name] ||= []).push(i));
    return Object.entries(g);
  }, [items]);

  return (
    <div className="container-page py-10">
      <h1 className="h-display text-4xl">Café</h1>
      <p className="mt-2 text-ink/60">Order ahead for pickup, enjoy it at your table, or get it delivered with your books and flowers.</p>
      <div className="mt-6 flex flex-wrap gap-2">
        {KINDS.map(([v, l]) => (
          <button key={l} className={kind === v ? "chip-active" : "chip"} onClick={() => setKind(v)}>{l}</button>
        ))}
      </div>
      <div className="mt-8 space-y-10">
        {!items ? (
          <PageLoader />
        ) : grouped.length === 0 ? (
          <Empty title="Nothing here right now" />
        ) : (
          grouped.map(([cat, list]) => (
            <section key={cat}>
              <h2 className="h-display mb-4 text-2xl">{cat}</h2>
              <div className="grid gap-4 md:grid-cols-2">{list.map((m) => <MenuCard key={m.id} item={m} />)}</div>
            </section>
          ))
        )}
      </div>
    </div>
  );
}
