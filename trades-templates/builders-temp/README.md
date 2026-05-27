# Builders Template - Tradie Website System

A scalable, config-driven Next.js website template for tradie businesses.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## 📁 Project Structure

```
builders-temp/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout with SEO
│   └── page.tsx           # Homepage
├── components/             # React components
│   ├── Hero.tsx
│   ├── Services.tsx
│   ├── About.tsx
│   ├── Testimonial.tsx
│   ├── CTA.tsx
│   ├── ContactForm.tsx
│   ├── Footer.tsx
│   └── StickyCallButton.tsx
├── lib/                    # Utilities
│   ├── types.ts           # TypeScript types
│   └── config.ts          # Config loader
├── public/                 # Static assets
│   └── images/
├── site-config.json        # Business configuration ⭐
├── package.json
├── tailwind.config.ts
└── next.config.mjs
```

## ⚙️ Configuration

Edit `site-config.json` to customize everything:

```json
{
  "businessName": "Your Business Name",
  "phone": "0400 000 000",
  "email": "info@yourbusiness.com.au",
  "services": ["Service 1", "Service 2", "Service 3"],
  "suburb": "Your Suburb",
  "primaryColor": "#0A84FF",
  "heroTitle": "Your Hero Title",
  "heroSubtitle": "Your subtitle text",
  "testimonial": {
    "name": "Customer Name",
    "text": "Great service!",
    "location": "Suburb",
    "rating": 5
  }
}
```

## 🎨 Customization

### Change Colors
Edit `primaryColor` in `site-config.json`. All components automatically update.

### Add Services
Add/remove items in the `services` array in `site-config.json`.

### Change Images
1. Add images to `public/images/`
2. Update paths in `site-config.json`:
```json
{
  "images": {
    "hero": "/images/your-hero.jpg",
    "about": "/images/your-team.jpg",
    "logo": "/images/logo.png"
  }
}
```

### SEO
Edit the `seo` section in `site-config.json`:
```json
{
  "seo": {
    "title": "Page Title",
    "description": "Meta description",
    "keywords": "keyword1, keyword2"
  }
}
```

## 📱 Features

- ✅ Fully responsive (mobile-first)
- ✅ Config-driven (zero code changes needed)
- ✅ SEO optimized
- ✅ Fast loading (Lighthouse optimized)
- ✅ Contact form with API-ready structure
- ✅ Sticky mobile call button
- ✅ Dynamic primary colors
- ✅ Clean, modern tradie aesthetic

## 🌐 Deployment

### Static Export (Recommended)
Already configured in `next.config.mjs`:

```bash
npm run build
# Output in /dist folder
```

### Deploy to Render
1. Connect your GitHub repo to Render
2. Set build command: `npm install && npm run build`
3. Set publish directory: `dist`

### Deploy to Vercel
```bash
npm i -g vercel
vercel
```

### Deploy to Netlify
```bash
npm i -g netlify-cli
netlify deploy --prod --dir=dist
```

## � Deploy to GitHub Pages

This template is configured for automatic GitHub Pages deployment.

### Setup

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/username/builders-temp.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Source: GitHub Actions

3. **Auto-deploy**:
   - The included `.github/workflows/deploy.yml` will automatically deploy on every push to `main`
   - Site will be available at `https://username.github.io/builders-temp`

### Manual Build (Local Testing)

```bash
# Build static site
npm run build

# Test the static output
npx serve dist
```

### Environment Variables

For GitHub Pages, set these in your repository Settings → Secrets:
- None required! The workflow auto-configures basePath.

## �🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Export:** Static HTML

## 📝 Contact Form API Integration

The contact form is ready to connect to any API. Example:

```typescript
// In ContactForm.tsx, replace the console.log with:
const response = await fetch('/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    ...formData,
    to: config.email,
    businessName: config.businessName,
  }),
});
```

Popular options:
- [Resend](https://resend.com) - Email API
- [Web3Forms](https://web3forms.com) - Form backend
- [Formspree](https://formspree.io) - Form backend
- Custom Next.js API route

## 🔄 Creating New Client Sites

1. Copy the entire `builders-temp` folder
2. Rename it (e.g., `electricians-temp`)
3. Edit only `site-config.json`
4. Run `npm install && npm run build`
5. Deploy!

**No code changes required!**

## 📄 License

MIT - Use freely for client projects.
