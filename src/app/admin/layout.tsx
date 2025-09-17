import type { Metadata } from "next";
import AdminSidebar from "@/components/admin/admin-sidebar";
import AdminHeader from "@/components/admin/admin-header";
import AdminFooter from "@/components/admin/admin-footer";
import AdminGuardNextAuth from "@/components/admin/admin-guard-nextauth";
import AdminProviders from "@/components/admin/admin-providers";

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
  return (
    <AdminProviders>
      <AdminGuardNextAuth>
        <div className="min-h-screen bg-gray-50 flex">
          <AdminSidebar />
          <div className="flex-1 flex flex-col">
            <AdminHeader />
            <main className="flex-1 p-6">
              {children}
            </main>
            <AdminFooter />
          </div>
        </div>
      </AdminGuardNextAuth>
    </AdminProviders>
  );
}
