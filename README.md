# Eclipse Client Website — Static Vercel Deployment

This package is a **static-only** version of the Eclipse Client website. It contains no Node server, no API routes, no serverless functions, and no package manager scripts.

## Correct Vercel settings

The included `vercel.json` enforces:

- Framework: **Other** (`framework: null`)
- Build command: **None** (`buildCommand: null`)
- Install command: **None** (`installCommand: ""`)
- Output directory: **`public`**
- No API directory and no Vercel Functions

## Deploy to the existing Vercel project

1. Extract this ZIP.
2. Upload the **contents of this extracted folder** to the root of the GitHub repository connected to `eclipsesite-beige.vercel.app`.
3. Replace the old `vercel.json` with this one.
4. Delete obsolete root-level `package.json` and `server.mjs` from the GitHub repository if they are still present. Also remove any `api/` or `src/api/` directory if one was added for this static website. Do not delete the files inside `public/`.
5. Confirm `vercel.json` is at the repository root and `public/index.html` exists.
6. Commit to the production branch (`main`). Vercel should create a new production deployment.

If you need to confirm Dashboard settings, open Project → Settings → Build and Deployment:

- Framework Preset: **Other**
- Root Directory: `.`
- Build Command: leave blank / disabled
- Install Command: leave blank / disabled
- Output Directory: `public`

The file-based settings above should take precedence for the new deployment, but the Dashboard values should match.

## Verify the deployment

After the new deployment is Ready, open:

- `/` — homepage
- `/download` — download page
- `/privacy` — privacy page
- `/terms` — terms page
- `/assets/ec-logo.png` — EC logo asset

A static-only deployment should serve these as static files and should not need any Function Invocations for ordinary page loads. If the deployment still reports Function Invocations, inspect Project → Logs → Runtime Logs and share the first error message; it means the project still has a function/server configuration outside this package or the deployment did not use this root.

## Configure the real Windows installer

Edit `public/config.js` and set `windowsDownloadUrl` only after the actual Windows installer is uploaded to a stable release URL. Do not link the launcher source ZIP as an installer.
