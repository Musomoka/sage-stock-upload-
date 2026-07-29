import React from 'react';

const SettingsPanel: React.FC = () => (
  <div className="settings-panel">
    {/* ── Export Settings ── */}
    <div className="wf-card wf-accent-blue">
      <div className="wf-card-header">
        <h3 className="wf-card-title">📤 CSV Export Settings</h3>
        <p className="wf-card-subtitle">Configure how the pricelist CSV is generated</p>
      </div>
      <div className="wf-card-body">
        <div className="wf-form-group">
          <label className="wf-label">Output Filename</label>
          <input className="wf-input" placeholder="SWITCH PRICELIST.csv" readOnly />
        </div>
        <div className="wf-form-group">
          <label className="wf-label">Delimiter</label>
          <input className="wf-input" placeholder="Comma (,)" readOnly />
        </div>
        <div className="wf-form-group">
          <label className="wf-label">Encoding</label>
          <input className="wf-input" placeholder="UTF-8" readOnly />
        </div>
        <div className="wf-form-actions">
          <button className="wf-btn wf-btn-primary">💾 Save Settings</button>
        </div>
      </div>
    </div>

    {/* ── Pricelist Tiers ── */}
    <div className="wf-card wf-accent-green">
      <div className="wf-card-header">
        <h3 className="wf-card-title">🏷️ Pricelist Tiers</h3>
        <p className="wf-card-subtitle">Active pricing tiers in your workbook</p>
      </div>
      <div className="wf-card-body">
        <div className="wf-mapping-grid">
          {[
            { sheet: 'Retail',          sage: 'Walk-in pricing' },
            { sheet: 'Warehouse Lusaka',sage: 'Lusaka trade' },
            { sheet: 'Warehouse Kitwe', sage: 'Kitwe trade' },
            { sheet: 'Jesmondine',      sage: 'Special location' },
          ].map((m, i) => (
            <div key={i} className="wf-mapping-row">
              <span className="wf-mapping-sheet">🏪 {m.sheet}</span>
              <span className="wf-mapping-arrow">→</span>
              <span className="wf-mapping-sage">{m.sage}</span>
            </div>
          ))}
        </div>
        <button className="wf-btn wf-btn-outline" style={{ marginTop: '1rem' }}>
          + Add Tier
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
            <span>Quote prices in CSV cells</span>
          </label>
          <label className="wf-toggle">
            <input type="checkbox" defaultChecked />
            <span className="wf-toggle-slider" />
            <span>Include header row in export</span>
          </label>
          <label className="wf-toggle">
            <input type="checkbox" />
            <span className="wf-toggle-slider" />
            <span>Exclude BLOCKED items</span>
          </label>
        </div>
      </div>
    </div>
  </div>
);

export default SettingsPanel;
