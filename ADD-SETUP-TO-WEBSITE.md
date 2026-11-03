# Add the Eclipse Windows Setup to the website

The website's download buttons are configured to use this GitHub Release asset URL:

`https://github.com/abdukhan42121-bot/eclipsesite/releases/download/v0.7.1/Eclipse-Client-Setup-0.7.1-x64.exe`

The asset must exist at that exact release/tag and filename before the button can download it.

## 1. Build the actual Windows installer

1. Download and extract `Eclipse-Client-Launcher-Setup-Builder-0.7.1.zip`.
2. Install Node.js 22.12 or newer on the Windows build computer.
3. Open the extracted `Eclipse-Client-Launcher-0.7.1` folder.
4. Double-click `BUILD-SETUP-WINDOWS.bat` and allow it to finish.
5. The expected installer is `dist\Eclipse-Client-Setup-0.7.1-x64.exe`.

The builder ZIP is source code, not the finished installer. Only upload the `.exe` produced in the `dist` folder.

## 2. Publish the installer as a GitHub Release asset

1. Open `https://github.com/abdukhan42121-bot/eclipsesite`.
2. Open **Releases** and choose **Draft a new release**.
3. Create/select the tag `v0.7.1`.
4. Set the release title to `Eclipse Client v0.7.1`.
5. Attach the file `Eclipse-Client-Setup-0.7.1-x64.exe` from the builder's `dist` folder.
6. Publish the release.

GitHub Release assets are preferable to adding a large installer directly to the website repository. Browser uploads to ordinary GitHub repository files are limited to 25 MiB per file; GitHub documents a 100 MiB hard limit for ordinary Git objects.

## 3. Redeploy the website

If this website package is already deployed, no website code change is needed because `public/config.js` already points to the release URL. Make sure the installer is published at the exact tag and filename above, then open:

`https://eclipsesite-beige.vercel.app/download`

Test the button and confirm that it downloads the `.exe`.

## 4. If the installer version changes

When publishing a newer installer, update `launcherVersion` and `windowsDownloadUrl` in `public/config.js` to match the new GitHub Release tag and exact asset filename, then commit/push the website changes to trigger a Vercel deployment.
