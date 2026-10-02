'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, Phone, Eye, EyeOff, GraduationCap, Building2 } from 'lucide-react';
import { Button, Input, ListBox, Select } from '@heroui/react';
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
        <Input
          type="text"
          value={firstName}
          onChange={(event) => setFirstName(event.target.value)}
          placeholder="Enter your first name"
          required
        />
      </div>

      <div className="fg" style={{ marginBottom: '16px' }}>
        <label>Last Name</label>
        <Input
          type="text"
          value={lastName}
          onChange={(event) => setLastName(event.target.value)}
          placeholder="Enter your last name"
          required
        />
      </div>

      <div className="fg" style={{ marginBottom: '16px' }}>
        <label>Email Address</label>
        <Input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Enter your email"
          required
        />
      </div>

      <div className="fg" style={{ marginBottom: '16px' }}>
        <label>Phone Number</label>
        <Input
          type="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="Optional phone number"
        />
      </div>

      <div className="fg" style={{ marginBottom: '16px' }}>
        <label>Batch</label>
        <Select
          aria-label="Batch"
          selectedKey={batchId || undefined}
          onSelectionChange={(key) => {
            setBatchId(String(key ?? ''));
          }}
          isRequired
          placeholder="Select a batch"
        >
          <Select.Trigger>
            <GraduationCap size={18} style={{ color: 'var(--gray)' }} />
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              {batchOptions.map((batch) => (
                <ListBox.Item key={batch.id} id={batch.id}>
                  {batch.name || `Batch ${batch.year ?? ''}`}
                </ListBox.Item>
              ))}
            </ListBox>
          </Select.Popover>
        </Select>
      </div>

      <div className="fg" style={{ marginBottom: '16px' }}>
        <label>Branch</label>
        <Select
          aria-label="Branch"
          selectedKey={branchId || undefined}
          onSelectionChange={(key) => {
            setBranchId(String(key ?? ''));
          }}
          isRequired
          placeholder="Select a branch"
        >
          <Select.Trigger>
            <Building2 size={18} style={{ color: 'var(--gray)' }} />
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              {branchOptions.map((branch) => (
                <ListBox.Item key={branch.id} id={branch.id}>{branch.name}</ListBox.Item>
              ))}
            </ListBox>
          </Select.Popover>
        </Select>
      </div>

      <div className="fg" style={{ marginBottom: '24px' }}>
        <label>Password</label>
        <Input
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Create a password"
          required
        />
        <Button isIconOnly type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onPress={() => setShowPassword(!showPassword)}>
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </Button>
      </div>
    </AuthCard>
  );
}
