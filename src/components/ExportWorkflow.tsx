import React, { useState } from 'react';
import { ColumnMapping, CsvPreset, ExportConfig, RangeData } from '../types';
import { getExportConfig, getLastMapping, getPresets, saveExportConfig, saveLastMapping, savePreset, deletePreset, DEFAULT_PRESET_COLUMNS } from '../services/settingsService';
import { downloadCSV, generateCSV, buildMappedRows } from '../services/csvService';
import RangeSelector from './RangeSelector';
import ColumnMapper from './ColumnMapper';
import CsvPresetManager from './CsvPresetManager';
import ExportConfigPanel from './ExportConfig';
import DataPreview from './DataPreview';

interface ExportWorkflowProps {
  isOffice: boolean;
}

/* ── Header matching for auto-mapping ── */
const normalize = (s: string): string => s.toLowerCase().replace(/[^a-z0-9]/g, '');

/** Match preset columns against loaded Excel headers by direct name. Falls back to positional index. */
const autoMapColumns = (columns: ColumnMapping[], headers: string[]): ColumnMapping[] =>
  columns.map((col) => {
    const target = normalize(col.csvName);
    const found = headers.findIndex((h) => normalize(h) === target);
    return { ...col, excelIndex: found >= 0 ? found : col.excelIndex };
  });

const uid = (): string => `out-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;

const cloneColumns = (columns: ColumnMapping[]): ColumnMapping[] =>
  columns.map((c) => ({ ...c, id: uid() }));

const STEP_LABELS = ['Select Range', 'Map Columns', 'Configure', 'Export'];

const ExportWorkflow: React.FC<ExportWorkflowProps> = () => {
  const [step, setStep] = useState(1);
  const [range, setRange] = useState<RangeData | null>(null);
  const [mapping, setMapping] = useState<ColumnMapping[]>(cloneColumns(DEFAULT_PRESET_COLUMNS));
  const [presets, setPresets] = useState<CsvPreset[]>(() => getPresets());
  const [config, setConfig] = useState<ExportConfig>(() => getExportConfig());
  const [exported, setExported] = useState<{ csv: string; filename: string; rows: number } | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);

  const handleDataLoaded = (data: RangeData) => {
    setRange(data);
    setExported(null);
    setExportError(null);

    // Restore last mapping if it fits, else auto-map the default preset.
    const last = getLastMapping();
    const base = last && last.length > 0 ? cloneColumns(last) : cloneColumns(DEFAULT_PRESET_COLUMNS);
    setMapping(autoMapColumns(base, data.headers));
    setStep(2);
  };

  const handleMappingChange = (m: ColumnMapping[]) => {
    setMapping(m);
    saveLastMapping(m);
  };

  const handleSelectPreset = (columns: ColumnMapping[]) => {
    setMapping(range ? autoMapColumns(cloneColumns(columns), range.headers) : cloneColumns(columns));
    setExported(null);
  };

  const handleSavePreset = (name: string) => {
    setPresets(savePreset({ name, columns: cloneColumns(mapping) }));
  };

  const handleDeletePreset = (name: string) => {
    setPresets(deletePreset(name));
  };

  const handleConfigChange = (c: ExportConfig) => {
    setConfig(c);
    saveExportConfig(c);
  };

  const handleExport = () => {
    if (!range) return;
    setExportError(null);
    try {
      const csv = generateCSV(range, mapping, config);
      downloadCSV(csv, config.filename);
      const { exportedCount } = buildMappedRows(range, mapping, config);
      setExported({ csv, filename: config.filename, rows: exportedCount });
    } catch (err: any) {
      setExportError(err.message || String(err));
    }
  };

  const nextDisabled = () => {
    if (step === 2) return mapping.length === 0;
    return false;
  };

  return (
    <div className="export-workflow">
      {/* ── Step indicator ── */}
      <div className="wf-steps">
        {STEP_LABELS.map((label, i) => (
          <div key={label} className={`wf-step ${step === i + 1 ? 'wf-step-active' : ''} ${step > i + 1 ? 'wf-step-done' : ''}`}>
            <span className="wf-step-num">{step > i + 1 ? '✓' : i + 1}</span>
            <span className="wf-step-label">{label}</span>
          </div>
        ))}
      </div>

      {step === 1 && (
        <RangeSelector
          onDataLoaded={handleDataLoaded}
          onCancel={() => setStep(2)}
        />
      )}

      {step === 2 && range && (
        <>
          <div className="wf-range-banner">
            📄 Loaded: <strong>{range.address}</strong> · {range.rowCount} rows × {range.columnCount} cols
            <button className="wf-btn wf-btn-sm wf-btn-outline" onClick={() => setStep(1)}>
              Change Range
            </button>
          </div>
          <CsvPresetManager
            presets={presets}
            currentMapping={mapping}
            onSelectPreset={handleSelectPreset}
            onSavePreset={handleSavePreset}
            onDeletePreset={handleDeletePreset}
          />
          <div className="wf-card wf-accent-blue">
            <div className="wf-card-header">
              <h3 className="wf-card-title">2️⃣ Map &amp; Order Columns</h3>
              <p className="wf-card-subtitle">Drag to reorder · set each output column's source</p>
            </div>
            <div className="wf-card-body">
              <ColumnMapper
                excelHeaders={range.headers}
                mapping={mapping}
                onMappingChange={handleMappingChange}
              />
            </div>
          </div>
        </>
      )}

      {step === 3 && range && (
        <>
          <ExportConfigPanel range={range} config={config} onConfigChange={handleConfigChange} />
          <DataPreview range={range} mapping={mapping} config={config} />
        </>
      )}

      {step === 4 && range && (
        <div className="wf-card wf-accent-green">
          <div className="wf-card-header">
            <h3 className="wf-card-title">4️⃣ Export CSV</h3>
            <p className="wf-card-subtitle">Download the mapped, formatted file</p>
          </div>
          <div className="wf-card-body">
            <div className="wf-export-summary">
              <div className="wf-stat">
                <span className="wf-stat-value">{buildMappedRows(range, mapping, config).exportedCount}</span>
                <span className="wf-stat-label">rows to export</span>
              </div>
              <div className="wf-stat">
                <span className="wf-stat-value">{mapping.length}</span>
                <span className="wf-stat-label">output columns</span>
              </div>
              <div className="wf-stat">
                <span className="wf-stat-value wf-stat-value-sm">{config.filename}</span>
                <span className="wf-stat-label">filename</span>
              </div>
            </div>

            <DataPreview range={range} mapping={mapping} config={config} />

            {exportError && <div className="wf-error-banner">⚠️ {exportError}</div>}

            {exported && (
              <div className="wf-success-banner">
                ✅ Exported <strong>{exported.filename}</strong> ({exported.rows} rows). Your browser download should have started.
              </div>
            )}

            <div className="wf-form-actions">
              <button className="wf-btn wf-btn-primary wf-btn-lg" onClick={handleExport}>
                📤 Download CSV
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Navigation ── */}
      <div className="wf-nav-row">
        {step > 1 && (
          <button className="wf-btn wf-btn-outline" onClick={() => setStep(step - 1)}>
            ‹ Back
          </button>
        )}
        {step < 4 && (
          <button
            className="wf-btn wf-btn-primary"
            disabled={nextDisabled()}
            onClick={() => setStep(step + 1)}
          >
            Next ›
          </button>
        )}
      </div>
    </div>
  );
};

export default ExportWorkflow;
