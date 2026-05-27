# Forge Creative - GitHub Pages Deployment Guide

## Architecture Overview

```
┌─────────────────┐      ┌──────────────────┐
│   GitHub        │──────▶│   GitHub Pages   │
│  (Repository)   │      │  (Static Hosting)│
└─────────────────┘      └──────────────────┘
                                │
                                ▼
                    https://username.github.io/forge-creative
```

---

## Prerequisites

- GitHub repository with the Forge Creative code
- Node.js 18+ installed locally
- Git configured on your machine

---

## 1. Local Setup & Build Test

### Step 1: Install Dependencies

```powershell
cd C:\Users\User\Documents\StreamPulse\forge_creative
npm install
```

### Step 2: Test Build Locally

```powershell
npm run build
```

This should create a `dist/` folder with the production build.

### Step 3: Preview Build Locally (Optional)

```powershell
npm run preview
```

Open http://localhost:4173 to preview the production build.

---

## 2. GitHub Repository Setup

### Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. **Repository name**: `forge-creative`
3. **Visibility**: Public (for free GitHub Pages)
4. **Initialize**: DO NOT add README (we already have one)
5. Click **Create repository**

### Step 2: Push Code to GitHub

```powershell
cd C:\Users\User\Documents\StreamPulse\forge_creative

# Initialize git (if not already done)
git init

# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/forge-creative.git

# Add all files
git add .

# Commit
git commit -m "Initial commit: Forge Creative website ready for GitHub Pages"

# Push to main branch
git branch -M main
git push -u origin main
```

---

## 3. GitHub Pages Configuration

### Step 1: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** tab
3. Scroll down to **Pages** section (or click "Pages" in left sidebar)
4. Under **Build and deployment**:
   - **Source**: Select "GitHub Actions"

### Step 2: Verify Workflow

1. Go to **Actions** tab in your repository
2. You should see the "Deploy to GitHub Pages" workflow
3. Click on it, then click **Run workflow** → **Run workflow**
4. Wait for the workflow to complete (green checkmark)

---

## 4. Access Your Deployed Site

Once the workflow completes successfully, your site will be available at:

```
https://YOUR_USERNAME.github.io/forge-creative/
```

**Important Notes:**
- ✅ URL uses `#/` for routing (e.g., `/#/contact`) - this is normal for HashRouter
- ✅ SEO still works perfectly with HashRouter
- ✅ All pages (Home, Contact) will work correctly

---

## 5. Making Updates

After making changes locally:

```powershell
# Make your edits...

# Build to verify
cd C:\Users\User\Documents\StreamPulse\forge_creative
npm run build

# Commit and push
git add .
git commit -m "Description of changes"
git push origin main
```

The GitHub Actions workflow will automatically rebuild and redeploy!

---

## Configuration Summary

### Files Modified for GitHub Pages

| File | Change |
|------|--------|
| `vite.config.js` | `base: '/forge-creative/'` |
| `src/main.jsx` | Uses `HashRouter` instead of `BrowserRouter` |
| `src/App.jsx` | Added `ScrollToTop` component |
| `.github/workflows/deploy.yml` | GitHub Actions workflow |

### Why HashRouter?

GitHub Pages is a **static file host** - it doesn't support server-side routing. When you refresh a page at `/contact`, GitHub would return a 404.

**HashRouter** solves this by using the URL hash (`/#/contact`), which works perfectly on static hosts while maintaining full React Router functionality.

---

## Troubleshooting

### Issue: Site shows 404

**Solution**: 
1. Check that GitHub Pages is enabled in Settings → Pages
2. Ensure Source is set to "GitHub Actions"
3. Check the Actions tab for any build errors

### Issue: Assets not loading (blank page)

**Solution**: 
- Verify `vite.config.js` has `base: '/forge-creative/'`
- Repository name MUST match the base path

### Issue: Images not showing

**Solution**: 
- Use relative paths or absolute URLs
- For local images, place them in `public/` folder

### Issue: Routes not working

**Solution**: 
- Ensure you're using HashRouter
- URLs will look like `/#/contact` - this is correct!

---

## Custom Domain (Optional)

To use a custom domain like `forgecreative.com.au`:

1. In your repository: Settings → Pages → Custom domain
2. Enter your domain
3. Add DNS records (A records pointing to GitHub Pages IPs)
4. Wait for DNS propagation
5. Update `vite.config.js`:

```javascript
export default defineConfig({
  base: '/',  // Change to '/' for custom domain
  // ... rest of config
})
```

---

## Support

- GitHub Pages docs: https://docs.github.com/en/pages
- React Router HashRouter: https://reactrouter.com/en/main/router-components/hash-router
