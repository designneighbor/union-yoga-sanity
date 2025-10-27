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
   NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id_here
   NEXT_PUBLIC_SANITY_DATASET=production
   NEXT_PUBLIC_SANITY_API_VERSION=2025-09-28
   SANITY_API_WRITE_TOKEN=your_sanity_write_token_here
   RESEND_API_KEY=your_resend_api_key_here
   ```

   **Sanity Write Token Setup:**
   - Go to your Sanity project settings at [sanity.io](https://sanity.io)
   - Navigate to "API" section
   - Create a new token with "Editor" permissions
   - Add the token to your Vercel environment variables
   - This is required for storing form submissions in Sanity

   **Resend Setup:**
   - Sign up for a Resend account at [resend.com](https://resend.com)
   - Create an API key in your Resend dashboard
   - Add the API key to your Vercel environment variables
   - This is required for form submission email functionality

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

### Monitoring

After deployment, monitor:

- Build logs in Vercel dashboard
- Function execution times
- Page load performance
- Sanity API response times
