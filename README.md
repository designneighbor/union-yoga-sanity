# Sanity and Next.js

This is a [Sanity.io](https://sanity.io) and [Next.js](https://nextjs.org) project created following a Course on [Sanity Learn](https://sanity.io/learn).

## Getting Started

First, run the development server:

```bash
npm run dev
```

- Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
- Open [http://localhost:3000/studio](http://localhost:3000/studio) to edit content.

## Environment Variables

This project requires the following environment variables to be set:

### Required for Production
- `NEXT_PUBLIC_SANITY_PROJECT_ID` - Your Sanity project ID
- `NEXT_PUBLIC_SANITY_DATASET` - Your Sanity dataset (usually "production")
- `SANITY_API_READ_TOKEN` - Sanity API token with read permissions

### Optional
- `NEXT_PUBLIC_SANITY_API_VERSION` - Sanity API version (defaults to "2025-09-28")

## Deployment

### Vercel Deployment

1. Set the required environment variables in your Vercel project settings
2. Deploy using Vercel CLI or connect your GitHub repository
3. The build process will automatically run `npm run typegen` before building

### Environment Variables for Vercel

Add these environment variables in your Vercel project dashboard:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=your_read_token_here
```

Make sure to generate the `SANITY_API_READ_TOKEN` in your Sanity project dashboard with appropriate read permissions.