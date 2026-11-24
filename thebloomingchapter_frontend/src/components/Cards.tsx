"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { taka } from "@/lib/format";
import type { Book, Flower, MenuItem } from "@/lib/types";
import { Cover } from "./ui";

export function BookCard({ book }: { book: Book }) {
  return (
    <Link href={`/books/${book.slug}`} className="group flex flex-col">
      <div className="overflow-hidden rounded-xl shadow-sm">
        <Cover src={book.cover} alt={book.title} className="aspect-[2/3] w-full transition group-hover:scale-[1.03]" />
      </div>
      <p className="mt-3 line-clamp-2 font-medium text-ink group-hover:text-forest">{book.title}</p>
      <p className="text-sm text-ink/60">{book.author}</p>
      <div className="mt-1 flex flex-wrap gap-1.5 text-xs">
        {book.is_free_read && <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-800">Free to read</span>}
        {book.sells_physical && <span className="rounded-full bg-cream-dark px-2 py-0.5">Print {taka(book.physical_price)}</span>}
        {book.sells_download && <span className="rounded-full bg-rose-light/60 px-2 py-0.5 text-rose-dark">PDF {taka(book.download_price)}</span>}
      </div>
    </Link>
  );
}

export function MenuCard({ item }: { item: MenuItem }) {
  const { add } = useCart();
  return (
    <div className="card flex gap-4 p-4">
      <Cover src={item.image} alt={item.name} className="h-20 w-20 shrink-0 rounded-xl" />
      <div className="flex flex-1 flex-col">
        <p className="font-medium">{item.name}</p>
        <p className="line-clamp-2 text-sm text-ink/60">{item.description}</p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="font-display text-lg text-forest">{taka(item.price)}</span>
          <button className="btn-primary btn-sm" onClick={() => add("menu", item.id)} aria-label={`Add ${item.name} to cart`}>
            <Plus className="h-4 w-4" /> Add
          </button>
        </div>
      </div>
    </div>
  );
}

export function FlowerCard({ flower }: { flower: Flower }) {
  const { add } = useCart();
  const soldOut = flower.stock < 1;
  return (
    <div className="card flex flex-col overflow-hidden">
      <Cover src={flower.image} alt={flower.name} className="aspect-square w-full bg-rose" />
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs uppercase tracking-wider text-rose">{flower.category_name}</p>
        <p className="mt-1 font-medium">{flower.name}</p>
        <p className="line-clamp-2 text-sm text-ink/60">{flower.description}</p>
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="font-display text-lg text-forest">{taka(flower.price)}</span>
          <button className="btn-rose btn-sm" disabled={soldOut} onClick={() => add("flower", flower.id)}>
            {soldOut ? "Sold out" : <><Plus className="h-4 w-4" /> Add</>}
          </button>
        </div>
      </div>
    </div>
  );
}
