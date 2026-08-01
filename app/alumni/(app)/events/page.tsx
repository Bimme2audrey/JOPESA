'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CalendarDays, MapPin, Users } from 'lucide-react';
import { Event } from '@/types';
import { apiFetch, eventImages, formatDateRange, unwrapList } from '@/lib/api';

export default function AlumniEventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const payload = await apiFetch(`/events?skip=0&take=100&status=PUBLISHED`);
        const list = unwrapList<Event>(payload).sort(
          (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
        );
        setEvents(list);
      } catch (err) {
        console.error(err);
        setError('Unable to load events.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div>
      <h1 style={{ margin: '0 0 6px', fontSize: 28, fontWeight: 800, color: 'var(--navy)' }}>Events</h1>
      <p style={{ margin: '0 0 22px', color: 'var(--gray)', fontSize: 14 }}>
        Browse reunions, gatherings, and alumni programs. Click an event to view details and register.
      </p>

      {loading && <div style={{ color: 'var(--gray)' }}>Loading events...</div>}
      {error && <div className="alumni-card" style={{ color: 'var(--err)' }}>{error}</div>}

      {!loading && !error && events.length === 0 && (
        <div className="alumni-card">No published events yet.</div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {events.map((event) => {
          const cover = eventImages(event)[0];
          const attendees = event._count?.attendees;
          return (
            <div
              key={event.id}
              className="alumni-card clickable"
              onClick={() => router.push(`/alumni/events/${event.id}`)}
              style={{ display: 'flex', gap: 16, padding: 0, overflow: 'hidden' }}
            >
              {cover ? (
                <img src={cover} alt={event.title} style={{ width: 160, minHeight: 120, objectFit: 'cover', flexShrink: 0 }} />
              ) : (
                <div
                  style={{
                    width: 160,
                    minHeight: 120,
                    background: 'linear-gradient(135deg, var(--navy), var(--navy2))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--gold2)',
                    flexShrink: 0,
                  }}
                >
                  <CalendarDays size={28} />
                </div>
              )}
              <div style={{ padding: '16px 16px 16px 0', minWidth: 0, flex: 1 }}>
                <div style={{ fontWeight: 800, color: 'var(--navy)', fontSize: 17, marginBottom: 8 }}>
                  {event.title}
                </div>
                <div style={{ fontSize: 13, color: 'var(--gray)', marginBottom: 10, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {event.description}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, fontSize: 12, color: 'var(--gray)' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                    <CalendarDays size={13} /> {formatDateRange(event.startDate, event.endDate)}
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                    <MapPin size={13} /> {event.location || 'TBA'}
                  </span>
                  {typeof attendees === 'number' && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                      <Users size={13} /> {attendees} registered
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
