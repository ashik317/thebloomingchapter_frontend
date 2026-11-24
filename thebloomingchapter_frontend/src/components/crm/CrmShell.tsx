"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import { BarChart3, BookOpen, Coffee, CreditCard, Flower2, Library, LogOut, Megaphone, MessageCircle, Package, Store, Users } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import RequireAuth from "@/components/RequireAuth";

const NAV = [
  { href: "/crm", label: "Dashboard", icon: BarChart3 },
  { href: "/crm/orders", label: "Orders", icon: Package },
  { href: "/crm/payments", label: "Payments", icon: CreditCard },
  { href: "/crm/books", label: "Books", icon: BookOpen },
  { href: "/crm/catalog", label: "Authors & categories", icon: Library },
  { href: "/crm/menu", label: "Café menu", icon: Coffee },
  { href: "/crm/flowers", label: "Flowers", icon: Flower2 },
  { href: "/crm/users", label: "Customers", icon: Users },
  { href: "/crm/messages", label: "Messages", icon: MessageCircle },
  { href: "/crm/notifications", label: "Broadcast", icon: Megaphone },
];

export default function CrmShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();

  if (pathname === "/crm/login") return <>{children}</>;

  return (
    <RequireAuth staff>
      <div className="flex min-h-screen flex-wrap">
        <aside className="w-full bg-forest text-cream md:min-h-screen md:w-64">
          <div className="p-5">
            <p className="font-display text-xl font-bold">The Blooming Chapter</p>
            <p className="text-xs uppercase tracking-[0.2em] text-rose-light">CRM</p>
          </div>
          <nav aria-label="CRM">
            <ul className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col">
              {NAV.map(({ href, label, icon: Icon }) => {
                const active = href === "/crm" ? pathname === href : pathname.startsWith(href);
                return (
                  <li key={href}>
                    <Link href={href} className={clsx("flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2.5 text-sm", active ? "bg-cream text-forest" : "text-cream/80 hover:bg-forest-light")}>
                      <Icon className="h-4 w-4" aria-hidden /> {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="hidden border-t border-cream/10 p-4 text-sm md:block">
            <p className="truncate text-cream/70">{user?.email}</p>
            <div className="mt-3 flex gap-2">
              <Link href="/" className="btn btn-sm bg-forest-light text-cream"><Store className="h-4 w-4" /> Shop</Link>
              <button onClick={async () => { await signOut(); router.push("/crm/login"); }} className="btn btn-sm bg-forest-light text-cream">
                <LogOut className="h-4 w-4" /> Log out
              </button>
            </div>
          </div>
        </aside>
        <main className="min-w-0 flex-[999_1_560px] p-4 sm:p-8">{children}</main>
      </div>
    </RequireAuth>
  );
}
