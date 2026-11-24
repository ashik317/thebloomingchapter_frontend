"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { api } from "@/lib/api";
import type { Book, Category, Paginated } from "@/lib/types";
import { BookCard } from "@/components/Cards";
import { Empty, PageLoader, Pager } from "@/components/ui";

const FILTERS = [
  ["", "All books"],
  ["is_free_read=true", "Free to read"],
  ["physical=true", "Printed copies"],
  ["downloadable=true", "PDF downloads"],
] as const;

export default function BooksPage() {
  const [data, setData] = useState<Paginated<Book> | null>(null);
  const [cats, setCats] = useState<Category[]>([]);
  const [q, setQ] = useState("");
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("");
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const initial = new URLSearchParams(window.location.search).get("category");
    if (initial) setCat(initial);
    api.get("/books/categories/").then((r) => setCats(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    const p = new URLSearchParams({ page: String(page) });
    if (search) p.set("search", search);
    if (cat) p.set("category", cat);
    const qs = `${p.toString()}${filter ? `&${filter}` : ""}`;
    setData(null);
    api.get(`/books/?${qs}`).then((r) => setData(r.data)).catch(() => setData({ count: 0, next: null, previous: null, results: [] }));
  }, [search, cat, filter, page]);

  return (
    <div className="container-page py-10">
      <h1 className="h-display text-4xl">Books</h1>
      <p className="mt-2 text-ink/60">Read online for free, preview any book, or buy the printed copy or PDF.</p>

      <form
        className="mt-6 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          setPage(1);
          setSearch(q);
        }}
      >
        <label className="relative flex-1">
          <span className="sr-only">Search books</span>
          <Search className="absolute left-3 top-3 h-5 w-5 text-ink/40" aria-hidden />
          <input className="input pl-10" placeholder="Search by title, author or ISBN" value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
        <button className="btn-primary">Search</button>
      </form>

      <div className="mt-5 flex flex-wrap gap-2">
        {FILTERS.map(([v, l]) => (
          <button key={l} className={filter === v ? "chip-active" : "chip"} onClick={() => { setFilter(v); setPage(1); }}>{l}</button>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <button className={cat === "" ? "chip-active" : "chip"} onClick={() => { setCat(""); setPage(1); }}>All categories</button>
        {cats.map((c) => (
          <button key={c.id} className={cat === c.slug ? "chip-active" : "chip"} onClick={() => { setCat(c.slug); setPage(1); }}>
            {c.name} <span className="opacity-60">({c.book_count ?? 0})</span>
          </button>
        ))}
      </div>

      <div className="mt-8">
        {!data ? (
          <PageLoader />
        ) : data.results.length === 0 ? (
          <Empty title="No books found">Try another search or category.</Empty>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
              {data.results.map((b) => <BookCard key={b.id} book={b} />)}
            </div>
            <Pager page={page} hasNext={!!data.next} hasPrev={!!data.previous} onChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
}
