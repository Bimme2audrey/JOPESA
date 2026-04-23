'use client';

import { Building2, MapPin, Users } from 'lucide-react';
import { Branch } from '@/types';

interface BranchesProps {
  branches: Branch[];
}

export default function Branches({ branches }: BranchesProps) {
  return (
    <div className="sec active">
      <div className="pg-title">JOPESA Chapters</div>
      <div className="pg-sub">Regional chapters and branches</div>

      {branches.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '16px' }}>
            <Building2 size={48} style={{ color: 'var(--navy)' }} />
          </div>
          <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--navy)', marginBottom: '8px' }}>No chapters yet</div>
          <div style={{ fontSize: '14px', color: 'var(--gray)' }}>Chapters will be added by the administrator</div>
        </div>
      ) : (
        branches.map((branch) => (
          <div key={branch.id} className="card" style={{ position: 'relative' }}>
            <div style={{ fontWeight: 700, fontSize: 17, color: 'var(--navy)', marginBottom: 8 }}>{branch.name}</div>
            <div style={{ fontSize: 14, color: 'var(--gray)', marginBottom: 12 }}>{branch.region}</div>
            <div style={{ display: 'flex', gap: 16, fontSize: 13, color: 'var(--gray)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Users size={14} /> {branch.memberCount} members
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <MapPin size={14} /> {branch.region}
              </span>
            </div>
            <div style={{ marginTop: 12, fontSize: 12, color: 'var(--lgray)' }}>
              Established {branch.createdAt}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
