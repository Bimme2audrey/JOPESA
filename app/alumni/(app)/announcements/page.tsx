'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Megaphone } from 'lucide-react';
import { Announcement } from '@/types';
import { apiFetch, formatDate, unwrapList } from '@/lib/api';

export default function AlumniAnnouncementsPage() {
  const router = useRouter();
  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const payload = await apiFetch(`/announcements?skip=0&take=100`);
        const list = unwrapList<Announcement>(payload).map((item) => ({
          ...item,
          imageUrl: item.imageUrl || item.image,
          createdBy: item.createdBy || 'Admin',
        }));
        list.sort((a, b) => Number(!!b.isPinned) - Number(!!a.isPinned));
        setItems(list);
      } catch (err) {
        console.error(err);
        setError('Unable to load announcements.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div>
      <h1 style={{ margin: '0 0 6px', fontSize: 28, fontWeight: 800, color: 'var(--navy)' }}>Announcements</h1>
      <p style={{ margin: '0 0 22px', color: 'var(--gray)', fontSize: 14 }}>
        Stay up to date with news, opportunities, and important updates.
      </p>

      {loading && <div style={{ color: 'var(--gray)' }}>Loading announcements...</div>}
      {error && <div className="alumni-card" style={{ color: 'var(--err)' }}>{error}</div>}
      {!loading && !error && items.length === 0 && <div className="alumni-card">No announcements yet.</div>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {items.map((item) => (
          <div
            key={item.id}
            className="alumni-card clickable"
            onClick={() => router.push(`/alumni/announcements/${item.id}`)}
            style={{ display: 'flex', gap: 14 }}
          >
            {(item.imageUrl || item.image) ? (
              <img
                src={item.imageUrl || item.image}
                alt={item.title}
                style={{ width: 96, height: 96, objectFit: 'cover', borderRadius: 12, flexShrink: 0 }}
              />
            ) : (
              <div
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: 12,
                  background: 'rgba(0,43,107,0.08)',
                  color: 'var(--navy)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Megaphone size={24} />
              </div>
            )}
            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                <div style={{ fontWeight: 800, color: 'var(--navy)', fontSize: 16 }}>{item.title}</div>
                {item.isPinned && (
                  <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--gold)', textTransform: 'uppercase' }}>
                    Pinned
                  </span>
                )}
              </div>
              <div style={{ fontSize: 12, color: 'var(--gray)', marginBottom: 8 }}>
                {item.type} · {formatDate(item.createdAt)}
              </div>
              <div style={{ fontSize: 14, color: 'var(--dark)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {item.content}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
