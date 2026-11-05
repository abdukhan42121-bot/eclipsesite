# Eclipse Client Website — Inferno · Live 1.0.0 Release Feed

This is the static Vercel website project for Eclipse Client.

## Live release connection

The `/releases` page fetches published release records from the **public distribution repository** `abdukhan42121-bot/eclipsesite`:

- Latest stable GitHub Release is featured at the top.
- Other published releases appear in the searchable Previous Versions archive.
- Installer buttons are generated only from actual `.exe` assets attached to each release.
- `latest.yml` and other attached files are linked directly from the matching GitHub release.
- Version badges and the download link across the site update from the latest stable release feed.

The launcher source repository `abdukhan42121-bot/eclipse-client-launcher` is private. The website intentionally does not fetch from it because visitors cannot access private GitHub release APIs or private assets. Keep source code private and publish only the installer/update metadata to the public `eclipsesite` repository.

## Release publishing requirement

In the launcher repository, configure Electron Builder's GitHub publisher target as:

```json
"publish": [
  {
    "provider": "github",
    "owner": "abdukhan42121-bot",
    "repo": "eclipsesite",
    "releaseType": "release"
  }
]
```

The launcher repository's Actions workflow must set `GH_TOKEN` to a fine-grained personal access token secret named `WEBSITE_RELEASE_TOKEN`. That token should be restricted to the `eclipsesite` repository and have **Contents: Read and write** permission. Do not put the token in source code or the website. The workflow's existing `contents: write` permission is not a substitute for this token when publishing to a different repository.

Once a release with tag `v1.0.0` and the installer asset `Eclipse-Client-Setup-1.0.0-x64.exe` has been published to `eclipsesite`, the site will feature it automatically. Future stable releases published there will automatically move to the top, and the previous stable releases will move into the archive. Draft releases are not shown publicly.

## Deploy

1. Replace the website repository's files with the contents of this project (preserve the existing repository structure).
2. Commit and push to the Vercel-connected `main` branch.
3. Vercel should redeploy automatically. The project uses Framework Preset `Other`, no build/install command, and `public` as the output directory.

## Site URL

https://eclipsesite-beige.vercel.app
