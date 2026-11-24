"use client";

import { useState } from "react";
import ResourceManager from "@/components/crm/ResourceManager";

export default function CrmCatalogPage() {
  const [tab, setTab] = useState<"authors" | "categories">("authors");
  return (
    <div>
      <div className="mb-6 flex gap-2" role="tablist">
        <button role="tab" aria-selected={tab === "authors"} className={tab === "authors" ? "chip-active" : "chip"} onClick={() => setTab("authors")}>Authors</button>
        <button role="tab" aria-selected={tab === "categories"} className={tab === "categories" ? "chip-active" : "chip"} onClick={() => setTab("categories")}>Book categories</button>
      </div>
      {tab === "authors" ? (
        <ResourceManager
          key="authors"
          title="Authors"
          endpoint="/admin/authors/"
          newLabel="Add author"
          fields={[
            { name: "name", label: "Name", type: "text", required: true, full: true },
            { name: "bio", label: "Bio", type: "textarea" },
            { name: "photo", label: "Photo", type: "image" },
          ]}
          columns={[{ key: "name", label: "Name" }, { key: "slug", label: "Slug" }]}
        />
      ) : (
        <ResourceManager
          key="categories"
          title="Book categories"
          endpoint="/admin/book-categories/"
          newLabel="Add category"
          searchable={false}
          fields={[
            { name: "name", label: "Name", type: "text", required: true, full: true },
            { name: "description", label: "Description", type: "textarea" },
          ]}
          columns={[{ key: "name", label: "Name" }, { key: "book_count", label: "Books" }]}
        />
      )}
    </div>
  );
}
