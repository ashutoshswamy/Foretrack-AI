# Foretrack AI - Expense Tracking & Budgeting

A modern expense tracking and budgeting application built with Next.js, Supabase, Clerk authentication, and Google Gemini AI.

## Features

- 📊 **Expense Tracking**: Log and categorize your expenses easily
- 💰 **Budget Management**: Set budgets for different categories and track your spending
- 🤖 **AI-Powered Insights**: Get personalized financial insights powered by Google Gemini
- ✨ **Smart Categorization**: AI automatically suggests categories based on expense descriptions
- 💬 **AI Financial Assistant**: Chat with an AI assistant about your finances
- 🔐 **Secure Authentication**: User authentication powered by Clerk
- 💾 **Cloud Storage**: All data securely stored in Supabase
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Authentication**: Clerk
- **Database**: Supabase (PostgreSQL)
- **AI**: Google Gemini (gemini-2.0-flash)
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account ([sign up here](https://supabase.com))
- A Clerk account ([sign up here](https://clerk.com))
- A Google AI Studio account ([sign up here](https://aistudio.google.com))

### Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd foretrack-ai
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Fill in your Clerk and Supabase credentials

### Clerk Setup

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Create a new application
3. Copy your API keys to `.env.local`:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`

### Supabase Setup

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Create a new project
3. Copy your project URL and anon key to `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

4. Run the database schema:
   - Open the SQL Editor in your Supabase project
   - Copy and paste the contents of `supabase-schema.sql`
   - Execute the SQL commands

### Google Gemini AI Setup

1. Go to [Google AI Studio](https://aistudio.google.com)
2. Create or sign in to your Google account
3. Click "Get API Key" and create a new API key
4. Copy your API key to `.env.local`:
   - `GEMINI_API_KEY`

### Running the Application

### Running the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your application.

## Database Schema

The application uses three main tables:

- **expenses**: Stores individual expense records
- **budgets**: Stores budget limits for categories
- **categories**: Stores custom expense categories (optional)

All tables include Row Level Security (RLS) policies to ensure users can only access their own data.

## Project Structure

```
foretrack-ai/
├── app/
│   ├── dashboard/          # Main dashboard page
│   ├── sign-in/           # Sign in page
│   ├── sign-up/           # Sign up page
│   ├── layout.tsx         # Root layout with Clerk provider
│   └── page.tsx           # Landing page
├── components/
│   ├── ExpenseForm.tsx    # Form to add expenses
│   ├── ExpenseList.tsx    # List of recent expenses
│   ├── BudgetForm.tsx     # Form to set budgets
│   └── BudgetOverview.tsx # Budget tracking overview
├── lib/
│   └── supabase.ts        # Supabase client configuration
└── supabase-schema.sql    # Database schema
```

## Features Overview

### Expense Tracking

- Add expenses with amount, category, description, and date
- View recent expenses with delete functionality
- Categorize expenses (Food, Transport, Entertainment, etc.)

### Budget Management

- Set monthly, weekly, or yearly budgets per category
- Visual progress bars showing budget usage
- Color-coded warnings (green, yellow, red) based on spending
- Automatic calculation of total monthly spending

### User Authentication

- Secure sign-up and sign-in with Clerk
- Protected routes (dashboard requires authentication)
- User-specific data isolation

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add your environment variables in Vercel project settings
4. Deploy!

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.
