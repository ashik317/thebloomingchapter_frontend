"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { ShieldCheck } from "lucide-react";
import { api, errorMessage } from "@/lib/api";
import type { AuthResponse } from "@/lib/types";
import { useAuth } from "@/context/AuthContext";
import { nextPath } from "@/components/AuthCard";
import { Field } from "@/components/ui";

export default function CrmLoginPage() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const { data } = await api.post<AuthResponse>("/auth/admin/login/", { email, password });
      signIn(data);
      router.replace(nextPath("/crm"));
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-forest p-4">
      <form onSubmit={submit} className="card w-full max-w-sm space-y-4 p-8">
        <ShieldCheck className="h-10 w-10 text-forest" aria-hidden />
        <h1 className="h-display text-2xl">Admin login</h1>
        <p className="text-sm text-ink/60">Staff accounts only.</p>
        <Field label="Email"><input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="username" /></Field>
        <Field label="Password"><input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" /></Field>
        <button className="btn-primary w-full" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
      </form>
    </div>
  );
}
