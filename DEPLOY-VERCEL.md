# Deploy Eclipse Client Website to Vercel

## 1) Create a GitHub repository

- Extract `Eclipse-Client-Website.zip`.
- Create a new repository, such as `eclipse-client-website`.
- Upload the **contents** of the extracted folder. `index.html`, `vercel.json`, `config.js`, and `assets/` must be at the repository root (do not add an extra parent folder).

## 2) Import to Vercel

- Open Vercel and choose **Add New → Project**.
- Import the new GitHub repository.
- Choose **Other** as the Framework Preset.
- Leave Build Command blank.
- Set Output Directory to `.`.
- Deploy.

No database, API keys, or environment variables are needed for this static website.

## 3) Configure your real download

The website's download action is intentionally not linked to a fake or unbuilt installer. The launcher project available at the time of packaging is a source/installer-builder archive; it does not contain a public Windows Setup EXE.

After building and publishing the real Windows installer, edit `config.js` and set:

```js
windowsDownloadUrl: "https://your-real-release-host/Eclipse-Client-Setup-0.7.1-x64.exe"
```

Replace the example URL with the actual direct link, then commit and redeploy. The header, hero, download section, mobile menu, and `/download` page all use the same configuration.

## 4) Add community/support URLs

The footer can show your real links when these fields are set in `config.js`:

```js
discordUrl: "https://discord.gg/your-real-invite",
supportUrl: "https://your-support-destination",
releaseNotesUrl: "https://your-release-notes-page"
```

Empty fields remain hidden. No community URL, support email, or domain has been invented.

## Local preview

Install Node.js 18+ and run `npm run dev`, then open `http://localhost:4173`. No npm packages are required.
