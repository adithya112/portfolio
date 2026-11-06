# Adithya G S — Engineering Portfolio

A personal portfolio for a Full Stack Engineer focused on backend architecture, distributed systems, and production reliability. Includes engineering case studies, technical writing, and a downloadable resume.

Built with Next.js, TypeScript, Tailwind CSS, and MDX.

## Run locally

Requires Node.js 22 or newer.

```sh
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000).

## Checks

```sh
npm run format:check
npm run lint
npm run typecheck
npm test
npx playwright install chromium
npm run test:e2e
```

The browser suite builds the production site. To build separately, run `npm run build`; serve it with `npm start`.

## Deployment configuration

Use `.env.example` as a reference. Set `NEXT_PUBLIC_SITE_URL` to the actual permanent HTTPS production origin after Vercel assigns it, then rebuild. Use that same origin in the Production and Preview environment scopes.

Preview deployments remain non-indexable. Search indexing is enabled only for Vercel production builds with a configured origin.

## Content

- Case studies and articles: `src/content/`
- Profile and portfolio data: `src/data/`
- Resume PDF: `public/resume.pdf`
