"use client";

import { useState } from "react";
import ResourceManager from "@/components/crm/ResourceManager";
import { Cover } from "@/components/ui";
import { OCCASIONS, taka } from "@/lib/format";

const OCCASION_OPTIONS = [{ value: "any", label: "Any occasion" }, ...OCCASIONS.filter(([v]) => v).map(([value, label]) => ({ value, label }))];

export default function CrmFlowersPage() {
  const [tab, setTab] = useState<"items" | "categories">("items");
  return (
    <div>
      <div className="mb-6 flex gap-2" role="tablist">
        <button role="tab" aria-selected={tab === "items"} className={tab === "items" ? "chip-active" : "chip"} onClick={() => setTab("items")}>Flowers</button>
        <button role="tab" aria-selected={tab === "categories"} className={tab === "categories" ? "chip-active" : "chip"} onClick={() => setTab("categories")}>Flower categories</button>
      </div>
      {tab === "items" ? (
        <ResourceManager
          key="items"
          title="Flowers"
          endpoint="/admin/flowers/"
          newLabel="Add flower"
          fields={[
            { name: "name", label: "Name", type: "text", required: true },
            { name: "category", label: "Category", type: "select", optionsUrl: "/admin/flower-categories/", required: true },
            { name: "occasion", label: "Occasion", type: "select", options: OCCASION_OPTIONS },
            { name: "color", label: "Colour", type: "text" },
            { name: "price", label: "Price (৳)", type: "number", required: true },
            { name: "stock", label: "Stock", type: "number", required: true },
            { name: "description", label: "Description", type: "textarea" },
            { name: "image", label: "Photo", type: "image" },
            { name: "is_available", label: "Available", type: "checkbox" },
            { name: "is_featured", label: "Featured", type: "checkbox" },
          ]}
          columns={[
            { key: "image", label: "", render: (r) => <Cover src={r.image} alt={r.name} className="h-12 w-12 rounded" /> },
            { key: "name", label: "Name" },
            { key: "category_name", label: "Category" },
            { key: "occasion", label: "Occasion" },
            { key: "price", label: "Price", render: (r) => taka(r.price) },
            { key: "stock", label: "Stock", render: (r) => <span className={r.stock <= 5 ? "font-medium text-rose" : ""}>{r.stock}</span> },
          ]}
        />
      ) : (
        <ResourceManager
          key="categories"
          title="Flower categories"
          endpoint="/admin/flower-categories/"
          newLabel="Add category"
          searchable={false}
          fields={[
            { name: "name", label: "Name", type: "text", required: true },
            { name: "description", label: "Description", type: "textarea" },
          ]}
          columns={[{ key: "name", label: "Name" }, { key: "slug", label: "Slug" }]}
        />
      )}
    </div>
  );
}
