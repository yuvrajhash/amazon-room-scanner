# Deploying Amazon Room Scanner to Netlify

This guide provides instructions for deploying the Amazon Room Scanner application to Netlify, making it accessible online with a custom domain.

## Prerequisites

- A [Netlify](https://www.netlify.com/) account
- Git repository with your project (optional for continuous deployment)

## Deployment Options

### Option 1: Deploy from the Netlify UI (Easiest)

1. Log in to your Netlify account
2. Click the "Add new site" button and select "Import an existing project"
3. Connect to your Git provider (GitHub, GitLab, Bitbucket) or upload the files directly
4. Configure the build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
5. Click "Deploy site"

### Option 2: Deploy using Netlify CLI

1. Install the Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Log in to your Netlify account:
   ```bash
   netlify login
   ```

3. Initialize your site:
   ```bash
   netlify init
   ```

4. Follow the prompts to configure your site

5. Deploy your site:
   ```bash
   netlify deploy --prod
   ```

## Configuration

A `netlify.toml` file has been created in the project root with the following configuration:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NETLIFY_NEXT_PLUGIN_SKIP = "true"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[dev]
  command = "npm run dev"
  port = 3000
  targetPort = 3000
```

This configuration:
- Sets the build command to `npm run build`
- Specifies the publish directory as `.next`
- Includes the Next.js plugin for Netlify
- Configures redirects for client-side routing

## Custom Domain

After deployment, you can configure a custom domain:

1. Go to your site settings in Netlify
2. Navigate to the "Domain management" section
3. Click "Add custom domain"
4. Follow the instructions to set up your domain

## Environment Variables

If your application requires environment variables:

1. Go to your site settings in Netlify
2. Navigate to the "Environment" section
3. Add your environment variables

## Continuous Deployment

Netlify automatically sets up continuous deployment when you connect to a Git repository. Any changes pushed to your main branch will trigger a new build and deployment.

## Troubleshooting

- If you encounter build errors, check the build logs in Netlify
- Ensure all dependencies are properly listed in your package.json
- For Next.js specific issues, refer to the [@netlify/plugin-nextjs](https://github.com/netlify/netlify-plugin-nextjs) documentation

## Local Testing

Before deploying, test your build locally:

```bash
npm run build
npm run start
```

This ensures your application builds correctly and functions as expected in a production environment.