"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import clsx from "clsx";
import { Bell, LayoutDashboard, LogOut, Menu, ShieldCheck, ShoppingBag, User as UserIcon, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useUnreadCount } from "./useUnread";

const LINKS = [
  { href: "/books", label: "Books" },
  { href: "/cafe", label: "Café" },
  { href: "/flowers", label: "Flowers" },
];

export default function Navbar() {
  const { user, signOut } = useAuth();
  const { count } = useCart();
  const unread = useUnreadCount();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);

  const logout = async () => {
    setMenu(false);
    await signOut();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-cream/95 backdrop-blur">
      <nav className="container-page flex h-16 items-center gap-4">
        <Link href="/" className="whitespace-nowrap font-display text-xl font-bold text-forest sm:text-2xl">
          The Blooming <span className="text-rose">Chapter</span>
        </Link>
        <div className="ml-6 hidden gap-1 md:flex">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className={clsx("rounded-lg px-3 py-2 text-sm font-medium", pathname.startsWith(l.href) ? "bg-forest text-white" : "text-forest hover:bg-forest/10")}>
              {l.label}
            </Link>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-1">
          {user && (
            <Link href="/dashboard/notifications" aria-label={`Notifications, ${unread} unread`} className="relative rounded-lg p-2.5 text-forest hover:bg-forest/10">
              <Bell className="h-5 w-5" />
              {unread > 0 && <span className="absolute right-1 top-1 rounded-full bg-rose px-1.5 text-[10px] font-bold text-white">{unread}</span>}
            </Link>
          )}
          <Link href="/cart" aria-label={`Cart, ${count} items`} className="relative rounded-lg p-2.5 text-forest hover:bg-forest/10">
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && <span className="absolute right-1 top-1 rounded-full bg-rose px-1.5 text-[10px] font-bold text-white">{count}</span>}
          </Link>
          {user ? (
            <div className="relative">
              <button onClick={() => setMenu(!menu)} className="flex items-center gap-2 rounded-lg p-2 text-forest hover:bg-forest/10" aria-expanded={menu} aria-label="Account menu">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-forest text-sm font-bold text-white">
                  {(user.full_name || user.email)[0].toUpperCase()}
                </span>
              </button>
              {menu && (
                <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-ink/10 bg-white shadow-lg" onMouseLeave={() => setMenu(false)}>
                  <p className="truncate border-b border-ink/10 px-4 py-3 text-sm text-ink/60">{user.email}</p>
                  <Link onClick={() => setMenu(false)} href="/dashboard" className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-cream">
                    <LayoutDashboard className="h-4 w-4" /> My dashboard
                  </Link>
                  <Link onClick={() => setMenu(false)} href="/dashboard/profile" className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-cream">
                    <UserIcon className="h-4 w-4" /> Profile
                  </Link>
                  {user.is_staff && (
                    <Link onClick={() => setMenu(false)} href="/crm" className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-cream">
                      <ShieldCheck className="h-4 w-4" /> Admin CRM
                    </Link>
                  )}
                  <button onClick={logout} className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-rose hover:bg-cream">
                    <LogOut className="h-4 w-4" /> Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link href="/login" className="btn-ghost btn-sm">Log in</Link>
              <Link href="/register" className="btn-primary btn-sm">Sign up</Link>
            </div>
          )}
          <button className="rounded-lg p-2.5 text-forest md:hidden" onClick={() => setOpen(!open)} aria-label="Open menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>
      {open && (
        <div className="container-page flex flex-col gap-1 pb-4 md:hidden">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 font-medium text-forest hover:bg-forest/10">
              {l.label}
            </Link>
          ))}
          {!user && (
            <div className="mt-2 flex gap-2">
              <Link href="/login" onClick={() => setOpen(false)} className="btn-outline flex-1">Log in</Link>
              <Link href="/register" onClick={() => setOpen(false)} className="btn-primary flex-1">Sign up</Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
