# Fixing the Eclipse Vercel 500 deployment

The prior project was a static HTML/CSS/JS website but also contained a custom Node HTTP server and Node start scripts. This replacement removes that runtime layer and serves only the contents of `public/` as static files.

The Vercel dashboard screenshot showed 5 Function Invocations and a 100% error rate. Ordinary requests to this static site should not invoke serverless functions. This package explicitly selects the Other framework, disables build/install commands, outputs `public/`, and includes no server or API files.

Follow `README.md` → “Deploy to the existing Vercel project”. If the domain still returns 500 after this commit is deployed, open Runtime Logs for the new deployment and share the first error. Also confirm the new deployment is attached to `eclipsesite-beige.vercel.app` under Domains.
