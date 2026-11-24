"use client";

import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { api, errorMessage } from "@/lib/api";
import AuthCard from "@/components/AuthCard";
import { Field } from "@/components/ui";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) return toast.error("Passwords do not match.");
    const q = new URLSearchParams(window.location.search);
    setBusy(true);
    try {
      await api.post("/auth/password/reset/confirm/", { uid: q.get("uid"), token: q.get("token"), new_password: password });
      setDone(true);
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthCard title="Set a new password">
      {done ? (
        <>
          <p className="text-emerald-700">Your password has been reset.</p>
          <Link href="/login" className="btn-primary mt-6 w-full">Log in</Link>
        </>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <Field label="New password"><input className="input" type="password" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" /></Field>
          <Field label="Confirm new password"><input className="input" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required autoComplete="new-password" /></Field>
          <button className="btn-primary w-full" disabled={busy}>Save password</button>
        </form>
      )}
    </AuthCard>
  );
}
