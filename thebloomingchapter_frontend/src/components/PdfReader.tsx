"use client";

import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { api } from "@/lib/api";
import { Spinner } from "./ui";

// The worker is copied to /public by the "prebuild"/"predev" scripts (avoids a Next.js minifier issue).
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

type Props = { slug: string; onPreview: (isPreview: boolean) => void };

/** Renders the PDF page by page. The file is fetched with the user's token as a blob, so there is no public link to it. */
export default function PdfReader({ slug, onPreview }: Props) {
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [pages, setPages] = useState(0);
  const [page, setPage] = useState(1);
  const [scale, setScale] = useState(1.1);
  const [width, setWidth] = useState(800);
  const box = useRef<HTMLDivElement>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    let objectUrl = "";
    Promise.all([api.get(`/books/${slug}/read/`, { responseType: "blob" }), api.get(`/books/${slug}/progress/`).catch(() => null)])
      .then(([pdf, progress]) => {
        onPreview(pdf.headers["x-preview"] === "true");
        objectUrl = URL.createObjectURL(pdf.data);
        setUrl(objectUrl);
        if (progress?.data?.last_page) setPage(progress.data.last_page);
      })
      .catch(() => setError("Could not open this book."));
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  useEffect(() => {
    const measure = () => box.current && setWidth(Math.min(box.current.clientWidth - 16, 900));
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const go = (p: number) => {
    const next = Math.max(1, Math.min(pages || 1, p));
    setPage(next);
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => api.patch(`/books/${slug}/progress/`, { last_page: next }).catch(() => {}), 800);
  };

  if (error) return <p className="py-20 text-center text-rose">{error}</p>;
  if (!url) return <div className="flex justify-center py-20"><Spinner className="h-8 w-8" /></div>;

  return (
    <div ref={box} onContextMenu={(e) => e.preventDefault()} className="select-none">
      <div className="sticky top-16 z-10 mb-4 flex flex-wrap items-center justify-center gap-2 rounded-xl bg-white/95 p-2 shadow-sm">
        <button className="btn-outline btn-sm" onClick={() => go(page - 1)} disabled={page <= 1} aria-label="Previous page">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <label className="flex items-center gap-2 text-sm">
          <span className="sr-only">Page number</span>
          <input type="number" className="input w-20 py-1.5 text-center" value={page} min={1} max={pages} onChange={(e) => go(Number(e.target.value))} />
          <span className="text-ink/60">of {pages || "…"}</span>
        </label>
        <button className="btn-outline btn-sm" onClick={() => go(page + 1)} disabled={page >= pages} aria-label="Next page">
          <ChevronRight className="h-4 w-4" />
        </button>
        <span className="mx-2 h-6 w-px bg-ink/10" />
        <button className="btn-ghost btn-sm" onClick={() => setScale((s) => Math.max(0.6, s - 0.15))} aria-label="Zoom out"><ZoomOut className="h-4 w-4" /></button>
        <span className="w-12 text-center text-sm">{Math.round(scale * 100)}%</span>
        <button className="btn-ghost btn-sm" onClick={() => setScale((s) => Math.min(2.5, s + 0.15))} aria-label="Zoom in"><ZoomIn className="h-4 w-4" /></button>
      </div>
      <div className="flex justify-center">
        <Document
          file={url}
          onLoadSuccess={({ numPages }) => {
            setPages(numPages);
            setPage((p) => Math.min(p, numPages));
          }}
          loading={<Spinner className="h-8 w-8" />}
          error={<p className="text-rose">Could not render this PDF.</p>}
        >
          <Page pageNumber={page} width={width * scale} className="shadow-lg" />
        </Document>
      </div>
    </div>
  );
}
