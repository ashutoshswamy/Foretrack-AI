# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

We take the security of Foretrack AI seriously. If you believe you have found a security vulnerability, please report it to us responsibly.

### How to Report

1. **Do NOT** create a public GitHub issue for security vulnerabilities
2. Send an email with details to the repository maintainer
3. Include as much information as possible:
   - Type of vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### What to Expect

- **Acknowledgment**: We will acknowledge receipt within 48 hours
- **Assessment**: We will assess the vulnerability within 7 days
- **Resolution**: Critical vulnerabilities will be patched within 30 days
- **Credit**: With your permission, we will credit you in the release notes

---

## Security Architecture

### Authentication & Authorization

#### Firebase Authentication

- Client-side sign-in is handled by [Firebase Auth](https://firebase.google.com/products/auth) (Google sign-in popup)
- After sign-in, the client exchanges its Firebase ID token for a server-issued, `httpOnly` session cookie (`POST /api/auth/session`)
- The session cookie is verified on the server using **Firebase Admin** (`adminAuth.verifySessionCookie`) — the client never proves identity by anything the server has to trust blindly
- Session cookies expire after 5 days; the client re-syncs the cookie on every auth-state change so a stale cookie doesn't silently 401 API calls

#### Route Protection

```typescript
// middleware.ts
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
    // API routes verify the session cookie themselves and return 401 JSON
    return NextResponse.next();
  }
  if (!request.cookies.has(SESSION_COOKIE)) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
  return NextResponse.next();
}
```

API routes are **not** gated by middleware — each one calls `withAuth()` (`lib/session.ts`), which verifies the session cookie via Firebase Admin and returns `401 Unauthorized` JSON if it's missing or invalid, before touching the database.

### Data Protection

#### User-scoped data access (application-layer, not Postgres RLS)

Neon is plain serverless PostgreSQL — it has no Supabase-style `auth.uid()` / `authenticated` role, so isolation is enforced in the API layer instead of via Row Level Security policies:

```typescript
// Every API route follows this pattern (lib/session.ts + app/api/**)
export async function GET(request: NextRequest) {
  return withAuth(async (uid) => {
    const rows = await sql`SELECT * FROM expenses WHERE user_id = ${uid} ...`;
    return NextResponse.json(rows);
  });
}
```

- `withAuth()` resolves the authenticated Firebase `uid` from the verified session cookie
- Every query is parameterized (via `@neondatabase/serverless` tagged templates) and explicitly filtered by `user_id = ${uid}` — there is no code path that reads or writes another user's rows
- Because queries are tagged-template parameterized, user input is never concatenated into SQL, which also rules out SQL injection

This ensures:

- ✅ Complete data isolation between users, enforced identically on every route
- ✅ No cross-user data access possible
- ✅ Parameterized queries — no SQL injection surface

#### Data Encryption

| Layer     | Protection                              |
| --------- | ---------------------------------------- |
| Transit   | TLS (HTTPS, enforced via HSTS)           |
| At Rest   | Encrypted at rest (Neon)                 |
| Passwords | Managed by Firebase Auth (Google OAuth — Foretrack never sees a password) |
| API Keys  | Environment variables only, server-side  |

### API Security

#### Server-Side API Routes

All database and AI operations run through server-side Next.js API routes — nothing talks to Neon or Gemini directly from the browser:

```
/api/auth/session   → Issues/clears the session cookie
/api/expenses       → CRUD, user-scoped
/api/incomes        → CRUD, user-scoped
/api/budgets        → CRUD, user-scoped
/api/categories     → CRUD, user-scoped
/api/user-settings  → User preferences (currency, etc.)
/api/ai/categorize  → Server-side only
/api/ai/chat        → Server-side only
/api/ai/insights    → Server-side only
```

#### API Key & Credential Protection

- `DATABASE_URL`, `GEMINI_API_KEY`, and the `FIREBASE_*` **admin** credentials are **never** exposed to the client
- Only `NEXT_PUBLIC_FIREBASE_*` values (Firebase's public client config — safe by design, scoped by Firebase security rules and domain allow-listing) are shipped to the browser
- All AI requests go through Next.js API routes

```typescript
// Keys are only accessible server-side
const apiKey = process.env.GEMINI_API_KEY!; // Server only
const sql = neon(process.env.DATABASE_URL!); // Server only
```

### Environment Variables

#### Required Variables

```bash
# Never commit these to version control!
DATABASE_URL=postgres://...                 # Server-only — Neon connection string
FIREBASE_PROJECT_ID=...                     # Server-only — Firebase Admin
FIREBASE_CLIENT_EMAIL=...                   # Server-only — Firebase Admin
FIREBASE_PRIVATE_KEY=...                    # Server-only — Firebase Admin
GEMINI_API_KEY=AIzaxxxxx                    # Server-only

# Client-safe (public) keys — Firebase's public web config
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

#### Best Practices

- ✅ Use `.env.local` for local development
- ✅ Add `.env*` to `.gitignore`
- ✅ Use your hosting provider's environment variable management
- ❌ Never hardcode API keys or the Firebase private key
- ❌ Never commit `.env` files

---

## Security Best Practices

### For Users

1. **Use a Google account you trust** — sign-in is Google-only via Firebase
2. **Secure Sessions**: Log out from shared devices (this clears the session cookie)
3. **Review Access**: Periodically review your Google account's connected apps

### For Developers

1. **Keep Dependencies Updated**

   ```bash
   npm audit
   npm update
   ```

2. **Validate All Inputs**
   - Server-side validation required in every API route
   - Never interpolate user input into raw SQL strings — always use `sql\`...\`` tagged templates
   - Sanitize/validate before writing to the database

3. **Node-only packages must stay external to the server bundle**

   `firebase-admin` (via `jwks-rsa` → `jose`) ships an ESM-only build. If Turbopack/webpack bundles it into a server chunk, Node throws `ERR_REQUIRE_ESM` at runtime. Keep it external:

   ```typescript
   // next.config.ts
   const nextConfig: NextConfig = {
     serverExternalPackages: ["firebase-admin"],
   };
   ```

4. **Security Headers** (already configured in `next.config.ts`)

   ```typescript
   {
     key: "Strict-Transport-Security",
     value: "max-age=63072000; includeSubDomains; preload",
   },
   { key: "X-Content-Type-Options", value: "nosniff" },
   { key: "X-Frame-Options", value: "SAMEORIGIN" },
   { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
   {
     key: "Permissions-Policy",
     value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
   },
   ```

5. **Content Security Policy** (already configured in `next.config.ts`)

   ```typescript
   {
     key: "Content-Security-Policy",
     value: [
       "default-src 'self'",
       "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.foretrackai.in https://apis.google.com",
       "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
       "img-src 'self' data: blob: https: http:",
       "font-src 'self' https://fonts.gstatic.com data:",
       "connect-src 'self' https://*.foretrackai.in https://generativelanguage.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com",
       "frame-src 'self' https://*.foretrackai.in https://accounts.google.com https://*.firebaseapp.com",
       "frame-ancestors 'self'",
       "form-action 'self'",
       "base-uri 'self'",
       "object-src 'none'",
       "worker-src 'self' blob:",
     ].join("; "),
   }
   ```

---

## Third-Party Security

### Firebase (Google)

- SOC 2, ISO 27001 certified infrastructure
- GDPR compliant
- [Firebase Security](https://firebase.google.com/support/privacy)

### Neon

- Encrypted at rest and in transit
- [Neon Security](https://neon.tech/docs/security/security-overview)

### Google Gemini AI

- Enterprise-grade security
- Data processed per Google's AI Principles
- [Google AI Privacy](https://ai.google/responsibility/principles/)

---

## Data Privacy

### What We Collect

- Google account email/display name (via Firebase Auth)
- Financial transaction data (expenses, income, budgets, categories)
- Display currency preference

### What We DON'T Collect

- Payment card numbers
- Bank account details
- Social Security numbers
- Passwords (authentication is delegated entirely to Google via Firebase)

### Data Retention

- Active accounts: Data retained while account is active
- Deleted accounts: Data removed within 30 days
- Backups: Retained for 7 days after deletion

### Data Deletion

Users can request complete data deletion by contacting the maintainer directly.

---

## Vulnerability Disclosure Timeline

| Day   | Action                            |
| ----- | ---------------------------------- |
| 0     | Vulnerability reported            |
| 1-2   | Acknowledgment sent               |
| 3-7   | Initial assessment                |
| 8-14  | Fix developed                     |
| 15-30 | Fix deployed                      |
| 30+   | Public disclosure (if applicable) |

---

## Security Checklist

### Deployment

- [ ] All environment variables configured (`DATABASE_URL`, `FIREBASE_*`, `GEMINI_API_KEY`)
- [ ] `serverExternalPackages: ["firebase-admin"]` set in `next.config.ts`
- [ ] Debug mode disabled
- [ ] HTTPS enforced
- [ ] Security headers configured
- [ ] Firebase Authorized Domains include the production domain
- [ ] Neon connection uses SSL (`sslmode=require`)

### Regular Maintenance

- [ ] Weekly dependency audits (`npm audit`)
- [ ] Monthly access review
- [ ] Quarterly security assessment
- [ ] Annual penetration testing (recommended)

---

## Contact

For security concerns, please reach out to the repository maintainer directly. Do not open public issues for security vulnerabilities.

---

_Last updated: September 2026_
