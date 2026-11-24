import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

export const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api").replace(/\/$/, "");

const ACCESS = "bb_access";
const REFRESH = "bb_refresh";
const isBrowser = () => typeof window !== "undefined";

export const tokens = {
  get access() {
    return isBrowser() ? localStorage.getItem(ACCESS) : null;
  },
  get refresh() {
    return isBrowser() ? localStorage.getItem(REFRESH) : null;
  },
  set(access: string, refresh?: string | null) {
    localStorage.setItem(ACCESS, access);
    if (refresh) localStorage.setItem(REFRESH, refresh);
  },
  clear() {
    localStorage.removeItem(ACCESS);
    localStorage.removeItem(REFRESH);
  },
};

export const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((cfg) => {
  const t = tokens.access;
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

const NO_RETRY = ["/auth/login", "/auth/admin/login", "/auth/token/refresh", "/auth/google", "/auth/register"];
let refreshing: Promise<string | null> | null = null;

api.interceptors.response.use(
  (r) => r,
  async (error: AxiosError) => {
    const original = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;
    const url = original?.url || "";
    if (error.response?.status === 401 && original && !original._retry && tokens.refresh && !NO_RETRY.some((u) => url.includes(u))) {
      original._retry = true;
      if (!refreshing) {
        refreshing = axios
          .post(`${API_URL}/auth/token/refresh/`, { refresh: tokens.refresh })
          .then((r) => {
            tokens.set(r.data.access, r.data.refresh);
            return r.data.access as string;
          })
          .catch(() => {
            tokens.clear();
            window.dispatchEvent(new Event("bb:logout"));
            return null;
          })
          .finally(() => {
            refreshing = null;
          });
      }
      const fresh = await refreshing;
      if (fresh) {
        original.headers.Authorization = `Bearer ${fresh}`;
        return api(original);
      }
    }
    return Promise.reject(error);
  }
);

/** Turn any DRF error response into one readable sentence. */
export function errorMessage(err: unknown, fallback = "Something went wrong. Please try again."): string {
  const e = err as AxiosError<any>;
  const data = e?.response?.data;
  if (!data) return e?.message === "Network Error" ? "Cannot reach the server." : fallback;
  if (typeof data === "string") return fallback;
  if (data instanceof Blob) return fallback;
  if (data.detail) return Array.isArray(data.detail) ? data.detail.join(" ") : String(data.detail);
  const parts: string[] = [];
  for (const [key, val] of Object.entries(data)) {
    if (key === "code") continue;
    const msg = Array.isArray(val) ? val.join(" ") : typeof val === "object" ? JSON.stringify(val) : String(val);
    parts.push(key === "non_field_errors" ? msg : `${key.replace(/_/g, " ")}: ${msg}`);
  }
  return parts.join(" · ") || fallback;
}

export function errorCode(err: unknown): string | undefined {
  const code = (err as AxiosError<any>)?.response?.data?.code;
  return Array.isArray(code) ? code[0] : code;
}

/** Lists may be paginated ({results}) or plain arrays. */
export function rows<T>(data: any): T[] {
  return Array.isArray(data) ? data : data?.results ?? [];
}

export async function downloadFile(path: string, filename: string) {
  const res = await api.get(path, { responseType: "blob" });
  const url = URL.createObjectURL(res.data);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
