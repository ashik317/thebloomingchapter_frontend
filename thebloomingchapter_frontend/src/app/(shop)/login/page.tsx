"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { api, errorCode, errorMessage } from "@/lib/api";
import type { AuthResponse } from "@/lib/types";
import { useAuth } from "@/context/AuthContext";
import AuthCard, { nextPath } from "@/components/AuthCard";
import GoogleButton from "@/components/GoogleButton";
import { Field } from "@/components/ui";

export default function LoginPage() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [unverified, setUnverified] = useState(false);

  const done = () => router.replace(nextPath());

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setUnverified(false);
    try {
      const { data } = await api.post<AuthResponse>("/auth/login/", { email, password });
      signIn(data);
      toast.success("Welcome back!");
      done();
    } catch (err) {
      if (errorCode(err) === "email_not_verified") setUnverified(true);
      toast.error(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const resend = async () => {
    await api.post("/auth/resend-verification/", { email }).catch(() => {});
    toast.success("Verification email sent. Check your inbox.");
  };

  return (
    <AuthCard title="Log in" subtitle="Welcome back to The Blooming Chapter.">
      <form onSubmit={submit} className="space-y-4">
        <Field label="Email"><input className="input" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></Field>
        <Field label="Password"><input className="input" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required /></Field>
        {unverified && (
          <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
            Your email isn&apos;t verified yet.{" "}
            <button type="button" onClick={resend} className="font-medium underline">Resend the email</button>
          </p>
        )}
        <div className="flex justify-end">
          <Link href="/forgot-password" className="text-sm text-rose hover:underline">Forgot password?</Link>
        </div>
        <button className="btn-primary w-full" disabled={busy}>{busy ? "Logging in…" : "Log in"}</button>
      </form>
      <div className="mt-6"><GoogleButton onDone={done} /></div>
      <p className="mt-6 text-center text-sm text-ink/60">
        New here? <Link href="/register" className="font-medium text-forest underline">Create an account</Link>
      </p>
    </AuthCard>
  );
}
