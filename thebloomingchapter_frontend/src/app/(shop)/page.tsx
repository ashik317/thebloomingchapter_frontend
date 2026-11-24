"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BookOpen, Coffee, Flower2 } from "lucide-react";
import { api, rows } from "@/lib/api";
import type { Book, Flower, MenuItem } from "@/lib/types";
import { BookCard, FlowerCard, MenuCard } from "@/components/Cards";

export default function HomePage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [flowers, setFlowers] = useState<Flower[]>([]);

  useEffect(() => {
    api.get("/books/?is_featured=true&page_size=5").then((r) => setBooks(rows(r.data))).catch(() => {});
    api.get("/cafe/items/?is_featured=true").then((r) => setMenu(rows<MenuItem>(r.data).slice(0, 4))).catch(() => {});
    api.get("/flowers/?is_featured=true&page_size=4").then((r) => setFlowers(rows(r.data))).catch(() => {});
  }, []);

  return (
    <>
      <section className="bg-forest text-cream">
        <div className="container-page grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-rose-light">Books · Coffee · Flowers</p>
            <h1 className="mt-4 font-display text-4xl font-medium leading-tight sm:text-5xl">A quiet corner to read, sip and send something beautiful.</h1>
            <p className="mt-5 max-w-lg text-cream/80">
              Read books online, buy the printed copy or the PDF, order your coffee before you arrive, and send fresh flowers anywhere in the city.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/books" className="btn bg-cream text-forest hover:bg-white">Browse books</Link>
              <Link href="/flowers" className="btn-rose">Send flowers</Link>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: BookOpen, t: "Read online", d: "Free classics and previews" },
              { icon: Coffee, t: "Café", d: "Coffee, tea and bakes" },
              { icon: Flower2, t: "Flowers", d: "Bouquets for every occasion" },
            ].map(({ icon: Icon, t, d }) => (
              <div key={t} className="rounded-2xl bg-forest-light p-5">
                <Icon className="h-7 w-7 text-rose-light" aria-hidden />
                <p className="mt-4 font-display text-lg">{t}</p>
                <p className="mt-1 text-sm text-cream/70">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Section title="Featured books" href="/books">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
          {books.map((b) => <BookCard key={b.id} book={b} />)}
        </div>
      </Section>

      <Section title="From the café" href="/cafe">
        <div className="grid gap-4 md:grid-cols-2">
          {menu.map((m) => <MenuCard key={m.id} item={m} />)}
        </div>
      </Section>

      <Section title="Fresh flowers" href="/flowers">
        <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
          {flowers.map((f) => <FlowerCard key={f.id} flower={f} />)}
        </div>
      </Section>
    </>
  );
}

function Section({ title, href, children }: { title: string; href: string; children: React.ReactNode }) {
  return (
    <section className="container-page mt-14">
      <div className="mb-6 flex items-end justify-between">
        <h2 className="h-display text-3xl">{title}</h2>
        <Link href={href} className="text-sm font-medium text-rose hover:underline">See all →</Link>
      </div>
      {children}
    </section>
  );
}
