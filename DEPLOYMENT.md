# Deployment Guide

## Vercel Deployment

This project is optimized for deployment on Vercel with Sanity CMS integration.

### Prerequisites

1. **Sanity Project Setup**
   - Create a Sanity project at [sanity.io](https://sanity.io)
   - Note your Project ID and Dataset name

2. **Environment Variables**
   Set the following environment variables in your Vercel project settings:

   ```
   # Sanity Configuration
   NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id_here
   NEXT_PUBLIC_SANITY_DATASET=production
   NEXT_PUBLIC_SANITY_API_VERSION=2025-09-28
   SANITY_API_WRITE_TOKEN=your_sanity_write_token_here
   SANITY_API_READ_TOKEN=your_sanity_read_token_here

   # Newsletter Configuration
   RESEND_API_KEY=re_your_resend_api_key_here
   NEWSLETTER_FROM_EMAIL="Union Yoga <no-reply@yourdomain.com>"
   NEXT_PUBLIC_SITE_URL=https://your-site.vercel.app

   # Optional: Scheduled Newsletter Security
   CRON_SECRET=your_random_secret_here
   ```

   **Sanity Write Token Setup:**
   - Go to your Sanity project settings at [sanity.io](https://sanity.io)
   - Navigate to "API" section
   - Create a new token with "Editor" permissions
   - Add the token to your Vercel environment variables
   - This is required for storing form submissions and newsletter data in Sanity

   **Resend Setup:**
   - Sign up for a Resend account at [resend.com](https://resend.com)
   - Create an API key in your Resend dashboard
   - Add the API key to your Vercel environment variables
   - **Domain Verification (Required):**
     - Go to Resend Dashboard → Domains
     - Add and verify your sending domain
     - Add the required DNS records (SPF, DKIM, DMARC)
     - Use the verified domain in `NEWSLETTER_FROM_EMAIL`
   - This is required for newsletter confirmation emails and sending

   **Site URL Setup:**
   - Set `NEXT_PUBLIC_SITE_URL` to your production/staging URL
   - **Do NOT use localhost** - confirmation links won't work
   - Example: `https://your-site.vercel.app` or `https://yourdomain.com`
   - Used for confirmation and unsubscribe links in emails

   **Cron Secret (Optional):**
   - Generate a random secret string for securing scheduled newsletter endpoint
   - Only needed if using scheduled newsletter sends
   - Example: `openssl rand -hex 32`

### Deployment Steps

1. **Connect to Vercel**
   - Import your GitHub repository to Vercel
   - Vercel will automatically detect this as a Next.js project

2. **Configure Environment Variables**
   - Go to your Vercel project settings
   - Add the environment variables listed above
   - Make sure to set them for Production, Preview, and Development environments

3. **Deploy**
   - Vercel will automatically build and deploy your project
   - The build process includes:
     - Sanity schema type generation
     - Next.js build optimization
     - Static page generation

4. **Configure Scheduled Newsletters (Optional)**
   - The `vercel.json` includes a cron job that runs every 5 minutes
   - This automatically processes scheduled newsletters
   - The cron job calls `/api/newsletters/scheduled`
   - If you set `CRON_SECRET`, the endpoint will require authentication
   - To customize the schedule, edit the `crons` section in `vercel.json`

5. **Configure Resend Webhooks (Optional)**
   - For email tracking (opens, clicks), set up Resend webhooks
   - Go to Resend Dashboard → Webhooks
   - Add webhook URL: `https://your-site.vercel.app/api/newsletters/webhook`
   - Select events: `email.opened`, `email.clicked`, `email.delivered`
   - This enables newsletter statistics in Sanity Studio

### Build Configuration

The project includes several optimizations for Vercel:

- **Automatic Type Generation**: Sanity types are generated before each build
- **Image Optimization**: Configured for Sanity CDN images
- **Bundle Optimization**: Package imports are optimized for better performance
- **Static Generation**: Pages are pre-rendered for optimal performance

### Troubleshooting

**Build Failures:**
- Ensure all environment variables are set correctly
- Check that your Sanity project is accessible
- Verify that the dataset exists and has content

**Runtime Errors:**
- Check browser console for missing environment variables
- Verify Sanity project permissions
- Ensure API version compatibility

### Performance Optimization

The deployment includes several performance optimizations:

- Static page generation for better SEO
- Image optimization through Next.js Image component
- Bundle splitting and tree shaking
- CDN caching for static assets

### Newsletter Features

After deployment, you can:

- **Create Newsletters**: Use Sanity Studio → Newsletter section
- **Send Test Emails**: Use "Send Test Email" action in newsletter document
- **Preview Newsletters**: Use "View in Browser" action
- **Send to Subscribers**: Use "Send Newsletter" action
- **Schedule Sends**: Use "Schedule Send" action (requires cron job)
- **Manage Subscribers**: View and manage in Newsletter → Subscribers section

### Monitoring

After deployment, monitor:

- Build logs in Vercel dashboard
- Function execution times
- Page load performance
- Sanity API response times
- Newsletter send success rates (check Resend dashboard)
- Email delivery rates
- Subscriber confirmation rates

### Troubleshooting Newsletter Issues

**Emails not sending:**
- Verify `RESEND_API_KEY` is set correctly
- Check that `NEWSLETTER_FROM_EMAIL` uses a verified domain
- Review Resend dashboard for error messages
- Check server logs for API errors

**Confirmation emails not arriving:**
- Verify domain is verified in Resend
- Check spam/junk folders
- Ensure `NEXT_PUBLIC_SITE_URL` is set to a public URL (not localhost)
- Check Resend dashboard for delivery status

**Scheduled newsletters not sending:**
- Verify cron job is configured in `vercel.json`
- Check Vercel cron job logs
- Ensure `CRON_SECRET` matches if authentication is enabled
- Verify newsletter status is set to "scheduled"
