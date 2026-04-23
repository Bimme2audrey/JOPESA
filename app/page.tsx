'use client';

import { useState, useEffect } from 'react';
import { Alumni, Event, Announcement, Document, Branch } from '@/types';
import SplashScreen from '@/components/SplashScreen';
import Header from '@/components/Header';
import BatchFinder from '@/components/BatchFinder';
import AlumniRegistry from '@/components/AlumniRegistry';
import Events from '@/components/Events';
import Announcements from '@/components/Announcements';
import Documents from '@/components/Documents';
import Branches from '@/components/Branches';
import About from '@/components/About';
import BottomNav from '@/components/BottomNav';
import Toast from '@/components/Toast';

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState<'finder' | 'alumni' | 'events' | 'announcements' | 'documents' | 'branches' | 'about'>('finder');
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [prefillData, setPrefillData] = useState({ year: '', classNum: '' as number | '' });

  useEffect(() => {
    const saved = localStorage.getItem('jopesa_alumni');
    if (saved) setAlumni(JSON.parse(saved));
    
    const savedEvents = localStorage.getItem('jopesa_events');
    if (savedEvents) setEvents(JSON.parse(savedEvents));
    
    const savedAnnouncements = localStorage.getItem('jopesa_announcements');
    if (savedAnnouncements) setAnnouncements(JSON.parse(savedAnnouncements));
    
    const savedDocuments = localStorage.getItem('jopesa_documents');
    if (savedDocuments) setDocuments(JSON.parse(savedDocuments));
    
    const savedBranches = localStorage.getItem('jopesa_branches');
    if (savedBranches) setBranches(JSON.parse(savedBranches));
    
    const timer = setTimeout(() => setShowSplash(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('jopesa_alumni', JSON.stringify(alumni));
  }, [alumni]);

  useEffect(() => {
    localStorage.setItem('jopesa_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('jopesa_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('jopesa_documents', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem('jopesa_branches', JSON.stringify(branches));
  }, [branches]);

  const showToast = (message: string, type = '') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 2800);
  };

  const handlePrefillAlumni = (year: string, classNum: number | '') => {
    setPrefillData({ year, classNum });
    setActiveTab('alumni');
    showToast('Year & class pre-filled — just add your name!', 'green');
  };

  return (
    <>
      {showSplash && <SplashScreen />}
      <Header />
      <main>
        {activeTab === 'finder' && <BatchFinder onPrefillAlumni={handlePrefillAlumni} />}
        {activeTab === 'alumni' && (
          <AlumniRegistry 
            alumni={alumni} 
            onAlumniChange={setAlumni}
            onShowToast={showToast}
            prefillData={prefillData}
          />
        )}
        {activeTab === 'events' && <Events events={events} />}
        {activeTab === 'announcements' && <Announcements announcements={announcements} />}
        {activeTab === 'documents' && <Documents documents={documents} />}
        {activeTab === 'branches' && <Branches branches={branches} />}
        {activeTab === 'about' && <About alumni={alumni} />}
      </main>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      <Toast show={toast.show} message={toast.message} type={toast.type} />
    </>
  );
}
