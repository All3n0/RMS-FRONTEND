'use client';

import { useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  setError('');

  try {
    const res = await fetch('http://127.0.0.1:5556/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        email: form.email.trim(),
        password: form.password
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Login failed');
    }

    // DEBUG: Check the actual response structure
    console.log('Full login response:', data);
    console.log('User data:', data.user);
    console.log('User role:', data.user?.role);
    console.log('User ID:', data.user?.user_id);

    // Store user data in cookie
    Cookies.set('user', JSON.stringify(data.user), {
      expires: 7,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    // DEBUG: Check what was stored in cookie
    const storedUser = Cookies.get('user');
    console.log('Stored in cookie:', storedUser);

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      console.log('Parsed cookie role:', parsedUser.role);
    }

    // Redirect based on role with explicit checks
    const userRole = data.user?.role;
    console.log('Redirecting with role:', userRole);

    if (userRole === 'admin') {
      console.log('Redirecting to /admin');
      router.push('/admin');
    } else if (userRole === 'tenant') {
      console.log('Redirecting to /tenant');
      router.push('/tenant');
    } else {
      console.log('Redirecting to /dashboard (fallback)');
      router.push('/dashboard');
    }

    router.refresh();

  } catch (err: any) {
    setError(err.message || 'An error occurred during login');
    console.error('Login error:', err);
  } finally {
    setIsLoading(false);
  }
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
          value={form.email}
          onChange={handleChange}
          className="input input-bordered w-full"
          required
        />
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <input
          name="password"
          type="password"
          value={form.password}
          placeholder="Password"
          onChange={handleChange}
          className="input input-bordered w-full"
          required
        />
        <div className="text-right">
          <Link href="/(auth)/forgot-password" className="text-sm text-blue-600 hover:underline">
            Forgot your password?
          </Link>
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          className="btn btn-neutral w-full mt-4"
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
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
