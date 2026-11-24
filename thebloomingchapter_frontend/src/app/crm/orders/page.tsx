"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { api } from "@/lib/api";
import { ORDER_STATUSES, dateTime, taka } from "@/lib/format";
import type { Order, Paginated } from "@/lib/types";
import { Badge, Empty, PageLoader, Pager } from "@/components/ui";

export default function CrmOrdersPage() {
  const [data, setData] = useState<Paginated<Order> | null>(null);
  const [status, setStatus] = useState("");
  const [payment, setPayment] = useState("");
  const [q, setQ] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const s = new URLSearchParams(window.location.search).get("status");
    if (s) setStatus(s);
  }, []);

  useEffect(() => {
    const p = new URLSearchParams({ page: String(page) });
    if (status) p.set("status", status);
    if (payment) p.set("payment_status", payment);
    if (search) p.set("search", search);
    setData(null);
    api.get(`/admin/orders/?${p}`).then((r) => setData(r.data)).catch(() => {});
  }, [status, payment, search, page]);

  return (
    <div>
      <h1 className="h-display mb-6 text-3xl">Orders</h1>
      <div className="mb-5 flex flex-wrap gap-3">
        <form onSubmit={(e) => { e.preventDefault(); setPage(1); setSearch(q); }} className="relative">
          <label>
            <span className="sr-only">Search orders</span>
            <Search className="absolute left-3 top-3 h-4 w-4 text-ink/40" aria-hidden />
            <input className="input w-64 pl-9" placeholder="Order no, email, phone" value={q} onChange={(e) => setQ(e.target.value)} />
          </label>
        </form>
        <label>
          <span className="sr-only">Order status</span>
          <select className="input w-52" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
            <option value="">All statuses</option>
            {ORDER_STATUSES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </label>
        <label>
          <span className="sr-only">Payment status</span>
          <select className="input w-44" value={payment} onChange={(e) => { setPayment(e.target.value); setPage(1); }}>
            <option value="">Any payment</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
        </label>
      </div>
      {!data ? (
        <PageLoader />
      ) : data.results.length === 0 ? (
        <Empty title="No orders match" />
      ) : (
        <>
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Order</th><th>Customer</th><th>Fulfilment</th><th>Status</th><th>Payment</th><th>Total</th><th>Date</th></tr></thead>
              <tbody>
                {data.results.map((o) => (
                  <tr key={o.id}>
                    <td><Link href={`/crm/orders/${o.id}`} className="font-medium text-forest underline">{o.order_number}</Link></td>
                    <td><p>{o.contact_name}</p><p className="text-xs text-ink/50">{o.customer_email}</p></td>
                    <td>{o.fulfillment_display}</td>
                    <td><Badge value={o.status} label={o.status_display} /></td>
                    <td><Badge value={o.payment_status} />{o.payment_method && <p className="mt-1 text-xs text-ink/50">{o.payment_method}</p>}</td>
                    <td className="whitespace-nowrap">{taka(o.total)}</td>
                    <td className="whitespace-nowrap">{dateTime(o.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pager page={page} hasNext={!!data.next} hasPrev={!!data.previous} onChange={setPage} />
        </>
      )}
    </div>
  );
}
