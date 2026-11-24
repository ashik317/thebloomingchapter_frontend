"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import { api, errorMessage } from "@/lib/api";
import { ITEM_TYPE_LABEL, ORDER_STATUSES, dateTime, taka } from "@/lib/format";
import type { Order } from "@/lib/types";
import { Badge, Field, PageLoader } from "@/components/ui";

export default function CrmOrderDetail() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [status, setStatus] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.get(`/admin/orders/${id}/`).then((r) => {
      setOrder(r.data);
      setStatus(r.data.status);
      setNote(r.data.note);
    });
  }, [id]);

  const save = async () => {
    setBusy(true);
    try {
      const { data } = await api.patch(`/admin/orders/${id}/`, { status, note });
      setOrder(data);
      toast.success("Order updated. The customer was notified.");
    } catch (e) {
      toast.error(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  if (!order) return <PageLoader />;
  return (
    <div className="space-y-6">
      <Link href="/crm/orders" className="btn-ghost btn-sm"><ArrowLeft className="h-4 w-4" /> All orders</Link>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="h-display text-3xl">{order.order_number}</h1>
        <Badge value={order.status} label={order.status_display} />
        <Badge value={order.payment_status} />
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="card divide-y divide-ink/10">
          {order.items.map((i) => (
            <div key={i.id} className="flex items-center justify-between gap-4 p-4 text-sm">
              <div>
                <p className="font-medium">{i.name}</p>
                <p className="text-xs text-ink/50">{ITEM_TYPE_LABEL[i.item_type]}</p>
              </div>
              <span>{i.quantity} × {taka(i.unit_price)}</span>
              <span className="font-medium">{taka(i.line_total)}</span>
            </div>
          ))}
          <div className="space-y-1 p-4 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>{taka(order.subtotal)}</span></div>
            <div className="flex justify-between"><span>Delivery</span><span>{taka(order.delivery_fee)}</span></div>
            <div className="flex justify-between font-medium"><span>Total</span><span>{taka(order.total)}</span></div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="card space-y-2 p-5 text-sm">
            <p className="font-medium">Customer</p>
            <p>{order.contact_name}</p>
            <p>{order.contact_phone}</p>
            <p>{order.customer_email}</p>
            <p className="text-ink/60">{order.fulfillment_display}</p>
            {order.address && <p>{order.address}, {order.city}</p>}
            <p className="text-ink/60">Placed {dateTime(order.created_at)}</p>
            {order.paid_at && <p className="text-ink/60">Paid {dateTime(order.paid_at)} via {order.payment_method}</p>}
          </div>
          <div className="card space-y-4 p-5">
            <Field label="Order status">
              <select className="input" value={status} onChange={(e) => setStatus(e.target.value)}>
                {ORDER_STATUSES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </Field>
            <Field label="Note"><textarea className="input" rows={3} value={note} onChange={(e) => setNote(e.target.value)} /></Field>
            <button className="btn-primary w-full" onClick={save} disabled={busy}>Save &amp; notify customer</button>
          </div>
        </div>
      </div>
    </div>
  );
}
