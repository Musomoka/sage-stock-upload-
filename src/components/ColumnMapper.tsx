import React, { useRef, useState } from 'react';
import { ColumnMapping } from '../types';

interface ColumnMapperProps {
  /** Source column headers from the loaded range. */
  excelHeaders: string[];
  /** Current ordered output mapping. */
  mapping: ColumnMapping[];
  onMappingChange: (mapping: ColumnMapping[]) => void;
}

const uid = (): string => `out-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;

const ColumnMapper: React.FC<ColumnMapperProps> = ({ excelHeaders, mapping, onMappingChange }) => {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  // Synchronous source index so drop works even when state hasn't flushed
  // (fast synthetic drags, low-power machines, etc.).
  const dragIndexRef = useRef<number | null>(null);

  const resetDrag = () => {
    dragIndexRef.current = null;
    setDragIndex(null);
    setOverIndex(null);
  };

  const updateAt = (index: number, patch: Partial<ColumnMapping>) => {
    const next = mapping.map((m, i) => (i === index ? { ...m, ...patch } : m));
    onMappingChange(next);
  };

  const addColumn = () => {
    onMappingChange([
      ...mapping,
      {
        id: uid(),
        csvName: `Column ${mapping.length + 1}`,
        excelIndex: -1,
        format: 'text',
      },
    ]);
  };

  const addColumnWithSource = (excelIndex: number) => {
    const header = excelHeaders[excelIndex] || `Column ${excelIndex + 1}`;
    onMappingChange([
      ...mapping,
      { id: uid(), csvName: header, excelIndex, format: 'text' },
    ]);
  };

  const isColumnMapped = (excelIndex: number): boolean =>
    mapping.some((m) => m.excelIndex === excelIndex);

  const removeColumn = (index: number) => {
    onMappingChange(mapping.filter((_, i) => i !== index));
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    dragIndexRef.current = index;
    setDragIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(index));
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragIndexRef.current !== null && dragIndexRef.current !== index) setOverIndex(index);
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    // Read the source index from dataTransfer (set during dragstart) — reliable
    // even when drag/drop fire before React state has flushed.
    const raw = e.dataTransfer.getData('text/plain');
    const from = raw !== '' ? Number(raw) : dragIndexRef.current;
    if (from === null || from === targetIndex || isNaN(from)) {
      resetDrag();
      return;
    }
    const next = [...mapping];
    const [moved] = next.splice(from, 1);
    next.splice(targetIndex, 0, moved);
    onMappingChange(next);
    resetDrag();
  };

  return (
    <div className="wf-column-mapper">
      <p className="wf-hint">
        Drag rows to set CSV column order. Click an Excel column below to add it, or use <strong>+ Add Column</strong> for an empty placeholder.
      </p>

      {/* ── Quick-add chips for each Excel column ── */}
      {excelHeaders.length > 0 && (
        <div className="wf-quick-add-row">
          {excelHeaders.map((header, i) => {
            const mapped = isColumnMapped(i);
            return (
              <button
                key={i}
                className={`wf-chip ${mapped ? 'wf-chip-used' : ''}`}
                disabled={mapped}
                onClick={() => addColumnWithSource(i)}
                title={mapped ? `${header} is already mapped` : `Add ${header} as an output column`}
              >
                {header}
                <span className="wf-chip-col">({String.fromCharCode(65 + i)})</span>
                {mapped && <span className="wf-chip-check"> ✓</span>}
              </button>
            );
          })}
        </div>
      )}

      {mapping.length === 0 ? (
        <div className="wf-empty-state">
          No output columns yet. Click <strong>+ Add Column</strong> to start.
        </div>
      ) : (
        <ul className="wf-mapper-list">
          {mapping.map((col, index) => (
            <li
              key={col.id}
              className={`wf-mapper-row ${overIndex === index ? 'wf-drag-over' : ''} ${
                dragIndex === index ? 'wf-dragging' : ''
              }`}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={resetDrag}
            >
              <span className="wf-drag-handle" title="Drag to reorder">
                ⠿
              </span>

              <div className="wf-mapper-main">
                <input
                  className="wf-input wf-input-sm"
                  value={col.csvName}
                  onChange={(e) => updateAt(index, { csvName: e.target.value })}
                  aria-label="CSV column name"
                />

                <div className="wf-mapper-controls">
                  <label className="wf-inline-label">
                    <span>Source:</span>
                    <select
                      className="wf-select wf-select-sm"
                      value={col.excelIndex}
                      onChange={(e) => updateAt(index, { excelIndex: Number(e.target.value) })}
                    >
                      <option value={-1}>— not mapped —</option>
                      {excelHeaders.map((h, i) => (
                        <option key={i} value={i}>
                          {h} ({String.fromCharCode(65 + i)})
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="wf-inline-label">
                    <span>Format:</span>
                    <select
                      className="wf-select wf-select-sm"
                      value={col.format}
                      onChange={(e) => updateAt(index, { format: e.target.value as 'text' | 'number' })}
                    >
                      <option value="text">Text</option>
                      <option value="number">Number</option>
                    </select>
                  </label>
                </div>
              </div>

              <button
                className="wf-btn wf-btn-sm wf-btn-danger"
                onClick={() => removeColumn(index)}
                title="Remove column"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="wf-form-actions">
        <button className="wf-btn wf-btn-outline" onClick={addColumn}>
          ➕ Add Column
        </button>
      </div>
    </div>
  );
};

export default ColumnMapper;
