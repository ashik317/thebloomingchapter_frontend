import type { Metadata } from "next";
import CrmShell from "@/components/crm/CrmShell";

export const metadata: Metadata = { title: "CRM" };

export default function CrmLayout({ children }: { children: React.ReactNode }) {
  return <CrmShell>{children}</CrmShell>;
}
