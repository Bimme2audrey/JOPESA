'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface CarouselSlide {
  id: string;
  url: string;
  title: string;
  eventId: string;
}

interface PhotoCarouselProps {
  slides: CarouselSlide[];
}

export default function PhotoCarousel({ slides }: PhotoCarouselProps) {
  const router = useRouter();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) {
    return (
      <div
        className="alumni-carousel empty"
        style={{
          height: 280,
          borderRadius: 18,
          background: 'linear-gradient(135deg, var(--navy), var(--navy2))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'rgba(255,255,255,0.7)',
          fontWeight: 600,
        }}
      >
        Event photos will appear here once uploaded
      </div>
    );
  }

  const slide = slides[index];

  return (
    <div
      className="alumni-carousel"
      style={{
        position: 'relative',
        height: 300,
        borderRadius: 18,
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(0,43,107,0.18)',
        cursor: 'pointer',
      }}
      onClick={() => router.push(`/alumni/events/${slide.eventId}`)}
    >
      {slides.map((item, i) => (
        <img
          key={item.id}
          src={item.url}
          alt={item.title}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: i === index ? 1 : 0,
            transform: i === index ? 'scale(1)' : 'scale(1.05)',
            transition: 'opacity 0.6s ease, transform 6s ease',
          }}
        />
      ))}

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.05) 30%, rgba(0,43,107,0.78) 100%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: 20,
          right: 20,
          bottom: 22,
          color: '#fff',
          zIndex: 2,
        }}
      >
        <div
          style={{
            display: 'inline-block',
            padding: '6px 12px',
            borderRadius: 999,
            background: 'rgba(200,150,12,0.9)',
            color: '#fff',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 0.4,
            marginBottom: 10,
          }}
        >
          Event Gallery
        </div>
        <div
          style={{
            fontSize: 24,
            fontWeight: 800,
            textShadow: '0 2px 12px rgba(0,0,0,0.35)',
            lineHeight: 1.2,
          }}
        >
          {slide.title}
        </div>
      </div>

      {slides.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIndex((prev) => (prev - 1 + slides.length) % slides.length);
            }}
            style={{
              position: 'absolute',
              left: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 36,
              height: 36,
              borderRadius: '50%',
              border: 'none',
              background: 'rgba(255,255,255,0.9)',
              color: 'var(--navy)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 3,
            }}
            aria-label="Previous photo"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIndex((prev) => (prev + 1) % slides.length);
            }}
            style={{
              position: 'absolute',
              right: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 36,
              height: 36,
              borderRadius: '50%',
              border: 'none',
              background: 'rgba(255,255,255,0.9)',
              color: 'var(--navy)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 3,
            }}
            aria-label="Next photo"
          >
            <ChevronRight size={18} />
          </button>

          <div
            style={{
              position: 'absolute',
              bottom: 12,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: 6,
              zIndex: 3,
            }}
          >
            {slides.map((item, i) => (
              <button
                key={item.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setIndex(i);
                }}
                style={{
                  width: i === index ? 18 : 8,
                  height: 8,
                  borderRadius: 999,
                  border: 'none',
                  background: i === index ? 'var(--gold2)' : 'rgba(255,255,255,0.55)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
