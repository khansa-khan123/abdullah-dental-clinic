'use client';

import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Stethoscope, LogIn, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await signIn('credentials', {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    if (res?.error) {
      setError('Invalid email or password. Please try again.');
      setLoading(false);
    } else {
      // redirect based on role — fetch session
      const sessionRes = await fetch('/api/auth/session');
      const session = await sessionRes.json();
      const role = session?.user?.role;

      if (role === 'ADMIN') router.push('/admin/dashboard');
      else if (role === 'DOCTOR') router.push('/doctor/dashboard');
      else router.push('/patient/dashboard');
    }
  };

  const fillDemo = (role: string) => {
    const demos: Record<string, { email: string; password: string }> = {
      admin: { email: 'admin@abdullahdental.com', password: 'Admin123!' },
      doctor: { email: 'dr.abdullah@abdullahdental.com', password: 'Doctor123!' },
      patient: { email: 'ahmed@example.com', password: 'Patient123!' },
    };
    if (demos[role]) setForm(demos[role]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="bg-primary-600 p-3 rounded-2xl group-hover:bg-primary-700 transition-colors shadow-lg">
              <Stethoscope className="h-8 w-8 text-white" />
            </div>
            <div className="text-left">
              <div className="font-bold text-primary-800 text-2xl font-heading">Abdullah Dental</div>
              <div className="text-sm text-gray-500">Patient & Staff Portal</div>
            </div>
          </Link>
        </div>

        <div className="card shadow-xl">
          <h1 className="text-2xl font-bold text-gray-900 font-heading mb-1">Welcome back</h1>
          <p className="text-gray-500 text-sm mb-7">Sign in to your account to continue</p>

          {/* Demo buttons */}
          <div className="bg-blue-50 rounded-xl p-4 mb-6">
            <p className="text-xs font-semibold text-blue-700 mb-2">Quick Demo Login:</p>
            <div className="flex gap-2 flex-wrap">
              {['admin', 'doctor', 'patient'].map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => fillDemo(role)}
                  className="text-xs px-3 py-1.5 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium capitalize transition-colors"
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-5">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Email Address</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className="input-field"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="label mb-0">Password</label>
                <Link href="#" className="text-xs text-primary-600 hover:text-primary-700 font-medium">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="input-field pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3 text-base disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <>
                  <LogIn className="h-5 w-5" />
                  Sign In
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            New patient?{' '}
            <Link href="/auth/register" className="text-primary-600 hover:text-primary-700 font-semibold">
              Create an account
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          <Link href="/" className="hover:text-gray-600 transition-colors">← Back to website</Link>
        </p>
      </div>
    </div>
  );
}
export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}