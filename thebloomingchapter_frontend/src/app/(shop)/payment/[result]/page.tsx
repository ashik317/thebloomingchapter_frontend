"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function PaymentResultPage() {
  const { result } = useParams<{ result: string }>();
  const { refresh } = useCart();
  const [order, setOrder] = useState("");

  useEffect(() => {
    setOrder(new URLSearchParams(window.location.search).get("order") || "");
    refresh();
    window.dispatchEvent(new Event("bb:notifications"));
  }, [refresh]);

  const ok = result === "success";
  return (
    <div className="container-page flex justify-center py-20">
      <div className="card max-w-lg p-10 text-center">
        {ok ? <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-600" aria-hidden /> : <XCircle className="mx-auto h-14 w-14 text-rose" aria-hidden />}
        <h1 className="h-display mt-4 text-3xl">
          {ok ? "Payment successful" : result === "cancelled" ? "Payment cancelled" : "Payment failed"}
        </h1>
        <p className="mt-3 text-ink/70">
          {ok
            ? "Thank you! We've emailed your receipt. Any PDF books are now in your library."
            : "No money was taken. You can try again from your order page."}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {order && <Link href={`/dashboard/orders/${order}`} className="btn-primary">View order</Link>}
          {ok && <Link href="/dashboard/library" className="btn-outline">My library</Link>}
          <Link href="/" className="btn-ghost">Home</Link>
        </div>
      </div>
    </div>
  );
}
