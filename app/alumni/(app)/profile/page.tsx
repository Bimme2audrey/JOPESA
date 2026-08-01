'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { Camera, LoaderCircle, Save, UserRound } from 'lucide-react';
import { Batch, Branch } from '@/types';
import { apiFetch, getApiBase, getAlumniToken, unwrapList } from '@/lib/api';

interface ProfileForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  batchId: string;
  branchId: string;
  bio: string;
  profileImage: string;
  currentRole: string;
  currentCompany: string;
  location: string;
  linkedIn: string;
  twitter: string;
  instagram: string;
  website: string;
}

const emptyForm: ProfileForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  batchId: '',
  branchId: '',
  bio: '',
  profileImage: '',
  currentRole: '',
  currentCompany: '',
  location: '',
  linkedIn: '',
  twitter: '',
  instagram: '',
  website: '',
};

export default function AlumniProfilePage() {
  const [form, setForm] = useState<ProfileForm>(emptyForm);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const [profile, batchPayload, branchPayload] = await Promise.all([
          apiFetch<any>('/alumni/me', {}, true),
          apiFetch('/batch?skip=0&take=100'),
          apiFetch('/branch?skip=0&take=100'),
        ]);

        setBatches(unwrapList<Batch>(batchPayload));
        setBranches(unwrapList<Branch>(branchPayload));
        setForm({
          firstName: profile.user?.firstName || '',
          lastName: profile.user?.lastName || '',
          email: profile.user?.email || '',
          phone: profile.user?.phone || '',
          batchId: profile.batchId || profile.batch?.id || '',
          branchId: profile.branchId || profile.branch?.id || '',
          bio: profile.bio || '',
          profileImage: profile.profileImage || '',
          currentRole: profile.currentRole || '',
          currentCompany: profile.currentCompany || '',
          location: profile.location || '',
          linkedIn: profile.linkedIn || '',
          twitter: profile.twitter || '',
          instagram: profile.instagram || '',
          website: profile.website || '',
        });

        const storedUser = {
          id: profile.user?.id,
          email: profile.user?.email,
          firstName: profile.user?.firstName,
          lastName: profile.user?.lastName,
          role: profile.user?.role,
          phone: profile.user?.phone,
        };
        localStorage.setItem('jopesa_user', JSON.stringify(storedUser));
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'Unable to load profile');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const setField = <K extends keyof ProfileForm>(key: K, value: ProfileForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSuccess('');
  };

  const uploadProfileImage = async (file: File) => {
    setUploading(true);
    setError('');
    try {
      const token = getAlumniToken();
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch(`${getApiBase()}/upload/image?folder=profiles`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Profile image upload failed');
      }
      const payload = await response.json();
      const url = payload.url || payload.secure_url;
      if (!url) throw new Error('No image URL returned');
      setField('profileImage', url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      if (!form.batchId || !form.branchId) {
        throw new Error('Please select your batch and chapter/branch');
      }

      const updated = await apiFetch<any>(
        '/alumni/me',
        {
          method: 'PUT',
          body: JSON.stringify({
            firstName: form.firstName,
            lastName: form.lastName,
            phone: form.phone || undefined,
            batchId: form.batchId,
            branchId: form.branchId,
            bio: form.bio || undefined,
            profileImage: form.profileImage || undefined,
            currentRole: form.currentRole || undefined,
            currentCompany: form.currentCompany || undefined,
            location: form.location || undefined,
            linkedIn: form.linkedIn || undefined,
            twitter: form.twitter || undefined,
            instagram: form.instagram || undefined,
            website: form.website || undefined,
          }),
        },
        true,
      );

      localStorage.setItem(
        'jopesa_user',
        JSON.stringify({
          id: updated.user?.id,
          email: updated.user?.email,
          firstName: updated.user?.firstName,
          lastName: updated.user?.lastName,
          phone: updated.user?.phone,
        }),
      );

      setSuccess('Profile updated successfully.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ color: 'var(--gray)', fontWeight: 600 }}>Loading profile...</div>;
  }

  return (
    <div>
      <h1 className="alumni-page-title">My Profile</h1>
      <p className="alumni-page-sub">
        Update your personal details, batch, chapter, bio, and social links.
      </p>

      <form className="alumni-profile-layout" onSubmit={handleSubmit}>
        <aside className="alumni-card alumni-profile-aside">
          <div className="alumni-profile-avatar-wrap">
            {form.profileImage ? (
              <img src={form.profileImage} alt="Profile" className="alumni-profile-avatar" />
            ) : (
              <div className="alumni-profile-avatar placeholder">
                <UserRound size={36} />
              </div>
            )}
            <label className="alumni-profile-upload">
              <Camera size={14} />
              {uploading ? 'Uploading...' : 'Change photo'}
              <input
                type="file"
                accept="image/*"
                hidden
                disabled={uploading}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) uploadProfileImage(file);
                }}
              />
            </label>
          </div>
          <div className="alumni-profile-name">
            {[form.firstName, form.lastName].filter(Boolean).join(' ') || 'Alumni member'}
          </div>
          <div className="alumni-profile-email">{form.email}</div>
          {(form.currentRole || form.currentCompany) && (
            <div className="alumni-profile-role">
              {[form.currentRole, form.currentCompany].filter(Boolean).join(' · ')}
            </div>
          )}
        </aside>

        <div className="alumni-profile-main">
          <section className="alumni-card alumni-form">
            <div className="alumni-form-banner">Personal information</div>
            <div className="alumni-form-grid">
              <div className="alumni-field">
                <label className="alumni-label">First name</label>
                <input
                  className="alumni-input"
                  value={form.firstName}
                  onChange={(e) => setField('firstName', e.target.value)}
                  required
                />
              </div>
              <div className="alumni-field">
                <label className="alumni-label">Last name</label>
                <input
                  className="alumni-input"
                  value={form.lastName}
                  onChange={(e) => setField('lastName', e.target.value)}
                  required
                />
              </div>
              <div className="alumni-field">
                <label className="alumni-label">Email</label>
                <input className="alumni-input" value={form.email} disabled />
              </div>
              <div className="alumni-field">
                <label className="alumni-label">Phone number</label>
                <input
                  className="alumni-input"
                  value={form.phone}
                  onChange={(e) => setField('phone', e.target.value)}
                  placeholder="+237 6XX XXX XXX"
                />
              </div>
            </div>
          </section>

          <section className="alumni-card alumni-form">
            <div className="alumni-form-banner">Batch & chapter</div>
            <div className="alumni-form-grid">
              <div className="alumni-field">
                <label className="alumni-label">Batch</label>
                <div className="alumni-select-wrap">
                  <select
                    className="alumni-input"
                    value={form.batchId}
                    onChange={(e) => setField('batchId', e.target.value)}
                    required
                  >
                    <option value="">Select batch</option>
                    {batches.map((batch) => (
                      <option key={batch.id} value={batch.id}>
                        {batch.name || `Batch ${batch.year}`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="alumni-field">
                <label className="alumni-label">Chapter / Branch</label>
                <div className="alumni-select-wrap">
                  <select
                    className="alumni-input"
                    value={form.branchId}
                    onChange={(e) => setField('branchId', e.target.value)}
                    required
                  >
                    <option value="">Select chapter</option>
                    {branches.map((branch) => (
                      <option key={branch.id} value={branch.id}>
                        {branch.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </section>

          <section className="alumni-card alumni-form">
            <div className="alumni-form-banner">Professional info</div>
            <div className="alumni-form-grid">
              <div className="alumni-field">
                <label className="alumni-label">Current role</label>
                <input
                  className="alumni-input"
                  value={form.currentRole}
                  onChange={(e) => setField('currentRole', e.target.value)}
                  placeholder="e.g. Software Engineer"
                />
              </div>
              <div className="alumni-field">
                <label className="alumni-label">Company</label>
                <input
                  className="alumni-input"
                  value={form.currentCompany}
                  onChange={(e) => setField('currentCompany', e.target.value)}
                  placeholder="e.g. Acme Corp"
                />
              </div>
              <div className="alumni-field" style={{ gridColumn: '1 / -1' }}>
                <label className="alumni-label">Location</label>
                <input
                  className="alumni-input"
                  value={form.location}
                  onChange={(e) => setField('location', e.target.value)}
                  placeholder="City, Country"
                />
              </div>
            </div>
          </section>

          <section className="alumni-card alumni-form">
            <div className="alumni-form-banner">About you</div>
            <div className="alumni-field">
              <label className="alumni-label">Bio</label>
              <textarea
                className="alumni-input"
                rows={5}
                value={form.bio}
                onChange={(e) => setField('bio', e.target.value)}
                placeholder="Tell the alumni community a bit about yourself..."
                style={{ resize: 'vertical', minHeight: 120 }}
              />
            </div>
          </section>

          <section className="alumni-card alumni-form">
            <div className="alumni-form-banner">Social & links</div>
            <div className="alumni-form-grid">
              <div className="alumni-field">
                <label className="alumni-label">LinkedIn</label>
                <input
                  className="alumni-input"
                  type="url"
                  value={form.linkedIn}
                  onChange={(e) => setField('linkedIn', e.target.value)}
                  placeholder="https://linkedin.com/in/..."
                />
              </div>
              <div className="alumni-field">
                <label className="alumni-label">Website</label>
                <input
                  className="alumni-input"
                  type="url"
                  value={form.website}
                  onChange={(e) => setField('website', e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <div className="alumni-field">
                <label className="alumni-label">Twitter / X</label>
                <input
                  className="alumni-input"
                  value={form.twitter}
                  onChange={(e) => setField('twitter', e.target.value)}
                  placeholder="@username"
                />
              </div>
              <div className="alumni-field">
                <label className="alumni-label">Instagram</label>
                <input
                  className="alumni-input"
                  value={form.instagram}
                  onChange={(e) => setField('instagram', e.target.value)}
                  placeholder="@username"
                />
              </div>
            </div>
          </section>

          {error && <div className="alumni-form-error">{error}</div>}
          {success && (
            <div
              className="alumni-form-error"
              style={{ background: 'rgba(4,120,87,.1)', color: 'var(--ok)', borderColor: 'rgba(4,120,87,.2)' }}
            >
              {success}
            </div>
          )}

          <div className="alumni-form-actions" style={{ justifyContent: 'flex-start' }}>
            <button type="submit" className="alumni-btn alumni-btn-primary" disabled={saving || uploading}>
              {saving ? (
                <>
                  <LoaderCircle size={16} className="loading-spinner" /> Saving...
                </>
              ) : (
                <>
                  <Save size={16} /> Save profile
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
