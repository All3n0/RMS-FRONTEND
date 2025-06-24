'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  HomeIcon,
  FileTextIcon,
  CreditCardIcon,
  SettingsIcon,
  LogOutIcon,
  UserIcon
} from 'lucide-react';

export default function TenantNavbar() {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);

  const handleLogout = () => {
    document.cookie = 'user=; Max-Age=0';
    router.push('/login');
  };

  return (
    <aside
      className={`fixed h-full bg-black text-white transition-all duration-300 ${
        expanded ? 'w-64' : 'w-12'
      } flex flex-col justify-between z-50`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <div>
        <div className="p-4 border-b border-gray-700">
          {expanded && <h1 className="text-xl font-bold">Tenant</h1>}
        </div>
        <nav className="p-4 space-y-4">
          <SidebarLink href="/tenant" label="Dashboard" icon={<HomeIcon className="w-5 h-5" />} expanded={expanded} />
          <SidebarLink href="/tenant/leases" label="Leases" icon={<FileTextIcon className="w-5 h-5" />} expanded={expanded} />
          <SidebarLink href="/tenant/payments" label="Payments" icon={<CreditCardIcon className="w-5 h-5" />} expanded={expanded} />
          <SidebarLink href="/tenant/profile" label="Profile" icon={<UserIcon className="w-5 h-5" />} expanded={expanded} />
          <SidebarLink href="/tenant/settings" label="Settings" icon={<SettingsIcon className="w-5 h-5" />} expanded={expanded} />
        </nav>
      </div>
      <div className="p-4 border-t border-gray-700">
        <button 
          onClick={handleLogout} 
          className="flex items-center gap-2 text-red-400 hover:text-red-200 transition"
        >
          <LogOutIcon className="w-5 h-5" />
          {expanded && 'Logout'}
        </button>
      </div>
    </aside>
  );
}

function SidebarLink({ href, label, icon, expanded }) {
  return (
    <Link 
      href={href} 
      className="flex items-center gap-3 hover:text-blue-400 transition"
    >
      {icon}
      {expanded && <span>{label}</span>}
    </Link>
  );
}