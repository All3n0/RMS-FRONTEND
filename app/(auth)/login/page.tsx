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
      credentials: 'include', // Crucial for cookies to work
      body: JSON.stringify({
        email: form.email.trim(),
        password: form.password
      }),
    });

    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.error || 'Login failed');
    }

    // Debug: Check what's being received
    console.log('Login response:', data);

    // Store user data in cookie (client-side)
    Cookies.set('user', JSON.stringify(data.user), { 
      expires: 7,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    // Debug: Verify cookie was set
    console.log('Cookie set:', Cookies.get('user'));

    // Redirect based on role
    if (data.user.role === 'admin') {
      router.push('/admin');
    } else if (data.user.role === 'tenant') {
      router.push('/tenant');
    } else {
      router.push('/dashboard');
    }

    // Force refresh to ensure all state updates
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