import React, { useState } from 'react';
import { RangeData } from '../types';
import {
  getCurrentSelectionAddress,
  getRangeByAddress,
  getSelectedRange,
  isOfficeAvailable,
  normalizeAddress,
  toRangeData,
} from '../services/excelService';

interface RangeSelectorProps {
  onDataLoaded: (data: RangeData) => void;
  onCancel: () => void;
}

const RangeSelector: React.FC<RangeSelectorProps> = ({ onDataLoaded, onCancel }) => {
  const [address, setAddress] = useState('');
  const [hasHeader, setHasHeader] = useState(true);
  const [selectionAddr, setSelectionAddr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const officeAvailable = isOfficeAvailable();

  const refreshSelection = async () => {
    setRefreshing(true);
    setError(null);
    try {
      const addr = await getCurrentSelectionAddress();
      setSelectionAddr(addr ? normalizeAddress(addr) : null);
      if (addr) setAddress(normalizeAddress(addr));
    } catch {
      setSelectionAddr(null);
    } finally {
      setRefreshing(false);
    }
  };

  const loadSelection = async () => {
    setLoading(true);
    setError(null);
    try {
      const raw = await getSelectedRange();
      if (!raw) {
        setError('No selection detected. Select a range in the sheet, or type an address below.');
        return;
      }
      onDataLoaded(toRangeData(raw, hasHeader));
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  const loadAddress = async () => {
    setLoading(true);
    setError(null);
    try {
      const raw = await getRangeByAddress(address);
      onDataLoaded(toRangeData(raw, hasHeader));
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wf-card wf-accent-blue">
      <div className="wf-card-header">
        <h3 className="wf-card-title">1️⃣ Select Excel Range</h3>
        <p className="wf-card-subtitle">
          {officeAvailable
            ? 'Select cells in the worksheet, then load them into the add-in.'
            : 'Open this add-in inside Excel to select a worksheet range.'}
        </p>
      </div>
      <div className="wf-card-body">
        {officeAvailable && (
          <div className="wf-form-group">
            <label className="wf-label">Current selection</label>
            <div className="wf-selection-row">
              <span className={`wf-selection-addr ${selectionAddr ? '' : 'wf-muted-text'}`}>
                {selectionAddr || '— no selection —'}
              </span>
              <button
                className="wf-btn wf-btn-sm wf-btn-outline"
                onClick={refreshSelection}
                disabled={refreshing}
                title="Detect current Excel selection"
              >
                {refreshing ? '…' : '🔄 Detect'}
              </button>
            </div>
          </div>
        )}

        <div className="wf-form-group">
          <label className="wf-label">Range address (optional)</label>
          <input
            className="wf-input"
            placeholder="e.g. A1:E100 or Sheet1!A1:E100"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div className="wf-checkbox-row">
          <label className="wf-toggle">
            <input
              type="checkbox"
              checked={hasHeader}
              onChange={(e) => setHasHeader(e.target.checked)}
            />
            <span className="wf-toggle-slider" />
            <span>First row contains column headers</span>
          </label>
        </div>

        {error && <div className="wf-error-banner">⚠️ {error}</div>}

        <div className="wf-form-actions">
          {officeAvailable ? (
            <>
              <button className="wf-btn wf-btn-primary" onClick={loadSelection} disabled={loading}>
                {loading ? 'Loading…' : '📥 Load Selected Range'}
              </button>
              <button className="wf-btn wf-btn-outline" onClick={loadAddress} disabled={loading || !address.trim()}>
                Load by Address
              </button>
            </>
          ) : (
            <div className="wf-empty-state">
              🔌 This add-in must be opened inside Excel to read worksheet data.
              Sideload it via <strong>Home → Add-ins → Excel → CSV Mapper (Local)</strong>.
            </div>
          )}
          <button className="wf-btn wf-btn-outline" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default RangeSelector;
