# 🚀 Deploying Excel → CSV Mapper — Making It Available in Every Excel File

Office add-ins are **app-level, not per-workbook**. Once an add-in is installed or
deployed, it appears in **every Excel file** that a user opens — there is nothing
per-sheet to configure. The only question is **who** it's available to, which is
controlled by *how* you deploy it:

| Method | Scope | Best for |
|--------|-------|----------|
| **Sideload** | One machine (all workbooks on it) | You testing on your own PC |
| **Centralized deployment** (M365 admin center) | Everyone in your Microsoft 365 org | "Anyone who opens Excel" gets it |
| **Shared folder catalog** | Machines pointed at an on-prem share | Companies not on Microsoft 365 |
| **AppSource** | Anyone on the internet | Public distribution |

---

## ✅ Prerequisites (already done in this repo)

The add-in is a *web add-in*: Excel loads it from a hosted HTTPS page. For Office to
accept it, three things must be publicly reachable over HTTPS. This repo is already
set up for all three via GitHub Pages:

| Asset | Hosted URL |
|-------|-----------|
| App page | `https://musomoka.github.io/sage-stock-upload-/index.html` |
| Ribbon icons | `https://musomoka.github.io/sage-stock-upload-/assets/icon-{16,32,64,80}.png` |
| Manifest | `https://musomoka.github.io/sage-stock-upload-/manifest.xml` |

> If your repo/Pages URL differs from `sage-stock-upload-`, update every URL in
> `src/manifest.xml` to match, then redeploy.

The build now generates all of the above into `docs/`:

```bash
npm run build   # -> docs/index.html, docs/bundle.*.js, docs/manifest.xml, docs/assets/
```

---

## 1️⃣ Sideload on your own machine (fastest — all workbooks on that PC)

**Web add-in (recommended):**

1. Open any Excel workbook.
2. **Insert ▸ Get Add-ins ▸ My Add-ins ▸ Upload My Add-in ▸ Upload from URL**.
3. Paste `https://musomoka.github.io/sage-stock-upload-/manifest.xml` → **Upload**.
4. The add-in now appears in the **Home ▸ CSV Mapper** group of **every workbook**
   you open on this machine.

**Sideload the local manifest for offline dev (Office 365 desktop):**

1. Run `npm run dev` to serve the app locally, or sideload the *local* manifest.
2. On Windows use the [Office Add-ins sideloading tool](https://learn.microsoft.com/office/dev/add-ins/testing/sideload-office-add-ins-for-testing)
   (Yo Office). On Mac, upload `src/manifest.xml` via **Insert ▸ Get Add-ins ▸ Upload My Add-in ▸ Browse**.

**Sideload on Mac (wef folder — recommended for local dev):**

This repo includes a local dev manifest (`src/manifest.local.xml`) that points the
add-in at `http://localhost:3000`. To install it on this Mac:

```bash
npm run sideload   # starts the dev server + copies the manifest into Excel
```

Or manually: copy `src/manifest.local.xml` into
`~/Library/Containers/com.microsoft.Excel/Data/Documents/wef/`
(create the `wef` folder if it doesn't exist), then **restart Excel** and open any
workbook → **Home ▸ Add-ins ▸ Excel → CSV Mapper (Local)**.

> The local manifest uses its own add-in `Id` and shows as *"(Local)"* so it can
> coexist with the hosted version. It loads from the dev server, so keep `npm run dev`
> running while you use it.

> Remember: sideloaded add-ins only exist on the machine where you sideload them.

---

## 2️⃣ Centralized deployment — make it available to EVERYONE in your org ⭐

This is what makes the add-in appear in Excel for **anyone who opens a workbook**
in your Microsoft 365 organization, with no per-user installs.

1. **Ensure your GitHub Pages site is live and HTTPS** (after pushing the updated
   `docs/` to the `main`/`master` branch — the GitHub Action deploys automatically).
2. Verify the hosted manifest loads in a browser:
   `https://musomoka.github.io/sage-stock-upload-/manifest.xml`
3. Go to the **Microsoft 365 admin center** → **Settings ▸ Integrated apps ▸
   Add-ins ▸ Deploy Add-in** (or *Office apps ▸ Excel ▸ Manage* → **Upload**).
4. Choose **Upload custom apps** and upload the manifest via URL
   (`.../manifest.xml`) or by file (`src/manifest.xml`).
5. Choose **who gets it**: *Everyone* or specific users/groups.
6. Review permissions and **Deploy**.

Within a few minutes the **Home ▸ CSV Mapper** ribbon group appears in Excel for
every assigned user, across all their workbooks (desktop + web).

> This requires a Microsoft 365 admin account. The manifest `Id` is a unique GUID
> and all assets are HTTPS, so it passes validation.

---

## 3️⃣ Shared folder catalog (on-prem / not on Microsoft 365)

For organizations without Microsoft 365 admin:

1. Put `src/manifest.xml` on a network share (e.g. `\\server\share\addins\`).
2. On each user's machine: **File ▸ Options ▸ Trust Center ▸ Trust Center
   Settings ▸ Trusted Add-in Catalogs ▸ Add** the share, and tick
   *Show in Menu*.
3. Users pick it from **Insert ▸ My Add-ins ▸ Shared Folder**.
   Available in all workbooks from then on.

---

## 🔁 After every code change

```bash
npm run build        # regenerate docs/ with the new bundle
npm run deploy       # build + commit docs/ + push -> GitHub Action publishes
```

The GitHub Actions workflow (`.github/workflows/deploy.yml`) rebuilds and publishes
`docs/` automatically on every push to `main`/`master`.

---

## ❓ FAQ

- **Do users need to install anything?** No — with centralized deployment the add-in
  is pushed to them; it just appears in their ribbon.
- **Is it available in Excel on the web / Mac / mobile?** Centralized deployment
  covers Windows, Mac, and Excel on the web. Mobile add-ins are generally not
  supported the same way.
- **Why is my ribbon button blank?** The icons must be reachable over HTTPS —
  redeploy after any URL change so `docs/assets/icon-*.png` are published.
