# Site Generator Dashboard

A clean, fast dashboard for generating tradie websites with one click.

## Features

- **Form-based site generation** - Enter client details, get a complete website
- **Auto-folder creation** - Sites saved to `../generated-sites/{slug}`
- **Template copying** - Automatically clones from `../trades-templates/builders-temp`
- **Config injection** - Writes custom `site-config.json` for each client
- **Sites listing** - View all generated sites in one place
- **Deployment stubs** - Ready for Vercel/Render API integration

## Quick Start

```bash
# 1. Install dependencies
cd dashboard
npm install

# 2. Run the dashboard
npm run dev

# 3. Open http://localhost:3001
```

## Usage

### Generate a New Site

1. Open the dashboard at `http://localhost:3001`
2. Fill in the client form:
   - Business Name (e.g., "ABC Plumbing")
   - Phone (e.g., "0400 000 000")
   - Suburb (e.g., "Brisbane")
   - Services (comma-separated)
   - Primary Color
   - Hero Title & Subtitle
3. Click **"Generate Website"**
4. Follow the displayed next steps to build and deploy

### View Generated Sites

- Click **"View All Sites"** or navigate to `/sites`
- See all previously generated projects
- Quick links to open folders

## Architecture

```
dashboard/
├── app/
│   ├── api/
│   │   ├── generate/route.ts    # POST: Creates new site
│   │   └── sites/route.ts       # GET: Lists all sites
│   ├── page.tsx                 # Main dashboard form
│   ├── sites/page.tsx           # Sites listing
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Tailwind styles
├── lib/
│   └── utils.ts                 # Utility functions
├── package.json
└── README.md
```

## API Endpoints

### POST /api/generate

Creates a new website from the template.

**Request Body:**
```json
{
  "businessName": "ABC Plumbing",
  "phone": "0400 000 000",
  "suburb": "Brisbane",
  "services": "Blocked Drains, Hot Water Systems, Emergency Plumbing",
  "primaryColor": "#0A84FF",
  "heroTitle": "Reliable Plumbing Services in Brisbane",
  "heroSubtitle": "Fast, affordable and trusted local plumbers"
}
```

**Response:**
```json
{
  "success": true,
  "project": {
    "name": "ABC Plumbing",
    "slug": "abc-plumbing",
    "path": "C:/Users/.../generated-sites/abc-plumbing",
    "configPath": "C:/Users/.../generated-sites/abc-plumbing/site-config.json"
  },
  "nextSteps": [
    "cd generated-sites/abc-plumbing",
    "npm install",
    "npm run build",
    "Deploy the 'dist' folder to your hosting provider"
  ]
}
```

### GET /api/sites

Lists all generated sites.

**Response:**
```json
{
  "sites": ["abc-plumbing", "joes-electrical", ...]
}
```

## Utility Functions

All in `lib/utils.ts`:

- `slugify(businessName)` - Convert to URL-friendly slug
- `parseServices(inputString)` - Parse comma-separated services
- `copyTemplate(source, destination)` - Copy template directory
- `writeConfigFile(path, data)` - Write site-config.json
- `generateSiteConfig(formData)` - Generate complete config object
- `deployToVercel(projectPath)` - Stub for Vercel deployment
- `deployToRender(projectPath)` - Stub for Render deployment
- `connectDomain(domainName)` - Stub for domain connection

## File System Operations

The dashboard performs these file operations:

1. **Copy Template** → `../trades-templates/builders-temp` to `../generated-sites/{slug}`
2. **Write Config** → Overwrites `site-config.json` with client data
3. **List Sites** → Reads `../generated-sites` directory

## Safety Features

- ✅ Validates all required fields
- ✅ Prevents overwriting existing projects
- ✅ Checks template exists before copying
- ✅ Returns clear error messages

## Future Enhancements

The following stubs are ready for implementation:

### Auto-Deployment

```typescript
// In lib/utils.ts - already stubbed:
deployToVercel(projectPath)    // TODO: Vercel API integration
deployToRender(projectPath)    // TODO: Render API integration
connectDomain(domainName)      // TODO: Domain API integration
```

### Database Logging

Could add SQLite to track:
- Generation history
- Deployment status
- Client contact info

## Port

Dashboard runs on **port 3001** (separate from template dev server).

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Node.js File System APIs
