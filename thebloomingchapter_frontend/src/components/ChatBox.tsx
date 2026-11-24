"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import clsx from "clsx";
import { Send } from "lucide-react";
import { api, errorMessage } from "@/lib/api";
import { dateTime } from "@/lib/format";
import type { ChatMessage } from "@/lib/types";

/** Shared chat thread. `staffView` flips which side counts as "mine". Polls every 5 seconds. */
export default function ChatBox({ endpoint, staffView = false, emptyText }: { endpoint: string; staffView?: boolean; emptyText?: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const end = useRef<HTMLDivElement>(null);
  const lastCount = useRef(0);

  const load = useCallback(() => {
    api.get<ChatMessage[]>(endpoint).then((r) => setMessages(r.data)).catch(() => {});
  }, [endpoint]);

  useEffect(() => {
    lastCount.current = 0;
    load();
    const t = setInterval(load, 5000);
    return () => clearInterval(t);
  }, [load]);

  useEffect(() => {
    if (messages.length !== lastCount.current) end.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    lastCount.current = messages.length;
  }, [messages]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;
    setSending(true);
    try {
      await api.post(endpoint, { body });
      setBody("");
      load();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="card flex h-[560px] flex-col">
      <div className="flex-1 space-y-3 overflow-y-auto p-5">
        {messages.length === 0 && <p className="py-10 text-center text-sm text-ink/50">{emptyText ?? "No messages yet."}</p>}
        {messages.map((m) => {
          const mine = m.is_from_staff === staffView;
          return (
            <div key={m.id} className={clsx("flex", mine ? "justify-end" : "justify-start")}>
              <div className={clsx("max-w-[78%] rounded-2xl px-4 py-2.5", mine ? "bg-forest text-white" : "bg-cream-dark text-ink")}>
                <p className="whitespace-pre-wrap text-sm">{m.body}</p>
                <p className={clsx("mt-1 text-[11px]", mine ? "text-white/70" : "text-ink/60")}>{m.sender_name} · {dateTime(m.created_at)}</p>
              </div>
            </div>
          );
        })}
        <div ref={end} />
      </div>
      <form onSubmit={send} className="flex gap-2 border-t border-ink/10 p-3">
        <label className="flex-1">
          <span className="sr-only">Message</span>
          <input className="input" value={body} onChange={(e) => setBody(e.target.value)} placeholder="Write a message…" maxLength={4000} />
        </label>
        <button className="btn-primary" disabled={sending || !body.trim()} aria-label="Send message">
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
