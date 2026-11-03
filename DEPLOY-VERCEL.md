# Vercel deployment checklist

- [ ] Upload this folder's contents to the repository root.
- [ ] Ensure `vercel.json` is at repository root.
- [ ] Ensure `public/home/index.html` and the other route directories exist.
- [ ] Remove old `package.json`, `server.mjs`, `api/` and server functions.
- [ ] Framework Preset: Other.
- [ ] Root Directory: `.`.
- [ ] Build Command: blank/disabled.
- [ ] Install Command: blank/disabled.
- [ ] Output Directory: `public`.
- [ ] Check `/home`, `/features`, `/launcher`, `/download`, `/requirements`, `/faq`, `/release-notes`, `/support`, `/privacy`, `/terms`.
- [ ] Confirm the GitHub Release includes the exact Setup EXE filename configured in `public/config.js`.

The site is static-only: normal page loads do not require serverless function invocations.
