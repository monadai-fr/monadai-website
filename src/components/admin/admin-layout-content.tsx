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
        <div className="min-h-screen bg-gray-50 flex w-full overflow-hidden">
          <AdminSidebar 
            isMobileOpen={isMobileSidebarOpen}
            onMobileClose={closeMobileSidebar}
          />
          
          {/* Main Content - Contraintes largeur strictes */}
          <div className="flex-1 flex flex-col lg:ml-0 min-w-0 w-full">
            <AdminHeader onMobileMenuClick={toggleMobileSidebar} />
            <main className="flex-1 p-2 sm:p-4 md:p-6 min-w-0 w-full overflow-x-hidden">
              <div className="w-full max-w-full overflow-x-auto">
                {children}
              </div>
            </main>
            <AdminFooter />
          </div>
        </div>
      </AdminGuardNextAuth>
    </AdminProviders>
  );
}
