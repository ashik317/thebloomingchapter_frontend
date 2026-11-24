"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BookOpen, Bookmark, BookmarkCheck, Download, FileText, ShoppingBag } from "lucide-react";
import { api, downloadFile, errorMessage } from "@/lib/api";
import { taka } from "@/lib/format";
import type { BookDetail } from "@/lib/types";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { Cover, PageLoader } from "@/components/ui";

export default function BookDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const { add } = useCart();
  const router = useRouter();
  const [book, setBook] = useState<BookDetail | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    api.get(`/books/${slug}/`).then((r) => setBook(r.data)).catch(() => setNotFound(true));
  }, [slug]);

  useEffect(load, [load, user]);

  if (notFound) return <div className="container-page py-20 text-center"><p className="h-display text-2xl">Book not found</p></div>;
  if (!book) return <PageLoader />;
  const a = book.access;

  const needLogin = () => {
    router.push(`/login?next=/books/${slug}`);
  };

  const toggleSave = async () => {
    if (!user) return needLogin();
    try {
      if (a.is_saved) await api.delete(`/books/library/${slug}/`);
      else await api.post("/books/library/", { book_id: book.id });
      toast.success(a.is_saved ? "Removed from your library" : "Saved to your library");
      load();
    } catch (e) {
      toast.error(errorMessage(e));
    }
  };

  const download = async () => {
    setBusy(true);
    try {
      await downloadFile(`/books/${slug}/download/`, `${book.slug}.pdf`);
    } catch (e) {
      toast.error(errorMessage(e, "Download failed."));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container-page grid gap-10 py-10 md:grid-cols-[280px_1fr]">
      <Cover src={book.cover} alt={book.title} className="aspect-[2/3] w-full max-w-[280px] rounded-2xl shadow-md" />
      <div>
        <div className="flex flex-wrap gap-2">
          {book.categories.map((c) => (
            <Link key={c.id} href={`/books?category=${c.slug}`} className="chip text-xs">{c.name}</Link>
          ))}
        </div>
        <h1 className="h-display mt-3 text-4xl">{book.title}</h1>
        <p className="mt-1 text-lg text-ink/70">by {book.author.name}</p>
        <p className="mt-5 max-w-2xl whitespace-pre-line leading-relaxed text-ink/80">{book.description}</p>

        <dl className="mt-6 grid max-w-lg grid-cols-2 gap-y-2 text-sm">
          {book.language && <><dt className="text-ink/50">Language</dt><dd>{book.language}</dd></>}
          {book.page_count && <><dt className="text-ink/50">Pages</dt><dd>{book.page_count}</dd></>}
          {book.publisher && <><dt className="text-ink/50">Publisher</dt><dd>{book.publisher}</dd></>}
          {book.published_year && <><dt className="text-ink/50">Published</dt><dd>{book.published_year}</dd></>}
          {book.isbn && <><dt className="text-ink/50">ISBN</dt><dd>{book.isbn}</dd></>}
        </dl>

        <div className="mt-8 grid max-w-3xl gap-4 sm:grid-cols-3">
          {a.can_read && (
            <div className="card flex flex-col p-5">
              <BookOpen className="h-6 w-6 text-forest" aria-hidden />
              <p className="mt-3 font-medium">Read online</p>
              <p className="mt-1 flex-1 text-sm text-ink/60">
                {a.can_read_full ? "Full book, free in your browser." : `Preview the first ${book.preview_pages} pages.`}
              </p>
              <button className="btn-primary mt-4" onClick={() => (user ? router.push(`/read/${slug}`) : needLogin())}>
                {a.can_read_full ? "Start reading" : "Read preview"}
              </button>
            </div>
          )}
          {book.sells_download && (
            <div className="card flex flex-col p-5">
              <FileText className="h-6 w-6 text-rose" aria-hidden />
              <p className="mt-3 font-medium">PDF download</p>
              <p className="mt-1 flex-1 text-sm text-ink/60">
                {a.owns_download ? "You own this PDF." : `Keep it forever: ${taka(book.download_price)}`}
              </p>
              {a.can_download ? (
                <button className="btn-rose mt-4" onClick={download} disabled={busy}>
                  <Download className="h-4 w-4" /> Download PDF
                </button>
              ) : (
                <button className="btn-rose mt-4" onClick={() => add("book_digital", book.id)}>Buy PDF {taka(book.download_price)}</button>
              )}
            </div>
          )}
          {book.sells_physical && (
            <div className="card flex flex-col p-5">
              <ShoppingBag className="h-6 w-6 text-teak" aria-hidden />
              <p className="mt-3 font-medium">Printed book</p>
              <p className="mt-1 flex-1 text-sm text-ink/60">
                {book.stock > 0 ? `${book.stock} in stock · delivery or pickup` : "Out of stock"}
              </p>
              <button className="btn-outline mt-4" disabled={book.stock < 1} onClick={() => add("book_physical", book.id)}>
                Add to cart {taka(book.physical_price)}
              </button>
            </div>
          )}
        </div>

        <button onClick={toggleSave} className="btn-ghost mt-6">
          {a.is_saved ? <BookmarkCheck className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
          {a.is_saved ? "In your library" : "Save to my library"}
        </button>
      </div>
    </div>
  );
}
