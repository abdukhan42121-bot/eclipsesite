# Eclipse Client Website — Luxury Static Vercel Edition

A multi-page, responsive website for Eclipse Client. The design uses the real EC logo supplied with the launcher and CSS-built interface illustrations. There are **no stock photos, AI-generated images, remote image embeds, backend APIs, or serverless functions**.

## Routes

- `/home` — homepage (the root `/` redirects here)
- `/features` — launcher features
- `/launcher` — interface overview
- `/download` — Windows installer
- `/requirements` — system and installation requirements
- `/faq` — frequently asked questions
- `/release-notes` — current release information
- `/support` — support and guidance
- `/privacy` — privacy notice
- `/terms` — terms of use

Each route is a static directory with its own `index.html`, so the endpoints remain readable and shareable. Shared CSS, JavaScript and the EC logo are served from `/styles.css`, `/app.js` and `/assets/`.

## Installer connection

`public/config.js` currently points to:

`https://github.com/abdukhan42121-bot/eclipsesite/releases/download/v0.7.1/Eclipse-Client-Setup-0.7.1-x64.exe`

The GitHub Release must contain an uploaded asset with this exact filename under tag `v0.7.1`. GitHub's automatically generated "Source code" archives are not the installer. If you use a different tag or filename, update `windowsDownloadUrl`, `downloadFileName` and `launcherVersion` in `public/config.js`.

## Deploy to Vercel

1. Extract this ZIP.
2. Upload the **contents** of this folder to the root of the GitHub repository connected to `eclipsesite-beige.vercel.app`, replacing old website files.
3. Remove obsolete root-level `package.json`, `server.mjs`, `api/`, or other server runtime files if they are still present. This project is static-only.
4. In Vercel Project Settings → Build & Deployment use Framework Preset `Other`, Root Directory `.`, leave Build Command empty/disabled, Install Command empty/disabled, and set Output Directory to `public`.
5. Commit to the production branch (for example `main`) and let Vercel deploy.

No Node.js build, install command, environment variable, database or API endpoint is required for the website itself.

## Local preview

From the project root, run a static server from `public`, for example:

```bash
npx serve public
```

For local clean URLs, use a static server that supports directory index files. The production Vercel project uses `public` as its output directory.

## Honest feature and legal boundaries

The site describes documented launcher features. Microsoft authentication, Modrinth content, Discord Rich Presence and any supported skin provider remain third-party integrations. Local skin files are not automatically public. A local profile does not bypass premium-authentication requirements on servers. The current installer is documented as unsigned; do not ask users to disable Windows security features.
