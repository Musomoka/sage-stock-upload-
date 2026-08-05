/* ═══════════════════════════════════════════
   csvService – CSV generation, formatting, filtering
   ═══════════════════════════════════════════ */

import { ColumnMapping, ExportConfig, FilterConfig, RangeData } from '../types';

/** Format a single cell per its column's format rule. */
export const formatCell = (
  value: string,
  format: 'text' | 'number',
  decimalPlaces: number
): string => {
  if (format === 'number' && value !== '') {
    const num = parseFloat(value.replace(/[^0-9.\-]/g, ''));
    if (!isNaN(num)) return num.toFixed(decimalPlaces);
  }
  return value;
};

/** Escape a value for CSV: quote when it contains delimiter, quote, or newline. */
export const escapeCell = (value: string, delimiter: string): string => {
  const needsQuoting =
    value.indexOf(delimiter) !== -1 ||
    value.indexOf('"') !== -1 ||
    value.indexOf('\n') !== -1 ||
    value.indexOf('\r') !== -1;
  if (needsQuoting) return `"${value.replace(/"/g, '""')}"`;
  return value;
};

/** True when a row should be excluded based on the filter config. */
export const shouldExcludeRow = (row: string[], filters: FilterConfig): boolean => {
  if (filters.excludeEmptyRows) {
    if (row.every((cell) => cell.trim() === '')) return true;
  }
  for (const rule of filters.excludeKeywords) {
    const cell = (row[rule.columnIndex] || '').toLowerCase();
    if (cell.indexOf(rule.keyword.toLowerCase()) !== -1) return true;
  }
  return false;
};

export interface MappedResult {
  /** Output CSV headers in export order. */
  headers: string[];
  /** Output rows (already filtered + formatted). */
  rows: string[][];
  /** Number of rows excluded by filters. */
  excludedCount: number;
  /** Number of rows that will be written. */
  exportedCount: number;
}

/**
 * Apply the column mapping + filters + formatting to a loaded range,
 * producing the rows that will appear in the CSV. Used by both the
 * preview and the final export so they always agree.
 */
export const buildMappedRows = (
  range: RangeData,
  mapping: ColumnMapping[],
  config: ExportConfig
): MappedResult => {
  const headers = mapping.map((m) => m.csvName);
  const rows: string[][] = [];
  let excludedCount = 0;

  for (const row of range.rows) {
    if (shouldExcludeRow(row, config.filters)) {
      excludedCount++;
      continue;
    }
    const outRow = mapping.map((m) => {
      if (m.excelIndex < 0 || m.excelIndex >= range.columnCount) return '';
      return formatCell(row[m.excelIndex] || '', m.format, config.decimalPlaces);
    });
    rows.push(outRow);
  }

  return { headers, rows, excludedCount, exportedCount: rows.length };
};

/** Generate the full CSV file content as a string. */
export const generateCSV = (
  range: RangeData,
  mapping: ColumnMapping[],
  config: ExportConfig
): string => {
  const { headers, rows } = buildMappedRows(range, mapping, config);
  const lines: string[] = [];

  if (config.includeHeader) {
    lines.push(headers.map((h) => escapeCell(h, config.delimiter)).join(config.delimiter));
  }

  for (const row of rows) {
    const cells = row.map((cell) =>
      config.quoteAll ? `"${cell.replace(/"/g, '""')}"` : escapeCell(cell, config.delimiter)
    );
    lines.push(cells.join(config.delimiter));
  }

  return lines.join('\r\n');
};

/** Trigger a browser download of the CSV string. */
export const downloadCSV = (csv: string, filename: string): void => {
  // BOM so Excel correctly detects UTF-8.
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
