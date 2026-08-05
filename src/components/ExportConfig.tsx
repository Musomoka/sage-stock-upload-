import React from 'react';
import { ExportConfig, FilterConfig, RangeData } from '../types';

interface ExportConfigProps {
  range: RangeData;
  config: ExportConfig;
  onConfigChange: (config: ExportConfig) => void;
}

const ExportConfigPanel: React.FC<ExportConfigProps> = ({ range, config, onConfigChange }) => {
  const update = (patch: Partial<ExportConfig>) => onConfigChange({ ...config, ...patch });

  const updateFilters = (patch: Partial<FilterConfig>) =>
    update({ filters: { ...config.filters, ...patch } });

  const addFilterRule = () => {
    updateFilters({
      excludeKeywords: [
        ...config.filters.excludeKeywords,
        { columnIndex: 0, keyword: 'BLOCKED' },
      ],
    });
  };

  const updateRule = (index: number, patch: Partial<{ columnIndex: number; keyword: string }>) => {
    const next = config.filters.excludeKeywords.map((r, i) => (i === index ? { ...r, ...patch } : r));
    updateFilters({ excludeKeywords: next });
  };

  const removeRule = (index: number) => {
    updateFilters({ excludeKeywords: config.filters.excludeKeywords.filter((_, i) => i !== index) });
  };

  return (
    <div className="wf-card wf-accent-purple">
      <div className="wf-card-header">
        <h3 className="wf-card-title">⚙️ Export Configuration</h3>
        <p className="wf-card-subtitle">File format, filtering and number formatting</p>
      </div>
      <div className="wf-card-body">
        <div className="wf-form-group">
          <label className="wf-label">Output filename</label>
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
            <span>Include header row</span>
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
        </div>

        <div className="wf-section-title">🚫 Exclude rows</div>

        {config.filters.excludeKeywords.map((rule, i) => (
          <div key={i} className="wf-filter-row">
            <select
              className="wf-select wf-select-sm"
              value={rule.columnIndex}
              onChange={(e) => updateRule(i, { columnIndex: Number(e.target.value) })}
            >
              {range.headers.map((h, c) => (
                <option key={c} value={c}>
                  {h} ({String.fromCharCode(65 + c)})
                </option>
              ))}
            </select>
            <input
              className="wf-input wf-input-sm"
              placeholder="keyword…"
              value={rule.keyword}
              onChange={(e) => updateRule(i, { keyword: e.target.value })}
            />
            <button className="wf-btn wf-btn-sm wf-btn-danger" onClick={() => removeRule(i)}>
              ✕
            </button>
          </div>
        ))}

        <div className="wf-form-actions">
          <button className="wf-btn wf-btn-outline" onClick={addFilterRule}>
            ➕ Add filter rule
          </button>
          <label className="wf-toggle wf-toggle-inline">
            <input
              type="checkbox"
              checked={config.filters.excludeEmptyRows}
              onChange={(e) => updateFilters({ excludeEmptyRows: e.target.checked })}
            />
            <span className="wf-toggle-slider" />
            <span>Skip empty rows</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default ExportConfigPanel;
