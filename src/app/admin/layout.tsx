'use client'

import type { Metadata } from "next";
import { useState } from 'react'
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

function AdminLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen)
  }

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false)
  }

  return (
    <AdminProviders>
      <AdminGuardNextAuth>
        <div className="min-h-screen bg-gray-50 flex">
          <AdminSidebar 
            isMobileOpen={isMobileSidebarOpen}
            onMobileClose={closeMobileSidebar}
          />
          
          {/* Main Content - Responsive padding pour éviter collision sidebar */}
          <div className="flex-1 flex flex-col lg:ml-0">
            <AdminHeader onMobileMenuClick={toggleMobileSidebar} />
            <main className="flex-1 p-4 md:p-6">
              {children}
            </main>
            <AdminFooter />
          </div>
        </div>
      </AdminGuardNextAuth>
    </AdminProviders>
  );
}

// Export metadata pour Next.js
export default function AdminLayout(props: { children: React.ReactNode }) {
  return <AdminLayoutContent {...props} />
}
