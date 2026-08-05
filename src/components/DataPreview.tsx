import React from 'react';
import { ColumnMapping, ExportConfig, RangeData } from '../types';
import { buildMappedRows } from '../services/csvService';

interface DataPreviewProps {
  range: RangeData;
  mapping: ColumnMapping[];
  config: ExportConfig;
}

const PREVIEW_LIMIT = 50;

const DataPreview: React.FC<DataPreviewProps> = ({ range, mapping, config }) => {
  const result = buildMappedRows(range, mapping, config);

  if (range.rowCount === 0) {
    return (
      <div className="wf-card wf-accent-amber">
        <div className="wf-card-header">
          <h3 className="wf-card-title">👁️ Preview</h3>
        </div>
        <div className="wf-card-body">
          <div className="wf-empty-state">No data rows loaded. Go back and load a range.</div>
        </div>
      </div>
    );
  }

  const previewRows = result.rows.slice(0, PREVIEW_LIMIT);

  return (
    <div className="wf-card wf-accent-amber">
      <div className="wf-card-header">
        <h3 className="wf-card-title">👁️ CSV Preview</h3>
        <p className="wf-card-subtitle">
          {range.rowCount} rows loaded · {result.excludedCount} excluded ·{' '}
          <strong>{result.exportedCount} exported</strong>
        </p>
      </div>
      <div className="wf-card-body">
        {result.headers.length === 0 ? (
          <div className="wf-empty-state">Add at least one output column to build the CSV.</div>
        ) : (
          <div className="wf-table-wrap">
            <table className="wf-table wf-table-sm">
              <thead>
                <tr>
                  {result.headers.map((h, i) => (
                    <th key={i}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewRows.map((row, ri) => (
                  <tr key={ri}>
                    {row.map((cell, ci) => (
                      <td key={ci} className={mapping[ci]?.format === 'number' ? 'wf-cell-numeric' : ''}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {result.exportedCount > PREVIEW_LIMIT && (
          <p className="wf-preview-note">
            Showing first {PREVIEW_LIMIT} of {result.exportedCount} rows.
          </p>
        )}
      </div>
    </div>
  );
};

export default DataPreview;
