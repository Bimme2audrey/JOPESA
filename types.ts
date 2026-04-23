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
  date: string;
  branchId?: string;
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
  gallery?: string[];
  createdAt: string;
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
