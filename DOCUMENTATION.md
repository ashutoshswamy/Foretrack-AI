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

Foretrack AI follows a modern serverless architecture built on Next.js 16 with the App Router and Turbopack:

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
│  │  Neon (sql)  │  │   Gemini AI  │  │  Firebase Auth/Admin │   │
│  │   Client     │  │    Client    │  │    + Currency utils  │   │
│  └──────────────┘  └──────────────┘  └──────────────────────┘   │
├─────────────────────────────────────────────────────────────────┤
│                    External Services                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │     Neon     │  │   Google     │  │       Firebase       │   │
│  │  PostgreSQL  │  │   Gemini AI  │  │  Auth (Google OAuth) │   │
│  └──────────────┘  └──────────────┘  └──────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Key Design Principles

1. **Server-First Rendering**: Leverages React Server Components for optimal performance
2. **Type Safety**: Full TypeScript implementation with strict type checking
3. **Application-Layer Data Isolation**: Every query is scoped by `user_id`, enforced in `lib/session.ts` + each API route (Neon has no Supabase-style RLS/`auth.uid()`)
4. **AI-Augmented UX**: Intelligent features powered by Google Gemini

---

## Project Structure

```
foretrack-ai/
├── app/                          # Next.js App Router
│   ├── globals.css               # Global styles (Tailwind)
│   ├── layout.tsx                # Root layout with providers
│   ├── page.tsx                  # Landing page
│   ├── robots.ts                 # SEO robots configuration
│   ├── sitemap.ts                # Dynamic sitemap generation
│   │
│   ├── api/                      # API Routes
│   │   ├── auth/session/         # Session cookie issue/clear
│   │   ├── expenses/             # Expense CRUD
│   │   ├── incomes/              # Income CRUD
│   │   ├── budgets/              # Budget CRUD
│   │   ├── categories/           # Category CRUD
│   │   ├── user-settings/        # User preferences (currency)
│   │   └── ai/
│   │       ├── categorize/       # AI expense categorization
│   │       ├── chat/             # AI chat assistant
│   │       └── insights/         # AI financial insights
│   │
│   ├── analytics/                # Analytics dashboard
│   ├── cookies/                  # Cookie policy page
│   ├── dashboard/                # Main application dashboard
│   ├── transactions/             # Transaction history page
│   ├── privacy/                  # Privacy policy page
│   ├── sign-in/                  # Authentication - Sign in
│   ├── sign-up/                  # Authentication - Sign up
│   └── terms/                    # Terms of service page
│
├── components/                   # React Components
│   ├── AccountMenu.tsx           # User account dropdown / sign-out
│   ├── AIChat.tsx                # AI chat interface
│   ├── AIInsights.tsx            # AI-powered insights display
│   ├── BudgetForm.tsx            # Budget creation/editing form
│   ├── BudgetOverview.tsx        # Budget tracking overview
│   ├── CategoryManager.tsx       # Category management interface
│   ├── CurrencySelector.tsx      # Display currency selector
│   ├── ExpenseForm.tsx           # Expense entry form
│   ├── ExpenseList.tsx           # Expense list display
│   ├── IncomeForm.tsx            # Income entry form
│   └── IncomeList.tsx            # Income list display
│
├── database/
│   └── schema.sql                # Complete database schema
│
├── lib/                          # Utility Libraries
│   ├── auth-context.tsx          # Client-side Firebase auth provider
│   ├── currency.tsx              # Display-currency context & formatting
│   ├── db.ts                     # Neon `sql` tagged-template client
│   ├── firebase.ts               # Firebase client SDK config
│   ├── firebase-admin.ts         # Firebase Admin SDK (server-only)
│   ├── gemini.ts                 # Google Gemini AI client & prompts
│   ├── session.ts                # Session cookie verification, `withAuth()`
│   ├── session-cookie.ts         # Edge-safe session cookie name constant
│   └── types.ts                  # Shared TypeScript types
│
├── public/                       # Static Assets
│   └── site.webmanifest          # PWA manifest
│
├── middleware.ts                 # Route protection (checks session cookie)
├── next.config.ts                # Next.js config, security headers, CSP
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies & scripts
```

> **Note on `lib/types.ts`**: it defines a richer schema than what's shipped today — tags, receipts/attachments, recurring-expense automation, and savings goals. None of those have a matching table in `database/schema.sql` or a route under `app/api/`; they're reserved types for planned features, not implemented functionality. Don't treat them as current behavior.

---

## Core Technologies

| Technology     | Version | Purpose                            |
| -------------- | ------- | ----------------------------------- |
| Next.js        | 16.1.x  | React framework with App Router (Turbopack) |
| React          | 19.x    | UI library                         |
| TypeScript     | 5.x     | Type-safe JavaScript               |
| Tailwind CSS   | 4.x     | Utility-first CSS framework        |
| Neon           | 1.x (`@neondatabase/serverless`) | Serverless PostgreSQL |
| Firebase       | 12.x (client) / 14.x (admin) | Authentication |
| Google Gemini  | `@google/genai` 1.x | AI-powered features (`gemini-3.5-flash-lite`) |
| Framer Motion  | 12.x    | Animation library                  |
| Lucide React   | Latest  | Icon library                       |

---

## Environment Configuration

### Required Environment Variables

Create a `.env.local` file in the project root:

```bash
# Neon (PostgreSQL)
DATABASE_URL=postgres://user:pass@host/db?sslmode=require

# Firebase Admin (server-only)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Firebase client config (public)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaxxxxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1234567890
NEXT_PUBLIC_FIREBASE_APP_ID=1:1234567890:web:xxxxx

# Google Gemini AI
GEMINI_API_KEY=AIzaxxxxx
```

### Environment Variable Descriptions

| Variable                                   | Description                              | Required |
| ------------------------------------------- | ----------------------------------------- | -------- |
| `DATABASE_URL`                              | Neon Postgres connection string           | ✅       |
| `FIREBASE_PROJECT_ID`                       | Firebase project ID (Admin SDK)           | ✅       |
| `FIREBASE_CLIENT_EMAIL`                     | Firebase service account email            | ✅       |
| `FIREBASE_PRIVATE_KEY`                      | Firebase service account private key      | ✅       |
| `NEXT_PUBLIC_FIREBASE_API_KEY`              | Firebase client config                    | ✅       |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`          | Firebase client config                    | ✅       |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID`           | Firebase client config                    | ✅       |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`       | Firebase client config                    | ✅       |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`  | Firebase client config                    | ✅       |
| `NEXT_PUBLIC_FIREBASE_APP_ID`               | Firebase client config                    | ✅       |
| `GEMINI_API_KEY`                            | Google AI Studio API key                  | ✅       |

Note: `FIREBASE_PRIVATE_KEY` is stored with literal `\n` sequences in most hosting dashboards; `lib/firebase-admin.ts` un-escapes them (`.replace(/\\n/g, "\n")`) before passing the key to `cert()`.

---

## Database Schema

Foretrack AI runs on **Neon (PostgreSQL)**. User scoping is enforced in the API layer (`app/api/**`, via `lib/session.ts`'s `withAuth`), not via Postgres RLS — Neon has no Supabase-style `auth.uid()` / `authenticated` role.

### Entity Relationship Diagram

```
┌─────────────────┐
│   categories     │
├─────────────────┤
│ id (PK)          │
│ user_id          │
│ name             │
│ icon             │
│ color            │
└─────────────────┘

┌─────────────────┐       ┌─────────────────┐
│    expenses      │       │     incomes      │
├─────────────────┤       ├─────────────────┤
│ id (PK)          │       │ id (PK)          │
│ user_id          │       │ user_id          │
│ amount           │       │ amount           │
│ category         │       │ source           │
│ description      │       │ description      │
│ date             │       │ date             │
└─────────────────┘       └─────────────────┘

┌─────────────────┐       ┌─────────────────┐
│    budgets        │       │  user_settings   │
├─────────────────┤       ├─────────────────┤
│ id (PK)          │       │ id (PK)          │
│ user_id          │       │ user_id (unique) │
│ category         │       │ currency         │
│ amount           │       └─────────────────┘
│ period           │
│ is_active        │
└─────────────────┘
```

### Tables (as defined in `database/schema.sql`)

#### `categories`

User-defined expense categories — `name`, emoji `icon`, `color`; unique per `(user_id, name)`.

#### `expenses`

Expense transactions: `amount`, `category` (plain text, not a foreign key), `description`, `date`. Indexed on `(user_id, date DESC)`.

#### `incomes`

Income records: `amount`, `source`, `description`, `date`. Indexed on `(user_id, date DESC)`.

#### `budgets`

Per-category budgets: `amount`, `period` (defaults to `monthly`), `is_active`; unique per `(user_id, category, period)`.

#### `user_settings`

One row per user: display `currency` (defaults to `USD`).

> `lib/types.ts` defines a broader set of fields (tags, attachments, recurring expenses, savings goals, multi-field user preferences) that aren't backed by tables here — see the note in [Project Structure](#project-structure).

### Data Isolation Pattern

Every table has a `user_id TEXT NOT NULL` column, and every query is filtered by it in the application code:

```typescript
// Example: app/api/expenses/route.ts
export async function GET(request: NextRequest) {
  return withAuth(async (uid) => {
    const rows = await sql`SELECT * FROM expenses WHERE user_id = ${uid} ORDER BY date DESC`;
    return NextResponse.json(rows);
  });
}
```

---

## Authentication

### Firebase Integration

Authentication uses **Firebase Auth** for identity plus a **server-verified session cookie** for API access:

1. **Sign In**: Client signs in with Google via `signInWithPopup` (`lib/auth-context.tsx`)
2. **Session Exchange**: The Firebase ID token is POSTed to `/api/auth/session`, which verifies it with Firebase Admin and issues an `httpOnly`, `secure` (in production), 5-day session cookie
3. **Re-sync**: On every `onAuthStateChanged` event, the client re-syncs the cookie so a stale/expired cookie doesn't desync from a still-valid Firebase client session
4. **Sign Out**: `DELETE /api/auth/session` clears the cookie, then Firebase signs out client-side

### Middleware Configuration

```typescript
// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/session-cookie";

const PUBLIC_ROUTES = [
  /^\/$/,
  /^\/sign-in(\/.*)?$/,
  /^\/sign-up(\/.*)?$/,
  /^\/privacy$/,
  /^\/terms$/,
  /^\/cookies$/,
  /^\/robots\.txt$/,
  /^\/sitemap\.xml$/,
];

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (isPublicRoute(pathname) || pathname.startsWith("/api")) {
    return NextResponse.next();
  }
  if (!request.cookies.has(SESSION_COOKIE)) {
    const url = request.nextUrl.clone();
    url.pathname = "/sign-in";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}
```

`middleware.ts` imports only `session-cookie.ts` (the cookie name constant), never `session.ts` — `firebase-admin` is Node-only and can't run in the Edge middleware runtime. API routes verify the cookie themselves via `withAuth()` and return a `401` JSON response rather than redirecting.

### Protected Routes

| Route                   | Protection                                  |
| ------------------------ | -------------------------------------------- |
| `/`                      | Public                                      |
| `/sign-in`, `/sign-up`   | Public                                      |
| `/privacy`, `/terms`, `/cookies` | Public                              |
| `/dashboard`             | 🔒 Session cookie required (middleware)     |
| `/analytics`             | 🔒 Session cookie required (middleware)     |
| `/transactions`          | 🔒 Session cookie required (middleware)     |
| `/api/*` (except `/api/auth/session`) | 🔒 Verified per-request via `withAuth()` |

---

## API Endpoints

All endpoints below (other than `/api/auth/session`) require a valid session cookie and are scoped to the authenticated `uid`.

### Auth

- `POST /api/auth/session` — exchanges a Firebase ID token for a session cookie
- `DELETE /api/auth/session` — clears the session cookie

### Data CRUD

| Resource      | Endpoints                                                        |
| -------------- | ----------------------------------------------------------------- |
| Expenses       | `GET/POST /api/expenses`, `PATCH/DELETE /api/expenses/[id]`     |
| Incomes        | `GET/POST /api/incomes`, `PATCH/DELETE /api/incomes/[id]`       |
| Budgets        | `GET/POST /api/budgets`, `PATCH/DELETE /api/budgets/[id]`       |
| Categories     | `GET/POST /api/categories`, `PATCH/DELETE /api/categories/[id]` |
| User Settings  | `GET/PUT /api/user-settings`                                     |

`GET /api/expenses` supports optional `?from=<date>` and `?limit=<n>` query params for filtering/pagination.

### AI Endpoints

#### `POST /api/ai/categorize`

Automatically categorizes an expense based on its description.

**Request:**

```json
{
  "description": "Coffee at Starbucks"
}
```

**Response:**

```json
{
  "category": "Food"
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
    "budgets": [...],
    "totalSpent": 1500.00
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
export const model = "gemini-3.5-flash-lite";
```

### AI Features

1. **Smart Categorization** (`categorizeExpense`): maps a free-text description to a fixed category list (Food, Transport, Entertainment, Shopping, Bills, Health, Other)
2. **Financial Insights** (`generateFinancialInsights`): 2-3 personalized tips/warnings as structured JSON
3. **Chat Assistant** (`chatWithAI`): natural-language financial guidance, given recent expenses/budgets as context
4. **Spending Analysis** (`generateSpendingAnalysis`): a short conversational summary of spending patterns
5. **Savings Tips** (`generateSavingsTips`): 3 actionable tips based on top spending categories

All functions fall back to a hardcoded default response if the Gemini call fails or returns unparsable JSON — AI features degrade gracefully rather than erroring out.

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
| -------------------- | ------------------------------------------- |
| `ExpenseForm`        | Form for adding/editing expenses          |
| `ExpenseList`        | Displays expense history                  |
| `IncomeForm`         | Form for adding/editing income            |
| `IncomeList`         | Displays income records                   |
| `BudgetForm`         | Budget creation and editing               |
| `BudgetOverview`     | Visual budget tracking with progress bars |
| `CategoryManager`    | CRUD operations for categories            |
| `CurrencySelector`   | Display-currency picker                   |
| `AccountMenu`        | User account dropdown / sign-out          |
| `AIChat`             | Interactive AI assistant interface        |
| `AIInsights`         | Displays AI-generated insights            |

### Component Architecture

Components follow these patterns:

- Server Components by default for data fetching
- Client Components (`"use client"`) for interactivity, forms, and anything using `useAuth()`/`useCurrency()`
- Framer Motion for animations
- Tailwind CSS for styling

---

## State Management

The application uses a combination of:

1. **Server State**: React Server Components with direct database queries where applicable
2. **Client State**: React hooks (`useState`, `useEffect`) for UI state
3. **Context Providers**: `AuthProvider` (`lib/auth-context.tsx`) for the current Firebase user, `CurrencyProvider` (`lib/currency.tsx`) for the display currency, backed by `/api/user-settings` and a `localStorage` fallback
4. **Form State**: Controlled components with validation

---

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Configure environment variables (see [Environment Configuration](#environment-configuration))
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
- [ ] `serverExternalPackages: ["firebase-admin"]` present in `next.config.ts` (required — see Troubleshooting)
- [ ] Add the production domain to Firebase Console → Authentication → Settings → Authorized domains
- [ ] Neon connection string uses `sslmode=require`
- [ ] Configure custom domain

---

## Troubleshooting

### `ERR_REQUIRE_ESM` / "Failed to load external module firebase-admin.../auth" in production

`firebase-admin`'s auth module pulls in `jwks-rsa` → `jose`, and `jose` ships an ESM-only build. If the bundler (Turbopack or webpack) inlines `firebase-admin` into a server chunk, Node tries to `require()` that ESM module and throws:

```
Error [ERR_REQUIRE_ESM]: require() of ES Module .../jose/dist/webapi/index.js
from .../jwks-rsa/src/utils.js not supported.
```

**Fix**: mark the package external so Next loads it natively via `require()`/`import()` from `node_modules` at runtime instead of bundling it:

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  serverExternalPackages: ["firebase-admin"],
};
```

### "Unauthorized" errors

- Verify the session cookie exists (`document.cookie` should include `session=...`)
- Check that `FIREBASE_PROJECT_ID` / `FIREBASE_CLIENT_EMAIL` / `FIREBASE_PRIVATE_KEY` are set correctly server-side
- Ensure the user is signed in and `/api/auth/session` succeeded

### Database connection errors

- Verify `DATABASE_URL` is correct and includes `sslmode=require`
- Verify `user_id` is being passed correctly from `withAuth()` into every query

### AI features not working

- Verify `GEMINI_API_KEY` is set
- Check API quota limits
- Review server logs — AI functions catch errors and return a fallback response rather than throwing, so a failure surfaces as generic content, not an error page

---

## Support

For additional support:

- Open an issue on GitHub
- Check the [Next.js Documentation](https://nextjs.org/docs)
- Review [Neon Documentation](https://neon.tech/docs)
- Consult [Firebase Documentation](https://firebase.google.com/docs)

---

_Last updated: September 2026_
