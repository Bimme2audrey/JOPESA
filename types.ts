export interface Alumni {
  id: number;
  name: string;
  year: number;
  classNum: number;
  className: string;
  batch: number;
  acadYear: string;
  f1AcadYear: string;
  gradYear: string;
  branchId?: string;
  date: string;
}

export interface BatchInfo {
  batch: number;
  acadYear: string;
  f1AcadYear: string;
  gradYear: string;
  yrsLeft: number;
  className: string;
}

export interface Branch {
  id: string;
  name: string;
  region: string;
  leaderId?: string;
  memberCount: number;
  createdAt: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  status: 'upcoming' | 'past';
  externalGalleryUrl?: string;
  createdAt: string;
}

export interface Photo {
  id: string;
  eventId: string;
  url: string;
  externalUrl?: string;
  uploadedAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: 'normal' | 'urgent';
  createdAt: string;
  createdBy: string;
}

export interface Document {
  id: string;
  title: string;
  type: 'minutes' | 'constitution' | 'report' | 'other';
  fileUrl: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'branch_leader' | 'member';
  branchId?: string;
}
