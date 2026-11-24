export const taka = (v: string | number | null | undefined) =>
  v === null || v === undefined || v === "" ? "—" : `৳${Number(v).toLocaleString("en-BD", { maximumFractionDigits: 2 })}`;

export const dateTime = (v: string | null | undefined) =>
  v ? new Date(v).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";

export const date = (v: string | null | undefined) =>
  v ? new Date(v).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—";

export const ITEM_TYPE_LABEL: Record<string, string> = {
  book_physical: "Printed book",
  book_digital: "PDF download",
  menu: "Café",
  flower: "Flowers",
};

export const ORDER_STATUSES = [
  ["pending", "Awaiting payment"],
  ["paid", "Paid"],
  ["processing", "Processing"],
  ["ready", "Ready for pickup"],
  ["shipped", "Out for delivery"],
  ["delivered", "Delivered"],
  ["completed", "Completed"],
  ["cancelled", "Cancelled"],
] as const;

export const OCCASIONS = [
  ["", "All"],
  ["love", "Love"],
  ["birthday", "Birthday"],
  ["wedding", "Wedding"],
  ["congrats", "Congrats"],
  ["festival", "Festival"],
  ["sympathy", "Sympathy"],
] as const;
