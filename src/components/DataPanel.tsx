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

/* ── Sample data matching the real Switch price list ── */
const sampleRows: string[][] = [
  ['Retail',          'Flex2.5mm3CWHT',       '11.00',  '15.00',  'Flex Cable 2.5MM 3 Core WHITE'],
  ['Warehouse Lusaka','Flex2.5mm3CWHT',       '6.03',   '6.99',   'Flex Cable 2.5MM 3 Core WHITE'],
  ['Warehouse Kitwe', 'Flex2.5mm3CWHT',       '6.03',   '6.99',   'Flex Cable 2.5MM 3 Core WHITE'],
  ['Retail',          'DEYE5KW1PLV',          '825.00', '825.00', 'DEYE 5KW Hybrid Inverter Single Phase'],
  ['Warehouse Lusaka','DEYE5KW1PLV',          '725.00', '725.00', 'DEYE 5KW Hybrid Inverter Single Phase'],
  ['Warehouse Kitwe', 'DEYE5KW1PLV',          '750.00', '750.00', 'DEYE 5KW Hybrid Inverter Single Phase'],
  ['Retail',          'HANCHU5.1KWHWALL',     '685.00', '685.00', 'HANCHU 5.1KWH 48V LV Battery - WALL MOUNT'],
  ['Warehouse Lusaka','HANCHU5.1KWHWALL',     '650.00', '650.00', 'HANCHU 5.1KWH 48V LV Battery - WALL MOUNT'],
  ['Warehouse Kitwe', 'HANCHU5.1KWHWALL',     '660.00', '660.00', 'HANCHU 5.1KWH 48V LV Battery - WALL MOUNT'],
  ['Retail',          'JIN-620W',             '80.00',  '80.00',  'PV MODULE 620W JINKO SOLAR'],
  ['Warehouse Lusaka','JIN-620W',             '71.00',  '71.00',  'PV MODULE 620W JINKO SOLAR'],
  ['Warehouse Kitwe', 'JIN-620W',             '75.00',  '75.00',  'PV MODULE 620W JINKO SOLAR'],
  ['Retail',          'MCB32A1P',             '3.45',   '4.00',   'TOSUN MCB 32A 1P AC Breaker'],
  ['Warehouse Lusaka','MCB32A1P',             '2.59',   '3.00',   'TOSUN MCB 32A 1P AC Breaker'],
  ['Warehouse Kitwe', 'MCB32A1P',             '2.59',   '3.00',   'TOSUN MCB 32A 1P AC Breaker'],
  ['Retail',          'DL5.0C',               '690.00', '690.00', 'DYNESS DL5.0C 5.1KWH 48V 100AH Battery'],
  ['Warehouse Lusaka','DL5.0C',               '650.00', '650.00', 'DYNESS DL5.0C 5.1KWH 48V 100AH Battery'],
  ['Warehouse Kitwe', 'DL5.0C',               '665.00', '665.00', 'DYNESS DL5.0C 5.1KWH 48V 100AH Battery'],
];

const headers = ['PRICELIST NAME', 'STOCK LINK', 'EXCLUSIVE', 'INCLUSIVE', 'DESCRIPTION'];

/* ── CSV Export ── */
const exportToCSV = (rows: string[][]) => {
  const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'SWITCH PRICELIST.csv';
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
          placeholder="🔍 Search by SKU, name, or pricelist…"
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
          <span className="wf-page-info">~210 SKUs × 4 tiers</span>
          <button className="wf-btn wf-btn-sm">Next ›</button>
        </div>
      </div>
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
            <h3 className="wf-card-title">📥 Edit Prices → Export CSV</h3>
            <p className="wf-card-subtitle">Edit prices in Excel, then export a pricelist CSV matching the Switch format</p>
          </div>
          <div className="wf-card-body">
            <div className="wf-steps">
              <Step num={1} label="Load Sheet" active />
              <Step num={2} label="Edit Prices" active={false} />
              <Step num={3} label="Calculate" active={false} />
              <Step num={4} label="Export CSV" active={false} />
            </div>

            {/* ── Drop zone ── */}
            <div className="wf-dropzone">
              <span className="wf-dropzone-icon">📊</span>
              <p className="wf-dropzone-text">Select your Excel price list sheet</p>
              <p className="wf-dropzone-hint">Columns: PRICELIST NAME | STOCK LINK | EXCLUSIVE | INCLUSIVE | DESCRIPTION</p>
              <button className="wf-btn wf-btn-primary">Select Sheet Range</button>
              <p className="wf-dropzone-types">The add-in reads directly from the active Excel worksheet</p>
            </div>

            {/* ── Recent exports ── */}
            <div className="wf-recent-files">
              <h4>📄 Recent Exports</h4>
              {[
                'SWITCH PRICELIST (Jul 29).csv',
                'SWITCH PRICELIST (Jul 25).csv',
                'SWITCH PRICELIST (Jul 20).csv',
              ].map((f, i) => (
                <div key={i} className="wf-file-item">
                  <span className="wf-file-icon">📄</span>
                  <span className="wf-file-name">{f}</span>
                  <span className="wf-file-date">⬇ Download</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    )}

    {variant === 'table' && (
      <>
        <div className="wf-card wf-accent-blue">
          <div className="wf-card-header">
            <h3 className="wf-card-title">📋 Switch Price List</h3>
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
