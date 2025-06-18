'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const res = await fetch('http://127.0.0.1:5556/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username }),
    });
    const data = await res.json();
    setMessage(data.message || 'Check your email for recovery instructions.');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h2 className="text-2xl font-bold text-center text-gray-800">Forgot Password</h2>
      <input
        placeholder="Enter your username"
        className="input input-bordered w-full"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      {message && <p className="text-green-600 text-sm">{message}</p>}
      <button className="btn btn-neutral w-full">Submit</button>
      <p className="text-sm text-center text-gray-500">
        Remembered your password?{' '}
        <Link href="/login" className="text-blue-600 font-medium">
          Go to login
        </Link>
      </p>
    </form>
  );
}
