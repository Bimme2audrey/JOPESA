'use client';

import { useState, useEffect, useCallback } from 'react';
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
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'warning' | 'error' }>({ show: false, message: '', type: 'success' });
  const [prefillData, setPrefillData] = useState({ year: '', classNum: '' as number | '' });

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  const showToast = useCallback((message: string, type: 'success' | 'warning' | 'error' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 2800);
  }, []);

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
    const fetchBranches = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/branch?skip=0&take=100`, { cache: 'no-store' });
        if (!response.ok) {
          throw new Error(`Branch endpoint returned ${response.status}`);
        }

        const json = await response.json();
        const branchData: Branch[] = Array.isArray(json?.data) ? json.data : json;

        if (Array.isArray(branchData) && branchData.length) {
          setBranches(branchData);
        }
      } catch (error) {
        console.error('Failed to fetch branches from backend:', error);
        showToast('Unable to load branches from backend', 'error');
      }
    };

    const fetchDocuments = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/documents?skip=0&take=100`, { cache: 'no-store' });
        if (!response.ok) {
          throw new Error(`Documents endpoint returned ${response.status}`);
        }

        const json = await response.json();
        const documentData = Array.isArray(json?.data)
          ? json.data.map((doc: any) => ({
              ...doc,
              type: (doc.fileType || doc.type || 'OTHER').toLowerCase(),
              uploadedAt: doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : '',
              uploadedBy: doc.category || 'Admin',
              category: doc.category,
              fileType: doc.fileType,
              fileSize: doc.fileSize,
              tags: doc.tags || [],
            }))
          : Array.isArray(json)
            ? json.map((doc: any) => ({
                ...doc,
                type: (doc.fileType || doc.type || 'OTHER').toLowerCase(),
                uploadedAt: doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : '',
                uploadedBy: doc.category || 'Admin',
                category: doc.category,
                fileType: doc.fileType,
                fileSize: doc.fileSize,
                tags: doc.tags || [],
              }))
            : [];

        if (documentData.length) {
          setDocuments(documentData);
        }
      } catch (error) {
        console.error('Failed to fetch documents from backend:', error);
        showToast('Unable to load documents from backend', 'error');
      }
    };

    fetchBranches();
    fetchDocuments();
  }, [apiBaseUrl, showToast]);

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

  const handlePrefillAlumni = (year: string, classNum: number | '') => {
    setPrefillData({ year, classNum });
    setActiveTab('alumni');
    showToast('Year & class pre-filled — just add your name!', 'success');
  };

  return (
    <>
      {showSplash && <SplashScreen />}
      <Header onShowAbout={() => setActiveTab('about')} />
      <main>
        {activeTab === 'finder' && <BatchFinder onPrefillAlumni={handlePrefillAlumni} />}
        {activeTab === 'alumni' && (
          <AlumniRegistry
            alumni={alumni}
            branches={branches}
            onAlumniChange={setAlumni}
            onShowToast={showToast}
            prefillData={prefillData}
          />
        )}
        {activeTab === 'events' && <Events events={events} />}
        {activeTab === 'announcements' && <Announcements announcements={announcements} />}
        {activeTab === 'documents' && <Documents documents={documents} />}
        {activeTab === 'branches' && <Branches branches={branches} alumni={alumni} />}
        {activeTab === 'about' && <About alumni={alumni} />}
      </main>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      <Toast show={toast.show} message={toast.message} type={toast.type} />
    </>
  );
}
