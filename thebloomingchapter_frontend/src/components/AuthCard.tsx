export default function AuthCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="container-page flex justify-center py-14">
      <div className="card w-full max-w-md p-8">
        <h1 className="h-display text-3xl">{title}</h1>
        {subtitle && <p className="mt-2 text-sm text-ink/60">{subtitle}</p>}
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}

export function nextPath(fallback = "/dashboard") {
  if (typeof window === "undefined") return fallback;
  const n = new URLSearchParams(window.location.search).get("next");
  return n && n.startsWith("/") && !n.startsWith("//") ? n : fallback;
}
