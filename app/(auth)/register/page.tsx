// app/(auth)/register/page.tsx
'use client';

import Link from 'next/link';

export default function RegisterPage() {
  return (
    <>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Create an account</h2>

      <form className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="John Doe"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
          <input
            type="email"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="you@example.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition"
        >
          Sign Up
        </button>
      </form>

      <p className="text-sm text-gray-600 text-center mt-6">
        Already have an account?{' '}
        <Link href="/login" className="text-blue-600 font-semibold hover:underline">
          Sign in
        </Link>
      </p>
    </>
  );
}