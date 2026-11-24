"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BookOpen, Download, Trash2 } from "lucide-react";
import { api, downloadFile, errorMessage, rows } from "@/lib/api";
import { date } from "@/lib/format";
import type { DigitalPurchase, SavedBook } from "@/lib/types";
import { Cover, Empty, PageLoader } from "@/components/ui";

export default function LibraryPage() {
  const [owned, setOwned] = useState<DigitalPurchase[] | null>(null);
  const [saved, setSaved] = useState<SavedBook[] | null>(null);
  const [tab, setTab] = useState<"owned" | "saved">("owned");

  const load = useCallback(() => {
    api.get("/books/my-purchases/?page_size=100").then((r) => setOwned(rows(r.data))).catch(() => setOwned([]));
    api.get("/books/library/?page_size=100").then((r) => setSaved(rows(r.data))).catch(() => setSaved([]));
  }, []);
  useEffect(load, [load]);

  const download = async (slug: string) => {
    try {
      await downloadFile(`/books/${slug}/download/`, `${slug}.pdf`);
    } catch (e) {
      toast.error(errorMessage(e, "Download failed."));
    }
  };

  const unsave = async (slug: string) => {
    await api.delete(`/books/library/${slug}/`).catch(() => {});
    load();
  };

  if (!owned || !saved) return <PageLoader />;
  return (
    <div>
      <h1 className="h-display mb-6 text-3xl">My library</h1>
      <div className="mb-6 flex gap-2" role="tablist">
        <button role="tab" aria-selected={tab === "owned"} className={tab === "owned" ? "chip-active" : "chip"} onClick={() => setTab("owned")}>Purchased PDFs ({owned.length})</button>
        <button role="tab" aria-selected={tab === "saved"} className={tab === "saved" ? "chip-active" : "chip"} onClick={() => setTab("saved")}>Saved to read ({saved.length})</button>
      </div>

      {tab === "owned" &&
        (owned.length === 0 ? (
          <Empty title="No PDFs bought yet">Buy a book&apos;s PDF to read it in full and download it.</Empty>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {owned.map((p) => (
              <div key={p.id} className="card flex gap-4 p-4">
                <Cover src={p.book.cover} alt={p.book.title} className="h-28 w-20 shrink-0 rounded-md" />
                <div className="flex flex-1 flex-col">
                  <p className="font-medium">{p.book.title}</p>
                  <p className="text-sm text-ink/60">{p.book.author}</p>
                  <p className="text-xs text-ink/50">Bought {date(p.created_at)} · downloaded {p.download_count}×</p>
                  <div className="mt-auto flex gap-2 pt-3">
                    <Link href={`/read/${p.book.slug}`} className="btn-primary btn-sm"><BookOpen className="h-4 w-4" /> Read</Link>
                    <button onClick={() => download(p.book.slug)} className="btn-outline btn-sm"><Download className="h-4 w-4" /> Download</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}

      {tab === "saved" &&
        (saved.length === 0 ? (
          <Empty title="Your reading list is empty">Tap “Save to my library” on any book.</Empty>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {saved.map((s) => (
              <div key={s.id} className="card flex gap-4 p-4">
                <Cover src={s.book.cover} alt={s.book.title} className="h-28 w-20 shrink-0 rounded-md" />
                <div className="flex flex-1 flex-col">
                  <Link href={`/books/${s.book.slug}`} className="font-medium hover:underline">{s.book.title}</Link>
                  <p className="text-sm text-ink/60">{s.book.author}</p>
                  <div className="mt-auto flex gap-2 pt-3">
                    {s.book.has_pdf && (
                      <Link href={`/read/${s.book.slug}`} className="btn-primary btn-sm">
                        <BookOpen className="h-4 w-4" /> {s.book.is_free_read ? "Read" : "Preview"}
                      </Link>
                    )}
                    <button onClick={() => unsave(s.book.slug)} className="btn-ghost btn-sm text-rose" aria-label={`Remove ${s.book.title}`}><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
    </div>
  );
}
