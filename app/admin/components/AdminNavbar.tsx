'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminNavbar() {
  const router = useRouter();

  const handleLogout = () => {
    document.cookie = 'user=; Max-Age=0';
    router.push('/login');
  };

  return (
    <nav className="bg-blue-900 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <div className="text-xl font-bold">Admin Panel</div>
      <div className="space-x-4">
        <Link href="/admin" className="hover:underline">
          Dashboard
        </Link>
        <Link href="/admin/users" className="hover:underline">
          Users
        </Link>
        <Link href="/admin/settings" className="hover:underline">
          Settings
        </Link>
        <button onClick={handleLogout} className="hover:underline text-red-300">
          Logout
        </button>
      </div>
    </nav>
  );
}
