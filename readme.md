## ReelSync

Movie-night matcher with shared sessions, mood switches, and mini-games.

### Admin URL
- Local dev: `http://localhost:5173/#/admin`
- GitHub Pages build: `https://<your-gh-username>.github.io/ReelSync/#/admin`

### Prerequisites
- Node 18+
- TMDB read token in server env: `TMDB_READ_TOKEN`

### Setup & Run
1) Backend
```bash
cd ReelSync/server
npm install
TMDB_READ_TOKEN=... npm start   # runs on port 3002
```
2) Frontend
```bash
cd ReelSync/client
npm install
npm run dev   # Vite dev server (default 5173)
```
> API base is configured in `client/src/lib/api.ts` (currently points to the ngrok URL). Update to your server origin if needed.

### Seeding movies (with keywords)
- Use the Admin page button “Import 50 Popular” for a one-click seed.
- Or API call (PowerShell):
```powershell
Invoke-RestMethod -Method Post `
  -Uri http://localhost:3002/api/admin/seed-tmdb `
  -ContentType 'application/json' `
  -Body '{"pages":50,"type":"popular"}'
```

### Notes
- Keywords are stored in the DB and used to align recommendations with mood switches.
- Hollywood/Foreign switch uses origin country + language filters; mood switches add keyword-based matches.