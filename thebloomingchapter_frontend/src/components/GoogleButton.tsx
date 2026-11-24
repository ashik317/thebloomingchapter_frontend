"use client";

import { GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import { api, errorMessage } from "@/lib/api";
import type { AuthResponse } from "@/lib/types";
import { useAuth } from "@/context/AuthContext";

/** Renders only when NEXT_PUBLIC_GOOGLE_CLIENT_ID is set. */
export default function GoogleButton({ onDone }: { onDone: () => void }) {
  const { signIn } = useAuth();
  if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) return null;
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex w-full items-center gap-3 text-xs text-ink/50">
        <span className="h-px flex-1 bg-ink/10" /> or <span className="h-px flex-1 bg-ink/10" />
      </div>
      <GoogleLogin
        onSuccess={async (res) => {
          try {
            const { data } = await api.post<AuthResponse>("/auth/google/", { credential: res.credential });
            signIn(data);
            toast.success(`Welcome, ${data.user.full_name || data.user.email}`);
            onDone();
          } catch (e) {
            toast.error(errorMessage(e));
          }
        }}
        onError={() => toast.error("Google sign-in failed.")}
      />
    </div>
  );
}
