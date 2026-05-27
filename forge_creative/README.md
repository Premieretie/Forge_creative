# Forge Creative

**Premium Brisbane Video Production Company Website**

A modern, premium, SEO-focused website for Forge Creative - a Brisbane-based video production company specializing in corporate videos, social media content, brand storytelling, and commercial content.

## Features

### Design & UX
- Dark cinematic aesthetic with premium feel
- Smooth Framer Motion animations
- Responsive design for all devices
- Cinematic grain texture overlay
- Scroll-triggered reveal animations
- Sticky transparent navigation
- Mobile hamburger menu

### SEO Optimization
- Proper H1/H2 heading hierarchy
- Semantic HTML structure
- Meta tags and Open Graph integration
- Schema.org LocalBusiness markup
- Optimized for Brisbane video production keywords
- Clean URL structure
- Mobile-first responsive design
- Fast loading with lazy loading

### Pages
- **Home Page**: Hero, Video Showcase, Services, About, Why Choose Us, Testimonials, CTA
- **Contact Page**: Contact form, business info, map section, social links

### Interactive Features
- Multi-step quote request modal (5 steps)
- Contact form with validation
- Testimonial carousel
- Service cards with hover animations
- Smooth scroll navigation

## Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **SEO**: React Helmet Async
- **Routing**: React Router DOM

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Navigate to the project directory:
```bash
cd C:\Users\User\Documents\StreamPulse\forge_creative
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The production build will be in the `dist/` folder.

## Project Structure

```
forge_creative/
├── public/
│   └── forge-favicon.svg
├── src/
│   ├── components/
│   │   ├── SEO.jsx          # SEO component with meta tags
│   │   ├── Navbar.jsx       # Navigation component
│   │   ├── Footer.jsx       # Footer component
│   │   └── QuoteModal.jsx   # Multi-step quote form modal
│   ├── pages/
│   │   ├── Home.jsx         # Home page with all sections
│   │   └── Contact.jsx      # Contact page
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles + Tailwind
├── index.html               # HTML template
├── package.json             # Dependencies
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind configuration
└── postcss.config.js        # PostCSS configuration
```

## SEO Keywords Targeted

Primary Keywords:
- Brisbane Video Production
- Corporate Video Production Brisbane
- Brisbane Videographer
- Social Media Content Brisbane
- Brisbane Content Creation
- Corporate Videographer Brisbane

## Customization

### Updating Contact Information
Edit the contact details in:
- `src/pages/Contact.jsx` - Contact info and form
- `src/components/Footer.jsx` - Footer contact info
- `src/components/SEO.jsx` - Schema.org data

### Adding Video Content
Replace the placeholder in the Video Showcase section (`src/pages/Home.jsx`) with your actual video embed:

```jsx
<iframe 
  src="https://www.youtube.com/embed/YOUR_VIDEO_ID?autoplay=1&mute=1&loop=1"
  title="Forge Creative Showreel"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
  className="absolute inset-0 w-full h-full"
/>
```

### Updating Brand Colors
Edit the custom colors in `tailwind.config.js`:

```javascript
colors: {
  forge: {
    black: '#0a0a0a',
    charcoal: '#141414',
    dark: '#1a1a1a',
    gray: '#2a2a2a',
    light: '#3a3a3a',
    accent: '#c9a962',  // Change this for new accent color
    gold: '#d4af37',
  }
}
```

### Adding Real Google Maps
Uncomment and replace the placeholder in `src/pages/Contact.jsx`:

```jsx
<iframe
  src="https://www.google.com/maps/embed?pb=YOUR_MAP_EMBED_URL"
  width="100%"
  height="100%"
  style={{ border: 0 }}
  allowFullScreen
  loading="lazy"
  referrerPolicy="no-referrer-when-downgrade"
  title="Forge Creative Brisbane Location"
/>
```

## Deployment

### Building for Production
```bash
npm run build
```

### Deploy Options

**Netlify/Vercel:**
1. Connect your GitHub repository
2. Build command: `npm run build`
3. Publish directory: `dist`

**GitHub Pages (Configured):**
1. Repository already configured with:
   - `vite.config.js` base path: `/forge-creative/`
   - `HashRouter` for static hosting compatibility
   - GitHub Actions workflow in `.github/workflows/deploy.yml`

2. See **DEPLOYMENT.md** for detailed setup instructions.

3. Quick Deploy:
```bash
git add .
git commit -m "Ready for GitHub Pages"
git push origin main
```

4. Enable GitHub Pages in repository settings → Pages → GitHub Actions

5. Site will be live at: `https://YOUR_USERNAME.github.io/forge-creative/`

**Traditional Hosting:**
Upload the contents of the `dist/` folder to your web server.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Accessibility

- Semantic HTML5 structure
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus visible indicators
- Reduced motion support for animations
- Alt text on images
- Proper heading hierarchy

## License

© 2024 Forge Creative. All rights reserved.
