'use client';

import { useState } from 'react';
import { Shield, Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@jopesa.org';
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123';
    
    if (email === adminEmail && password === adminPassword) {
      localStorage.setItem('jopesa_admin_auth', 'true');
      router.push('/admin/dashboard');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--off)', padding: '20px' }}>
      <div className="card" style={{ maxWidth: '400px', width: '100%', padding: '32px 24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px' }}>
          <img 
            src="/logo.png" 
            alt="JOPESA Logo" 
            style={{ width: '64px', height: '64px', borderRadius: '50%', border: '2px solid var(--gold)', objectFit: 'cover', marginBottom: '16px' }}
          />
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--navy)', marginBottom: '4px' }}>Admin Login</h1>
          <p style={{ fontSize: '14px', color: 'var(--gray)', textAlign: 'center' }}>JOPESA Connect Administration</p>
        </div>

        {error && (
          <div className="msg-box msg-err show" style={{ marginBottom: '16px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="fg" style={{ marginBottom: '16px' }}>
            <label>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray)' }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter admin email"
                style={{ paddingLeft: '42px' }}
                required
              />
            </div>
          </div>

          <div className="fg" style={{ marginBottom: '24px' }}>
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ paddingLeft: '42px', paddingRight: '42px' }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray)', display: 'flex', alignItems: 'center' }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-navy">
            Sign In →
          </button>
        </form>
      </div>
    </div>
  );
}
