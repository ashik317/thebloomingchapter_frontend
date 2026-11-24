"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import clsx from "clsx";
import { api, errorMessage } from "@/lib/api";

export type Gateway = "sslcommerz" | "bkash";

export const GATEWAYS: { id: Gateway; title: string; note: string }[] = [
  { id: "bkash", title: "bKash", note: "Pay directly from your bKash account" },
  { id: "sslcommerz", title: "Card / Nagad / Rocket / Bank", note: "Secure checkout by SSLCommerz (bKash also available)" },
];

/** Starts a payment for an existing order and sends the browser to the gateway page. */
export async function startPayment(orderNumber: string, gateway: Gateway) {
  const { data } = await api.post(`/payments/${gateway}/init/`, { order_number: orderNumber });
  window.location.href = data.redirect_url;
}

export function GatewayPicker({ value, onChange }: { value: Gateway; onChange: (g: Gateway) => void }) {
  return (
    <fieldset className="grid gap-3 sm:grid-cols-2">
      <legend className="label">Payment method</legend>
      {GATEWAYS.map((g) => (
        <label key={g.id} className={clsx("card flex cursor-pointer gap-3 p-4", value === g.id && "border-forest ring-2 ring-forest/20")}>
          <input type="radio" name="gateway" checked={value === g.id} onChange={() => onChange(g.id)} className="mt-1 accent-forest" />
          <span>
            <span className={clsx("block font-medium", g.id === "bkash" && "text-[#E2136E]")}>{g.title}</span>
            <span className="text-sm text-ink/60">{g.note}</span>
          </span>
        </label>
      ))}
    </fieldset>
  );
}

export function PayNow({ orderNumber }: { orderNumber: string }) {
  const [gateway, setGateway] = useState<Gateway>("bkash");
  const [busy, setBusy] = useState(false);
  const pay = async () => {
    setBusy(true);
    try {
      await startPayment(orderNumber, gateway);
    } catch (e) {
      toast.error(errorMessage(e, "Could not start the payment."));
      setBusy(false);
    }
  };
  return (
    <div className="space-y-4">
      <GatewayPicker value={gateway} onChange={setGateway} />
      <button className="btn-primary w-full sm:w-auto" onClick={pay} disabled={busy}>{busy ? "Redirecting…" : "Pay now"}</button>
    </div>
  );
}
