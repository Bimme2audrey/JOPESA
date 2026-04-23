'use client';

import { Megaphone } from 'lucide-react';
import { Announcement } from '@/types';

interface AnnouncementsProps {
  announcements: Announcement[];
}

export default function Announcements({ announcements }: AnnouncementsProps) {
  return (
    <section className="sec active" id="sec-announcements">
      <div className="pg-title">Announcements</div>
      <div className="pg-sub">Official updates and notices from the association.</div>
      {!announcements.length ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '16px' }}>
            <Megaphone size={48} style={{ color: 'var(--navy)' }} />
          </div>
          <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--navy)', marginBottom: '8px' }}>No announcements yet</div>
          <div style={{ fontSize: '14px', color: 'var(--gray)' }}>Announcements will be posted by the administrator</div>
        </div>
      ) : (
        <div className="announcements-list">
          {announcements.map(announcement => (
            <div key={announcement.id} className="card" style={{ borderLeft: announcement.priority === 'urgent' ? '4px solid var(--err)' : '4px solid var(--gold)' }}>
              <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--navy)', marginBottom: 5 }}>{announcement.title}</div>
              <div style={{ fontSize: 14, color: 'var(--dark)', lineHeight: 1.5, marginBottom: 8 }}>{announcement.content}</div>
              <div style={{ fontSize: 12, color: 'var(--gray)' }}>
                {announcement.createdAt} · by {announcement.createdBy}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
