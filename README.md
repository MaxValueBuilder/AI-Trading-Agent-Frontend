# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/2baa054a-ffff-42ee-bdbb-dcce7655cbfd

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/2baa054a-ffff-42ee-bdbb-dcce7655cbfd) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## Environment Setup

### Local Development

Create a `.env` file in the root directory with the following variables:

```env
# Backend API URL
VITE_BACKEND_URL=http://localhost:8000

# Firebase Configuration (if needed)
# VITE_FIREBASE_API_KEY=your_firebase_api_key
# VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
# VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
```

### Vercel Deployment

When deploying to Vercel, you need to set environment variables in the Vercel dashboard:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variable:
   - **Name**: `VITE_BACKEND_URL`
   - **Value**: Your production backend URL (e.g., `https://your-backend-domain.com`)
   - **Environment**: Select all environments (Production, Preview, Development)

**Important**:

- In Vite, environment variables must be prefixed with `VITE_` to be accessible in the client-side code
- After adding environment variables in Vercel, redeploy your application for changes to take effect

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/2baa054a-ffff-42ee-bdbb-dcce7655cbfd) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
