"use client";

import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { api, errorMessage } from "@/lib/api";
import AuthCard from "@/components/AuthCard";
import { Field } from "@/components/ui";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post("/auth/password/reset/", { email });
      setSent(true);
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthCard title="Forgot your password?" subtitle="We'll email you a link to set a new one.">
      {sent ? (
        <p className="text-ink/70">If an account exists for <b>{email}</b>, a reset link is on its way. Check your inbox and spam folder.</p>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <Field label="Email"><input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></Field>
          <button className="btn-primary w-full" disabled={busy}>Send reset link</button>
        </form>
      )}
      <p className="mt-6 text-center text-sm"><Link href="/login" className="text-forest underline">Back to login</Link></p>
    </AuthCard>
  );
}
