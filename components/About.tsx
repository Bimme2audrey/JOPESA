'use client';

import { Building2, GraduationCap, Calendar, Smartphone } from 'lucide-react';
import { Alumni } from '@/types';

interface AboutProps {
  alumni: Alumni[];
}

export default function About({ alumni }: AboutProps) {
  const batches = [...new Set(alumni.map(a => a.batch))];

  return (
    <section className="sec active" id="sec-about">
      <div className="about-hero">
        <div className="about-logo" style={{ width: 80, height: 80, borderRadius: '50%', border: '3px solid #C8960C', background: '#002B6B', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F0C040', fontSize: 24, fontWeight: 800 }}>
          JC
        </div>
        <div className="about-name">JOPESA</div>
        <div className="about-school">
          JOPACC Ex-Students Association<br />
          John Paul II Comprehensive College<br />
          Wum · North West Region · Cameroon
        </div>
        <div className="about-tag">"Empowering minds and Impacting lives"</div>
      </div>
      <div className="card">
        <div className="info-row">
          <Building2 className="info-icon" size={19} />
          <div className="info-body"><h4>School Founded</h4><p>JOPACC opened in 2007/2008 with only Form 1. A new class was added each year until the full school (Form 1 to Upper Sixth) was complete in 2013/2014.</p></div>
        </div>
        <div className="info-row">
          <GraduationCap className="info-icon" size={19} />
          <div className="info-body"><h4>How Batches Work</h4><p>Your batch is determined by the Form 1 year you belong to. A student who entered Form 2 in 2008/2009 is Batch 1 because their Form 1 year was 2007/2008 — the same as those who entered Form 1 in 2007/2008.</p></div>
        </div>
        <div className="info-row">
          <Calendar className="info-icon" size={19} />
          <div className="info-body"><h4>Class Timeline</h4><p>2007/08 → F1 only • 2008/09 → F1–2 • 2009/10 → F1–3 • 2010/11 → F1–4 • 2011/12 → F1–5 • 2012/13 → F1–LS6 • 2013/14+ → All classes</p></div>
        </div>
        <div className="info-row">
          <Smartphone className="info-icon" size={19} />
          <div className="info-body"><h4>This App</h4><p>JOPESA Connect v2.2 • Share on WhatsApp — open in Chrome, works offline. Alumni registered: <strong>{alumni.length}</strong> • Batches: <strong>{batches.length}</strong></p></div>
        </div>
      </div>
    </section>
  );
}
