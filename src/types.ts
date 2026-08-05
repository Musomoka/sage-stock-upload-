/* ═══════════════════════════════════════════
   Shared domain types for Excel CSV Mapper
   ═══════════════════════════════════════════ */

/** Data read from an Excel range. */
export interface RangeData {
  /** Range address, e.g. "Sheet1!A1:E50". */
  address: string;
  /** Column headers — the first row when a header row exists, else generated names. */
  headers: string[];
  /** Data rows (each is a string[] aligned to headers). */
  rows: string[][];
  /** Number of columns. */
  columnCount: number;
  /** Number of data rows (excludes header). */
  rowCount: number;
}

/** A single output column in the CSV, mapped to a source Excel column. */
export interface ColumnMapping {
  /** Stable unique id. */
  id: string;
  /** Output CSV column name. */
  csvName: string;
  /** Index into the source range's columns (0-based), or -1 when not mapped. */
  excelIndex: number;
  /** Formatting rule applied during export. */
  format: 'text' | 'number';
}

/** A named, saved CSV layout. */
export interface CsvPreset {
  name: string;
  columns: ColumnMapping[];
}

/** Row filtering rules applied during export. */
export interface FilterConfig {
  /** Exclude rows where the given source column contains the keyword (case-insensitive). */
  excludeKeywords: { columnIndex: number; keyword: string }[];
  /** Exclude rows that are entirely empty. */
  excludeEmptyRows: boolean;
}

/** Full export configuration. */
export interface ExportConfig {
  filename: string;
  delimiter: ',' | ';' | '\t';
  includeHeader: boolean;
  quoteAll: boolean;
  decimalPlaces: number;
  filters: FilterConfig;
}
