"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Bell, BookOpen, LayoutDashboard, MessageCircle, Package, UserCog } from "lucide-react";
import RequireAuth from "@/components/RequireAuth";

const NAV = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/orders", label: "My orders", icon: Package },
  { href: "/dashboard/library", label: "My library", icon: BookOpen },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
  { href: "/dashboard/messages", label: "Messages", icon: MessageCircle },
  { href: "/dashboard/profile", label: "Profile & password", icon: UserCog },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <RequireAuth>
      <div className="container-page flex flex-wrap gap-8 py-10">
        <nav className="w-full md:w-56" aria-label="Dashboard">
          <ul className="flex gap-1 overflow-x-auto md:flex-col">
            {NAV.map(({ href, label, icon: Icon }) => {
              const active = href === "/dashboard" ? pathname === href : pathname.startsWith(href);
              return (
                <li key={href}>
                  <Link href={href} className={clsx("flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2.5 text-sm font-medium", active ? "bg-forest text-white" : "text-forest hover:bg-forest/10")}>
                    <Icon className="h-4 w-4" aria-hidden /> {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="min-w-0 flex-[999_1_560px]">{children}</div>
      </div>
    </RequireAuth>
  );
}
