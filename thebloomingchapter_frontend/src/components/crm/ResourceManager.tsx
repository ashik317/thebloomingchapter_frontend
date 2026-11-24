"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import toast from "react-hot-toast";
import { Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { api, errorMessage, rows } from "@/lib/api";
import { Empty, Field, PageLoader, Pager } from "@/components/ui";

export type FieldDef = {
  name: string;
  label: string;
  type: "text" | "textarea" | "number" | "checkbox" | "select" | "multiselect" | "image" | "file";
  options?: { value: string | number; label: string }[];
  optionsUrl?: string; // load options from an endpoint ({id, name|title})
  required?: boolean;
  hint?: string;
  accept?: string;
  full?: boolean;
};

export type Column = { key: string; label: string; render?: (row: any) => ReactNode };

type Props = { title: string; endpoint: string; fields: FieldDef[]; columns: Column[]; searchable?: boolean; newLabel?: string };

/**
 * Generic CRM table + create/edit form for any DRF ListCreate / RetrieveUpdateDestroy endpoint pair.
 * Sends multipart/form-data so images and PDFs upload with the rest of the fields.
 */
export default function ResourceManager({ title, endpoint, fields, columns, searchable = true, newLabel = "Add new" }: Props) {
  const [data, setData] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<any | null>(null);
  const [values, setValues] = useState<Record<string, any>>({});
  const [files, setFiles] = useState<Record<string, File | null>>({});
  const [options, setOptions] = useState<Record<string, { value: string | number; label: string }[]>>({});
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    const p = new URLSearchParams({ page: String(page) });
    if (search) p.set("search", search);
    api.get(`${endpoint}?${p}`).then((r) => setData(r.data)).catch((e) => toast.error(errorMessage(e)));
  }, [endpoint, page, search]);
  useEffect(load, [load]);

  const optionKey = fields.map((f) => f.optionsUrl ?? "").join("|");
  useEffect(() => {
    fields
      .filter((f) => f.optionsUrl)
      .forEach((f) =>
        api.get(`${f.optionsUrl}?page_size=100`).then((r) =>
          setOptions((o) => ({ ...o, [f.name]: rows<any>(r.data).map((x) => ({ value: x.id, label: x.name ?? x.title })) }))
        )
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optionKey]);

  const open = (row: any | null) => {
    const v: Record<string, any> = {};
    fields.forEach((f) => {
      const cur = row?.[f.name];
      if (f.type === "checkbox") v[f.name] = row ? !!cur : f.name === "is_active" || f.name === "is_available";
      else if (f.type === "multiselect") v[f.name] = (cur ?? []).map(String);
      else if (f.type === "image" || f.type === "file") v[f.name] = cur ?? null;
      else v[f.name] = cur ?? "";
    });
    setValues(v);
    setFiles({});
    setEditing(row ?? {});
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData();
    fields.forEach((f) => {
      const v = values[f.name];
      if (f.type === "image" || f.type === "file") {
        if (files[f.name]) fd.append(f.name, files[f.name] as File);
      } else if (f.type === "checkbox") fd.append(f.name, v ? "true" : "false");
      else if (f.type === "multiselect") (v as string[]).forEach((x) => fd.append(f.name, x));
      else fd.append(f.name, v === null || v === undefined ? "" : String(v));
    });
    try {
      if (editing?.id) await api.patch(`${endpoint}${editing.id}/`, fd);
      else await api.post(endpoint, fd);
      toast.success("Saved");
      setEditing(null);
      load();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (row: any) => {
    if (!window.confirm(`Delete “${row.name ?? row.title ?? row.id}”? This can't be undone.`)) return;
    try {
      await api.delete(`${endpoint}${row.id}/`);
      toast.success("Deleted");
      load();
    } catch (err) {
      toast.error(errorMessage(err, "Can't delete: it is used by other records. Try marking it inactive instead."));
    }
  };

  const list = rows<any>(data);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <h1 className="h-display mr-auto text-3xl">{title}</h1>
        {searchable && (
          <form onSubmit={(e) => { e.preventDefault(); setPage(1); setSearch(q); }} className="relative">
            <label>
              <span className="sr-only">Search {title}</span>
              <Search className="absolute left-3 top-3 h-4 w-4 text-ink/40" aria-hidden />
              <input className="input w-60 pl-9" placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} />
            </label>
          </form>
        )}
        <button className="btn-primary" onClick={() => open(null)}><Plus className="h-4 w-4" /> {newLabel}</button>
      </div>

      {!data ? (
        <PageLoader />
      ) : list.length === 0 ? (
        <Empty title="Nothing here yet" />
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead><tr>{columns.map((c) => <th key={c.key}>{c.label}</th>)}<th className="text-right">Actions</th></tr></thead>
            <tbody>
              {list.map((row) => (
                <tr key={row.id}>
                  {columns.map((c) => <td key={c.key}>{c.render ? c.render(row) : String(row[c.key] ?? "—")}</td>)}
                  <td className="whitespace-nowrap text-right">
                    <button className="btn-ghost btn-sm" onClick={() => open(row)} aria-label="Edit"><Pencil className="h-4 w-4" /></button>
                    <button className="btn-ghost btn-sm text-rose" onClick={() => remove(row)} aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {data && !Array.isArray(data) && <Pager page={page} hasNext={!!data.next} hasPrev={!!data.previous} onChange={setPage} />}

      {editing && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40" role="dialog" aria-modal="true" aria-label={editing.id ? "Edit" : "Create"}>
          <form onSubmit={save} className="flex h-full w-full max-w-2xl flex-col bg-white">
            <div className="flex items-center justify-between border-b border-ink/10 p-5">
              <h2 className="h-display text-2xl">{editing.id ? "Edit" : newLabel}</h2>
              <button type="button" className="btn-ghost btn-sm" onClick={() => setEditing(null)} aria-label="Close"><X className="h-5 w-5" /></button>
            </div>
            <div className="grid flex-1 gap-4 overflow-y-auto p-5 sm:grid-cols-2">
              {fields.map((f) => {
                const v = values[f.name];
                const set = (val: any) => setValues((s) => ({ ...s, [f.name]: val }));
                const opts = f.options ?? options[f.name] ?? [];
                const wide = f.full || f.type === "textarea" || f.type === "multiselect";
                return (
                  <div key={f.name} className={wide ? "sm:col-span-2" : ""}>
                    {f.type === "checkbox" ? (
                      <label className="flex min-h-[44px] items-center gap-3">
                        <input type="checkbox" className="h-5 w-5 accent-forest" checked={!!v} onChange={(e) => set(e.target.checked)} />
                        <span className="text-sm font-medium">{f.label}</span>
                      </label>
                    ) : (
                      <Field label={f.label + (f.required ? " *" : "")} hint={f.hint}>
                        {f.type === "textarea" ? (
                          <textarea className="input" rows={4} value={v} onChange={(e) => set(e.target.value)} required={f.required} />
                        ) : f.type === "select" ? (
                          <select className="input" value={v} onChange={(e) => set(e.target.value)} required={f.required}>
                            <option value="">Choose…</option>
                            {opts.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                          </select>
                        ) : f.type === "multiselect" ? (
                          <div className="flex flex-wrap gap-2 rounded-lg border border-ink/15 p-2">
                            {opts.map((o) => {
                              const on = (v as string[]).includes(String(o.value));
                              return (
                                <button type="button" key={o.value} className={on ? "chip-active" : "chip"} aria-pressed={on}
                                  onClick={() => set(on ? (v as string[]).filter((x) => x !== String(o.value)) : [...v, String(o.value)])}>
                                  {o.label}
                                </button>
                              );
                            })}
                          </div>
                        ) : f.type === "image" || f.type === "file" ? (
                          <div className="space-y-2">
                            {f.type === "image" && typeof v === "string" && v && <img src={v} alt="" className="h-24 rounded-lg object-cover" />}
                            {f.type === "file" && editing.has_pdf && <p className="text-xs text-emerald-700">A file is uploaded. Choose a new one to replace it.</p>}
                            <input type="file" accept={f.accept ?? (f.type === "image" ? "image/*" : undefined)} onChange={(e) => setFiles((s) => ({ ...s, [f.name]: e.target.files?.[0] ?? null }))} />
                          </div>
                        ) : (
                          <input className="input" type={f.type === "number" ? "number" : "text"} step={f.type === "number" ? "any" : undefined}
                            value={v} onChange={(e) => set(e.target.value)} required={f.required} />
                        )}
                      </Field>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex justify-end gap-2 border-t border-ink/10 p-5">
              <button type="button" className="btn-outline" onClick={() => setEditing(null)}>Cancel</button>
              <button className="btn-primary" disabled={saving}>{saving ? "Saving…" : "Save"}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
