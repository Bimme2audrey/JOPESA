'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Download } from 'lucide-react';
import { Announcement } from '@/types';
import { apiFetch, formatDate } from '@/lib/api';
import { downloadFile } from '@/lib/download';

export default function AlumniAnnouncementDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params.id || '');
  const [item, setItem] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const payload = await apiFetch<Announcement>(`/announcements/${id}`);
        setItem({
          ...payload,
          imageUrl: payload.imageUrl || payload.image,
          createdBy: payload.createdBy || 'Admin',
        });
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'Unable to load announcement');
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id]);

  if (loading) return <div style={{ color: 'var(--gray)' }}>Loading announcement...</div>;

  if (error || !item) {
    return (
      <div>
        <button className="alumni-back-btn" onClick={() => router.push('/alumni/announcements')}>
          <ArrowLeft size={16} /> Back
        </button>
        <div className="alumni-card" style={{ color: 'var(--err)' }}>{error || 'Announcement not found'}</div>
      </div>
    );
  }

  const image = item.imageUrl || item.image;

  return (
    <div>
      <button className="alumni-back-btn" onClick={() => router.push('/alumni/announcements')}>
        <ArrowLeft size={16} /> Back to announcements
      </button>

      {image && (
        <div className="alumni-detail-hero" style={{ height: 'auto', maxHeight: 360 }}>
          <img src={image} alt={item.title} style={{ maxHeight: 360 }} />
          <button
            className="alumni-download-chip"
            onClick={() => downloadFile(image, `${item.title}.jpg`)}
            style={{ position: 'absolute', right: 12, bottom: 12 }}
          >
            <Download size={14} /> Download image
          </button>
        </div>
      )}

      <div className="alumni-card alumni-detail-panel">
        <div className="alumni-meta-row">
          <span style={{ color: 'var(--gold)', textTransform: 'uppercase', fontSize: 11 }}>{item.type}</span>
          {item.isPinned && <span style={{ color: 'var(--navy)', textTransform: 'uppercase', fontSize: 11 }}>Pinned</span>}
          <span>{formatDate(item.createdAt)} · {item.createdBy}</span>
        </div>
        <h1 className="alumni-page-title" style={{ marginBottom: 14 }}>{item.title}</h1>
        <p className="alumni-detail-body">{item.content}</p>
      </div>
    </div>
  );
}
