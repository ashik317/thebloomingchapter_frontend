"use client";

import { useState } from "react";
import ResourceManager from "@/components/crm/ResourceManager";
import { Cover } from "@/components/ui";
import { taka } from "@/lib/format";

const KINDS = [
  { value: "coffee", label: "Coffee" },
  { value: "tea", label: "Tea" },
  { value: "cold", label: "Cold drink" },
  { value: "snack", label: "Snack" },
  { value: "dessert", label: "Dessert" },
];

export default function CrmMenuPage() {
  const [tab, setTab] = useState<"items" | "categories">("items");
  return (
    <div>
      <div className="mb-6 flex gap-2" role="tablist">
        <button role="tab" aria-selected={tab === "items"} className={tab === "items" ? "chip-active" : "chip"} onClick={() => setTab("items")}>Menu items</button>
        <button role="tab" aria-selected={tab === "categories"} className={tab === "categories" ? "chip-active" : "chip"} onClick={() => setTab("categories")}>Menu sections</button>
      </div>
      {tab === "items" ? (
        <ResourceManager
          key="items"
          title="Café menu"
          endpoint="/admin/menu-items/"
          newLabel="Add item"
          fields={[
            { name: "name", label: "Name", type: "text", required: true },
            { name: "category", label: "Section", type: "select", optionsUrl: "/admin/menu-categories/", required: true },
            { name: "kind", label: "Type", type: "select", options: KINDS, required: true },
            { name: "price", label: "Price (৳)", type: "number", required: true },
            { name: "description", label: "Description", type: "textarea" },
            { name: "image", label: "Photo", type: "image" },
            { name: "is_available", label: "Available now", type: "checkbox" },
            { name: "is_featured", label: "Featured", type: "checkbox" },
          ]}
          columns={[
            { key: "image", label: "", render: (r) => <Cover src={r.image} alt={r.name} className="h-12 w-12 rounded" /> },
            { key: "name", label: "Name" },
            { key: "category_name", label: "Section" },
            { key: "kind", label: "Type" },
            { key: "price", label: "Price", render: (r) => taka(r.price) },
            { key: "is_available", label: "Available", render: (r) => (r.is_available ? "Yes" : "No") },
          ]}
        />
      ) : (
        <ResourceManager
          key="categories"
          title="Menu sections"
          endpoint="/admin/menu-categories/"
          newLabel="Add section"
          searchable={false}
          fields={[
            { name: "name", label: "Name", type: "text", required: true },
            { name: "sort_order", label: "Sort order", type: "number" },
          ]}
          columns={[{ key: "name", label: "Name" }, { key: "sort_order", label: "Order" }]}
        />
      )}
    </div>
  );
}
