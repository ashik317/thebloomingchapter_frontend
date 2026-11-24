"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { api, errorMessage } from "@/lib/api";
import { Field } from "@/components/ui";

export default function CrmBroadcastPage() {
  const [form, setForm] = useState({ title: "", message: "", link: "", kind: "promo", send_email: false });
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!window.confirm("Send this to every active customer?")) return;
    setBusy(true);
    try {
      const { data } = await api.post("/admin/notifications/broadcast/", form);
      toast.success(`Sent to ${data.sent_to} customers`);
      setForm({ title: "", message: "", link: "", kind: "promo", send_email: false });
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="h-display text-3xl">Broadcast a notification</h1>
      <p className="mb-6 mt-1 text-sm text-ink/60">New arrivals, café specials, festival flower offers. Customers see it under the bell icon, and by email if you tick the box.</p>
      <form onSubmit={submit} className="card space-y-4 p-6">
        <Field label="Title"><input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required maxLength={200} /></Field>
        <Field label="Message"><textarea className="input" rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required /></Field>
        <Field label="Link (optional)" hint="A page on the site, e.g. /flowers or /books/gitanjali"><input className="input" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} /></Field>
        <Field label="Type">
          <select className="input" value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value })}>
            <option value="promo">Promotion</option>
            <option value="system">Announcement</option>
          </select>
        </Field>
        <label className="flex min-h-[44px] items-center gap-3">
          <input type="checkbox" className="h-5 w-5 accent-forest" checked={form.send_email} onChange={(e) => setForm({ ...form, send_email: e.target.checked })} />
          <span className="text-sm">Also send by email</span>
        </label>
        <button className="btn-primary" disabled={busy}>{busy ? "Sending…" : "Send to all customers"}</button>
      </form>
    </div>
  );
}
