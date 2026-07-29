import React from 'react';

const SettingsPanel: React.FC = () => (
  <div className="settings-panel">
    {/* ── Sage Connection ── */}
    <div className="wf-card wf-accent-blue">
      <div className="wf-card-header">
        <h3 className="wf-card-title">🔗 Sage Cloud Connection</h3>
        <p className="wf-card-subtitle">Configure your Sage integration settings</p>
      </div>
      <div className="wf-card-body">
        <div className="wf-form-group">
          <label className="wf-label">Sage API Endpoint</label>
          <input className="wf-input" placeholder="https://api.sage.com/v3/..." readOnly />
        </div>
        <div className="wf-form-group">
          <label className="wf-label">API Key</label>
          <input className="wf-input" type="password" value="••••••••••••••••" readOnly />
        </div>
        <div className="wf-form-group">
          <label className="wf-label">Company ID</label>
          <input className="wf-input" placeholder="SAGE-COMPANY-12345" readOnly />
        </div>
        <div className="wf-form-actions">
          <button className="wf-btn wf-btn-primary">Test Connection</button>
          <button className="wf-btn wf-btn-outline">Save</button>
        </div>
      </div>
    </div>

    {/* ── Column Mapping ── */}
    <div className="wf-card wf-accent-green">
      <div className="wf-card-header">
        <h3 className="wf-card-title">📋 Column Mapping</h3>
        <p className="wf-card-subtitle">Map your spreadsheet columns to Sage fields</p>
      </div>
      <div className="wf-card-body">
        <div className="wf-mapping-grid">
          {[
            { sheet: 'SKU Code',    sage: 'item_code' },
            { sheet: 'Description', sage: 'description' },
            { sheet: 'Quantity',    sage: 'quantity' },
            { sheet: 'Unit Price',  sage: 'unit_price' },
            { sheet: 'Warehouse',   sage: 'warehouse_id' },
          ].map((m, i) => (
            <div key={i} className="wf-mapping-row">
              <span className="wf-mapping-sheet">📊 {m.sheet}</span>
              <span className="wf-mapping-arrow">→</span>
              <span className="wf-mapping-sage">☁️ {m.sage}</span>
            </div>
          ))}
        </div>
        <button className="wf-btn wf-btn-outline" style={{ marginTop: '1rem' }}>
          + Add Mapping
        </button>
      </div>
    </div>

    {/* ── Preferences ── */}
    <div className="wf-card wf-accent-purple">
      <div className="wf-card-header">
        <h3 className="wf-card-title">⚙️ Preferences</h3>
      </div>
      <div className="wf-card-body">
        <div className="wf-toggle-group">
          <label className="wf-toggle">
            <input type="checkbox" defaultChecked />
            <span className="wf-toggle-slider" />
            <span>Auto-validate on import</span>
          </label>
          <label className="wf-toggle">
            <input type="checkbox" />
            <span className="wf-toggle-slider" />
            <span>Skip duplicates silently</span>
          </label>
          <label className="wf-toggle">
            <input type="checkbox" defaultChecked />
            <span className="wf-toggle-slider" />
            <span>Show upload notifications</span>
          </label>
        </div>
      </div>
    </div>
  </div>
);

export default SettingsPanel;
