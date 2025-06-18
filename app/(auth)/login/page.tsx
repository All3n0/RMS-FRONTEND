'use client';

import Link from 'next/link';

export default function LoginPage() {
  return (
    <>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Sign in to your account</h2>

      <form className="space-y-5">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
          <input
            type="email"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="you@example.com"
            required
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
            required
          />
          <div className="text-sm text-right mt-2">
            <Link href="/forgot-password" className="text-blue-600 hover:underline">
              Forgot your password?
            </Link>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition"
        >
          Sign In
        </button>
      </form>

      {/* Register */}
      <p className="text-sm text-gray-600 text-center mt-6">
        Don’t have an account?{' '}
        <Link href="/register" className="text-blue-600 font-semibold hover:underline">
          Create one
        </Link>
      </p>
    </>
  );
}
