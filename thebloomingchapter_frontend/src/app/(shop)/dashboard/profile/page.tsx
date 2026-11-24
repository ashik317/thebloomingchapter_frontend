"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api, errorMessage } from "@/lib/api";
import type { AuthResponse, User } from "@/lib/types";
import { useAuth } from "@/context/AuthContext";
import { Field } from "@/components/ui";

export default function ProfilePage() {
  const { user, setUser, signIn } = useAuth();
  const [form, setForm] = useState({ full_name: "", phone: "", address: "", city: "" });
  const [avatar, setAvatar] = useState<File | null>(null);
  const [pw, setPw] = useState({ old_password: "", new_password: "", confirm: "" });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) setForm({ full_name: user.full_name, phone: user.phone, address: user.address, city: user.city });
  }, [user]);

  if (!user) return null;

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v ?? ""));
      if (avatar) fd.append("avatar", avatar);
      const { data } = await api.patch<User>("/auth/me/", fd);
      setUser(data);
      toast.success("Profile saved");
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const savePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.new_password !== pw.confirm) return toast.error("New passwords do not match.");
    try {
      const { data } = await api.post<AuthResponse>("/auth/password/change/", { old_password: pw.old_password, new_password: pw.new_password });
      signIn(data);
      setPw({ old_password: "", new_password: "", confirm: "" });
      toast.success(user.has_password ? "Password changed" : "Password set. You can now log in with email too.");
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="h-display text-3xl">Profile</h1>
      <form onSubmit={saveProfile} className="card grid gap-4 p-6 sm:grid-cols-2">
        <div className="flex items-center gap-4 sm:col-span-2">
          {user.avatar ? (
            <img src={user.avatar} alt="" className="h-16 w-16 rounded-full object-cover" />
          ) : (
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-forest text-2xl font-bold text-white">{(user.full_name || user.email)[0].toUpperCase()}</span>
          )}
          <label className="text-sm">
            <span className="label">Profile photo</span>
            <input type="file" accept="image/*" onChange={(e) => setAvatar(e.target.files?.[0] ?? null)} />
          </label>
        </div>
        <Field label="Email"><input className="input bg-cream" value={user.email} disabled /></Field>
        <Field label="Full name"><input className="input" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} /></Field>
        <Field label="Phone"><input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
        <Field label="City"><input className="input" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></Field>
        <div className="sm:col-span-2"><Field label="Address"><textarea className="input" rows={2} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></Field></div>
        <div className="sm:col-span-2"><button className="btn-primary" disabled={busy}>Save profile</button></div>
      </form>

      <form onSubmit={savePassword} className="card grid gap-4 p-6 sm:grid-cols-2">
        <h2 className="h-display text-xl sm:col-span-2">{user.has_password ? "Change password" : "Set a password"}</h2>
        {!user.has_password && <p className="text-sm text-ink/60 sm:col-span-2">You signed up with Google. Set a password to also log in with your email.</p>}
        {user.has_password && (
          <div className="sm:col-span-2"><Field label="Current password"><input type="password" className="input" value={pw.old_password} onChange={(e) => setPw({ ...pw, old_password: e.target.value })} required autoComplete="current-password" /></Field></div>
        )}
        <Field label="New password"><input type="password" minLength={8} className="input" value={pw.new_password} onChange={(e) => setPw({ ...pw, new_password: e.target.value })} required autoComplete="new-password" /></Field>
        <Field label="Confirm new password"><input type="password" className="input" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} required autoComplete="new-password" /></Field>
        <div className="sm:col-span-2"><button className="btn-primary">{user.has_password ? "Change password" : "Set password"}</button></div>
      </form>
    </div>
  );
}
