# Deploy Eclipse Inferno Website

- Framework Preset: `Other`
- Root Directory: `.`
- Build Command: leave empty/disabled
- Install Command: leave empty/disabled
- Output Directory: `public`

Commit the project root to the connected production branch. This is a static site with no serverless functions. `vercel.json` contains the `/` to `/home` and `/versions` to `/releases` redirects.

The `/releases` page queries the public GitHub Releases API and Tags API at runtime. It features the latest stable release first, then lists every other published release and version-like source tag. Installer links appear only for releases with real `.exe` assets. If GitHub's API is temporarily unavailable or rate-limited, the page shows the configured current version fallback and links to the official GitHub Releases page.
