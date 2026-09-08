# Landslide Early Warning System — Dima Hasao

A demo-ready React + Vite + Tailwind CSS dashboard for monitoring landslide risk in Dima Hasao district, Assam. The application uses realistic mock data and does not require a live backend or external API.

## Requirements

- Node.js 18 or newer
- pnpm 10 or newer (recommended)
- Git, if cloning the repository

The project dependencies are managed in `package.json` and locked in `pnpm-lock.yaml`. The `require.txt` file documents the runtime requirements for this frontend project.

## Install and run locally

```bash
# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

Open the local URL shown by Vite in the terminal. The development server serves the React dashboard and Express server together.

## Production build

```bash
pnpm build
pnpm start
```

`pnpm build` creates the client bundle and server bundle. `pnpm start` serves the production build.

## Quality checks

```bash
pnpm typecheck
pnpm test
```

## Project structure

- `client/pages/Index.tsx` — dashboard shell and all four views
- `client/mockData.js` — editable village, rainfall, alert, and report data
- `client/global.css` — global styles and design tokens
- `tailwind.config.ts` — Tailwind theme configuration
- `server/` — Express server integration and example API route

## Updating demo data

Edit `client/mockData.js` to change village names, risk levels, rainfall values, road statuses, alerts, and citizen reports. No database or API setup is needed for the prototype.

## Environment variables

The current dashboard does not require external API keys. If the Builder public key is used by the surrounding project tooling, configure it in `.env` as `VITE_PUBLIC_BUILDER_KEY`.
