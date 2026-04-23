'use client';

import { GraduationCap, Users, Info, Calendar, FileText, Megaphone, Building2 } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'finder' | 'alumni' | 'events' | 'announcements' | 'documents' | 'branches' | 'about';
  onTabChange: (tab: 'finder' | 'alumni' | 'events' | 'announcements' | 'documents' | 'branches' | 'about') => void;
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="bnav" style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)' }}>
      <button className={`nav-btn ${activeTab === 'finder' ? 'active' : ''}`} onClick={() => onTabChange('finder')}>
        <GraduationCap className="nav-ico" size={19} />Finder
      </button>
      <button className={`nav-btn ${activeTab === 'alumni' ? 'active' : ''}`} onClick={() => onTabChange('alumni')}>
        <Users className="nav-ico" size={19} />Alumni
      </button>
      <button className={`nav-btn ${activeTab === 'events' ? 'active' : ''}`} onClick={() => onTabChange('events')}>
        <Calendar className="nav-ico" size={19} />Events
      </button>
      <button className={`nav-btn ${activeTab === 'announcements' ? 'active' : ''}`} onClick={() => onTabChange('announcements')}>
        <Megaphone className="nav-ico" size={19} />News
      </button>
      <button className={`nav-btn ${activeTab === 'documents' ? 'active' : ''}`} onClick={() => onTabChange('documents')}>
        <FileText className="nav-ico" size={19} />Docs
      </button>
      <button className={`nav-btn ${activeTab === 'branches' ? 'active' : ''}`} onClick={() => onTabChange('branches')}>
        <Building2 className="nav-ico" size={19} />Chapters
      </button>
    </nav>
  );
}
