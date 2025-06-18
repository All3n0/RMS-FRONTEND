// app/(auth)/forgot-password/page.tsx
'use client';

import Link from 'next/link';

export default function ForgotPasswordPage() {
  return (
    <>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Forgot your password?</h2>
      <p className="text-sm text-gray-600 mb-6">
        Enter your email address below and we’ll send you a link to reset your password.
      </p>

      <form className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
          <input
            type="email"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="you@example.com"
            style={{ color: 'black' }}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition"
        >
          Send Reset Link
        </button>
      </form>

      <p className="text-sm text-gray-600 text-center mt-6">
        Remember your password?{' '}
        <Link href="/login" className="text-blue-600 font-semibold hover:underline">
          Sign in
        </Link>
      </p>
    </>
  );
}