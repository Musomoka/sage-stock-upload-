/* ═══════════════════════════════════════════
   settingsService – localStorage-backed persistence
   ═══════════════════════════════════════════ */

import { ColumnMapping, CsvPreset, ExportConfig, FilterConfig } from '../types';

const KEY_PRESETS = 'excel-csv-mapper:presets';
const KEY_LAST_MAPPING = 'excel-csv-mapper:last-mapping';
const KEY_EXPORT_CONFIG = 'excel-csv-mapper:export-config';

/** The default column mapping (empty — users define their own). */
export const DEFAULT_PRESET_COLUMNS: ColumnMapping[] = [];

export const DEFAULT_EXPORT_CONFIG: ExportConfig = {
  filename: 'export.csv',
  delimiter: ',',
  includeHeader: true,
  quoteAll: false,
  decimalPlaces: 2,
  filters: { excludeKeywords: [], excludeEmptyRows: true },
};

const read = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const write = (key: string, value: unknown): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Quota / privacy mode — ignore silently.
  }
};

/* ── Presets ── */

export const getPresets = (): CsvPreset[] => read<CsvPreset[]>(KEY_PRESETS, []);

export const savePreset = (preset: CsvPreset): CsvPreset[] => {
  const presets = getPresets().filter((p) => p.name.toLowerCase() !== preset.name.toLowerCase());
  presets.push(preset);
  write(KEY_PRESETS, presets);
  return presets;
};

export const deletePreset = (name: string): CsvPreset[] => {
  const presets = getPresets().filter((p) => p.name.toLowerCase() !== name.toLowerCase());
  write(KEY_PRESETS, presets);
  return presets;
};

/* ── Last-used mapping ── */

export const getLastMapping = (): ColumnMapping[] | null =>
  read<ColumnMapping[] | null>(KEY_LAST_MAPPING, null);

export const saveLastMapping = (mapping: ColumnMapping[]): void =>
  write(KEY_LAST_MAPPING, mapping);

/* ── Export config ── */

export const getExportConfig = (): ExportConfig =>
  read<ExportConfig>(KEY_EXPORT_CONFIG, DEFAULT_EXPORT_CONFIG);

export const saveExportConfig = (config: ExportConfig): void =>
  write(KEY_EXPORT_CONFIG, config);

/* ── Filter helpers ── */

export const addFilterRule = (filters: FilterConfig, columnIndex: number, keyword: string): FilterConfig => ({
  ...filters,
  excludeKeywords: [...filters.excludeKeywords, { columnIndex, keyword }],
});

export const removeFilterRule = (filters: FilterConfig, index: number): FilterConfig => ({
  ...filters,
  excludeKeywords: filters.excludeKeywords.filter((_, i) => i !== index),
});
