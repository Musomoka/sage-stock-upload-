# � Excel → CSV Mapper — Excel Add-in

> An Excel add-in that lets you select a worksheet range, map columns to any CSV layout, and export.

---

## 🎨 Live Wireframe Preview

👉 **[View Wireframe on GitHub Pages](https://musomoka.github.io/sage-stock-upload-/)**

The wireframe runs standalone in any browser — no Excel required for preview.

---

## 📸 Screens

| Dashboard | Export CSV | Data Table | Settings |
|:---:|:---:|:---:|:---:|
| KPIs, activity feed | Range pick, column mapper, export wizard | Sortable table with toolbar | Presets, default export config |

---

## 🏗 Project Structure

```
excel-csv-mapper/
├── .github/workflows/deploy.yml   # Auto-deploy to GitHub Pages
├── public/
│   └── index.html                 # Host page (loads Office.js)
├── src/
│   ├── components/
│   │   ├── App.tsx                # Root (taskpane vs standalone)
│   │   ├── Header.tsx             # Top bar with breadcrumbs
│   │   ├── Sidebar.tsx            # Navigation sidebar
│   │   ├── Dashboard.tsx          # KPI cards, chart, activity feed
│   │   ├── DataPanel.tsx          # Price table view
│   │   ├── ExportWorkflow.tsx     # 4-step: range → map → configure → export
│   │   ├── RangeSelector.tsx      # Step 1: pick a worksheet range
│   │   ├── ColumnMapper.tsx       # Step 2: drag-to-reorder column mapping
│   │   ├── CsvPresetManager.tsx   # Save/load CSV layout presets
│   │   ├── ExportConfig.tsx       # Step 3: filters, format, filename
│   │   ├── DataPreview.tsx        # Live CSV preview with row counts
│   │   └── SettingsPanel.tsx      # Presets + default export settings
│   ├── services/
│   │   ├── excelService.ts        # Office.js range reading + sample data
│   │   ├── csvService.ts          # CSV generation, formatting, filtering
│   │   └── settingsService.ts     # localStorage presets & config
│   ├── styles/
│   │   └── wireframe.css          # Full wireframe stylesheet
│   ├── manifest.xml               # Office Add-in manifest
│   ├── index.tsx                  # Entry point
│   ├── types.ts                   # Shared domain types
│   └── declarations.d.ts
├── package.json
├── tsconfig.json
├── webpack.config.js
└── README.md
```

---

## 🎯 How It Works

The **Export CSV** view walks through four steps:

1. **Select Range** — pick cells in the worksheet (or type an address). The add-in reads the selection via Office.js. Outside Excel, a sample dataset is provided for preview.
2. **Map Columns** — drag output columns into the desired CSV order and choose which Excel column feeds each one. Save the layout as a named preset for repeated use.
3. **Configure** — set filename, delimiter, decimal places, header row, quoting, and row filters (e.g. exclude rows containing a keyword). A live preview shows exactly what will be exported.
4. **Export** — download the CSV with prices formatted and filters applied.

Settings (presets, last mapping, export defaults) persist in `localStorage` across sessions.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run dev server (opens browser wireframe)
npm run dev

# 3. Build for production
npm run build
```

---

## 📦 Deploy to GitHub Pages

### Option A: Automatic (recommended)

Push to `main` and the GitHub Action in `.github/workflows/deploy.yml` auto-deploys.

### Option B: Manual

```bash
npm run deploy
```

Then enable GitHub Pages in your repo:  
**Settings → Pages → Source: GitHub Actions**

The build now also publishes the Office **manifest** and **ribbon icons** into
`docs/`, so after deploying the add-in can be loaded from:

```
https://musomoka.github.io/sage-stock-upload-/manifest.xml
```

---

## 🔌 Use the add-in in Excel

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for the full guide on making the add-in
available in **every Excel file** — sideload it on your own machine, or deploy it
to your whole organization via the Microsoft 365 admin center.

Quick sideload (one machine):

1. Push to `main` so GitHub Pages serves `docs/`.
2. In Excel: **Insert → Add-ins → My Add-ins → Upload My Add-in → Upload from URL**
3. Paste `https://musomoka.github.io/sage-stock-upload-/manifest.xml` → Upload.

> ⚠️ HTTPS is required for production add-ins. GitHub Pages provides this automatically.

---

## 🧱 Tech Stack

| Layer | Technology |
|:---|:---|
| UI | React 18 + TypeScript |
| Bundler | Webpack 5 |
| Styling | CSS with wireframe aesthetic (dashed borders, grayscale) |
| Office API | Office.js (loaded at runtime) |
| Hosting | GitHub Pages |
| CI/CD | GitHub Actions |

---

## 📋 Wireframe Conventions

- **Dashed borders** = placeholder / not yet implemented
- **Solid borders** = active / selected state
- **Color accents** (blue, green, amber, purple) = category indicators
- **Monospace text** = API fields / technical identifiers

---

## 📝 License

MIT — free to use and modify.
