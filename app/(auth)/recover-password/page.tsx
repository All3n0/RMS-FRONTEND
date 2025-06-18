// app/(auth)/recover-password/page.tsx
'use client';

import Link from 'next/link';

export default function RecoverPasswordPage() {
  return (
    <>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Reset your password</h2>

      <form className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
          <input
            type="password"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
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
          Reset Password
        </button>
      </form>

      <p className="text-sm text-gray-600 text-center mt-6">
        Back to{' '}
        <Link href="/login" className="text-blue-600 font-semibold hover:underline">
          Sign in
        </Link>
      </p>
    </>
  );
}
