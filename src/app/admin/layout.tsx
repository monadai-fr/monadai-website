import type { Metadata } from "next";
import AdminLayoutContent from "@/components/admin/admin-layout-content";

export const metadata: Metadata = {
  title: 'Admin MonadAI | Dashboard Business Intelligence',
  description: 'Dashboard administrateur MonadAI. Analytics, sécurité, CRM et performance monitoring.',
  robots: {
    index: false,
    follow: false
  }
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayoutContent>{children}</AdminLayoutContent>;
}
