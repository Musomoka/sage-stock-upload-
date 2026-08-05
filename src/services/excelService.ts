/* ═══════════════════════════════════════════
   excelService – Office.js range reading + sample data
   ═══════════════════════════════════════════ */

import { RangeData } from '../types';

export interface RawRange {
  address: string;
  values: (string | number | boolean)[][];
}

/** True when running inside a real Office host with Excel available. */
export const isOfficeAvailable = (): boolean =>
  typeof (window as any).Office !== 'undefined' &&
  typeof (window as any).Excel !== 'undefined';

const toCellString = (v: string | number | boolean): string => {
  if (v === null || v === undefined) return '';
  return String(v);
};

/** Strip any sheet prefix and $ from an address, e.g. "Sheet1!$A$1:$E$50" → "A1:E50". */
export const normalizeAddress = (address: string): string =>
  address
    .replace(/^.*!/, '')
    .replace(/\$/g, '');

/**
 * Read the currently selected range from the workbook.
 * Returns null when running outside Office or when there is no selection.
 */
export const getSelectedRange = async (): Promise<RawRange | null> => {
  if (!isOfficeAvailable()) return null;

  const context = (window as any).Excel.run((ctx: any) => {
    const range = ctx.workbook.getSelectedRange();
    range.load('values');
    range.load('address');
    return ctx.sync().then(() => ({
      address: range.address,
      values: range.values as (string | number | boolean)[][],
    }));
  });

  try {
    return await context;
  } catch (err: any) {
    // No selection / empty workbook → Office throws RichApi.Error 1004 or similar.
    throw new Error(`Could not read the selection: ${err.message || err}`);
  }
};

/** Read the currently selected range's address only. Returns null outside Office. */
export const getCurrentSelectionAddress = async (): Promise<string | null> => {
  if (!isOfficeAvailable()) return null;
  const context = (window as any).Excel.run((ctx: any) => {
    const range = ctx.workbook.getSelectedRange();
    range.load('address');
    return ctx.sync().then(() => range.address);
  });
  try {
    return await context;
  } catch {
    return null;
  }
};

/**
 * Read a specific range by address (e.g. "Sheet1!A1:E100" or "A1:E100").
 * Throws a friendly error when the address is invalid or outside Office.
 */
export const getRangeByAddress = async (address: string): Promise<RawRange> => {
  if (!isOfficeAvailable()) {
    throw new Error('Not running inside Excel — load data via sample data instead.');
  }
  const trimmed = address.trim();
  if (!trimmed) throw new Error('Please enter a range address, e.g. A1:E100.');

  const context = (window as any).Excel.run((ctx: any) => {
    const range = ctx.workbook.worksheets.getActiveWorksheet().getRange(trimmed);
    range.load('values');
    range.load('address');
    return ctx.sync().then(() => ({
      address: range.address,
      values: range.values as (string | number | boolean)[][],
    }));
  });

  try {
    return await context;
  } catch (err: any) {
    throw new Error(`Could not read "${trimmed}": ${err.message || err}`);
  }
};

/**
 * Convert a raw Office range into a typed RangeData.
 * When `hasHeader` is true the first row is used as headers, otherwise
 * generated headers (A, B, C…) are used and every row is data.
 */
export const toRangeData = (raw: RawRange, hasHeader: boolean): RangeData => {
  const values = raw.values && raw.values.length ? raw.values : [[]];
  const columnCount = Math.max(1, ...values.map((row) => row.length));

  const cellAt = (r: number, c: number): string =>
    c < (values[r] || []).length ? toCellString(values[r][c]) : '';

  let headers: string[];
  let dataStart = 0;

  if (hasHeader && values.length > 0) {
    headers = Array.from({ length: columnCount }, (_, c) =>
      toCellString(values[0][c] !== undefined ? values[0][c] : '').trim() || String.fromCharCode(65 + c)
    );
    dataStart = 1;
  } else {
    headers = Array.from({ length: columnCount }, (_, c) => String.fromCharCode(65 + c));
  }

  const rows: string[][] = [];
  for (let r = dataStart; r < values.length; r++) {
    const row: string[] = [];
    for (let c = 0; c < columnCount; c++) row.push(cellAt(r, c));
    rows.push(row);
  }

  return {
    address: raw.address,
    headers,
    rows,
    columnCount,
    rowCount: rows.length,
  };
};

/* ── No sample data — the add-in reads real ranges from the active workbook ── */
