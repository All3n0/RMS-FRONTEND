'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  HomeIcon,
  BuildingIcon,
  CreditCardIcon,
  SettingsIcon,
  LogOutIcon
} from 'lucide-react';

export default function AdminNavbar() {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);

  const handleLogout = () => {
    document.cookie = 'user=; Max-Age=0';
    router.push('/login');
  };

  const toggleSidebar = () => setExpanded(prev => !prev);

  return (
    <aside
      className={`h-screen bg-black text-white transition-all duration-300 ${
        expanded ? 'w-64' : 'w-12'
      } flex flex-col justify-between`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <div>
        {/* Top area */}
        <div className="p-4 border-b border-gray-700">
          {expanded && <h1 className="text-xl font-bold">Admin</h1>}
        </div>

        {/* Navigation links */}
        <nav className="p-4 space-y-4">
          <SidebarLink href="/admin" label="Dashboard" icon={<HomeIcon className="w-5 h-5" />} expanded={expanded} />
          <SidebarLink href="/admin/properties" label="Properties" icon={<BuildingIcon className="w-5 h-5" />} expanded={expanded} />
          <SidebarLink href="/admin/rent" label="Rent" icon={<CreditCardIcon className="w-5 h-5" />} expanded={expanded} />
          <SidebarLink href="/admin/settings" label="Settings" icon={<SettingsIcon className="w-5 h-5" />} expanded={expanded} />
        </nav>
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-gray-700">
        <button onClick={handleLogout} className="flex items-center gap-2 text-red-400 hover:text-red-200 transition">
          <LogOutIcon className="w-5 h-5" />
          {expanded && 'Logout'}
        </button>
      </div>
    </aside>
  );
}

function SidebarLink({
  href,
  label,
  icon,
  expanded
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  expanded: boolean;
}) {
  return (
    <Link href={href} className="flex items-center gap-3 hover:text-blue-400 transition">
      {icon}
      {expanded && <span>{label}</span>}
    </Link>
  );
}
