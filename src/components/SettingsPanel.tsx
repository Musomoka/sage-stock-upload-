import React, { useState } from 'react';
import {
  deletePreset,
  getExportConfig,
  getPresets,
  saveExportConfig,
  DEFAULT_EXPORT_CONFIG,
} from '../services/settingsService';
import { CsvPreset, ExportConfig } from '../types';

const SettingsPanel: React.FC = () => {
  const [presets, setPresets] = useState<CsvPreset[]>(() => getPresets());
  const [config, setConfig] = useState<ExportConfig>(() => getExportConfig());

  const update = (patch: Partial<ExportConfig>) => {
    const next = { ...config, ...patch };
    setConfig(next);
    saveExportConfig(next);
  };

  const handleDeletePreset = (name: string) => {
    setPresets(deletePreset(name));
  };

  const resetDefaults = () => {
    setConfig(DEFAULT_EXPORT_CONFIG);
    saveExportConfig(DEFAULT_EXPORT_CONFIG);
  };

  return (
    <div className="settings-panel">
      {/* ── CSV Layout Presets ── */}
      <div className="wf-card wf-accent-green">
        <div className="wf-card-header">
          <h3 className="wf-card-title">🗂️ CSV Layout Presets</h3>
          <p className="wf-card-subtitle">
            Column layouts for different upload formats. Create presets from the Export CSV workflow.
          </p>
        </div>
        <div className="wf-card-body">
          {presets.length === 0 ? (
            <div className="wf-empty-state">
              No presets saved yet. Open <strong>Export CSV</strong>, map your columns, and click
              “Save current layout as preset”.
            </div>
          ) : (
            <div className="wf-mapping-grid">
              {presets.map((p) => (
                <div key={p.name} className="wf-mapping-row">
                  <span className="wf-mapping-sheet">🗂️ {p.name}</span>
                  <span className="wf-mapping-arrow">{p.columns.length} cols</span>
                  <button
                    className="wf-btn wf-btn-sm wf-btn-danger"
                    onClick={() => handleDeletePreset(p.name)}
                    title="Delete preset"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Default Export Settings ── */}
      <div className="wf-card wf-accent-blue">
        <div className="wf-card-header">
          <h3 className="wf-card-title">📤 Default Export Settings</h3>
          <p className="wf-card-subtitle">Applied to every new export</p>
        </div>
        <div className="wf-card-body">
          <div className="wf-form-group">
            <label className="wf-label">Output Filename</label>
            <input
              className="wf-input"
              value={config.filename}
              onChange={(e) => update({ filename: e.target.value })}
            />
          </div>
          <div className="wf-form-grid-2">
            <div className="wf-form-group">
              <label className="wf-label">Delimiter</label>
              <select
                className="wf-select"
                value={config.delimiter}
                onChange={(e) => update({ delimiter: e.target.value as ExportConfig['delimiter'] })}
              >
                <option value=",">Comma (,)</option>
                <option value=";">Semicolon (;)</option>
                <option value={'\t'}>Tab</option>
              </select>
            </div>
            <div className="wf-form-group">
              <label className="wf-label">Decimal places</label>
              <input
                className="wf-input"
                type="number"
                min={0}
                max={6}
                value={config.decimalPlaces}
                onChange={(e) => update({ decimalPlaces: Math.max(0, Number(e.target.value) || 0) })}
              />
            </div>
          </div>

          <div className="wf-toggle-group">
            <label className="wf-toggle">
              <input
                type="checkbox"
                checked={config.includeHeader}
                onChange={(e) => update({ includeHeader: e.target.checked })}
              />
              <span className="wf-toggle-slider" />
              <span>Include header row in export</span>
            </label>
            <label className="wf-toggle">
              <input
                type="checkbox"
                checked={config.quoteAll}
                onChange={(e) => update({ quoteAll: e.target.checked })}
              />
              <span className="wf-toggle-slider" />
              <span>Quote every cell</span>
            </label>
            <label className="wf-toggle">
              <input
                type="checkbox"
                checked={config.filters.excludeEmptyRows}
                onChange={(e) =>
                  update({ filters: { ...config.filters, excludeEmptyRows: e.target.checked } })
                }
              />
              <span className="wf-toggle-slider" />
              <span>Skip empty rows</span>
            </label>
          </div>

          <div className="wf-form-actions">
            <button className="wf-btn wf-btn-primary" onClick={resetDefaults}>
              ↩️ Reset to Defaults
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
