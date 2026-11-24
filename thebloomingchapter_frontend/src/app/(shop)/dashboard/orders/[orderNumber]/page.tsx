"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api, errorMessage } from "@/lib/api";
import { ITEM_TYPE_LABEL, dateTime, taka } from "@/lib/format";
import type { Order } from "@/lib/types";
import { Badge, Cover, PageLoader } from "@/components/ui";
import { PayNow } from "@/components/PayButtons";

export default function OrderDetailPage() {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [missing, setMissing] = useState(false);

  const load = useCallback(() => {
    api.get(`/orders/${orderNumber}/`).then((r) => setOrder(r.data)).catch(() => setMissing(true));
  }, [orderNumber]);
  useEffect(load, [load]);

  const cancel = async () => {
    try {
      const { data } = await api.post(`/orders/${orderNumber}/cancel/`);
      setOrder(data);
      toast.success("Order cancelled");
    } catch (e) {
      toast.error(errorMessage(e));
    }
  };

  if (missing) return <p>Order not found.</p>;
  if (!order) return <PageLoader />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="h-display text-3xl">Order {order.order_number}</h1>
        <Badge value={order.status} label={order.status_display} />
        <Badge value={order.payment_status} />
      </div>
      <p className="text-sm text-ink/60">Placed {dateTime(order.created_at)} · {order.fulfillment_display}{order.payment_method && ` · paid via ${order.payment_method}`}</p>

      {order.is_payable && (
        <div className="card space-y-4 border-amber-300 bg-amber-50/50 p-6">
          <p className="font-medium">This order is waiting for payment ({taka(order.total)}).</p>
          <PayNow orderNumber={order.order_number} />
          <button onClick={cancel} className="btn-ghost btn-sm text-rose">Cancel order</button>
        </div>
      )}

      <div className="card divide-y divide-ink/10">
        {order.items.map((i) => (
          <div key={i.id} className="flex flex-wrap items-center gap-4 p-4">
            <Cover src={i.image} alt={i.name} className="h-16 w-12 shrink-0 rounded" />
            <div className="flex-1">
              <p className="font-medium">{i.name}</p>
              <p className="text-xs uppercase tracking-wider text-ink/50">{ITEM_TYPE_LABEL[i.item_type]}</p>
            </div>
            {i.item_type === "book_digital" && order.payment_status === "paid" && i.product_slug && (
              <Link href={`/books/${i.product_slug}`} className="btn-outline btn-sm">Read / download</Link>
            )}
            <span className="text-sm text-ink/60">{i.quantity} × {taka(i.unit_price)}</span>
            <span className="w-24 text-right font-medium">{taka(i.line_total)}</span>
          </div>
        ))}
        <div className="space-y-1 p-4 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>{taka(order.subtotal)}</span></div>
          <div className="flex justify-between"><span>Delivery</span><span>{taka(order.delivery_fee)}</span></div>
          <div className="flex justify-between text-lg font-medium"><span>Total</span><span className="font-display text-forest">{taka(order.total)}</span></div>
        </div>
      </div>

      <div className="card grid gap-2 p-5 text-sm sm:grid-cols-2">
        <p><span className="text-ink/50">Name:</span> {order.contact_name}</p>
        <p><span className="text-ink/50">Phone:</span> {order.contact_phone}</p>
        {order.address && <p className="sm:col-span-2"><span className="text-ink/50">Address:</span> {order.address}, {order.city}</p>}
        {order.note && <p className="sm:col-span-2"><span className="text-ink/50">Note:</span> {order.note}</p>}
      </div>
    </div>
  );
}
