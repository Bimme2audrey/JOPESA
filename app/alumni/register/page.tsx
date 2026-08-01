'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, Phone, Eye, EyeOff, GraduationCap, Building2 } from 'lucide-react';
import AuthCard from '@/components/AuthCard';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const getApiErrorMessage = (payload: any): string => {
  if (Array.isArray(payload?.message)) {
    return payload.message.flat(Infinity).filter(Boolean).join(' ');
  }

  if (typeof payload?.message === 'string' && payload.message.trim()) {
    return payload.message;
  }

  if (typeof payload?.error === 'string' && payload.error.trim()) {
    return payload.error;
  }

  return 'Registration failed. Please try again.';
};

export default function AlumniRegisterPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [batchId, setBatchId] = useState('');
  const [branchId, setBranchId] = useState('');
  const [batchOptions, setBatchOptions] = useState<Array<{ id: string; name?: string; year?: number }>>([]);
  const [branchOptions, setBranchOptions] = useState<Array<{ id: string; name?: string }>>([]);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [batchResponse, branchResponse] = await Promise.all([
          fetch(`${apiBaseUrl}/batch?skip=0&take=100`),
          fetch(`${apiBaseUrl}/branch?skip=0&take=100`),
        ]);

        if (batchResponse.ok) {
          const batchPayload = await batchResponse.json();
          const batchData = Array.isArray(batchPayload?.data) ? batchPayload.data : Array.isArray(batchPayload) ? batchPayload : [];
          setBatchOptions(batchData);
          if (batchData[0]?.id) {
            setBatchId(batchData[0].id);
          }
        }

        if (branchResponse.ok) {
          const branchPayload = await branchResponse.json();
          const branchData = Array.isArray(branchPayload?.data) ? branchPayload.data : Array.isArray(branchPayload) ? branchPayload : [];
          setBranchOptions(branchData);
          if (branchData[0]?.id) {
            setBranchId(branchData[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to load batch and branch options:', err);
      }
    };

    loadOptions();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    try {
      const response = await fetch(`${apiBaseUrl}/alumni`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, firstName, lastName, phone, batchId, branchId }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(getApiErrorMessage(payload));
      }

      await response.json();

      const loginResponse = await fetch(`${apiBaseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!loginResponse.ok) {
        router.push('/alumni/login');
        return;
      }

      const loginData = await loginResponse.json();
      localStorage.setItem('jopesa_alumni_token', loginData.accessToken);
      localStorage.setItem('jopesa_user', JSON.stringify(loginData.user));
      router.push('/alumni/dashboard');
    } catch (err) {
      console.error('Alumni registration failed:', err);
      setError(err instanceof Error && err.message ? err.message : 'Registration failed. Please try again.');
    }
  };

  return (
    <AuthCard
      title="Create Alumni Account"
      subtitle="Join the JOPESA network and access alumni resources."
      submitLabel="Create Account →"
      footerText="Already have an account?"
      footerHref="/alumni/login"
      footerLabel="Sign in"
      error={error}
      onSubmit={handleSubmit}
    >
      <div className="fg" style={{ marginBottom: '16px' }}>
        <label>First Name</label>
        <div style={{ position: 'relative' }}>
          <User size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray)' }} />
          <input
            type="text"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            placeholder="Enter your first name"
            style={{ paddingLeft: '42px' }}
            required
          />
        </div>
      </div>

      <div className="fg" style={{ marginBottom: '16px' }}>
        <label>Last Name</label>
        <div style={{ position: 'relative' }}>
          <User size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray)' }} />
          <input
            type="text"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            placeholder="Enter your last name"
            style={{ paddingLeft: '42px' }}
            required
          />
        </div>
      </div>

      <div className="fg" style={{ marginBottom: '16px' }}>
        <label>Email Address</label>
        <div style={{ position: 'relative' }}>
          <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray)' }} />
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter your email"
            style={{ paddingLeft: '42px' }}
            required
          />
        </div>
      </div>

      <div className="fg" style={{ marginBottom: '16px' }}>
        <label>Phone Number</label>
        <div style={{ position: 'relative' }}>
          <Phone size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray)' }} />
          <input
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="Optional phone number"
            style={{ paddingLeft: '42px' }}
          />
        </div>
      </div>

      <div className="fg" style={{ marginBottom: '16px' }}>
        <label>Batch</label>
        <div style={{ position: 'relative' }}>
          <GraduationCap size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray)' }} />
          <select
            value={batchId}
            onChange={(event) => setBatchId(event.target.value)}
            style={{ paddingLeft: '42px' }}
            required
          >
            {batchOptions.map((batch) => (
              <option key={batch.id} value={batch.id}>
                {batch.name || `Batch ${batch.year ?? ''}`}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="fg" style={{ marginBottom: '16px' }}>
        <label>Branch</label>
        <div style={{ position: 'relative' }}>
          <Building2 size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray)' }} />
          <select
            value={branchId}
            onChange={(event) => setBranchId(event.target.value)}
            style={{ paddingLeft: '42px' }}
            required
          >
            {branchOptions.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="fg" style={{ marginBottom: '24px' }}>
        <label>Password</label>
        <div style={{ position: 'relative' }}>
          <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray)' }} />
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Create a password"
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
    </AuthCard>
  );
}
