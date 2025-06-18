'use client';
import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="w-full bg-white shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <Link href="/" className="text-2xl font-extrabold text-blue-700 hover:text-blue-900 transition-colors">
        Renty
      </Link>
      <Link href="/login">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all shadow-md">
          Login
        </button>
      </Link>
    </nav>
  );
};

export default Navbar;
