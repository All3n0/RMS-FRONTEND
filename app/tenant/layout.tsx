'use client';

import { useState } from 'react';
import TenantNavbar from './components/TenantNavbar';
import TenantFooter from './components/TenantFooter';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function TenantLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Fixed top navbar */}
      <TenantNavbar toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />

      {/* Main layout */}
      <div className="flex flex-1 relative">
        {/* Sidebar */}
        <aside
          className={`fixed z-30 top-16 left-0 h-full bg-white shadow-lg transition-all duration-300 ${
            isSidebarOpen ? 'w-64' : 'w-16'
          }`}
        >
          {/* Add your sidebar content here */}
          <div className="h-full flex flex-col items-center p-2">
            <i className="bi bi-house-door-fill text-2xl mb-4"></i>
            {/* More nav icons or tooltips */}
          </div>
        </aside>

        {/* Content next to sidebar */}
        <div
          className={`flex-1 ml-16 transition-all duration-300 ${
            isSidebarOpen ? 'md:ml-64' : 'md:ml-16'
          }`}
        >
          <main className="p-4 md:p-6 lg:p-8 min-h-[calc(100vh-4rem)]">{children}</main>
          <TenantFooter />
        </div>
      </div>
    </div>
  );
}
