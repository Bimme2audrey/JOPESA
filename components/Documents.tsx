'use client';

import { FolderOpen, Download } from 'lucide-react';
import { Document } from '@/types';

interface DocumentsProps {
  documents: Document[];
}

export default function Documents({ documents }: DocumentsProps) {
  const documentTypes = {
    minutes: 'Meeting Minutes',
    constitution: 'Constitution',
    report: 'Report',
    pdf: 'PDF',
    image: 'Image',
    presentation: 'Presentation',
    spreadsheet: 'Spreadsheet',
    video: 'Video',
    other: 'Other',
  };

  return (
    <section className="sec active" id="sec-documents">
      <div className="pg-title">Document Archive</div>
      <div className="pg-sub">Access important documents, reports, and meeting minutes.</div>
      {!documents.length ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '16px' }}>
            <FolderOpen size={48} style={{ color: 'var(--navy)' }} />
          </div>
          <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--navy)', marginBottom: '8px' }}>No documents yet</div>
          <div style={{ fontSize: '14px', color: 'var(--gray)' }}>Documents will be uploaded by the administrator</div>
        </div>
      ) : (
        <div className="documents-list">
          {documents.map(doc => {
            const typeLabel = (documentTypes as Record<string, string>)[(doc.type || '').toLowerCase()] || doc.fileType || doc.type || 'Other';
            const subtitle = [doc.category, typeLabel, doc.uploadedAt].filter(Boolean).join(' • ');

            return (
              <div key={doc.id} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--navy)', marginBottom: 3 }}>{doc.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--gray)' }}>{subtitle}</div>
                </div>
                <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="btn btn-navy btn-sm" style={{ textDecoration: 'none' }}>
                  <Download size={14} />
                </a>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
