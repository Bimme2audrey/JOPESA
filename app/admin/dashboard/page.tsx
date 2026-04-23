'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Users, Calendar, FileText, LogOut, Plus, Trash2, Calendar as CalendarIcon, Megaphone, FileText as FileIcon, Building2, X, Menu, MapPin, UserPlus, Clock } from 'lucide-react';
import { User, Event, Announcement, Document, Branch } from '@/types';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<'overview' | 'events' | 'announcements' | 'documents' | 'branches'>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  // Event management
  const [showEventForm, setShowEventForm] = useState(false);
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    location: '',
    status: 'upcoming' as 'upcoming' | 'past'
  });

  // Announcement management
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);
  const [announcementData, setAnnouncementData] = useState({
    title: '',
    content: '',
    priority: 'normal' as 'normal' | 'urgent',
    createdBy: 'Admin'
  });

  // Document management
  const [showDocumentForm, setShowDocumentForm] = useState(false);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [documentData, setDocumentData] = useState({
    title: '',
    type: 'other' as 'minutes' | 'constitution' | 'report' | 'other',
    uploadedBy: 'Admin'
  });

  // Branch management
  const [showBranchForm, setShowBranchForm] = useState(false);
  const [branchData, setBranchData] = useState({
    name: '',
    region: '',
    leaderId: ''
  });

  useEffect(() => {
    const auth = localStorage.getItem('jopesa_admin_auth');
    if (!auth) {
      router.push('/admin');
    }

    const savedEvents = localStorage.getItem('jopesa_events');
    if (savedEvents) setEvents(JSON.parse(savedEvents));
    
    const savedAnnouncements = localStorage.getItem('jopesa_announcements');
    if (savedAnnouncements) setAnnouncements(JSON.parse(savedAnnouncements));
    
    const savedDocuments = localStorage.getItem('jopesa_documents');
    if (savedDocuments) setDocuments(JSON.parse(savedDocuments));
    
    const savedBranches = localStorage.getItem('jopesa_branches');
    if (savedBranches) setBranches(JSON.parse(savedBranches));
  }, [router]);

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

  const handleLogout = () => {
    localStorage.removeItem('jopesa_admin_auth');
    router.push('/admin');
  };

  const handleCreateEvent = () => {
    if (!eventData.title || !eventData.startDate || !eventData.endDate || !eventData.location) {
      alert('Please fill in all required fields');
      return;
    }
    const newEvent: Event = {
      id: Date.now().toString(),
      ...eventData,
      createdAt: new Date().toLocaleDateString()
    };
    setEvents([newEvent, ...events]);
    setEventData({ title: '', description: '', startDate: '', endDate: '', location: '', status: 'upcoming' });
    setShowEventForm(false);
  };

  const handleCreateAnnouncement = () => {
    if (!announcementData.title || !announcementData.content) {
      alert('Please fill in all required fields');
      return;
    }
    const newAnnouncement: Announcement = {
      id: Date.now().toString(),
      ...announcementData,
      createdAt: new Date().toLocaleDateString()
    };
    setAnnouncements([newAnnouncement, ...announcements]);
    setAnnouncementData({ title: '', content: '', priority: 'normal', createdBy: 'Admin' });
    setShowAnnouncementForm(false);
  };

  const handleCreateDocument = async () => {
    if (!documentData.title || !documentFile) {
      alert('Please fill in all required fields');
      return;
    }

    // Convert file to base64 for localStorage
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      const newDocument: Document = {
        id: Date.now().toString(),
        title: documentData.title,
        type: documentData.type,
        fileUrl: base64,
        uploadedBy: documentData.uploadedBy,
        uploadedAt: new Date().toLocaleDateString()
      };
      setDocuments([newDocument, ...documents]);
      setDocumentData({ title: '', type: 'other', uploadedBy: 'Admin' });
      setDocumentFile(null);
      setShowDocumentForm(false);
    };
    reader.readAsDataURL(documentFile);
  };

  const handleCreateBranch = () => {
    if (!branchData.name || !branchData.region) {
      alert('Please fill in all required fields');
      return;
    }
    const newBranch: Branch = {
      id: Date.now().toString(),
      ...branchData,
      memberCount: 0,
      createdAt: new Date().toLocaleDateString()
    };
    setBranches([newBranch, ...branches]);
    setBranchData({ name: '', region: '', leaderId: '' });
    setShowBranchForm(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--off)' }}>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          style={{ 
            position: 'fixed', 
            inset: 0, 
            background: 'rgba(0,0,0,0.5)', 
            zIndex: 40
          }}
          className="md:hidden"
        />
      )}
      
      <aside 
        style={{ 
          width: '260px', 
          background: 'linear-gradient(180deg, var(--navy), var(--navy2))', 
          padding: '24px', 
          display: 'flex', 
          flexDirection: 'column', 
          position: 'fixed', 
          left: 0,
          top: 0, 
          bottom: 0,
          zIndex: 50,
          transition: 'transform 0.3s ease'
        }}
        className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
          <img 
            src="/logo.png" 
            alt="JOPESA Logo" 
            style={{ width: '56px', height: '56px', borderRadius: '50%', border: '2px solid var(--gold)', objectFit: 'cover' }}
          />
          <div>
            <h1 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--gold2)', letterSpacing: '0.8px', margin: 0 }}>JOPESA</h1>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.6px', textTransform: 'uppercase' }}>Admin Panel</div>
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          <button
            onClick={() => setActiveSection('overview')}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '10px', border: 'none', background: activeSection === 'overview' ? 'rgba(200,150,12,0.2)' : 'transparent', color: activeSection === 'overview' ? 'var(--gold2)' : 'rgba(255,255,255,0.6)', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.15s', textAlign: 'left' }}
          >
            <Shield size={18} /> Overview
          </button>
          <button
            onClick={() => setActiveSection('events')}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '10px', border: 'none', background: activeSection === 'events' ? 'rgba(200,150,12,0.2)' : 'transparent', color: activeSection === 'events' ? 'var(--gold2)' : 'rgba(255,255,255,0.6)', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.15s', textAlign: 'left' }}
          >
            <Calendar size={18} /> Events
          </button>
          <button
            onClick={() => setActiveSection('announcements')}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '10px', border: 'none', background: activeSection === 'announcements' ? 'rgba(200,150,12,0.2)' : 'transparent', color: activeSection === 'announcements' ? 'var(--gold2)' : 'rgba(255,255,255,0.6)', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.15s', textAlign: 'left' }}
          >
            <Megaphone size={18} /> Announcements
          </button>
          <button
            onClick={() => setActiveSection('documents')}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '10px', border: 'none', background: activeSection === 'documents' ? 'rgba(200,150,12,0.2)' : 'transparent', color: activeSection === 'documents' ? 'var(--gold2)' : 'rgba(255,255,255,0.6)', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.15s', textAlign: 'left' }}
          >
            <FileText size={18} /> Documents
          </button>
          <button
            onClick={() => setActiveSection('branches')}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '10px', border: 'none', background: activeSection === 'branches' ? 'rgba(200,150,12,0.2)' : 'transparent', color: activeSection === 'branches' ? 'var(--gold2)' : 'rgba(255,255,255,0.6)', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.15s', textAlign: 'left' }}
          >
            <Users size={18} /> Branches
          </button>
        </nav>

        <button
          onClick={handleLogout}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.7)', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.15s', marginTop: 'auto' }}
        >
          <LogOut size={18} /> Logout
        </button>
      </aside>

      <main style={{ flex: 1, marginLeft: '260px', padding: '32px 32px 32px 32px', maxWidth: '1200px', boxSizing: 'border-box' }} className="admin-main">
        {/* Mobile hamburger menu */}
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="admin-hamburger"
          style={{ 
            display: 'none',
            alignItems: 'center', 
            justifyContent: 'center',
            width: '40px', 
            height: '40px', 
            borderRadius: '8px',
            background: 'var(--navy)',
            color: 'var(--gold2)',
            border: 'none',
            cursor: 'pointer',
            marginBottom: '16px'
          }}
        >
          <Menu size={24} />
        </button>
        
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--navy)', marginBottom: '8px', margin: 0 }}>
            {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--gray)', margin: 0 }}>Manage your {activeSection} content</p>
        </div>

        <div className="stats-row" style={{ marginBottom: '32px' }}>
          <div className="stat-cell"><div className="stat-num">{users.length}</div><div className="stat-lbl">Users</div></div>
          <div className="stat-cell"><div className="stat-num">{branches.length}</div><div className="stat-lbl">Branches</div></div>
          <div className="stat-cell"><div className="stat-num">{events.length}</div><div className="stat-lbl">Events</div></div>
          <div className="stat-cell"><div className="stat-num">{announcements.length}</div><div className="stat-lbl">Posts</div></div>
          <div className="stat-cell"><div className="stat-num">{documents.length}</div><div className="stat-lbl">Docs</div></div>
        </div>

        {activeSection === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }} className="admin-grid-2">
            <div className="card">
              <div style={{ fontWeight: 800, fontSize: 17, color: 'var(--navy)', marginBottom: '16px' }}>Recent Activity</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {events.slice(0, 3).map(event => (
                  <div key={event.id} style={{ padding: '12px', background: 'var(--off)', borderRadius: '8px', border: '1px solid var(--lgray)' }}>
                    <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--navy)', marginBottom: '4px' }}>{event.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--gray)' }}>{event.startDate} · {event.location}</div>
                  </div>
                ))}
                {events.length === 0 && (
                  <div style={{ padding: '24px', textAlign: 'center', color: 'var(--gray)', fontSize: 14 }}>No recent events</div>
                )}
              </div>
            </div>
            <div className="card">
              <div style={{ fontWeight: 800, fontSize: 17, color: 'var(--navy)', marginBottom: '16px' }}>Recent Announcements</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {announcements.slice(0, 3).map(announcement => (
                  <div key={announcement.id} style={{ padding: '12px', background: 'var(--off)', borderRadius: '8px', border: '1px solid var(--lgray)' }}>
                    <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--navy)', marginBottom: '4px' }}>{announcement.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--gray)' }}>{announcement.createdAt} · {announcement.createdBy}</div>
                  </div>
                ))}
                {announcements.length === 0 && (
                  <div style={{ padding: '24px', textAlign: 'center', color: 'var(--gray)', fontSize: 14 }}>No recent announcements</div>
                )}
              </div>
            </div>
            <div className="card" style={{ gridColumn: '1 / -1' }}>
              <div style={{ fontWeight: 800, fontSize: 17, color: 'var(--navy)', marginBottom: '16px' }}>Quick Actions</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }} className="admin-grid-4">
                <button onClick={() => setActiveSection('events')} style={{ padding: '16px', background: 'var(--navy)', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={24} />
                  <span>Create Event</span>
                </button>
                <button onClick={() => setActiveSection('announcements')} style={{ padding: '16px', background: 'var(--gold)', color: 'var(--navy)', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <Megaphone size={24} />
                  <span>Post Update</span>
                </button>
                <button onClick={() => setActiveSection('documents')} style={{ padding: '16px', background: 'var(--navy)', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <FileIcon size={24} />
                  <span>Upload Doc</span>
                </button>
                <button onClick={() => setActiveSection('branches')} style={{ padding: '16px', background: 'var(--gold)', color: 'var(--navy)', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <Building2 size={24} />
                  <span>Add Branch</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'events' && (
          <div className="card">
            <div className="reg-header">
              <div>
                <div style={{ fontWeight: 800, fontSize: 17, color: 'var(--navy)' }}>Manage Events</div>
                <div style={{ fontSize: 12, color: 'var(--gray)' }}>Create and edit events</div>
              </div>
              <button className="btn btn-gold btn-sm" onClick={() => setShowEventForm(!showEventForm)}>
                {showEventForm ? <X size={14} /> : <Plus size={14} />} {showEventForm ? 'Cancel' : 'New Event'}
              </button>
            </div>
            {showEventForm && (
              <div className="reg-panel open">
                <div className="divider"></div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }} className="admin-grid-2">
                  <div className="fg"><label>Event Title *</label><input type="text" value={eventData.title} onChange={(e) => setEventData({ ...eventData, title: e.target.value })} placeholder="e.g. Annual Reunion" /></div>
                  <div className="fg"><label>Location *</label><input type="text" value={eventData.location} onChange={(e) => setEventData({ ...eventData, location: e.target.value })} placeholder="e.g. JOPACC Campus" /></div>
                  <div className="fg"><label>Start Date *</label><input type="date" value={eventData.startDate} onChange={(e) => setEventData({ ...eventData, startDate: e.target.value })} /></div>
                  <div className="fg"><label>End Date *</label><input type="date" value={eventData.endDate} onChange={(e) => setEventData({ ...eventData, endDate: e.target.value })} /></div>
                </div>
                <div className="fg"><label>Description</label><input type="text" value={eventData.description} onChange={(e) => setEventData({ ...eventData, description: e.target.value })} placeholder="Event details..." /></div>
                <div className="fg"><label>Status</label><div className="sel-wrap"><select value={eventData.status} onChange={(e) => setEventData({ ...eventData, status: e.target.value as 'upcoming' | 'past' })}><option value="upcoming">Upcoming</option><option value="past">Past</option></select></div></div>
                <button className="btn btn-navy" onClick={handleCreateEvent}>Create Event →</button>
              </div>
            )}
            {events.length === 0 ? (
              <div className="empty-state" style={{ textAlign: 'center', padding: '48px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '16px' }}><CalendarIcon size={48} style={{ color: 'var(--navy)' }} /></div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--navy)', marginBottom: '8px' }}>No events yet</div>
                <div style={{ fontSize: '14px', color: 'var(--gray)' }}>Create your first event to get started</div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px', marginTop: '16px' }}>
                {events.map(event => (
                  <div key={event.id} className="card" style={{ position: 'relative' }}>
                    <button className="del-btn" style={{ position: 'absolute', top: 12, right: 12 }} onClick={() => setEvents(events.filter(e => e.id !== event.id))}><Trash2 size={14} /></button>
                    <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--navy)', marginBottom: 5 }}>{event.title}</div>
                    <div style={{ fontSize: 13, color: 'var(--gray)', marginBottom: 8 }}>{event.description}</div>
                    <div style={{ display: 'flex', gap: 15, fontSize: 12, color: 'var(--gray)', alignItems: 'center' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><CalendarIcon size={12} /> {event.startDate} - {event.endDate}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={12} /> {event.location}</span>
                    </div>
                    <div style={{ marginTop: 10 }}><span className={`status-badge ${event.status}`}>{event.status}</span></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeSection === 'announcements' && (
          <div className="card">
            <div className="reg-header">
              <div>
                <div style={{ fontWeight: 800, fontSize: 17, color: 'var(--navy)' }}>Manage Announcements</div>
                <div style={{ fontSize: 12, color: 'var(--gray)' }}>Create and edit announcements</div>
              </div>
              <button className="btn btn-gold btn-sm" onClick={() => setShowAnnouncementForm(!showAnnouncementForm)}>
                {showAnnouncementForm ? <X size={14} /> : <Plus size={14} />} {showAnnouncementForm ? 'Cancel' : 'New Post'}
              </button>
            </div>
            {showAnnouncementForm && (
              <div className="reg-panel open">
                <div className="divider"></div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }} className="admin-grid-2">
                  <div className="fg"><label>Title *</label><input type="text" value={announcementData.title} onChange={(e) => setAnnouncementData({ ...announcementData, title: e.target.value })} placeholder="e.g. Annual Meeting Schedule" /></div>
                  <div className="fg"><label>Priority</label><div className="sel-wrap"><select value={announcementData.priority} onChange={(e) => setAnnouncementData({ ...announcementData, priority: e.target.value as 'normal' | 'urgent' })}><option value="normal">Normal</option><option value="urgent">Urgent</option></select></div></div>
                </div>
                <div className="fg"><label>Content *</label><textarea value={announcementData.content} onChange={(e) => setAnnouncementData({ ...announcementData, content: e.target.value })} placeholder="Announcement details..." style={{ width: '100%', padding: '15px 16px', border: '2px solid var(--lgray)', borderRadius: '10px', fontSize: '15px', fontFamily: 'inherit', minHeight: '100px', resize: 'vertical' }} /></div>
                <button className="btn btn-navy" onClick={handleCreateAnnouncement}>Post Announcement →</button>
              </div>
            )}
            {announcements.length === 0 ? (
              <div className="empty-state" style={{ textAlign: 'center', padding: '48px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '16px' }}><Megaphone size={48} style={{ color: 'var(--navy)' }} /></div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--navy)', marginBottom: '8px' }}>No announcements yet</div>
                <div style={{ fontSize: '14px', color: 'var(--gray)' }}>Create your first announcement to get started</div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px', marginTop: '16px' }}>
                {announcements.map(announcement => (
                  <div key={announcement.id} className="card" style={{ borderLeft: announcement.priority === 'urgent' ? '4px solid var(--err)' : '4px solid var(--gold)', position: 'relative' }}>
                    <button className="del-btn" style={{ position: 'absolute', top: 12, right: 12 }} onClick={() => setAnnouncements(announcements.filter(a => a.id !== announcement.id))}><Trash2 size={14} /></button>
                    <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--navy)', marginBottom: 5 }}>{announcement.title}</div>
                    <div style={{ fontSize: 14, color: 'var(--dark)', lineHeight: 1.5, marginBottom: 8 }}>{announcement.content}</div>
                    <div style={{ fontSize: 12, color: 'var(--gray)' }}>{announcement.createdAt} · by {announcement.createdBy}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeSection === 'documents' && (
          <div className="card">
            <div className="reg-header">
              <div>
                <div style={{ fontWeight: 800, fontSize: 17, color: 'var(--navy)' }}>Manage Documents</div>
                <div style={{ fontSize: 12, color: 'var(--gray)' }}>Upload and manage files</div>
              </div>
              <button className="btn btn-gold btn-sm" onClick={() => setShowDocumentForm(!showDocumentForm)}>
                {showDocumentForm ? <X size={14} /> : <Plus size={14} />} {showDocumentForm ? 'Cancel' : 'Upload'}
              </button>
            </div>
            {showDocumentForm && (
              <div className="reg-panel open">
                <div className="divider"></div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }} className="admin-grid-2">
                  <div className="fg"><label>Document Title *</label><input type="text" value={documentData.title} onChange={(e) => setDocumentData({ ...documentData, title: e.target.value })} placeholder="e.g. Annual Meeting Minutes" /></div>
                  <div className="fg"><label>Type</label><div className="sel-wrap"><select value={documentData.type} onChange={(e) => setDocumentData({ ...documentData, type: e.target.value as 'minutes' | 'constitution' | 'report' | 'other' })}><option value="minutes">Meeting Minutes</option><option value="constitution">Constitution</option><option value="report">Report</option><option value="other">Other</option></select></div></div>
                </div>
                <div className="fg"><label>File *</label><input type="file" onChange={(e) => setDocumentFile(e.target.files?.[0] || null)} accept=".pdf,.doc,.docx,.txt" style={{ width: '100%', padding: '15px 16px', border: '2px solid var(--lgray)', borderRadius: '10px', fontSize: '15px', fontFamily: 'inherit' }} /><div style={{ fontSize: 11, color: 'var(--gray)', marginTop: 4 }}>Accepted: PDF, DOC, DOCX, TXT</div></div>
                <button className="btn btn-navy" onClick={handleCreateDocument}>Upload Document →</button>
              </div>
            )}
            {documents.length === 0 ? (
              <div className="empty-state" style={{ textAlign: 'center', padding: '48px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '16px' }}><FileIcon size={48} style={{ color: 'var(--navy)' }} /></div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--navy)', marginBottom: '8px' }}>No documents yet</div>
                <div style={{ fontSize: '14px', color: 'var(--gray)' }}>Upload your first document to get started</div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px', marginTop: '16px' }}>
                {documents.map(doc => (
                  <div key={doc.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', minHeight: '80px' }}>
                    <button className="del-btn" style={{ position: 'absolute', top: 12, right: 12 }} onClick={() => setDocuments(documents.filter(d => d.id !== doc.id))}><Trash2 size={14} /></button>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--navy)', marginBottom: 3 }}>{doc.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--gray)' }}>{doc.type} · {doc.uploadedAt}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeSection === 'branches' && (
          <div className="card">
            <div className="reg-header">
              <div>
                <div style={{ fontWeight: 800, fontSize: 17, color: 'var(--navy)' }}>Manage Branches</div>
                <div style={{ fontSize: 12, color: 'var(--gray)' }}>Create and manage regional chapters</div>
              </div>
              <button className="btn btn-gold btn-sm" onClick={() => setShowBranchForm(!showBranchForm)}>
                {showBranchForm ? <X size={14} /> : <Plus size={14} />} {showBranchForm ? 'Cancel' : 'New Branch'}
              </button>
            </div>
            {showBranchForm && (
              <div className="reg-panel open">
                <div className="divider"></div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }} className="admin-grid-2">
                  <div className="fg"><label>Branch Name *</label><input type="text" value={branchData.name} onChange={(e) => setBranchData({ ...branchData, name: e.target.value })} placeholder="e.g. Douala Chapter" /></div>
                  <div className="fg"><label>Region *</label><input type="text" value={branchData.region} onChange={(e) => setBranchData({ ...branchData, region: e.target.value })} placeholder="e.g. Littoral Region" /></div>
                </div>
                <div className="fg"><label>Leader ID (optional)</label><input type="text" value={branchData.leaderId} onChange={(e) => setBranchData({ ...branchData, leaderId: e.target.value })} placeholder="Enter user ID" /></div>
                <button className="btn btn-navy" onClick={handleCreateBranch}>Create Branch →</button>
              </div>
            )}
            {branches.length === 0 ? (
              <div className="empty-state" style={{ textAlign: 'center', padding: '48px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '16px' }}><Building2 size={48} style={{ color: 'var(--navy)' }} /></div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--navy)', marginBottom: '8px' }}>No branches yet</div>
                <div style={{ fontSize: '14px', color: 'var(--gray)' }}>Create your first branch to get started</div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px', marginTop: '16px' }}>
                {branches.map(branch => (
                  <div key={branch.id} className="card" style={{ position: 'relative' }}>
                    <button className="del-btn" style={{ position: 'absolute', top: 12, right: 12 }} onClick={() => setBranches(branches.filter(b => b.id !== branch.id))}><Trash2 size={14} /></button>
                    <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--navy)', marginBottom: 5 }}>{branch.name}</div>
                    <div style={{ fontSize: 13, color: 'var(--gray)', marginBottom: 8 }}>{branch.region}</div>
                    <div style={{ display: 'flex', gap: 15, fontSize: 12, color: 'var(--gray)', alignItems: 'center' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><UserPlus size={12} /> {branch.memberCount} members</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> Created {branch.createdAt}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
