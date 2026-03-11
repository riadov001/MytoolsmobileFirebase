# Deployment Guide — MyTools Admin Marketing Site

## Build Information
- **Status:** ✅ Production-ready
- **Build Date:** March 2026
- **Output Directory:** `/out`
- **Build Size:** ~2.5 MB
- **Static Pages:** 4 (Home, Privacy, Support, 404)

## What's Inside
The `/out` directory contains a fully static website ready to deploy:
- Pre-rendered HTML files (no server runtime required)
- Optimized CSS and JavaScript
- Automatic image optimization
- SEO-ready metadata

## Deploy to Vercel (Recommended)
Vercel has built-in Next.js support and will auto-detect the export.

```bash
npm install -g vercel
cd marketing-site
vercel deploy --prod
```

## Deploy to Netlify
```bash
npm install -g netlify-cli
cd marketing-site
netlify deploy --prod --dir=out
```

## Deploy to Static Hosting
(AWS S3, Cloudflare Pages, GitHub Pages, Firebase Hosting, etc.)

1. Sync the `/out` directory to your host:
```bash
# AWS S3 example
aws s3 sync marketing-site/out s3://my-bucket --delete

# GitHub Pages
cp -r marketing-site/out/* ./docs/
git add ./docs
git commit -m "Deploy marketing site"
git push
```

2. Configure domain and TLS (handled automatically by most providers)

## Custom Domain
Update the canonical URL in `app/layout.tsx`:
```typescript
metadataBase: new URL("https://your-domain.com"),
```

Then rebuild:
```bash
cd marketing-site
npm run build
```

## Environment Variables
**No environment variables required.** This is a static site with no server-side logic.

## What Gets Built
- `/` — Homepage (Hero + Features + How it Works + CTA)
- `/privacy/` — RGPD Privacy Policy
- `/support/` — Support page + FAQ
- `/404.html` — Custom 404 page

## Performance
- **First Load JS:** ~131 KB (split across 4 routes)
- **Route-specific:** 88-131 KB depending on page
- **Static assets:** Automatically optimized

## Monitoring
After deployment, monitor:
- Page load speed (use Lighthouse)
- Google Search Console (for indexing)
- Domain SSL/TLS certificate
- Email contact form (if you add one)

## Updates
To update the site:
1. Make code changes locally
2. Run `npm run build`
3. Re-deploy `/out` directory to your hosting

## Support
For questions about Next.js or the build process, see:
- `/marketing-site/README.md` — Development setup
- `next.config.js` — Build configuration
- `package.json` — Dependencies
