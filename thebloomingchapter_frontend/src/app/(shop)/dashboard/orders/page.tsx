"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { date, taka } from "@/lib/format";
import type { Order, Paginated } from "@/lib/types";
import { Badge, Empty, PageLoader, Pager } from "@/components/ui";

export default function MyOrdersPage() {
  const [data, setData] = useState<Paginated<Order> | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    api.get(`/orders/?page=${page}`).then((r) => setData(r.data)).catch(() => {});
  }, [page]);

  if (!data) return <PageLoader />;
  return (
    <div>
      <h1 className="h-display mb-6 text-3xl">My orders</h1>
      {data.results.length === 0 ? (
        <Empty title="No orders yet"><Link href="/books" className="btn-primary mt-2">Start shopping</Link></Empty>
      ) : (
        <>
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Order</th><th>Date</th><th>Items</th><th>Status</th><th>Payment</th><th>Total</th></tr></thead>
              <tbody>
                {data.results.map((o) => (
                  <tr key={o.id}>
                    <td><Link href={`/dashboard/orders/${o.order_number}`} className="font-medium text-forest underline">{o.order_number}</Link></td>
                    <td>{date(o.created_at)}</td>
                    <td className="max-w-[220px] truncate">{o.items.map((i) => i.name).join(", ")}</td>
                    <td><Badge value={o.status} label={o.status_display} /></td>
                    <td><Badge value={o.payment_status} /></td>
                    <td className="whitespace-nowrap">{taka(o.total)}</td>
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
