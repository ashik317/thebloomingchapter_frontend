"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { MailCheck } from "lucide-react";
import { api, errorMessage } from "@/lib/api";
import AuthCard from "@/components/AuthCard";
import GoogleButton from "@/components/GoogleButton";
import { Field } from "@/components/ui";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", password: "", password2: "" });
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post("/auth/register/", form);
      setSent(true);
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  if (sent)
    return (
      <AuthCard title="Check your email">
        <MailCheck className="h-12 w-12 text-forest" aria-hidden />
        <p className="mt-4 text-ink/70">
          We sent a verification link to <b>{form.email}</b>. Click it to activate your account. The link is valid for 3 days.
        </p>
        <Link href="/login" className="btn-primary mt-6 w-full">Go to login</Link>
      </AuthCard>
    );

  return (
    <AuthCard title="Create your account" subtitle="Read, order coffee, and send flowers.">
      <form onSubmit={submit} className="space-y-4">
        <Field label="Full name"><input className="input" value={form.full_name} onChange={set("full_name")} required autoComplete="name" /></Field>
        <Field label="Email"><input className="input" type="email" value={form.email} onChange={set("email")} required autoComplete="email" /></Field>
        <Field label="Phone"><input className="input" value={form.phone} onChange={set("phone")} placeholder="01XXXXXXXXX" autoComplete="tel" /></Field>
        <Field label="Password" hint="At least 8 characters, not only numbers."><input className="input" type="password" value={form.password} onChange={set("password")} required minLength={8} autoComplete="new-password" /></Field>
        <Field label="Confirm password"><input className="input" type="password" value={form.password2} onChange={set("password2")} required autoComplete="new-password" /></Field>
        <button className="btn-primary w-full" disabled={busy}>{busy ? "Creating account…" : "Sign up"}</button>
      </form>
      <div className="mt-6"><GoogleButton onDone={() => router.replace("/dashboard")} /></div>
      <p className="mt-6 text-center text-sm text-ink/60">
        Already have an account? <Link href="/login" className="font-medium text-forest underline">Log in</Link>
      </p>
    </AuthCard>
  );
}
