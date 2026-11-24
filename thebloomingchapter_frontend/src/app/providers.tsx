"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

export default function Providers({ children }: { children: React.ReactNode }) {
  const inner = (
    <AuthProvider>
      <CartProvider>
        {children}
        <Toaster position="top-center" toastOptions={{ style: { fontFamily: "'DM Sans', sans-serif" } }} />
      </CartProvider>
    </AuthProvider>
  );
  return GOOGLE_CLIENT_ID ? <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>{inner}</GoogleOAuthProvider> : inner;
}
