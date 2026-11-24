"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AlertTriangle, BookOpen, Flower2, MessageCircle, Package, Users, Wallet } from "lucide-react";
import { api } from "@/lib/api";
import { ITEM_TYPE_LABEL, ORDER_STATUSES, dateTime, taka } from "@/lib/format";
import type { Order } from "@/lib/types";
import { Badge, PageLoader, StatCard } from "@/components/ui";

type Data = {
  stats: Record<string, number | string>;
  revenue_7d: { date: string; revenue: string | number }[];
  revenue_by_type: { type: string; revenue: string | number }[];
  orders_by_status: { status: string; count: number }[];
  low_stock: { books: { id: number; title: string; stock: number }[]; flowers: { id: number; name: string; stock: number }[] };
  recent_orders: Order[];
};

export default function CrmDashboard() {
  const [d, setD] = useState<Data | null>(null);
  useEffect(() => {
    api.get("/admin/dashboard/").then((r) => setD(r.data)).catch(() => {});
  }, []);
  if (!d) return <PageLoader />;

  const max = Math.max(1, ...d.revenue_7d.map((r) => Number(r.revenue)));
  const statusLabel = Object.fromEntries(ORDER_STATUSES);

  return (
    <div className="space-y-8">
      <h1 className="h-display text-3xl">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Revenue today" value={taka(d.stats.revenue_today)} icon={<Wallet className="h-5 w-5" />} />
        <StatCard label="Revenue (all time)" value={taka(d.stats.revenue_total)} icon={<Wallet className="h-5 w-5" />} />
        <StatCard label="Orders to fulfil" value={d.stats.orders_to_fulfil} icon={<Package className="h-5 w-5" />} />
        <StatCard label="Orders today" value={d.stats.orders_today} icon={<Package className="h-5 w-5" />} />
        <StatCard label="Customers" value={d.stats.customers} icon={<Users className="h-5 w-5" />} />
        <StatCard label="Unread messages" value={d.stats.unread_messages} icon={<MessageCircle className="h-5 w-5" />} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card p-6">
          <h2 className="h-display text-xl">Revenue, last 7 days</h2>
          <div className="mt-6 flex h-48 items-end gap-3" role="img" aria-label="Bar chart of revenue for the last 7 days">
            {d.revenue_7d.map((r) => (
              <div key={r.date} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-[11px] text-ink/60">{Number(r.revenue) ? taka(r.revenue) : ""}</span>
                <div className="w-full rounded-t-md bg-forest" style={{ height: `${(Number(r.revenue) / max) * 140 + 2}px` }} />
                <span className="text-xs text-ink/60">{new Date(r.date).toLocaleDateString("en-GB", { weekday: "short" })}</span>
              </div>
            ))}
          </div>
        </section>
        <section className="card p-6">
          <h2 className="h-display text-xl">Sales by product type</h2>
          <ul className="mt-4 space-y-3">
            {d.revenue_by_type.map((r) => (
              <li key={r.type} className="flex justify-between border-b border-ink/5 pb-2 text-sm">
                <span>{r.type}</span>
                <span className="font-medium">{taka(r.revenue)}</span>
              </li>
            ))}
          </ul>
          <h3 className="mt-6 font-medium">Orders by status</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {d.orders_by_status.map((s) => (
              <Link key={s.status} href={`/crm/orders?status=${s.status}`}><Badge value={s.status} label={`${statusLabel[s.status] ?? s.status}: ${s.count}`} /></Link>
            ))}
          </div>
        </section>
      </div>

      {(d.low_stock.books.length > 0 || d.low_stock.flowers.length > 0) && (
        <section className="card border-amber-300 p-6">
          <h2 className="flex items-center gap-2 font-medium text-amber-800"><AlertTriangle className="h-5 w-5" /> Low stock</h2>
          <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
            {d.low_stock.books.map((b) => <p key={`b${b.id}`}><BookOpen className="mr-1 inline h-4 w-4" />{b.title}: <b>{b.stock}</b> left</p>)}
            {d.low_stock.flowers.map((f) => <p key={`f${f.id}`}><Flower2 className="mr-1 inline h-4 w-4" />{f.name}: <b>{f.stock}</b> left</p>)}
          </div>
        </section>
      )}

      <section>
        <h2 className="h-display mb-3 text-xl">Latest orders</h2>
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Order</th><th>Customer</th><th>Items</th><th>Status</th><th>Payment</th><th>Total</th><th>Date</th></tr></thead>
            <tbody>
              {d.recent_orders.map((o) => (
                <tr key={o.id}>
                  <td><Link href={`/crm/orders/${o.id}`} className="font-medium text-forest underline">{o.order_number}</Link></td>
                  <td>{o.customer_email}</td>
                  <td className="max-w-[200px] truncate">{o.items.map((i) => `${i.quantity}× ${ITEM_TYPE_LABEL[i.item_type]}`).join(", ")}</td>
                  <td><Badge value={o.status} label={o.status_display} /></td>
                  <td><Badge value={o.payment_status} /></td>
                  <td>{taka(o.total)}</td>
                  <td className="whitespace-nowrap">{dateTime(o.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
