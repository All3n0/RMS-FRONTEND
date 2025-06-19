'use client';

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

export default function AdminDashboardPage() {
  const [adminName, setAdminName] = useState<string>('Admin');

  useEffect(() => {
    const userCookie = Cookies.get('user');
    if (userCookie) {
      try {
        const userData = JSON.parse(userCookie);
        const name = userData?.user?.username;
        if (name) {
          setAdminName(name);
        }
      } catch (error) {
        console.error('Failed to parse user cookie:', error);
      }
    }
  }, []);

  return (
    <div className="text-gray-800">
      <h1 className="text-3xl font-semibold mb-4">Hey, {adminName}</h1>
      <p>This is the admin dashboard.</p>
    </div>
  );
}
