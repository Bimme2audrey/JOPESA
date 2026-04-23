'use client';

import { Info } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  onShowAbout?: () => void;
}

export default function Header({ onShowAbout }: HeaderProps) {
  return (
    <header>
      <div className="hdr" style={{ justifyContent: 'center' }}>
        <img
          src="/logo.png"
          alt="JOPESA Logo"
          style={{ width: 44, height: 44, borderRadius: '50%', border: '2px solid #C8960C', objectFit: 'cover' }}
        />
        <div className="hdr-t">
          <h1>JOPESA Connect</h1>
          <div className="hdr-sub">JOPACC Wum · Est. 2007</div>
          <div className="hdr-mot">Lux Mundi Et Sal Terrae</div>
        </div>
        {onShowAbout && (
          <button
            onClick={onShowAbout}
            style={{
              position: 'absolute',
              right: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'var(--off)',
              border: '1px solid var(--lgray)',
              borderRadius: '8px',
              padding: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--navy)'
            }}
          >
            <Info size={18} />
          </button>
        )}
      </div>
    </header>
  );
}
