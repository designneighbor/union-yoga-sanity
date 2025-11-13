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
- `SANITY_API_WRITE_TOKEN` - Sanity API token with write permissions (for forms and newsletters)

### Newsletter Feature (Required if using newsletters)
- `RESEND_API_KEY` - Resend API key for sending emails
- `NEWSLETTER_FROM_EMAIL` - From email address (must use verified domain)
- `NEXT_PUBLIC_SITE_URL` - Your site's public URL (not localhost)

### Optional
- `NEXT_PUBLIC_SANITY_API_VERSION` - Sanity API version (defaults to "2025-09-28")
- `CRON_SECRET` - Secret for securing scheduled newsletter endpoint

## Deployment

### Vercel Deployment

1. Set the required environment variables in your Vercel project settings
2. Deploy using Vercel CLI or connect your GitHub repository
3. The build process will automatically run `npm run typegen` before building

### Environment Variables for Vercel

Add these environment variables in your Vercel project dashboard:

```
# Sanity Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-09-28
SANITY_API_READ_TOKEN=your_read_token_here
SANITY_API_WRITE_TOKEN=your_write_token_here

# Newsletter Configuration
RESEND_API_KEY=re_your_resend_api_key_here
NEWSLETTER_FROM_EMAIL="Union Yoga <no-reply@yourdomain.com>"
NEXT_PUBLIC_SITE_URL=https://your-site.vercel.app

# Optional: Scheduled Newsletter Security
CRON_SECRET=your_random_secret_here
```

Make sure to:
- Generate the `SANITY_API_READ_TOKEN` and `SANITY_API_WRITE_TOKEN` in your Sanity project dashboard
- Verify your domain in Resend and use it in `NEWSLETTER_FROM_EMAIL`
- Set `NEXT_PUBLIC_SITE_URL` to your production URL (not localhost)

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed setup instructions.