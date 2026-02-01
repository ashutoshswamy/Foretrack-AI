# Foretrack AI - Technical Documentation

> Comprehensive technical documentation for the Foretrack AI expense tracking and budgeting application.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Project Structure](#project-structure)
- [Core Technologies](#core-technologies)
- [Environment Configuration](#environment-configuration)
- [Database Schema](#database-schema)
- [Authentication](#authentication)
- [API Endpoints](#api-endpoints)
- [AI Integration](#ai-integration)
- [Components](#components)
- [State Management](#state-management)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

---

## Architecture Overview

Foretrack AI follows a modern serverless architecture built on Next.js 16 with the App Router pattern:

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client (Browser)                         │
├─────────────────────────────────────────────────────────────────┤
│                     Next.js App Router                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │   Pages      │  │  Components  │  │   API Routes         │   │
│  │  (app/)      │  │              │  │   (app/api/)         │   │
│  └──────────────┘  └──────────────┘  └──────────────────────┘   │
├─────────────────────────────────────────────────────────────────┤
│                     Service Layer (lib/)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │  Supabase    │  │   Gemini AI  │  │    Currency          │   │
│  │   Client     │  │    Client    │  │    Utilities         │   │
│  └──────────────┘  └──────────────┘  └──────────────────────┘   │
├─────────────────────────────────────────────────────────────────┤
│                    External Services                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │   Supabase   │  │   Google     │  │       Clerk          │   │
│  │  PostgreSQL  │  │   Gemini AI  │  │   Authentication     │   │
│  └──────────────┘  └──────────────┘  └──────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Key Design Principles

1. **Server-First Rendering**: Leverages React Server Components for optimal performance
2. **Type Safety**: Full TypeScript implementation with strict type checking
3. **Data Isolation**: Row Level Security (RLS) ensures user data privacy
4. **AI-Augmented UX**: Intelligent features powered by Google Gemini

---

## Project Structure

```
foretrack-ai/
├── app/                          # Next.js App Router
│   ├── globals.css               # Global styles (Tailwind)
│   ├── layout.tsx                # Root layout with providers
│   ├── page.tsx                  # Landing page
│   ├── opengraph-image.tsx       # Dynamic OG image generation
│   ├── robots.ts                 # SEO robots configuration
│   ├── sitemap.ts                # Dynamic sitemap generation
│   │
│   ├── api/                      # API Routes
│   │   └── ai/
│   │       ├── categorize/       # AI expense categorization
│   │       ├── chat/             # AI chat assistant
│   │       └── insights/         # AI financial insights
│   │
│   ├── analytics/                # Analytics dashboard
│   ├── cookies/                  # Cookie policy page
│   ├── dashboard/                # Main application dashboard
│   ├── privacy/                  # Privacy policy page
│   ├── sign-in/                  # Authentication - Sign in
│   ├── sign-up/                  # Authentication - Sign up
│   └── terms/                    # Terms of service page
│
├── components/                   # React Components
│   ├── AIChat.tsx                # AI chat interface
│   ├── AIInsights.tsx            # AI-powered insights display
│   ├── BudgetForm.tsx            # Budget creation/editing form
│   ├── BudgetOverview.tsx        # Budget tracking overview
│   ├── CategoryManager.tsx       # Category management interface
│   ├── CurrencySelector.tsx      # Multi-currency selector
│   ├── ExpenseForm.tsx           # Expense entry form
│   ├── ExpenseList.tsx           # Expense list display
│   ├── IncomeForm.tsx            # Income entry form
│   └── IncomeList.tsx            # Income list display
│
├── database/
│   └── schema.sql                # Complete database schema
│
├── lib/                          # Utility Libraries
│   ├── currency.tsx              # Currency conversion utilities
│   ├── gemini.ts                 # Google Gemini AI client
│   └── supabase.ts               # Supabase client & types
│
├── public/                       # Static Assets
│   └── site.webmanifest          # PWA manifest
│
├── middleware.ts                 # Next.js middleware (auth)
├── next.config.ts                # Next.js configuration
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies & scripts
```

---

## Core Technologies

| Technology    | Version | Purpose                         |
| ------------- | ------- | ------------------------------- |
| Next.js       | 16.x    | React framework with App Router |
| React         | 19.x    | UI library                      |
| TypeScript    | 5.x     | Type-safe JavaScript            |
| Tailwind CSS  | 4.x     | Utility-first CSS framework     |
| Supabase      | 2.x     | PostgreSQL database & auth      |
| Clerk         | 6.x     | User authentication             |
| Google Gemini | Latest  | AI-powered features             |
| Framer Motion | 12.x    | Animation library               |
| Lucide React  | Latest  | Icon library                    |

---

## Environment Configuration

### Required Environment Variables

Create a `.env.local` file in the project root:

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx

# Clerk Redirect URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxx

# Google Gemini AI
GEMINI_API_KEY=AIzaxxxxx

# Application URL (for production)
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### Environment Variable Descriptions

| Variable                            | Description                           | Required |
| ----------------------------------- | ------------------------------------- | -------- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public API key                  | ✅       |
| `CLERK_SECRET_KEY`                  | Clerk secret key for server-side auth | ✅       |
| `NEXT_PUBLIC_SUPABASE_URL`          | Your Supabase project URL             | ✅       |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`     | Supabase anonymous/public key         | ✅       |
| `GEMINI_API_KEY`                    | Google AI Studio API key              | ✅       |
| `NEXT_PUBLIC_APP_URL`               | Production URL for SEO/OG images      | Optional |

---

## Database Schema

### Entity Relationship Diagram

```
┌─────────────────┐       ┌─────────────────┐
│   categories    │       │      tags       │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │       │ id (PK)         │
│ user_id         │       │ user_id         │
│ name            │       │ name            │
│ icon            │       │ color           │
│ color           │       └────────┬────────┘
│ is_default      │                │
│ parent_id (FK)  │                │
└────────┬────────┘                │
         │                         │
         │         ┌───────────────┴───────────────┐
         │         │        expense_tags           │
         │         ├───────────────────────────────┤
         │         │ expense_id (FK)               │
         │         │ tag_id (FK)                   │
         │         └───────────────┬───────────────┘
         │                         │
         ▼                         ▼
┌─────────────────┐       ┌─────────────────┐
│    expenses     │       │    incomes      │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │       │ id (PK)         │
│ user_id         │       │ user_id         │
│ category_id(FK) │       │ source          │
│ amount          │       │ amount          │
│ description     │       │ description     │
│ date            │       │ date            │
│ is_recurring    │       │ is_recurring    │
└─────────────────┘       └─────────────────┘
         │
         ▼
┌─────────────────┐       ┌─────────────────┐
│    budgets      │       │  savings_goals  │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │       │ id (PK)         │
│ user_id         │       │ user_id         │
│ category_id(FK) │       │ name            │
│ amount          │       │ target_amount   │
│ period          │       │ current_amount  │
│ start_date      │       │ status          │
└─────────────────┘       └─────────────────┘
```

### Key Tables

#### `expenses`

Stores all user expense transactions with support for:

- Category linking
- Recurring expenses
- Custom descriptions
- Date tracking
- Currency support

#### `incomes`

Tracks all income sources:

- Multiple income types (Salary, Freelance, etc.)
- Recurring income support
- Source categorization

#### `budgets`

Budget management per category:

- Multiple period types (daily, weekly, monthly, etc.)
- Category-specific limits
- Automatic tracking

#### `categories`

User-defined expense categories:

- Custom icons and colors
- Hierarchical support (parent categories)
- Default categories for new users

### Row Level Security (RLS)

All tables implement RLS policies to ensure data isolation:

```sql
-- Example RLS policy for expenses
CREATE POLICY "Users can only access own expenses"
ON expenses FOR ALL
USING (user_id = current_user_id());
```

---

## Authentication

### Clerk Integration

The application uses Clerk for authentication with the following features:

1. **Sign Up/Sign In**: Email/password and social providers
2. **Protected Routes**: Middleware-based route protection
3. **User Identification**: User ID passed to Supabase for RLS

### Middleware Configuration

```typescript
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/privacy",
  "/terms",
  "/cookies",
]);

export default clerkMiddleware((auth, req) => {
  if (!isPublicRoute(req)) {
    auth.protect();
  }
});
```

### Protected Routes

| Route                  | Protection       |
| ---------------------- | ---------------- |
| `/`                    | Public           |
| `/sign-in`, `/sign-up` | Public           |
| `/dashboard`           | 🔒 Authenticated |
| `/analytics`           | 🔒 Authenticated |
| `/api/ai/*`            | 🔒 Authenticated |

---

## API Endpoints

### AI Endpoints

#### `POST /api/ai/categorize`

Automatically categorizes an expense based on its description.

**Request:**

```json
{
  "description": "Coffee at Starbucks",
  "amount": 5.5
}
```

**Response:**

```json
{
  "category": "Food & Dining",
  "confidence": 0.95
}
```

#### `POST /api/ai/insights`

Generates personalized financial insights.

**Request:**

```json
{
  "expenses": [...],
  "budgets": [...],
  "totalSpent": 1500.00
}
```

**Response:**

```json
{
  "insights": [
    {
      "type": "warning",
      "title": "Budget Alert",
      "message": "You've spent 90% of your dining budget",
      "icon": "⚠️"
    }
  ]
}
```

#### `POST /api/ai/chat`

AI-powered financial assistant chat.

**Request:**

```json
{
  "message": "How can I save more money?",
  "context": {
    "expenses": [...],
    "budgets": [...]
  }
}
```

**Response:**

```json
{
  "response": "Based on your spending patterns..."
}
```

---

## AI Integration

### Google Gemini Configuration

```typescript
// lib/gemini.ts
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY!;
export const genAI = new GoogleGenAI({ apiKey });
export const model = "gemini-3-flash-preview";
```

### AI Features

1. **Smart Categorization**: Automatically suggests expense categories
2. **Financial Insights**: Personalized tips and warnings
3. **Chat Assistant**: Natural language financial guidance
4. **Spending Analysis**: Pattern recognition and recommendations

### AI Response Types

```typescript
export type FinancialInsight = {
  type: "tip" | "warning" | "achievement" | "suggestion";
  title: string;
  message: string;
  icon: string;
};
```

---

## Components

### Core Components

| Component          | Description                               |
| ------------------ | ----------------------------------------- |
| `ExpenseForm`      | Form for adding/editing expenses          |
| `ExpenseList`      | Displays paginated expense history        |
| `IncomeForm`       | Form for adding/editing income            |
| `IncomeList`       | Displays income records                   |
| `BudgetForm`       | Budget creation and editing               |
| `BudgetOverview`   | Visual budget tracking with progress bars |
| `CategoryManager`  | CRUD operations for categories            |
| `CurrencySelector` | Multi-currency support selector           |
| `AIChat`           | Interactive AI assistant interface        |
| `AIInsights`       | Displays AI-generated insights            |

### Component Architecture

Components follow these patterns:

- Server Components by default for data fetching
- Client Components (`"use client"`) for interactivity
- Framer Motion for animations
- Tailwind CSS for styling

---

## State Management

The application uses a combination of:

1. **Server State**: React Server Components with direct database queries
2. **Client State**: React hooks (`useState`, `useEffect`) for UI state
3. **Form State**: Controlled components with validation
4. **URL State**: Search params for filtering/pagination

---

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy

### Build Commands

```bash
# Development
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Linting
npm run lint
```

### Production Checklist

- [ ] Set all environment variables
- [ ] Run database migrations
- [ ] Configure Clerk production keys
- [ ] Set up Supabase production project
- [ ] Enable RLS policies
- [ ] Configure custom domain

---

## Troubleshooting

### Common Issues

#### "Unauthorized" errors

- Verify Clerk keys are correct
- Check middleware configuration
- Ensure user is signed in

#### Database connection errors

- Verify Supabase URL and anon key
- Check RLS policies
- Verify user_id is being passed correctly

#### AI features not working

- Verify GEMINI_API_KEY is set
- Check API quota limits
- Review error logs for rate limiting

### Debug Mode

Enable verbose logging:

```typescript
// Add to lib/supabase.ts for debugging
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  db: { schema: "public" },
  auth: { persistSession: true },
  global: { headers: { "x-debug": "true" } },
});
```

---

## Support

For additional support:

- Open an issue on GitHub
- Check the [Next.js Documentation](https://nextjs.org/docs)
- Review [Supabase Documentation](https://supabase.com/docs)
- Consult [Clerk Documentation](https://clerk.com/docs)

---

_Last updated: February 2026_
