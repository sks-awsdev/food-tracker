# MintyLedger
### *by Sujan KS*

A clean, macOS-inspired web app to track your daily expenses (₹40/day for lunch).  
Built for **GitHub Pages** — pure HTML/CSS/JS, no backend needed.

## Features

- Beautiful landing page with scroll-to-app
- Monthly calendar view
- Tap any day → Lunch (₹40) or Skip (₹0)
- Live totals (this month + all time)
- Recent entries list
- Dark / Light theme toggle
- Data saved in browser (localStorage)
- Export data as JSON
- Fully responsive

## How to launch on GitHub Pages

### 1. Create a new repository
1. Go to [github.com/new](https://github.com/new)
2. Name it something like `minty-ledger` or `expense-tracker`
3. Keep it **Public**
4. Do **not** initialize with README (we already have one)
5. Click **Create repository**

### 2. Upload the files
You have three files:
- `index.html`
- `styles.css`
- `script.js`
- `README.md` (optional)

**Option A – Drag & drop (easiest)**
1. On the new repo page, click **uploading an existing file**
2. Drag all three files (`index.html`, `styles.css`, `script.js`) into the browser
3. Click **Commit changes**

**Option B – Git command line**
```bash
git clone https://github.com/YOUR_USERNAME/minty-ledger.git
cd minty-ledger
# copy the three files into this folder
git add .
git commit -m "Initial commit - MintyLedger by Sujan KS"
git push origin main
```

### 3. Enable GitHub Pages
1. Go to your repo → **Settings** → **Pages** (left sidebar)
2. Under **Source**, select **Deploy from a branch**
3. Branch: `main` (or `master`)
4. Folder: `/ (root)`
5. Click **Save**

### 4. Wait & open
After 30–60 seconds your site will be live at:

```
https://YOUR_USERNAME.github.io/minty-ledger/
```

(Replace `YOUR_USERNAME` and `minty-ledger` with your actual values)

## Tips

- Data is stored only in **your browser**. Clearing browser data will erase it.
- Use the **Export** button regularly to back up your data.
- Works offline after first load (you can add a service worker later if you want).
- To customize the price, open `script.js` and change `const PRICE = 40;`

Enjoy tracking with MintyLedger! ✦