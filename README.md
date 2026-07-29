# 🐂 SageStockUpload — Excel Add-in Wireframe

> A wireframe prototype for an Excel add-in that imports stock data from CSV/Excel and uploads it to **Sage Cloud**.

---

## 🎨 Live Wireframe Preview

👉 **[View Wireframe on GitHub Pages](https://YOUR_USERNAME.github.io/sage-stock-upload/)**

The wireframe runs standalone in any browser — no Excel required for preview.

---

## 📸 Screens

| Dashboard | Import | Data Table | Settings |
|:---:|:---:|:---:|:---:|
| KPIs, charts, activity | Drop zone, file list, step wizard | Sortable table with toolbar | Sage connection, column mapping, prefs |

---

## 🏗 Project Structure

```
sage-stock-upload/
├── .github/workflows/deploy.yml   # Auto-deploy to GitHub Pages
├── public/
│   └── index.html                 # Host page (loads Office.js)
├── src/
│   ├── components/
│   │   ├── App.tsx                # Root (taskpane vs standalone)
│   │   ├── Header.tsx             # Top bar with breadcrumbs
│   │   ├── Sidebar.tsx            # Navigation sidebar
│   │   ├── Dashboard.tsx          # KPI cards, chart, activity feed
│   │   ├── DataPanel.tsx          # Import wizard + data table
│   │   └── SettingsPanel.tsx      # Sage config, column mapping, prefs
│   ├── styles/
│   │   └── wireframe.css          # Full wireframe stylesheet
│   ├── manifest.xml               # Office Add-in manifest
│   ├── index.tsx                  # Entry point
│   └── declarations.d.ts
├── package.json
├── tsconfig.json
├── webpack.config.js
└── README.md
```

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

---

## 🔌 Side-load into Excel

1. Build: `npm run build`
2. Update `src/manifest.xml` — replace `YOUR_USERNAME` with your GitHub username
3. Copy `manifest.xml` to a network share or local folder
4. In Excel: **Insert → Add-ins → Upload My Add-in** → select `manifest.xml`

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
