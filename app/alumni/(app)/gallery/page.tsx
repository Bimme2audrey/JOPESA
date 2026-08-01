'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Download, Images } from 'lucide-react';
import { Photo } from '@/types';
import { apiFetch, unwrapList } from '@/lib/api';
import { downloadFile } from '@/lib/download';

export default function AlumniGalleryPage() {
  const router = useRouter();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const payload = await apiFetch(`/photos?skip=0&take=200`);
        setPhotos(
          unwrapList<Photo>(payload).map((photo) => ({
            ...photo,
            eventTitle: photo.event?.title || photo.eventTitle || 'Event photo',
          })),
        );
      } catch (err) {
        console.error(err);
        setError('Unable to load gallery.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div>
      <h1 style={{ margin: '0 0 6px', fontSize: 28, fontWeight: 800, color: 'var(--navy)' }}>Gallery</h1>
      <p style={{ margin: '0 0 22px', color: 'var(--gray)', fontSize: 14 }}>
        Photos uploaded from the admin Photos tab. Click a photo to open its event.
      </p>

      {loading && <div style={{ color: 'var(--gray)' }}>Loading gallery...</div>}
      {error && <div className="alumni-card" style={{ color: 'var(--err)' }}>{error}</div>}
      {!loading && !error && photos.length === 0 && (
        <div className="alumni-card" style={{ textAlign: 'center', padding: 40 }}>
          <Images size={36} color="var(--navy)" style={{ marginBottom: 10 }} />
          <div style={{ fontWeight: 700, color: 'var(--navy)' }}>No photos yet</div>
          <div style={{ fontSize: 13, color: 'var(--gray)', marginTop: 6 }}>
            Photos will appear here after admins upload them from the Photos section.
          </div>
        </div>
      )}

      <div className="alumni-gallery-grid">
        {photos.map((photo) => {
          const title = photo.event?.title || photo.eventTitle || 'Event photo';
          return (
            <div
              key={photo.id}
              style={{
                position: 'relative',
                borderRadius: 14,
                overflow: 'hidden',
                background: '#fff',
                boxShadow: '0 3px 18px rgba(0,43,107,.1)',
              }}
            >
              <img
                src={photo.url}
                alt={title}
                onClick={() => router.push(`/alumni/events/${photo.eventId}`)}
                style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block', cursor: 'pointer' }}
              />
              <div style={{ padding: '10px 12px 12px' }}>
                <div
                  onClick={() => router.push(`/alumni/events/${photo.eventId}`)}
                  style={{ fontWeight: 700, color: 'var(--navy)', fontSize: 13, cursor: 'pointer', marginBottom: 8 }}
                >
                  {title}
                </div>
                <button
                  onClick={() => downloadFile(photo.url, `${title}.jpg`)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                    border: '1px solid var(--lgray)',
                    background: 'var(--off)',
                    color: 'var(--navy)',
                    borderRadius: 8,
                    padding: '6px 8px',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  <Download size={13} /> Download
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
