"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

/** Polls the unread notification count every 30 seconds. */
export function useUnreadCount() {
  const { user } = useAuth();
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!user) return setCount(0);
    let alive = true;
    const load = () =>
      api
        .get("/notifications/unread-count/")
        .then((r) => alive && setCount(r.data.unread))
        .catch(() => {});
    load();
    const t = setInterval(load, 30000);
    window.addEventListener("bb:notifications", load);
    return () => {
      alive = false;
      clearInterval(t);
      window.removeEventListener("bb:notifications", load);
    };
  }, [user]);
  return count;
}
