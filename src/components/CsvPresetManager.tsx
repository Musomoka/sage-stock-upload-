import React, { useState } from 'react';
import { ColumnMapping, CsvPreset } from '../types';

interface CsvPresetManagerProps {
  presets: CsvPreset[];
  currentMapping: ColumnMapping[];
  onSelectPreset: (columns: ColumnMapping[]) => void;
  onSavePreset: (name: string) => void;
  onDeletePreset: (name: string) => void;
}

const CsvPresetManager: React.FC<CsvPresetManagerProps> = ({
  presets,
  currentMapping,
  onSelectPreset,
  onSavePreset,
  onDeletePreset,
}) => {
  const [selected, setSelected] = useState<string>('');
  const [presetName, setPresetName] = useState('');

  const applyPreset = (name: string) => {
    setSelected(name);
    const preset = presets.find((p) => p.name === name);
    if (preset) onSelectPreset(preset.columns);
  };

  const handleSave = () => {
    const name = presetName.trim();
    if (!name) return;
    onSavePreset(name);
    setPresetName('');
    setSelected(name);
  };

  const handleDelete = () => {
    if (!selected) return;
    onDeletePreset(selected);
    setSelected('');
  };

  return (
    <div className="wf-card wf-accent-green">
      <div className="wf-card-header">
        <h3 className="wf-card-title">🗂️ CSV Layout Presets</h3>
        <p className="wf-card-subtitle">Save column layouts for different upload formats</p>
      </div>
      <div className="wf-card-body">
        <div className="wf-form-group">
          <label className="wf-label">Load preset</label>
          <div className="wf-selection-row">
            <select
              className="wf-select"
              value={selected}
              onChange={(e) => applyPreset(e.target.value)}
            >
              <option value="">— choose a preset —</option>
              {presets.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name} ({p.columns.length} cols)
                </option>
              ))}
            </select>
            <button
              className="wf-btn wf-btn-sm wf-btn-danger"
              onClick={handleDelete}
              disabled={!selected}
              title="Delete selected preset"
            >
              🗑️
            </button>
          </div>
        </div>

        <div className="wf-form-group">
          <label className="wf-label">Save current layout as preset</label>
          {currentMapping.length === 0 && (
            <p className="wf-hint">Add at least one column in the mapper above, then type a name to save.</p>
          )}
          <div className="wf-selection-row">
            <input
              className="wf-input"
              placeholder="e.g. Employee Export"
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
            />
            <button
              className="wf-btn wf-btn-sm wf-btn-primary"
              onClick={handleSave}
              disabled={!presetName.trim() || currentMapping.length === 0}
            >
              💾 Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CsvPresetManager;
