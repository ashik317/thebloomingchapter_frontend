"use client";

import { useCallback, useEffect, useState } from "react";
import clsx from "clsx";
import { api, rows } from "@/lib/api";
import { dateTime } from "@/lib/format";
import type { Conversation } from "@/lib/types";
import ChatBox from "@/components/ChatBox";
import { Empty } from "@/components/ui";

export default function CrmMessagesPage() {
  const [convs, setConvs] = useState<Conversation[]>([]);
  const [active, setActive] = useState<number | null>(null);

  const load = useCallback(() => {
    api.get("/admin/conversations/?page_size=100").then((r) => setConvs(rows(r.data))).catch(() => {});
  }, []);

  useEffect(() => {
    const c = new URLSearchParams(window.location.search).get("c");
    if (c) setActive(Number(c));
    load();
    const t = setInterval(load, 10000);
    return () => clearInterval(t);
  }, [load]);

  const current = convs.find((c) => c.id === active);

  return (
    <div>
      <h1 className="h-display mb-6 text-3xl">Customer messages</h1>
      <div className="flex flex-wrap gap-6">
        <ul className="card w-full divide-y divide-ink/10 overflow-hidden md:w-80">
          {convs.length === 0 && <li className="p-5 text-sm text-ink/60">No conversations yet.</li>}
          {convs.map((c) => (
            <li key={c.id}>
              <button onClick={() => { setActive(c.id); setTimeout(load, 500); }} className={clsx("w-full p-4 text-left hover:bg-cream", active === c.id && "bg-cream")}>
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate font-medium">{c.customer_name}</p>
                  {c.unread > 0 && <span className="rounded-full bg-rose px-2 text-xs font-bold text-white">{c.unread}</span>}
                </div>
                <p className="truncate text-xs text-ink/50">{c.customer_email}</p>
                <p className="mt-1 truncate text-sm text-ink/70">{c.last_message}</p>
                <p className="text-[11px] text-ink/40">{dateTime(c.last_message_at)}</p>
              </button>
            </li>
          ))}
        </ul>
        <div className="min-w-0 flex-[999_1_420px]">
          {current ? (
            <>
              <p className="mb-3 text-sm text-ink/60">Chatting with <b>{current.customer_name}</b> ({current.customer_email}). Replies are also emailed to the customer.</p>
              <ChatBox key={current.id} endpoint={`/admin/conversations/${current.id}/messages/`} staffView />
            </>
          ) : (
            <Empty title="Choose a conversation" />
          )}
        </div>
      </div>
    </div>
  );
}
