import React, { useState } from 'react';

interface DataPanelProps {
  variant?: 'import' | 'table';
}

/* ── Step indicator ── */
const Step: React.FC<{ num: number; label: string; active: boolean }> = ({ num, label, active }) => (
  <div className={`wf-step ${active ? 'wf-step-active' : ''}`}>
    <span className="wf-step-num">{num}</span>
    <span className="wf-step-label">{label}</span>
  </div>
);

/* ── No sample data — load real data from an Excel range ── */

const sampleRows: string[][] = [];
const headers: string[] = [];

/* ── CSV Export ── */
const exportToCSV = (rows: string[][]) => {
  const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'export.csv';
  a.click();
  URL.revokeObjectURL(url);
};

/* ── Editable Table ── */
const PriceTable: React.FC = () => {
  const [rows, setRows] = useState(sampleRows);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<{ row: number; col: number } | null>(null);
  const [editValue, setEditValue] = useState('');

  const filtered = rows.filter(r =>
    r.some(cell => cell.toLowerCase().includes(search.toLowerCase()))
  );

  const startEdit = (rowIdx: number, colIdx: number) => {
    setEditing({ row: rowIdx, col: colIdx });
    setEditValue(rows[rowIdx][colIdx]);
  };

  const saveEdit = () => {
    if (editing) {
      const newRows = [...rows];
      newRows[editing.row] = [...newRows[editing.row]];
      newRows[editing.row][editing.col] = editValue;
      setRows(newRows);
      setEditing(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') saveEdit();
    if (e.key === 'Escape') setEditing(null);
  };

  return (
    <>
      <div className="wf-table-toolbar">
        <input
          className="wf-input"
          placeholder="🔍 Search…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button className="wf-btn wf-btn-outline" onClick={() => setRows(sampleRows)}>
          🔄 Reset
        </button>
        <button className="wf-btn wf-btn-primary" onClick={() => exportToCSV(rows)}>
          📤 Export CSV
        </button>
      </div>

      {rows.length === 0 ? (
        <div className="wf-empty-state">
          No data loaded. Use the <strong>Export CSV</strong> view to select a worksheet
          range and map its columns.
        </div>
      ) : (
        <>
        <div className="wf-table-wrap">
          <table className="wf-table">
            <thead>
              <tr>{headers.map((h) => <th key={h}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {filtered.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => {
                  const isEditing = editing?.row === ri && editing?.col === ci;
                  return (
                    <td
                      key={ci}
                      className={ci >= 2 && ci <= 3 ? 'wf-cell-numeric' : ''}
                      onDoubleClick={() => startEdit(ri, ci)}
                      title="Double-click to edit"
                    >
                      {isEditing ? (
                        <input
                          className="wf-cell-input"
                          value={editValue}
                          onChange={e => setEditValue(e.target.value)}
                          onBlur={saveEdit}
                          onKeyDown={handleKeyDown}
                          autoFocus
                        />
                      ) : (
                        cell
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="wf-table-footer">
        <span>Showing {filtered.length} of {rows.length} records (double-click to edit)</span>
        <div className="wf-pagination">
          <button className="wf-btn wf-btn-sm" disabled>‹ Prev</button>
          <span className="wf-page-info">{rows.length} records</span>
          <button className="wf-btn wf-btn-sm">Next ›</button>
        </div>
      </div>
        </>
      )}
    </>
  );
};

/* ── Data Panel ── */
const DataPanel: React.FC<DataPanelProps> = ({ variant = 'import' }) => (
  <div className="data-panel">
    {variant === 'import' && (
      <>
        {/* ── Workflow Steps ── */}
        <div className="wf-card wf-accent-blue">
          <div className="wf-card-header">
            <h3 className="wf-card-title">📥 Edit Data → Export CSV</h3>
            <p className="wf-card-subtitle">Edit data in the table, then export as a CSV file</p>
          </div>
          <div className="wf-card-body">
            <div className="wf-steps">
              <Step num={1} label="Load Data" active />
              <Step num={2} label="Edit" active={false} />
              <Step num={3} label="Review" active={false} />
              <Step num={4} label="Export CSV" active={false} />
            </div>

            {/* ── Drop zone ── */}
            <div className="wf-dropzone">
              <span className="wf-dropzone-icon">📊</span>
              <p className="wf-dropzone-text">Select a range in your Excel worksheet</p>
              <p className="wf-dropzone-hint">The first row is used as the CSV column headers</p>
              <button className="wf-btn wf-btn-primary">Select Sheet Range</button>
              <p className="wf-dropzone-types">The add-in reads directly from the active Excel worksheet</p>
            </div>

            {/* ── Recent exports ── */}
            <div className="wf-recent-files">
              <h4>📄 Recent Exports</h4>
              <p className="wf-hint">Exported files will appear here</p>
            </div>
          </div>
        </div>
      </>
    )}

    {variant === 'table' && (
      <>
        <div className="wf-card wf-accent-blue">
          <div className="wf-card-header">
            <h3 className="wf-card-title">📋 Data Table</h3>
            <p className="wf-card-subtitle">Double-click any cell to edit. Press Export CSV to generate the file.</p>
          </div>
          <div className="wf-card-body">
            <PriceTable />
          </div>
        </div>
      </>
    )}
  </div>
);

export default DataPanel;
