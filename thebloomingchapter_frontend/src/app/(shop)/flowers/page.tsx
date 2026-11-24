"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { OCCASIONS } from "@/lib/format";
import type { Flower, Paginated } from "@/lib/types";
import { FlowerCard } from "@/components/Cards";
import { Empty, PageLoader, Pager } from "@/components/ui";

export default function FlowersPage() {
  const [data, setData] = useState<Paginated<Flower> | null>(null);
  const [occasion, setOccasion] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setData(null);
    const p = new URLSearchParams({ page: String(page) });
    if (occasion) p.set("occasion", occasion);
    api.get(`/flowers/?${p}`).then((r) => setData(r.data)).catch(() => setData({ count: 0, next: null, previous: null, results: [] }));
  }, [occasion, page]);

  return (
    <div className="container-page py-10">
      <h1 className="h-display text-4xl">Flowers</h1>
      <p className="mt-2 text-ink/60">Fresh bouquets and stems, made in our shop. Add a book for the perfect gift.</p>
      <div className="mt-6 flex flex-wrap gap-2">
        {OCCASIONS.map(([v, l]) => (
          <button key={l} className={occasion === v ? "chip-active" : "chip"} onClick={() => { setOccasion(v); setPage(1); }}>{l}</button>
        ))}
      </div>
      <div className="mt-8">
        {!data ? (
          <PageLoader />
        ) : data.results.length === 0 ? (
          <Empty title="No flowers for this occasion yet" />
        ) : (
          <>
            <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">{data.results.map((f) => <FlowerCard key={f.id} flower={f} />)}</div>
            <Pager page={page} hasNext={!!data.next} hasPrev={!!data.previous} onChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
}
