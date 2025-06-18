'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RecoverPasswordPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: '', new_password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e: any) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const res = await fetch('http://127.0.0.1:5556/recover-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok) {
      setMessage('Password changed! Redirecting to login...');
      setTimeout(() => router.push('/login'), 2000);
    } else {
      setMessage(data.error || 'Something went wrong');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h2 className="text-2xl font-bold text-center text-gray-800">Recover Password</h2>
      <input
        name="username"
        placeholder="Username"
        onChange={handleChange}
        className="input input-bordered w-full"
        required
      />
      <input
        name="new_password"
        type="password"
        placeholder="New Password"
        onChange={handleChange}
        className="input input-bordered w-full"
        required
      />
      {message && <p className="text-green-600 text-sm">{message}</p>}
      <button className="btn btn-neutral w-full">Reset Password</button>
    </form>
  );
}
