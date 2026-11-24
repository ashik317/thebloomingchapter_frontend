"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import RequireAuth from "@/components/RequireAuth";
import { PageLoader } from "@/components/ui";

const PdfReader = dynamic(() => import("@/components/PdfReader"), { ssr: false, loading: () => <PageLoader /> });

export default function ReadPage() {
  const { slug } = useParams<{ slug: string }>();
  const [preview, setPreview] = useState(false);

  return (
    <RequireAuth>
      <div className="container-page py-6">
        <Link href={`/books/${slug}`} className="btn-ghost btn-sm mb-4">
          <ArrowLeft className="h-4 w-4" /> Back to book
        </Link>
        {preview && (
          <div className="mb-4 rounded-xl border border-rose/30 bg-rose-light/30 p-4 text-sm text-rose-dark">
            You&apos;re reading a free preview. <Link href={`/books/${slug}`} className="font-medium underline">Buy the PDF</Link> to read the whole book and download it.
          </div>
        )}
        <PdfReader slug={slug} onPreview={setPreview} />
      </div>
    </RequireAuth>
  );
}
