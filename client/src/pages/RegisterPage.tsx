import { FormEvent, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';

export const RegisterPage = () => {
  const { isAuthenticated, register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/app" replace />;
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(name, email, password);
      navigate('/app');
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : 'Unable to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(96,99,238,0.12),_transparent_30%),linear-gradient(180deg,_#f8fafc_0%,_#f5f3f4_100%)] lg:grid-cols-[1.1fr_0.9fr]">
      <section className="hidden flex-col justify-between p-12 text-primary lg:flex">
        <div>
          <div className="inline-flex items-center gap-3 rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-2 text-sm font-semibold shadow-soft">
            <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
            Start managing leads
          </div>
          <h1 className="mt-8 max-w-xl text-5xl font-extrabold tracking-tight">Build a cleaner pipeline with less noise and better visibility.</h1>
          <p className="mt-5 max-w-xl text-lg text-on-surface-variant">
            Register once and get a secure, role-ready lead dashboard with responsive layouts and reusable TypeScript components.
          </p>
        </div>
      </section>
      <section className="flex items-center justify-center px-4 py-12 sm:px-6 lg:px-10">
        <form onSubmit={submit} className="w-full max-w-md rounded-md border border-outline-variant bg-surface-container-lowest p-8 shadow-ambient">
          <div className="mb-8">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-on-surface-variant">Create account</div>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-primary">Register</h2>
            <p className="mt-2 text-sm text-on-surface-variant">Set up your workspace account.</p>
          </div>
          <div className="grid gap-4">
            <label className="grid gap-2 text-sm font-medium text-on-surface-variant">
              Name
              <input className="rounded-md border border-outline-variant bg-surface-container-lowest px-4 py-3 outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/20" value={name} onChange={(event) => setName(event.target.value)} type="text" required />
            </label>
            <label className="grid gap-2 text-sm font-medium text-on-surface-variant">
              Email
              <input className="rounded-md border border-outline-variant bg-surface-container-lowest px-4 py-3 outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/20" value={email} onChange={(event) => setEmail(event.target.value)} type="email" required />
            </label>
            <label className="grid gap-2 text-sm font-medium text-on-surface-variant">
              Password
              <input className="rounded-md border border-outline-variant bg-surface-container-lowest px-4 py-3 outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/20" value={password} onChange={(event) => setPassword(event.target.value)} type="password" required />
            </label>
            {error ? <div className="rounded-md border border-error bg-error-container px-4 py-3 text-sm text-error">{error}</div> : null}
            <button className="rounded-md bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60" disabled={loading} type="submit">
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </div>
          <p className="mt-6 text-sm text-on-surface-variant">
            Already registered?{' '}
            <Link className="font-semibold text-secondary hover:underline" to="/login">
              Log in
            </Link>
          </p>
        </form>
      </section>
    </div>
  );
};
