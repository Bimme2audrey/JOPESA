'use client';

import { useState, type FormEvent } from 'react';
import { AlertTriangle, Star, Search } from 'lucide-react';
import { getBatchInfo, maxClass, updateYearHint, CLASS_NAMES, SY } from '@/lib/batchUtils';
import { BatchInfo } from '@/types';

export default function AlumniBatchFinderPage() {
  const [yIn, setYIn] = useState('');
  const [cIn, setCIn] = useState<number | ''>('');
  const [result, setResult] = useState<BatchInfo | null>(null);
  const [finderError, setFinderError] = useState('');

  const calcBatch = (event?: FormEvent) => {
    event?.preventDefault();
    setFinderError('');
    setResult(null);

    const year = parseInt(yIn);
    const cVal = parseInt(String(cIn));
    const CY = new Date().getFullYear();

    if (!year || isNaN(year)) return setFinderError('Please enter your year of entry (e.g. 2008 for 2008/2009).');
    if (year < SY) return setFinderError(`JOPACC was founded in 2007/2008. Year ${year} is before the school existed.`);
    if (year > CY) return setFinderError(`Year ${year}/${year + 1} is in the future.`);
    if (!cVal) return setFinderError('Please select your class at entry.');

    const mx = maxClass(year);
    if (cVal > mx) {
      const openYear = SY + (cVal - 1);
      return setFinderError(
        `${CLASS_NAMES[cVal]} did not exist at JOPACC in ${year}/${year + 1}. It first opened in ${openYear}/${openYear + 1}.`,
      );
    }

    const info = getBatchInfo(year, cVal);
    if (info.batch < 1) {
      return setFinderError('Invalid combination. The resulting batch number is before the school existed.');
    }

    setResult(info);
  };

  const buildRefTable = () => {
    const rows = [];
    const CY = new Date().getFullYear();
    const end = Math.min(CY, SY + 16);
    for (let y = end; y >= SY; y--) {
      const info = getBatchInfo(y, 1);
      rows.push(
        <tr key={y}>
          <td>{info.acadYear}</td>
          <td>{info.batch}</td>
          <td>{info.gradYear}</td>
        </tr>,
      );
    }
    return rows;
  };

  return (
    <div>
      <h1 className="alumni-page-title">Batch Finder</h1>
      <p className="alumni-page-sub">
        Enter your year of entry and class to calculate your JOPESA batch and graduation year.
      </p>

      <div className="alumni-grid-2" style={{ alignItems: 'start' }}>
        <form className="alumni-card alumni-form" onSubmit={calcBatch}>
          <div className="alumni-form-banner">
            <Search size={18} />
            <span>Calculate your batch</span>
          </div>

          <div className="alumni-field">
            <label className="alumni-label">Academic year of entry</label>
            <input
              type="number"
              className="alumni-input"
              value={yIn}
              onChange={(e) => {
                setYIn(e.target.value);
                setResult(null);
                setFinderError('');
              }}
              placeholder="e.g. 2008 (means 2008/2009)"
              min={2007}
            />
            <div className="alumni-field-hint">{updateYearHint(yIn)}</div>
          </div>

          <div className="alumni-field">
            <label className="alumni-label">Class at entry</label>
            <div className="alumni-select-wrap">
              <select
                className="alumni-input"
                value={cIn}
                onChange={(e) => {
                  setCIn(e.target.value === '' ? '' : parseInt(e.target.value));
                  setResult(null);
                  setFinderError('');
                }}
              >
                <option value="">Select your class</option>
                <option value="1">Form 1</option>
                <option value="2">Form 2</option>
                <option value="3">Form 3</option>
                <option value="4">Form 4</option>
                <option value="5">Form 5</option>
                <option value="6">Lower Sixth (LS6)</option>
                <option value="7">Upper Sixth (US6)</option>
              </select>
            </div>
          </div>

          <button type="submit" className="alumni-btn alumni-btn-primary" style={{ width: '100%' }}>
            Calculate my batch
          </button>

          {finderError && (
            <div className="alumni-form-error" style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
              <span>{finderError}</span>
            </div>
          )}

          {result && (
            <div className="alumni-result-panel">
              <div className="alumni-result-label">Your batch</div>
              <div className="alumni-result-batch">Batch {result.batch}</div>
              <div className="alumni-result-grid">
                <div>
                  <div className="alumni-result-k">Entry year</div>
                  <div className="alumni-result-v">{result.acadYear}</div>
                </div>
                <div>
                  <div className="alumni-result-k">Class entered</div>
                  <div className="alumni-result-v">{result.className}</div>
                </div>
                <div>
                  <div className="alumni-result-k">Graduation</div>
                  <div className="alumni-result-v">{result.gradYear}</div>
                </div>
                <div>
                  <div className="alumni-result-k">Years left</div>
                  <div className="alumni-result-v">
                    {result.yrsLeft} yr{result.yrsLeft === 1 ? '' : 's'}
                  </div>
                </div>
              </div>
              <div className="alumni-result-f1">
                <Star size={14} />
                <span>Batch Form 1 year: <strong>{result.f1AcadYear}</strong></span>
              </div>
              {typeof cIn === 'number' && cIn > 1 && (
                <div className="alumni-result-note">
                  You entered in {result.className}. Your batch matches those who entered Form 1 in {result.f1AcadYear}.
                </div>
              )}
            </div>
          )}
        </form>

        <div className="alumni-card">
          <div className="alumni-section-title">Quick reference (Form 1 entries)</div>
          <div className="alumni-table-wrap">
            <table className="alumni-table">
              <thead>
                <tr>
                  <th>Entry year</th>
                  <th>Batch</th>
                  <th>Graduation</th>
                </tr>
              </thead>
              <tbody>{buildRefTable()}</tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
