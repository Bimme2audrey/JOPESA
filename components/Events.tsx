'use client';

import { Calendar, MapPin } from 'lucide-react';
import { Event } from '@/types';

interface EventsProps {
  events: Event[];
}

export default function Events({ events }: EventsProps) {
  return (
    <section className="sec active" id="sec-events">
      <div className="pg-title">Events</div>
      <div className="pg-sub">View upcoming and past events.</div>
      {!events.length ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '16px' }}>
            <Calendar size={48} style={{ color: 'var(--navy)' }} />
          </div>
          <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--navy)', marginBottom: '8px' }}>No events yet</div>
          <div style={{ fontSize: '14px', color: 'var(--gray)' }}>Events will be added by the administrator</div>
        </div>
      ) : (
        <div className="events-list">
          {events.map(event => (
            <div key={event.id} className="card">
              <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--navy)', marginBottom: 5 }}>{event.title}</div>
              <div style={{ fontSize: 13, color: 'var(--gray)', marginBottom: 8 }}>{event.description}</div>
              <div style={{ display: 'flex', gap: 15, fontSize: 12, color: 'var(--gray)', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={12} /> {event.startDate} - {event.endDate}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={12} /> {event.location}</span>
              </div>
              <div style={{ marginTop: 10 }}>
                <span className={`status-badge ${event.status}`}>{event.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
