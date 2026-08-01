'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Download, FileText } from 'lucide-react';
import { Document } from '@/types';
import { apiFetch, formatDate, unwrapList } from '@/lib/api';
import { downloadFile } from '@/lib/download';

export default function AlumniDocumentsPage() {
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const payload = await apiFetch(`/documents?skip=0&take=100`);
        setDocuments(
          unwrapList<Document>(payload).map((doc) => ({
            ...doc,
            type: (doc.fileType || doc.type || 'OTHER').toLowerCase(),
            uploadedAt: doc.uploadedAt || (doc as Document & { createdAt?: string }).createdAt || '',
            uploadedBy: doc.uploadedBy || doc.category || 'Admin',
          })),
        );
      } catch (err) {
        console.error(err);
        setError('Unable to load documents.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div>
      <h1 style={{ margin: '0 0 6px', fontSize: 28, fontWeight: 800, color: 'var(--navy)' }}>Documents</h1>
      <p style={{ margin: '0 0 22px', color: 'var(--gray)', fontSize: 14 }}>
        Access and download shared alumni resources.
      </p>

      {loading && <div style={{ color: 'var(--gray)' }}>Loading documents...</div>}
      {error && <div className="alumni-card" style={{ color: 'var(--err)' }}>{error}</div>}
      {!loading && !error && documents.length === 0 && <div className="alumni-card">No documents available.</div>}

      <div className="alumni-grid-2">
        {documents.map((doc) => (
          <div key={doc.id} className="alumni-card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div onClick={() => router.push(`/alumni/documents/${doc.id}`)} style={{ cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--navy)', marginBottom: 8 }}>
                <FileText size={18} />
                <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: 'var(--gray)' }}>
                  {doc.type || doc.fileType || 'File'}
                </span>
              </div>
              <div style={{ fontWeight: 800, color: 'var(--navy)', fontSize: 16, marginBottom: 6 }}>{doc.title}</div>
              <div style={{ fontSize: 13, color: 'var(--gray)' }}>
                {doc.category || 'General'} · {formatDate(doc.uploadedAt)}
              </div>
            </div>
            <button
              onClick={() => downloadFile(doc.fileUrl, doc.title)}
              style={{
                marginTop: 'auto',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                padding: '10px 12px',
                borderRadius: 8,
                border: 'none',
                background: 'var(--navy)',
                color: '#fff',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <Download size={14} /> Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
