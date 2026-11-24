"use client";

import ResourceManager, { type FieldDef } from "@/components/crm/ResourceManager";
import { Cover } from "@/components/ui";
import { taka } from "@/lib/format";

const FIELDS: FieldDef[] = [
  { name: "title", label: "Title", type: "text", required: true, full: true },
  { name: "author", label: "Author", type: "select", optionsUrl: "/admin/authors/", required: true },
  { name: "language", label: "Language", type: "text" },
  { name: "categories", label: "Categories", type: "multiselect", optionsUrl: "/admin/book-categories/" },
  { name: "description", label: "Description", type: "textarea" },
  { name: "cover", label: "Cover image", type: "image" },
  { name: "pdf_file", label: "Book PDF (private, never public)", type: "file", accept: "application/pdf" },
  { name: "is_free_read", label: "Free to read online (full book)", type: "checkbox" },
  { name: "preview_pages", label: "Preview pages (for non-free books)", type: "number" },
  { name: "download_price", label: "PDF download price (৳)", type: "number", hint: "Leave empty if the PDF is not for sale." },
  { name: "physical_price", label: "Printed book price (৳)", type: "number", hint: "Leave empty if there is no printed copy." },
  { name: "stock", label: "Printed copies in stock", type: "number" },
  { name: "isbn", label: "ISBN", type: "text" },
  { name: "publisher", label: "Publisher", type: "text" },
  { name: "published_year", label: "Published year", type: "number" },
  { name: "page_count", label: "Page count", type: "number" },
  { name: "is_active", label: "Visible in shop", type: "checkbox" },
  { name: "is_featured", label: "Featured on home page", type: "checkbox" },
];

export default function CrmBooksPage() {
  return (
    <ResourceManager
      title="Books"
      endpoint="/admin/books/"
      newLabel="Add book"
      fields={FIELDS}
      columns={[
        { key: "cover", label: "", render: (r) => <Cover src={r.cover} alt={r.title} className="h-14 w-10 rounded" /> },
        { key: "title", label: "Title", render: (r) => <><p className="font-medium">{r.title}</p><p className="text-xs text-ink/50">{r.author_name}</p></> },
        { key: "is_free_read", label: "Read", render: (r) => (r.has_pdf ? (r.is_free_read ? "Free" : `Preview ${r.preview_pages}p`) : "No PDF") },
        { key: "download_price", label: "PDF", render: (r) => taka(r.download_price) },
        { key: "physical_price", label: "Print", render: (r) => taka(r.physical_price) },
        { key: "stock", label: "Stock" },
        { key: "views", label: "Views" },
        { key: "is_active", label: "Active", render: (r) => (r.is_active ? "Yes" : "No") },
      ]}
    />
  );
}
