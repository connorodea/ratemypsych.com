# Psychiatrist rating website

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/connorodeas-projects/v0-ratemypsych-com)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/q025ZQ6hSb5)

## Overview

This repository will stay in sync with your deployed chats on [v0.app](https://v0.app).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.app](https://v0.app).

## Deployment

Your project is live at:

**[https://vercel.com/connorodeas-projects/v0-ratemypsych-com](https://vercel.com/connorodeas-projects/v0-ratemypsych-com)**

## Local Development

1. Copy `.env.example` to `.env` and fill in `DATABASE_URL` and `NEXTAUTH_SECRET`.
2. Install dependencies: `pnpm install`
3. Generate Prisma client: `pnpm db:generate`
4. Run migrations: `pnpm db:migrate`
5. Start the dev server: `pnpm dev`

## Data Ingestion (NPPES)

Download and ingest NPPES data (psychiatry-focused) into Postgres:

```
pnpm ingest:nppes --url=https://download.cms.gov/nppes/NPPES_Data_Dissemination_YYYYMMDD.zip
```

You can also point to a local zip:

```
pnpm ingest:nppes --zip=/path/to/nppes.zip
```

The ingestion script filters for psychiatry taxonomy codes and upserts providers.
If no URL is provided, it will fetch the latest NPPES zip from the CMS index.

## Build your app

Continue building your app on:

**[https://v0.app/chat/q025ZQ6hSb5](https://v0.app/chat/q025ZQ6hSb5)**

## How It Works

1. Create and modify your project using [v0.app](https://v0.app)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository
