# Eclipse Client Website — Inferno Release Archive Edition

A static multi-page Vercel website using the Eclipse Inferno visual identity: obsidian black, burnt orange, vermilion red and warm titanium. No stock photography, AI-generated images, remote image embeds, backend APIs or serverless functions. Visuals are CSS-built and use the supplied EC pixel-art eclipse logo.

## Routes

- `/` redirects to `/home`
- `/home` — Inferno landing page
- `/features` — feature overview
- `/launcher` — launcher interface showcase
- `/releases` — live release archive; latest stable release first, previous releases and version tags below
- `/versions` — redirect to `/releases`
- `/download` — current installer and release-archive link
- `/requirements` — system requirements
- `/faq` — frequently asked questions
- `/support` — support information
- `/release-notes` — feature notes
- `/privacy` and `/terms` — policies

## Live version archive

`/releases` reads all published releases from the public GitHub Releases API and version-like Git tags from the public repository Tags API (up to 1,000 entries per endpoint, 100 per page). The official latest stable release is featured first. Every other published release and every additional version-like tag appears in the searchable archive. Published release entries link to their real attached assets; source-only tags are clearly labelled and link to the source archive/tag page instead of showing a made-up installer.

GitHub's List Releases endpoint excludes regular Git tags that do not have a Release, which is why the page separately reads the repository Tags endpoint. See [GitHub Releases API](https://docs.github.com/en/rest/releases/releases) and [Repository Tags API](https://docs.github.com/en/rest/repos/repos#list-repository-tags).

Update repository settings in `public/config.js` if the owner or repository changes. The public endpoint currently targets `abdukhan42121-bot/eclipsesite`.

## Installer

The pinned fallback remains `v0.7.1` and expects `Eclipse-Client-Setup-0.7.1-x64.exe`. When GitHub has a newer published stable release with an `.exe` attachment, the version badges and download button resolve to that actual release. Historical release rows only show an installer button when an actual `.exe` asset exists.

## Deploy to Vercel

1. Upload the contents of this project to the repository root.
2. In Vercel choose Framework Preset `Other`, Root Directory `.`, no Build Command, no Install Command, Output Directory `public`.
3. Deploy the production branch. There are no runtime functions, Node server, package installation or environment variables required.

## Validation

Static HTML/CSS/JS. The release history is fetched client-side from GitHub's public Releases and Tags APIs. Actual release data and attached files come from the repository; old versions are never hard-coded or fabricated.
