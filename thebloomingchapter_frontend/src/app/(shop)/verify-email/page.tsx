"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { api, errorMessage } from "@/lib/api";
import type { AuthResponse } from "@/lib/types";
import { useAuth } from "@/context/AuthContext";
import AuthCard from "@/components/AuthCard";
import { Spinner } from "@/components/ui";

export default function VerifyEmailPage() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [state, setState] = useState<"loading" | "ok" | "error">("loading");
  const [msg, setMsg] = useState("");
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    const token = new URLSearchParams(window.location.search).get("token");
    if (!token) {
      setState("error");
      setMsg("The verification link is missing its token.");
      return;
    }
    api
      .post<AuthResponse>("/auth/verify-email/", { token })
      .then(({ data }) => {
        signIn(data);
        setState("ok");
        setTimeout(() => router.replace("/dashboard"), 1500);
      })
      .catch((e) => {
        setState("error");
        setMsg(errorMessage(e));
      });
  }, [router, signIn]);

  return (
    <AuthCard title="Email verification">
      {state === "loading" && <div className="flex items-center gap-3"><Spinner /> Verifying…</div>}
      {state === "ok" && <p className="text-emerald-700">Your email is verified. Taking you to your dashboard…</p>}
      {state === "error" && (
        <>
          <p className="text-rose">{msg}</p>
          <Link href="/login" className="btn-primary mt-6 w-full">Back to login</Link>
        </>
      )}
    </AuthCard>
  );
}
