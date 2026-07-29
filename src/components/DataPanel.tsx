import React from 'react';

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

/* ── Mock table ── */
const MockTable: React.FC = () => {
  const headers = ['SKU', 'Name', 'Qty', 'Price (£)', 'Warehouse', 'Status'];
  const rows = [
    ['STK-001', 'Widget A', '250', '12.50', 'London', '✓ Ready'],
    ['STK-002', 'Gadget B', '180', '8.20',  'Manchester', '✓ Ready'],
    ['STK-003', 'Tool C',   '95',  '45.00', 'Birmingham', '⚠ Review'],
    ['STK-004', 'Part D',   '420', '3.15',  'London', '✓ Ready'],
    ['STK-005', 'Kit E',    '60',  '99.00', 'Leeds', '⏳ Pending'],
  ];

  return (
    <div className="wf-table-wrap">
      <table className="wf-table">
        <thead>
          <tr>{headers.map((h) => <th key={h}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/* ── Data Panel ── */
const DataPanel: React.FC<DataPanelProps> = ({ variant = 'import' }) => (
  <div className="data-panel">
    {variant === 'import' && (
      <>
        {/* ── Import Steps ── */}
        <div className="wf-card wf-accent-blue">
          <div className="wf-card-header">
            <h3 className="wf-card-title">📥 Import Stock Data</h3>
            <p className="wf-card-subtitle">Follow the steps below to import your stock file</p>
          </div>
          <div className="wf-card-body">
            <div className="wf-steps">
              <Step num={1} label="Select File" active />
              <Step num={2} label="Map Columns" active={false} />
              <Step num={3} label="Validate Data" active={false} />
              <Step num={4} label="Upload to Sage" active={false} />
            </div>

            {/* ── Drop zone ── */}
            <div className="wf-dropzone">
              <span className="wf-dropzone-icon">📁</span>
              <p className="wf-dropzone-text">Drop CSV or Excel file here</p>
              <p className="wf-dropzone-hint">or</p>
              <button className="wf-btn wf-btn-primary">Browse Files</button>
              <p className="wf-dropzone-types">Supports: .csv, .xlsx, .xls (max 50 MB)</p>
            </div>

            {/* ── Recent files ── */}
            <div className="wf-recent-files">
              <h4>📄 Recent Files</h4>
              {['stock_upload_july.csv', 'inventory_q3.xlsx', 'warehouse_stock.csv'].map((f, i) => (
                <div key={i} className="wf-file-item">
                  <span className="wf-file-icon">{f.endsWith('.csv') ? '📄' : '📊'}</span>
                  <span className="wf-file-name">{f}</span>
                  <span className="wf-file-date">
                    {['Jul 28', 'Jul 25', 'Jul 20'][i]}
                  </span>
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
            <h3 className="wf-card-title">📋 Stock Data Table</h3>
            <p className="wf-card-subtitle">Preview of your imported stock records</p>
          </div>
          <div className="wf-card-body">
            <div className="wf-table-toolbar">
              <input className="wf-input" placeholder="🔍 Search SKU or name…" />
              <button className="wf-btn wf-btn-outline">🔽 Export CSV</button>
              <button className="wf-btn wf-btn-primary">📤 Upload All to Sage</button>
            </div>
            <MockTable />
            <div className="wf-table-footer">
              <span>Showing 1–5 of 1,248 records</span>
              <div className="wf-pagination">
                <button className="wf-btn wf-btn-sm" disabled>‹ Prev</button>
                <span className="wf-page-info">Page 1 of 250</span>
                <button className="wf-btn wf-btn-sm">Next ›</button>
              </div>
            </div>
          </div>
        </div>
      </>
    )}
  </div>
);

export default DataPanel;
