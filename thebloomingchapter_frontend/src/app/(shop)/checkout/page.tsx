"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import clsx from "clsx";
import { api, errorMessage } from "@/lib/api";
import { taka } from "@/lib/format";
import type { Order } from "@/lib/types";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import RequireAuth from "@/components/RequireAuth";
import { Empty, Field, PageLoader } from "@/components/ui";
import { Gateway, GatewayPicker, startPayment } from "@/components/PayButtons";

const FULFILMENT = [
  { id: "pickup", title: "Pick up at shop", note: "Free" },
  { id: "dine_in", title: "Dine in", note: "We'll bring it to your table" },
  { id: "delivery", title: "Home delivery", note: "Delivery fee applies" },
];

function Checkout() {
  const { user } = useAuth();
  const { cart, refresh } = useCart();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [gateway, setGateway] = useState<Gateway>("bkash");
  const [form, setForm] = useState({ fulfillment: "pickup", contact_name: "", contact_phone: "", address: "", city: "Dhaka", note: "" });

  useEffect(() => {
    if (user) setForm((f) => ({ ...f, contact_name: user.full_name, contact_phone: user.phone, address: user.address, city: user.city || "Dhaka" }));
  }, [user]);

  if (!cart) return <PageLoader />;
  if (cart.items.length === 0) return <div className="container-page py-16"><Empty title="Your cart is empty" /></div>;

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm({ ...form, [k]: e.target.value });
  const delivery = !cart.only_digital && form.fulfillment === "delivery";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    let order: Order | null = null;
    try {
      const { data } = await api.post<Order>("/orders/checkout/", cart.only_digital ? { ...form, fulfillment: "digital" } : form);
      order = data;
      await refresh();
      await startPayment(order.order_number, gateway);
    } catch (err) {
      toast.error(errorMessage(err));
      setBusy(false);
      if (order) router.push(`/dashboard/orders/${order.order_number}`);
    }
  };

  return (
    <form onSubmit={submit} className="container-page grid gap-8 py-10 lg:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        <h1 className="h-display text-4xl">Checkout</h1>
        {!cart.only_digital && (
          <fieldset className="grid gap-3 sm:grid-cols-3">
            <legend className="label">How would you like it?</legend>
            {FULFILMENT.map((f) => (
              <label key={f.id} className={clsx("card flex cursor-pointer gap-3 p-4", form.fulfillment === f.id && "border-forest ring-2 ring-forest/20")}>
                <input type="radio" name="fulfillment" className="mt-1 accent-forest" checked={form.fulfillment === f.id} onChange={() => setForm({ ...form, fulfillment: f.id })} />
                <span>
                  <span className="block font-medium">{f.title}</span>
                  <span className="text-sm text-ink/60">{f.note}</span>
                </span>
              </label>
            ))}
          </fieldset>
        )}
        <div className="card grid gap-4 p-6 sm:grid-cols-2">
          <Field label="Full name"><input className="input" value={form.contact_name} onChange={set("contact_name")} required /></Field>
          <Field label="Phone"><input className="input" value={form.contact_phone} onChange={set("contact_phone")} required placeholder="01XXXXXXXXX" /></Field>
          {delivery && (
            <>
              <div className="sm:col-span-2"><Field label="Delivery address"><textarea className="input" rows={2} value={form.address} onChange={set("address")} required /></Field></div>
              <Field label="City"><input className="input" value={form.city} onChange={set("city")} required /></Field>
            </>
          )}
          <div className="sm:col-span-2"><Field label="Note (optional)"><textarea className="input" rows={2} value={form.note} onChange={set("note")} placeholder="Gift message for the flowers, sugar level for coffee…" /></Field></div>
        </div>
        <GatewayPicker value={gateway} onChange={setGateway} />
      </div>

      <aside className="card h-fit p-6 lg:mt-16">
        <h2 className="h-display text-xl">Order summary</h2>
        <ul className="mt-4 space-y-2 text-sm">
          {cart.items.map((i) => (
            <li key={i.id} className="flex justify-between gap-3">
              <span>{i.quantity} × {i.name}</span>
              <span>{taka(i.line_total)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 space-y-1 border-t border-ink/10 pt-4 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>{taka(cart.subtotal)}</span></div>
          {delivery && cart.needs_shipping && <div className="flex justify-between text-ink/60"><span>Delivery</span><span>calculated on order</span></div>}
        </div>
        <button className="btn-primary mt-6 w-full" disabled={busy}>{busy ? "Redirecting to payment…" : "Place order & pay"}</button>
        <p className="mt-3 text-xs text-ink/50">You&apos;ll be taken to the secure {gateway === "bkash" ? "bKash" : "SSLCommerz"} page to complete the payment.</p>
      </aside>
    </form>
  );
}

export default function CheckoutPage() {
  return (
    <RequireAuth>
      <Checkout />
    </RequireAuth>
  );
}
