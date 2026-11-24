"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import clsx from "clsx";
import { api } from "@/lib/api";
import { dateTime } from "@/lib/format";
import type { Notification, Paginated } from "@/lib/types";
import { Empty, PageLoader, Pager } from "@/components/ui";

export default function NotificationsPage() {
  const [data, setData] = useState<Paginated<Notification> | null>(null);
  const [page, setPage] = useState(1);

  const load = useCallback(() => {
    api.get(`/notifications/?page=${page}`).then((r) => setData(r.data)).catch(() => {});
  }, [page]);
  useEffect(load, [load]);

  const changed = () => {
    load();
    window.dispatchEvent(new Event("bb:notifications"));
  };
  const markAll = async () => {
    await api.post("/notifications/mark-all-read/").catch(() => {});
    changed();
  };
  const markOne = async (n: Notification) => {
    if (!n.is_read) await api.patch(`/notifications/${n.id}/`, { is_read: true }).catch(() => {});
    changed();
  };

  if (!data) return <PageLoader />;
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="h-display text-3xl">Notifications</h1>
        <button onClick={markAll} className="btn-outline btn-sm">Mark all as read</button>
      </div>
      {data.results.length === 0 ? (
        <Empty title="You're all caught up" />
      ) : (
        <ul className="card divide-y divide-ink/10">
          {data.results.map((n) => (
            <li key={n.id} className={clsx("flex gap-3 p-4", !n.is_read && "bg-rose-light/15")}>
              <span className={clsx("mt-2 h-2 w-2 shrink-0 rounded-full", n.is_read ? "bg-transparent" : "bg-rose")} aria-hidden />
              <div className="flex-1">
                <p className="font-medium">{n.title}</p>
                {n.message && <p className="whitespace-pre-line text-sm text-ink/70">{n.message}</p>}
                <p className="mt-1 text-xs text-ink/50">{dateTime(n.created_at)}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                {n.link && <Link href={n.link} onClick={() => markOne(n)} className="btn-ghost btn-sm">Open</Link>}
                {!n.is_read && <button onClick={() => markOne(n)} className="btn-ghost btn-sm">Mark read</button>}
              </div>
            </li>
          ))}
        </ul>
      )}
      <Pager page={page} hasNext={!!data.next} hasPrev={!!data.previous} onChange={setPage} />
    </div>
  );
}
