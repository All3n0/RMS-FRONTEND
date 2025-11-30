'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [form, setForm] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [resetSuccess, setResetSuccess] = useState(false);

  // Verify token on mount
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setError('No reset link provided. Please request a new one.');
        setIsVerifying(false);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/auth/verify-reset-token?token=${encodeURIComponent(token)}`);
        const data = await res.json();

        if (res.ok && data.valid) {
          setIsTokenValid(true);
        } else {
          setError(data.message || 'Invalid or expired reset link');
        }
      } catch (err: any) {
        setError('Failed to verify reset link. Please try again.');
        console.error('Token verification error:', err);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyToken();
  }, [token]);

  // Calculate password strength
  const calculateStrength = (password: string) => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 1;
    setPasswordStrength(strength);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (name === 'newPassword') {
      calculateStrength(value);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return 'bg-red-500';
    if (passwordStrength <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 2) return 'Weak';
    if (passwordStrength <= 3) return 'Fair';
    return 'Strong';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Validation
    if (form.newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (passwordStrength < 2) {
      setError('Password is too weak. Please choose a stronger password.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          new_password: form.newPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setResetSuccess(true);
        setMessage(data.message);
      } else {
        setError(data.error || 'Failed to reset password');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
      console.error('Reset error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state
  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          <p className="text-gray-600">Verifying reset link...</p>
        </div>
      </div>
    );
  }

  // Token invalid
  if (!isTokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white shadow-md rounded p-6 w-full max-w-md space-y-5">
          <div className="text-center">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-3">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Invalid Link</h2>
            <p className="text-gray-600 mt-2">{error}</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded p-4">
            <p className="text-sm text-blue-800">
              <strong>What to do:</strong> Request a new password reset link.
            </p>
          </div>

          <Link href="/forgot-password" className="btn btn-neutral w-full block text-center">
            Request New Link
          </Link>

          <p className="text-sm text-center text-gray-500">
            <Link href="/login" className="text-blue-600 font-medium hover:underline">
              Back to login
            </Link>
          </p>
        </div>
      </div>
    );
  }

  // Success state
  if (resetSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white shadow-md rounded p-6 w-full max-w-md space-y-5">
          <div className="text-center">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-3">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Password Reset!</h2>
            <p className="text-gray-600 mt-2">{message}</p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded p-4">
            <p className="text-sm text-green-800">
              <strong>Next:</strong> You'll be redirected to login shortly.
            </p>
          </div>

          <button
            onClick={() => router.push('/login')}
            className="btn btn-neutral w-full"
          >
            Go to Login Now
          </button>
        </div>
      </div>
    );
  }

  // Reset form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded p-6 w-full max-w-md space-y-5">
        <div>
          <h2 className="text-2xl font-bold text-center text-gray-800">Reset Password</h2>
          <p className="text-center text-gray-600 text-sm mt-2">
            Enter your new password below.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="newPassword"
              placeholder="At least 8 characters"
              value={form.newPassword}
              onChange={handleChange}
              className="input input-bordered w-full pr-10"
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>

          {/* Password strength indicator */}
          {form.newPassword && (
            <div className="mt-3 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Strength:</span>
                <span className="text-xs font-medium text-gray-700">
                  {getPasswordStrengthText()}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${getPasswordStrengthColor()}`}
                  style={{ width: `${(passwordStrength / 5) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500">
                Password should contain:
              </p>
              <ul className="text-xs text-gray-600 space-y-1">
                <li className={form.newPassword.length >= 8 ? 'text-green-600' : ''}>
                  ✓ At least 8 characters
                </li>
                <li className={/[a-z]/.test(form.newPassword) && /[A-Z]/.test(form.newPassword) ? 'text-green-600' : ''}>
                  ✓ Mix of uppercase and lowercase
                </li>
                <li className={/[0-9]/.test(form.newPassword) ? 'text-green-600' : ''}>
                  ✓ A number
                </li>
                <li className={/[^a-zA-Z0-9]/.test(form.newPassword) ? 'text-green-600' : ''}>
                  ✓ Special character (!@#$%)
                </li>
              </ul>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password
          </label>
          <input
            type={showPassword ? 'text' : 'password'}
            name="confirmPassword"
            placeholder="Re-enter your password"
            value={form.confirmPassword}
            onChange={handleChange}
            className={`input input-bordered w-full ${
              form.confirmPassword && form.newPassword !== form.confirmPassword
                ? 'border-red-500'
                : ''
            }`}
            required
            disabled={isLoading}
          />
          {form.confirmPassword && form.newPassword !== form.confirmPassword && (
            <p className="text-red-600 text-xs mt-1">Passwords do not match</p>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-3">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <button
          type="submit"
          className="btn btn-neutral w-full"
          disabled={
            isLoading ||
            !form.newPassword ||
            !form.confirmPassword ||
            form.newPassword !== form.confirmPassword ||
            passwordStrength < 2
          }
        >
          {isLoading ? 'Resetting...' : 'Reset Password'}
        </button>

        <p className="text-sm text-center text-gray-500">
          Remember your password?{' '}
          <Link href="/login" className="text-blue-600 font-medium hover:underline">
            Go to login
          </Link>
        </p>
      </form>
    </div>
  );
}
