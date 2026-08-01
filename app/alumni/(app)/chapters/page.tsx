'use client';

import { useEffect, useState } from 'react';
import { Building2, MapPin, Users } from 'lucide-react';
import { Branch } from '@/types';
import { apiFetch, unwrapList } from '@/lib/api';

export default function AlumniChaptersPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const payload = await apiFetch(`/branch?skip=0&take=100`);
        setBranches(
          unwrapList<Branch>(payload).map((branch) => ({
            ...branch,
            region: branch.region || (branch as Branch & { description?: string }).description || '',
            memberCount: branch.memberCount ?? 0,
            createdAt: branch.createdAt || '',
          })),
        );
      } catch (err) {
        console.error(err);
        setError('Unable to load chapters.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div>
      <h1 style={{ margin: '0 0 6px', fontSize: 28, fontWeight: 800, color: 'var(--navy)' }}>Chapters</h1>
      <p style={{ margin: '0 0 22px', color: 'var(--gray)', fontSize: 14 }}>
        Regional JOPESA chapters and communities.
      </p>

      {loading && <div style={{ color: 'var(--gray)' }}>Loading chapters...</div>}
      {error && <div className="alumni-card" style={{ color: 'var(--err)' }}>{error}</div>}
      {!loading && !error && branches.length === 0 && (
        <div className="alumni-card" style={{ textAlign: 'center', padding: 40 }}>
          <Building2 size={36} color="var(--navy)" style={{ marginBottom: 10 }} />
          <div style={{ fontWeight: 700, color: 'var(--navy)' }}>No chapters yet</div>
          <div style={{ fontSize: 13, color: 'var(--gray)', marginTop: 6 }}>
            Chapters will appear here once added by the administrator.
          </div>
        </div>
      )}

      <div className="alumni-grid-2">
        {branches.map((branch) => (
          <div key={branch.id} className="alumni-card">
            <div style={{ fontWeight: 800, fontSize: 17, color: 'var(--navy)', marginBottom: 8 }}>{branch.name}</div>
            <div style={{ fontSize: 14, color: 'var(--gray)', marginBottom: 12 }}>
              {(branch as Branch & { description?: string }).description || branch.region || 'Chapter'}
            </div>
            <div style={{ display: 'flex', gap: 16, fontSize: 13, color: 'var(--gray)' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                <Users size={14} /> {branch.memberCount || 0} members
              </span>
              {branch.region && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  <MapPin size={14} /> {branch.region}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
