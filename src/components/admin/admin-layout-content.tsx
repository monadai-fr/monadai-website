'use client'

import { useState } from 'react'
import AdminSidebar from "@/components/admin/admin-sidebar";
import AdminHeader from "@/components/admin/admin-header";
import AdminFooter from "@/components/admin/admin-footer";
import AdminGuardNextAuth from "@/components/admin/admin-guard-nextauth";
import AdminProviders from "@/components/admin/admin-providers";

interface AdminLayoutContentProps {
  children: React.ReactNode;
}

export default function AdminLayoutContent({
  children,
}: AdminLayoutContentProps) {
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
            <main className="flex-1 p-2 sm:p-4 md:p-6">
              {children}
            </main>
            <AdminFooter />
          </div>
        </div>
      </AdminGuardNextAuth>
    </AdminProviders>
  );
}
