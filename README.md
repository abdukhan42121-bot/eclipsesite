# Eclipse Client Website

A premium, responsive static website for the Eclipse Client Minecraft launcher. Includes the EC logo, launcher showcase, feature sections, interactive tabs, FAQ accordions, download page, privacy and terms pages.

## Run locally

Requires Node.js 18+ (no npm packages required):

```bash
npm run dev
```

Open http://localhost:4173.

You can also open `index.html` directly, but the local server is recommended so clean routes such as `/download` work.

## Deploy to Vercel

1. Create a new GitHub repository and upload the **contents** of this folder.
2. In Vercel, select **Add New → Project** and import the repository.
3. Set Framework Preset to **Other**.
4. Leave Build Command empty. Set Output Directory to `.` (project root).
5. Click Deploy.

This is a static site; no database or environment variables are required.

## Connect the real installer

The launcher source archive available when this website was built identifies version `0.7.1`, but it is an installer-builder source ZIP, not the finished Windows Setup EXE. Do not link that source ZIP as an end-user installer.

After building and publishing the actual Windows installer (for example, as a GitHub Release asset), edit `config.js`:

```js
window.ECLIPSE_SITE_CONFIG = {
  launcherVersion: "0.7.1",
  releaseLabel: "Public release",
  windowsDownloadUrl: "https://your-real-hosted-installer-url/Eclipse-Client-Setup-0.7.1-x64.exe",
  discordUrl: "",
  supportUrl: "",
  releaseNotesUrl: ""
};
```

Replace the example URL with the actual direct installer URL. Once configured, all Get Eclipse buttons and `/download` will take visitors to the installer. Do not publish an example URL.

## Configure community links

Set `discordUrl`, `supportUrl`, and `releaseNotesUrl` in `config.js` when you have the official destinations. They are intentionally not fabricated.

## Included pages

- `/` — marketing homepage
- `/download` — Windows download status and configured installer link
- `/privacy` — website and launcher privacy notes
- `/terms` — project/third-party content terms
