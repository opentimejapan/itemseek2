'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TouchButton, TouchInput, MobileCard } from '@itemseek2/ui-mobile';
import { useAuth } from '@itemseek2/api-client';
import { LoginInput } from '@itemseek2/shared';

export default function LoginPage() {
  const router = useRouter();
  const { login, user, loading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState<LoginInput>({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(formData);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">ItemSeek2</h1>
          <p className="text-gray-500">Mobile-first inventory management</p>
        </div>

        <MobileCard>
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              {isLogin ? 'Welcome back' : 'Create account'}
            </h2>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <TouchInput
              type="email"
              label="Email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />

            <TouchInput
              type="password"
              label="Password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />

            <TouchButton
              type="submit"
              fullWidth
              variant="primary"
              disabled={loading || !formData.email || !formData.password}
            >
              {loading ? 'Loading...' : isLogin ? 'Sign In' : 'Create Account'}
            </TouchButton>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-blue-600"
              >
                {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
              </button>
            </div>
          </form>
        </MobileCard>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Demo Credentials:</p>
          <p>admin@demo.com / demo123456</p>
          <p>manager@demo.com / demo123456</p>
        </div>
      </div>
    </div>
  );
}