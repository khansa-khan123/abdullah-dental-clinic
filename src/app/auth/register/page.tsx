'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Stethoscope, UserPlus, AlertCircle, CheckCircle } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: '',
    dateOfBirth: '', address: '',
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/patients/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');

      router.push('/auth/login?registered=true');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = () => {
    const p = form.password;
    if (!p) return null;
    if (p.length < 6) return { label: 'Weak', color: 'bg-red-500', width: '25%' };
    if (p.length < 8) return { label: 'Fair', color: 'bg-yellow-500', width: '50%' };
    if (p.length < 12) return { label: 'Good', color: 'bg-blue-500', width: '75%' };
    return { label: 'Strong', color: 'bg-green-500', width: '100%' };
  };
  const strength = passwordStrength();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="bg-primary-600 p-3 rounded-2xl group-hover:bg-primary-700 transition-colors shadow-lg">
              <Stethoscope className="h-8 w-8 text-white" />
            </div>
            <div className="text-left">
              <div className="font-bold text-primary-800 text-2xl font-heading">Abdullah Dental</div>
              <div className="text-sm text-gray-500">Create Your Account</div>
            </div>
          </Link>
        </div>

        <div className="card shadow-xl">
          <h1 className="text-2xl font-bold text-gray-900 font-heading mb-1">Create Account</h1>
          <p className="text-gray-500 text-sm mb-7">Register as a patient to book appointments and manage your care.</p>

          {error && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-5">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <label className="label">Full Name *</label>
                <input
                  type="text" required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your full name"
                  className="input-field"
                />
              </div>
              <div>
                <label className="label">Email Address *</label>
                <input
                  type="email" required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  className="input-field"
                />
              </div>
              <div>
                <label className="label">Phone Number *</label>
                <input
                  type="tel" required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+971-50-xxx-xxxx"
                  className="input-field"
                />
              </div>
              <div>
                <label className="label">Date of Birth</label>
                <input
                  type="date"
                  value={form.dateOfBirth}
                  onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="label">Address</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="Your address"
                  className="input-field"
                />
              </div>
              <div>
                <label className="label">Password *</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'} required
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Min. 8 characters"
                    className="input-field pr-10"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {strength && (
                  <div className="mt-2">
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className={`h-full ${strength.color} transition-all`} style={{ width: strength.width }} />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Strength: {strength.label}</p>
                  </div>
                )}
              </div>
              <div>
                <label className="label">Confirm Password *</label>
                <input
                  type="password" required
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  placeholder="Repeat password"
                  className="input-field"
                />
                {form.confirmPassword && (
                  <p className={`text-xs mt-1 flex items-center gap-1 ${form.password === form.confirmPassword ? 'text-green-600' : 'text-red-600'}`}>
                    <CheckCircle className="h-3.5 w-3.5" />
                    {form.password === form.confirmPassword ? 'Passwords match' : 'Passwords do not match'}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3 text-base disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : (
                <><UserPlus className="h-5 w-5" /> Create Account</>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-primary-600 font-semibold hover:text-primary-700">Sign In</Link>
          </p>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          <Link href="/" className="hover:text-gray-600 transition-colors">← Back to website</Link>
        </p>
      </div>
    </div>
  );
}
