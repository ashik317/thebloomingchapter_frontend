"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { dateTime, taka } from "@/lib/format";
import type { Paginated } from "@/lib/types";
import { Badge, PageLoader, Pager } from "@/components/ui";

type Payment = {
  id: number;
  order_number: string;
  customer_email: string;
  provider: string;
  tran_id: string;
  gateway_trx_id: string;
  amount: string;
  status: string;
  created_at: string;
};

export default function CrmPaymentsPage() {
  const [data, setData] = useState<Paginated<Payment> | null>(null);
  const [provider, setProvider] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const p = new URLSearchParams({ page: String(page) });
    if (provider) p.set("provider", provider);
    if (status) p.set("status", status);
    api.get(`/admin/payments/?${p}`).then((r) => setData(r.data)).catch(() => {});
  }, [provider, status, page]);

  return (
    <div>
      <h1 className="h-display mb-6 text-3xl">Payments</h1>
      <div className="mb-5 flex flex-wrap gap-3">
        <label><span className="sr-only">Gateway</span>
          <select className="input w-48" value={provider} onChange={(e) => { setProvider(e.target.value); setPage(1); }}>
            <option value="">All gateways</option>
            <option value="bkash">bKash</option>
            <option value="sslcommerz">SSLCommerz</option>
          </select>
        </label>
        <label><span className="sr-only">Status</span>
          <select className="input w-44" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
            <option value="">Any status</option>
            <option value="success">Success</option>
            <option value="initiated">Initiated</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </label>
      </div>
      {!data ? (
        <PageLoader />
      ) : (
        <>
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Transaction</th><th>Order</th><th>Customer</th><th>Gateway</th><th>Gateway trx</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>
                {data.results.map((p) => (
                  <tr key={p.id}>
                    <td className="font-mono text-xs">{p.tran_id}</td>
                    <td>{p.order_number}</td>
                    <td>{p.customer_email}</td>
                    <td>{p.provider === "bkash" ? "bKash" : "SSLCommerz"}</td>
                    <td className="font-mono text-xs">{p.gateway_trx_id || "—"}</td>
                    <td>{taka(p.amount)}</td>
                    <td><Badge value={p.status} /></td>
                    <td className="whitespace-nowrap">{dateTime(p.created_at)}</td>
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
