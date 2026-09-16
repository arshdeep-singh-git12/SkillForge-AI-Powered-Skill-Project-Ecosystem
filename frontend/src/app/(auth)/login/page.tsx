'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loginUser } from '../../../services/auth.service';
import { useAuth } from '../../../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await loginUser(email, password);
      setUser(data);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-machined-900 text-machined-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-dim blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-dim blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-machined-800/80 backdrop-blur-xl border border-machined-600 rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:shadow-cyan/10 hover:border-machined-500">
          <div className="p-8 sm:p-10">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-sans font-bold text-transparent bg-clip-text bg-gradient-to-r from-machined-100 to-machined-400 mb-2">
                Welcome Back
              </h1>
              <p className="text-machined-400 font-mono text-sm">
                Authenticate to access your workspace
              </p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm font-mono flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-mono text-machined-400 block" htmlFor="email">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-machined-900 border border-machined-600 rounded-lg px-4 py-3 text-machined-100 placeholder-machined-500 focus:outline-none focus:border-cyan focus:ring-1 focus:ring-cyan transition-colors"
                    placeholder="name@example.com"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-machined-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-mono text-machined-400 block" htmlFor="password">
                    Password
                  </label>
                  <Link href="/forgot-password" className="text-xs font-mono text-cyan hover:text-cyan-hover transition-colors">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-machined-900 border border-machined-600 rounded-lg px-4 py-3 text-machined-100 placeholder-machined-500 focus:outline-none focus:border-cyan focus:ring-1 focus:ring-cyan transition-colors"
                    placeholder="••••••••"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-machined-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-cyan hover:bg-cyan-hover text-machined-900 font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(12,189,232,0.3)] hover:shadow-[0_0_25px_rgba(12,189,232,0.5)]"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-machined-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Authenticating...
                  </span>
                ) : (
                  'Log In'
                )}
              </button>
            </form>
          </div>
          
          <div className="bg-machined-900/50 border-t border-machined-600 px-8 py-6 text-center">
            <p className="text-sm font-mono text-machined-400">
              Don't have an account?{' '}
              <Link href="/signup" className="text-cyan font-bold hover:text-cyan-hover transition-colors">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
