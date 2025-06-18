'use client';

import { useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e: any) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const res = await fetch('http://127.0.0.1:5556/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Login failed');
      return;
    }

    Cookies.set('user', JSON.stringify(data), { expires: 7 });
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded p-6 w-full max-w-md space-y-5">
        <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          className="input input-bordered w-full"
          required
        />
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className="input input-bordered w-full"
          required
        />
        <div className="text-right">
          <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
            Forgot your password?
          </Link>
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button className="center btn btn-neutral w-full" style={{ marginTop: '1rem' }}>Login</button>
        <p className="text-sm text-center text-gray-500">
          Don't have an account?{' '}
          <Link href="/register" className="text-blue-600 font-medium">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
