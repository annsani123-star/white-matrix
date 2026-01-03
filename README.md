# Voting Platform

A full-stack voting application built with Next.js, Express, and MongoDB that allows users to vote for candidates across different teams with multiple authentication options.

## Features

- 🔐 **Multiple Authentication Methods**
  - Google OAuth 2.0
  - LinkedIn OpenID Connect
  - Email/Password (with bcrypt)
  
- 🗳️ **Voting System**
  - Vote for candidates across different teams
  - One vote per user
  - Real-time vote counting
  
- 📊 **Dashboard**
  - Live leaderboard showing top candidates
  - View all voted users with LinkedIn profiles
  - Responsive 3-column layout
  
- 🔑 **Password Reset**
  - Forgot password functionality
  - Email-based password reset with secure tokens
  - HTML email templates with Nodemailer
  
- 👤 **User Profiles**
  - LinkedIn profile URL collection
  - Profile picture display
  - Account linking (Google + LinkedIn)

## Tech Stack

### Frontend
- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS 4**
- **React Hooks**

### Backend
- **Node.js** with **Express 5**
- **MongoDB** with **Mongoose**
- **Passport.js** (Google OAuth)
- **JWT** authentication
- **Nodemailer** (email service)
- **bcrypt** (password hashing)

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **MongoDB** (running locally or MongoDB Atlas)
- **npm** or **yarn**

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd project-1
```

### 2. Backend Setup

#### Install Dependencies

```bash
cd backend
npm install
```

#### Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
cp .env.example .env
```

Edit the `.env` file with your credentials:

```env
# Server Configuration
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/voting_platform

# JWT Secret (generate a random string)
JWT_SECRET=your-super-secret-jwt-key

# Google OAuth
# Get these from: https://console.cloud.google.com/
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# LinkedIn OAuth
# Get these from: https://www.linkedin.com/developers/
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret
LINKEDIN_REDIRECT_URI=http://localhost:5000/api/auth/linkedin/callback

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Email Configuration (Gmail)
# Instructions:
# 1. Go to Google Account Settings
# 2. Enable 2-Factor Authentication
# 3. Go to Security > App Passwords
# 4. Generate a new app password for "Mail"
# 5. Use that 16-character password below
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
```

#### Setting up OAuth Credentials

**Google OAuth:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:5000/api/auth/google/callback`
6. Copy Client ID and Client Secret to `.env`

**LinkedIn OAuth:**
1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/)
2. Create a new app
3. Add redirect URL: `http://localhost:5000/api/auth/linkedin/callback`
4. Request OpenID Connect scopes: `openid`, `profile`, `email`
5. Copy Client ID and Client Secret to `.env`

**Gmail App Password:**
1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Enable 2-Factor Authentication
3. Go to Security → App Passwords
4. Generate password for "Mail"
5. Copy the 16-character password (remove spaces) to `.env`

#### Start MongoDB

Make sure MongoDB is running:

```bash
# If using local MongoDB
mongod

# Or if MongoDB is already running as a service, it's ready to go
```

#### Start Backend Server

```bash
npm start
# or for development with auto-reload:
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

#### Install Dependencies

```bash
cd frontend
npm install
```

#### Configure Environment Variables

Create a `.env.local` file in the `frontend` directory:

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
```

#### Start Frontend Server

```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

### 4. Database Seeding (Optional)

If you want to seed the database with sample teams and candidates:

```bash
cd backend
node src/seeders/seedDatabase.js
```

## Project Structure

```
project-1/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js           # MongoDB connection
│   │   │   ├── passport.js     # Passport.js Google OAuth
│   │   │   └── email.js        # Nodemailer configuration
│   │   ├── middleware/
│   │   │   └── auth.js         # JWT authentication middleware
│   │   ├── models/
│   │   │   ├── User.js         # User schema
│   │   │   ├── Team.js         # Team schema
│   │   │   ├── Candidate.js    # Candidate schema
│   │   │   └── Vote.js         # Vote schema
│   │   ├── routes/
│   │   │   ├── auth.js         # Email/password auth + user endpoints
│   │   │   ├── passwordReset.js # Forgot/reset password
│   │   │   ├── linkedin.js     # LinkedIn OAuth initiation
│   │   │   ├── linkedinCallback.js # LinkedIn OAuth callback
│   │   │   ├── teams.js        # Team endpoints
│   │   │   ├── candidates.js   # Candidate endpoints
│   │   │   ├── vote.js         # Voting endpoints
│   │   │   ├── results.js      # Results & leaderboard
│   │   │   └── proxy.js        # LinkedIn image proxy
│   │   ├── utils/
│   │   │   └── jwt.js          # JWT utilities
│   │   ├── app.js              # Express app configuration
│   │   └── server.js           # Server entry point
│   ├── .env                    # Environment variables
│   └── package.json
│
└── frontend/
    ├── app/
    │   ├── dashboard/
    │   │   └── page.tsx        # Main voting dashboard
    │   ├── linkedin-profile/
    │   │   └── page.tsx        # LinkedIn URL collection page
    │   ├── forgot-password/
    │   │   └── page.tsx        # Forgot password page
    │   ├── reset-password/
    │   │   └── page.tsx        # Reset password page
    │   ├── page.tsx            # Login/signup page
    │   ├── layout.tsx          # Root layout
    │   └── globals.css         # Global styles
    ├── .env.local              # Frontend environment variables
    └── package.json
```

## Usage

### For Users

1. **Sign Up/Login**
   - Visit `http://localhost:3000`
   - Choose authentication method:
     - Google OAuth
     - LinkedIn OAuth
     - Email/Password registration

2. **Provide LinkedIn Profile**
   - After first login, provide your LinkedIn profile URL
   - This URL will be shown to other users after you vote

3. **Vote**
   - Browse teams and candidates on the dashboard
   - Click "Vote" on your preferred candidate
   - You can only vote once

4. **View Results**
   - See live leaderboard with top candidates
   - View all users who have voted
   - Click on voted users to visit their LinkedIn profiles

5. **Forgot Password** (Email/Password users only)
   - Click "Forgot Password?" on login page
   - Enter your email
   - Check email for reset link
   - Set new password

### API Endpoints

#### Authentication
- `POST /api/auth/register` - Email/password registration
- `POST /api/auth/login` - Email/password login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout
- `GET /api/auth/google` - Google OAuth initiation
- `GET /api/auth/google/callback` - Google OAuth callback
- `GET /api/auth/linkedin` - LinkedIn OAuth initiation
- `GET /api/auth/linkedin/callback` - LinkedIn OAuth callback
- `POST /api/auth/update-linkedin-url` - Update LinkedIn profile URL
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

#### Voting
- `GET /api/teams` - Get all teams with candidates
- `GET /api/candidates` - Get all candidates
- `POST /api/vote` - Submit a vote
- `GET /api/results` - Get voting results
- `GET /api/results/voted-users` - Get all users who voted
- `GET /api/results/vote-counts` - Get vote counts per candidate

#### Utility
- `GET /api/proxy/linkedin-image?url=<image-url>` - Proxy LinkedIn images

## Security Features

- 🔒 **Password Hashing** with bcrypt (10 salt rounds)
- 🎫 **JWT Tokens** stored in HTTP-only cookies
- 🔐 **Secure Password Reset** with crypto-generated tokens (1-hour expiry)
- ✉️ **Email Verification** for password reset
- 🛡️ **OAuth 2.0** for Google and LinkedIn
- 🚫 **Duplicate Vote Prevention**
- 🔑 **Environment Variables** for sensitive data

## Troubleshooting

### Backend won't start
- Check if MongoDB is running: `mongod`
- Verify `.env` file exists and has all required variables
- Check port 5000 is not in use: `lsof -i :5000`

### Frontend won't connect to backend
- Verify backend is running on port 5000
- Check `.env.local` has correct `NEXT_PUBLIC_API_URL`
- Check CORS configuration in backend

### OAuth not working
- Verify redirect URIs match in OAuth provider settings
- Check Client ID and Secret are correct in `.env`
- Ensure OAuth scopes are properly configured

### Email not sending
- Verify Gmail credentials in `.env`
- Check you're using App Password, not regular password
- Ensure 2FA is enabled on Google account
- Check email isn't in spam folder

### Database connection failed
- Check MongoDB is running
- Verify `MONGO_URI` in `.env` is correct
- Check MongoDB version compatibility

## Development

### Running Tests
```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

### Building for Production

```bash
# Backend
cd backend
npm start

# Frontend
cd frontend
npm run build
npm start
```

## Deployment to Vercel

This application is configured for easy deployment to Vercel with both frontend and backend.

### Prerequisites
- Vercel account ([sign up at vercel.com](https://vercel.com))
- Vercel CLI installed (optional): `npm i -g vercel`

### Deployment Steps

#### Option 1: Using Vercel Dashboard (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click "Import Git Repository"
   - Select your repository
   - Vercel will auto-detect Next.js configuration

3. **Configure Environment Variables**
   
   In Vercel Dashboard → Settings → Environment Variables, add:
   
   **Frontend Variables:**
   ```
   NEXT_PUBLIC_API_URL=https://your-project-name.vercel.app
   ```
   
   **Backend Variables:**
   ```
   MONGO_URI=<your-mongodb-atlas-uri>
   JWT_SECRET=<your-jwt-secret>
   GOOGLE_CLIENT_ID=<your-google-client-id>
   GOOGLE_CLIENT_SECRET=<your-google-client-secret>
   LINKEDIN_CLIENT_ID=<your-linkedin-client-id>
   LINKEDIN_CLIENT_SECRET=<your-linkedin-client-secret>
   LINKEDIN_REDIRECT_URI=https://your-project-name.vercel.app/api/auth/linkedin/callback
   FRONTEND_URL=https://your-project-name.vercel.app
   EMAIL_USER=<your-gmail>
   EMAIL_PASSWORD=<your-gmail-app-password>
   ```

4. **Update OAuth Redirect URIs**
   
   After deployment, update redirect URIs in:
   - **Google Console:** Add `https://your-project-name.vercel.app/api/auth/google/callback`
   - **LinkedIn Developers:** Add `https://your-project-name.vercel.app/api/auth/linkedin/callback`

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at `https://your-project-name.vercel.app`

#### Option 2: Using Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```
   
   Follow the prompts:
   - Set up and deploy? Yes
   - Which scope? Select your account
   - Link to existing project? No
   - Project name? (default or custom name)
   - Directory? `./` (root)
   
4. **Set Environment Variables**
   ```bash
   vercel env add MONGO_URI production
   vercel env add JWT_SECRET production
   vercel env add GOOGLE_CLIENT_ID production
   # ... add all variables listed above
   ```

5. **Deploy to Production**
   ```bash
   vercel --prod
   ```

### MongoDB Atlas Setup (for Production)

Since Vercel is serverless, use MongoDB Atlas for production database:

1. **Create Cluster**
   - Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Create free cluster
   - Click "Connect" → "Connect your application"
   - Copy connection string

2. **Configure Network Access**
   - In Atlas: Network Access → Add IP Address
   - Choose "Allow Access from Anywhere" (0.0.0.0/0) for Vercel

3. **Use in Vercel**
   - Add MongoDB Atlas URI to Vercel environment variables:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/voting_platform
   ```

### Vercel Configuration Files

The project includes:
- `vercel.json` - Configures routing for monorepo setup (frontend + backend)
- `.vercelignore` - Files to exclude from deployment

### Post-Deployment Checklist

✅ Verify all environment variables are set in Vercel
✅ Update OAuth redirect URIs with production URL
✅ Test Google OAuth login
✅ Test LinkedIn OAuth login
✅ Test email/password registration
✅ Test forgot password email functionality
✅ Test voting functionality
✅ Check MongoDB Atlas connection
✅ Verify CORS settings allow production domain

### Monitoring

- **View Logs:** Vercel Dashboard → Project → Logs
- **Function Metrics:** Dashboard → Analytics
- **Error Tracking:** Check Runtime Logs for API errors

### Automatic Deployments

Once connected to GitHub:
- Every push to `main` branch automatically deploys to production
- Pull requests get preview deployments
- Rollback available in Vercel Dashboard

### Domain Setup (Optional)

1. **Add Custom Domain**
   - Vercel Dashboard → Project → Settings → Domains
   - Add your custom domain
   - Configure DNS as instructed by Vercel

2. **Update Environment Variables**
   - Change `FRONTEND_URL` to your custom domain
   - Update OAuth redirect URIs with custom domain

(^-^).....



