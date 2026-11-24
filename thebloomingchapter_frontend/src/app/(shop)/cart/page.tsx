"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { ITEM_TYPE_LABEL, taka } from "@/lib/format";
import { Cover, Empty, PageLoader } from "@/components/ui";

export default function CartPage() {
  const { user, loading } = useAuth();
  const { cart, update, remove } = useCart();

  if (loading) return <PageLoader />;
  if (!user)
    return (
      <div className="container-page py-16">
        <Empty title="Log in to see your cart">
          <Link href="/login?next=/cart" className="btn-primary mt-2">Log in</Link>
        </Empty>
      </div>
    );
  if (!cart) return <PageLoader />;

  return (
    <div className="container-page py-10">
      <h1 className="h-display text-4xl">Your cart</h1>
      {cart.items.length === 0 ? (
        <div className="mt-8">
          <Empty title="Your cart is empty">
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              <Link href="/books" className="btn-outline btn-sm">Books</Link>
              <Link href="/cafe" className="btn-outline btn-sm">Café</Link>
              <Link href="/flowers" className="btn-outline btn-sm">Flowers</Link>
            </div>
          </Empty>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
          <ul className="card divide-y divide-ink/10">
            {cart.items.map((i) => (
              <li key={i.id} className="flex flex-wrap items-center gap-4 p-4">
                <Cover src={i.image} alt={i.name} className="h-20 w-16 shrink-0 rounded-lg" />
                <div className="min-w-[160px] flex-1">
                  <p className="font-medium">{i.name}</p>
                  <p className="text-xs uppercase tracking-wider text-ink/50">{ITEM_TYPE_LABEL[i.item_type]}</p>
                  <p className="mt-1 text-sm text-ink/70">{taka(i.unit_price)} each</p>
                </div>
                {i.item_type === "book_digital" ? (
                  <span className="text-sm text-ink/50">1 download</span>
                ) : (
                  <div className="flex items-center gap-1">
                    <button className="btn-outline btn-sm" aria-label="Decrease" disabled={i.quantity <= 1} onClick={() => update(i.id, i.quantity - 1)}><Minus className="h-3 w-3" /></button>
                    <span className="w-8 text-center">{i.quantity}</span>
                    <button className="btn-outline btn-sm" aria-label="Increase" onClick={() => update(i.id, i.quantity + 1)}><Plus className="h-3 w-3" /></button>
                  </div>
                )}
                <p className="w-24 text-right font-medium">{taka(i.line_total)}</p>
                <button className="btn-ghost btn-sm text-rose" aria-label={`Remove ${i.name}`} onClick={() => remove(i.id)}><Trash2 className="h-4 w-4" /></button>
              </li>
            ))}
          </ul>
          <aside className="card h-fit p-6">
            <div className="flex justify-between text-lg">
              <span>Subtotal</span>
              <span className="font-display text-forest">{taka(cart.subtotal)}</span>
            </div>
            <p className="mt-2 text-sm text-ink/60">
              {cart.needs_shipping ? "Delivery fee is added at checkout if you choose home delivery." : "No delivery needed."}
            </p>
            <Link href="/checkout" className="btn-primary mt-6 w-full">Checkout</Link>
          </aside>
        </div>
      )}
    </div>
  );
}
