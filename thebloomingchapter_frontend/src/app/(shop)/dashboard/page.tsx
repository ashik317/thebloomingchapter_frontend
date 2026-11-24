"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Bell, BookOpen, MessageCircle, Package, Wallet } from "lucide-react";
import { api } from "@/lib/api";
import { date, taka } from "@/lib/format";
import type { Order, ReadingProgress } from "@/lib/types";
import { useAuth } from "@/context/AuthContext";
import { Badge, Cover, PageLoader, StatCard } from "@/components/ui";

type Data = {
  stats: { orders: number; active_orders: number; total_spent: string; books_owned: number; saved_books: number; unread_notifications: number; unread_messages: number };
  continue_reading: ReadingProgress[];
  recent_orders: Order[];
};

export default function DashboardHome() {
  const { user } = useAuth();
  const [data, setData] = useState<Data | null>(null);

  useEffect(() => {
    api.get("/dashboard/").then((r) => setData(r.data)).catch(() => {});
  }, []);

  if (!data) return <PageLoader />;
  const s = data.stats;

  return (
    <div className="space-y-8">
      <h1 className="h-display text-3xl">Hello, {user?.full_name || user?.email.split("@")[0]}</h1>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active orders" value={s.active_orders} icon={<Package className="h-5 w-5" />} />
        <StatCard label="PDF books owned" value={s.books_owned} icon={<BookOpen className="h-5 w-5" />} />
        <StatCard label="Total spent" value={taka(s.total_spent)} icon={<Wallet className="h-5 w-5" />} />
        <StatCard label="Unread" value={`${s.unread_notifications} / ${s.unread_messages}`} icon={s.unread_messages ? <MessageCircle className="h-5 w-5" /> : <Bell className="h-5 w-5" />} />
      </div>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="h-display text-xl">Continue reading</h2>
          <Link href="/dashboard/library" className="text-sm text-rose hover:underline">My library →</Link>
        </div>
        {data.continue_reading.length === 0 ? (
          <p className="text-sm text-ink/60">Nothing yet. <Link href="/books?is_free_read=true" className="underline">Find a free book to read</Link>.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {data.continue_reading.map((p) => (
              <Link key={p.book.id} href={`/read/${p.book.slug}`} className="card flex gap-4 p-4 hover:border-forest">
                <Cover src={p.book.cover} alt={p.book.title} className="h-24 w-16 shrink-0 rounded-md" />
                <div>
                  <p className="font-medium">{p.book.title}</p>
                  <p className="text-sm text-ink/60">{p.book.author}</p>
                  <p className="mt-2 text-sm text-forest">Page {p.last_page} · continue →</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="h-display text-xl">Recent orders</h2>
          <Link href="/dashboard/orders" className="text-sm text-rose hover:underline">All orders →</Link>
        </div>
        {data.recent_orders.length === 0 ? (
          <p className="text-sm text-ink/60">No orders yet.</p>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Order</th><th>Date</th><th>Status</th><th>Total</th></tr></thead>
              <tbody>
                {data.recent_orders.map((o) => (
                  <tr key={o.id}>
                    <td><Link href={`/dashboard/orders/${o.order_number}`} className="font-medium text-forest underline">{o.order_number}</Link></td>
                    <td>{date(o.created_at)}</td>
                    <td><Badge value={o.status} label={o.status_display} /></td>
                    <td>{taka(o.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
