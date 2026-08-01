'use client';

import Link from 'next/link';
import { ReactNode, FormEvent } from 'react';

interface AuthCardProps {
  title: string;
  subtitle: string;
  submitLabel: string;
  footerText: string;
  footerHref: string;
  footerLabel: string;
  error?: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
}

export default function AuthCard({
  title,
  subtitle,
  submitLabel,
  footerText,
  footerHref,
  footerLabel,
  error,
  onSubmit,
  children,
}: AuthCardProps) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--off)', padding: '20px' }}>
      <div className="card" style={{ maxWidth: '420px', width: '100%', padding: '32px 24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px' }}>
          <img
            src="/logo.png"
            alt="JOPESA Logo"
            style={{ width: '64px', height: '64px', borderRadius: '50%', border: '2px solid var(--gold)', objectFit: 'cover', marginBottom: '16px' }}
          />
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--navy)', marginBottom: '4px' }}>{title}</h1>
          <p style={{ fontSize: '14px', color: 'var(--gray)', textAlign: 'center' }}>{subtitle}</p>
        </div>

        {error && (
          <div className="msg-box msg-err show" style={{ marginBottom: '16px' }}>
            {error}
          </div>
        )}

        <form onSubmit={onSubmit}>
          {children}
          <button type="submit" className="btn btn-navy" style={{ width: '100%' }}>
            {submitLabel}
          </button>
        </form>

        <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '14px', color: 'var(--gray)' }}>
          {footerText}{' '}
          <Link href={footerHref} style={{ color: 'var(--navy)', fontWeight: 700 }}>
            {footerLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
