"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Search } from "lucide-react";
import { api, errorMessage } from "@/lib/api";
import { date } from "@/lib/format";
import type { Paginated, User } from "@/lib/types";
import { Badge, PageLoader, Pager } from "@/components/ui";

export default function CrmUsersPage() {
  const [data, setData] = useState<Paginated<User> | null>(null);
  const [q, setQ] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const load = useCallback(() => {
    const p = new URLSearchParams({ page: String(page) });
    if (search) p.set("search", search);
    api.get(`/admin/users/?${p}`).then((r) => setData(r.data)).catch(() => {});
  }, [page, search]);
  useEffect(load, [load]);

  const toggle = async (u: User, field: "is_active" | "is_staff") => {
    try {
      await api.patch(`/admin/users/${u.id}/`, { [field]: !u[field] });
      toast.success("Updated");
      load();
    } catch (e) {
      toast.error(errorMessage(e));
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <h1 className="h-display mr-auto text-3xl">Customers &amp; staff</h1>
        <form onSubmit={(e) => { e.preventDefault(); setPage(1); setSearch(q); }} className="relative">
          <label>
            <span className="sr-only">Search users</span>
            <Search className="absolute left-3 top-3 h-4 w-4 text-ink/40" aria-hidden />
            <input className="input w-64 pl-9" placeholder="Name, email or phone" value={q} onChange={(e) => setQ(e.target.value)} />
          </label>
        </form>
      </div>
      {!data ? (
        <PageLoader />
      ) : (
        <>
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>User</th><th>Phone</th><th>Sign-in</th><th>Verified</th><th>Joined</th><th>Role</th><th>Status</th></tr></thead>
              <tbody>
                {data.results.map((u) => (
                  <tr key={u.id}>
                    <td><p className="font-medium">{u.full_name || "—"}</p><p className="text-xs text-ink/50">{u.email}</p></td>
                    <td>{u.phone || "—"}</td>
                    <td>{u.auth_provider}</td>
                    <td>{u.is_email_verified ? <Badge value="success" label="Yes" /> : <Badge value="pending" label="No" />}</td>
                    <td className="whitespace-nowrap">{date(u.date_joined)}</td>
                    <td><button className="btn-outline btn-sm" onClick={() => toggle(u, "is_staff")}>{u.is_staff ? "Staff" : "Customer"}</button></td>
                    <td><button className="btn-outline btn-sm" onClick={() => toggle(u, "is_active")}>{u.is_active ? "Active" : "Disabled"}</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pager page={page} hasNext={!!data.next} hasPrev={!!data.previous} onChange={setPage} />
        </>
      )}
    </div>
  );
}
