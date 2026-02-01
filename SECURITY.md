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

#### Clerk Authentication

- All user authentication is handled by [Clerk](https://clerk.com)
- Supports secure password hashing (bcrypt)
- Session management with secure, HTTP-only cookies
- Optional MFA/2FA support
- OAuth providers (Google, GitHub, etc.)

#### Route Protection

```typescript
// Protected routes via middleware
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
    auth.protect(); // Requires authentication
  }
});
```

### Data Protection

#### Row Level Security (RLS)

All database tables implement Row Level Security policies in Supabase:

```sql
-- Users can only view their own data
CREATE POLICY "Users can view own expenses"
ON expenses FOR SELECT
USING (auth.uid() = user_id);

-- Users can only insert their own data
CREATE POLICY "Users can insert own expenses"
ON expenses FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can only update their own data
CREATE POLICY "Users can update own expenses"
ON expenses FOR UPDATE
USING (auth.uid() = user_id);

-- Users can only delete their own data
CREATE POLICY "Users can delete own expenses"
ON expenses FOR DELETE
USING (auth.uid() = user_id);
```

This ensures:

- ✅ Complete data isolation between users
- ✅ No cross-user data access possible
- ✅ Database-level enforcement (not just application-level)

#### Data Encryption

| Layer     | Protection                 |
| --------- | -------------------------- |
| Transit   | TLS 1.3 (HTTPS)            |
| At Rest   | AES-256 (Supabase)         |
| Passwords | Managed by Clerk (bcrypt)  |
| API Keys  | Environment variables only |

### API Security

#### Server-Side API Routes

All AI API routes are server-side only:

```
/api/ai/categorize  → Server-side only
/api/ai/chat        → Server-side only
/api/ai/insights    → Server-side only
```

#### API Key Protection

- API keys are **never** exposed to the client
- All AI requests go through Next.js API routes
- Environment variables are validated at build time

```typescript
// Keys are only accessible server-side
const apiKey = process.env.GEMINI_API_KEY!; // Server only
```

### Environment Variables

#### Required Security Variables

```bash
# Never commit these to version control!
CLERK_SECRET_KEY=sk_xxxxx           # Server-only
GEMINI_API_KEY=AIzaxxxxx            # Server-only

# Client-safe (public) keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_xxxxx
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxx
```

#### Best Practices

- ✅ Use `.env.local` for local development
- ✅ Add `.env*` to `.gitignore`
- ✅ Use Vercel/hosting provider's environment variable management
- ❌ Never hardcode API keys
- ❌ Never commit `.env` files

---

## Security Best Practices

### For Users

1. **Strong Passwords**: Use a unique, strong password
2. **Enable 2FA**: If available, enable two-factor authentication
3. **Secure Sessions**: Log out from shared devices
4. **Review Access**: Periodically review connected accounts

### For Developers

1. **Keep Dependencies Updated**

   ```bash
   npm audit
   npm update
   ```

2. **Validate All Inputs**
   - Server-side validation required
   - Sanitize user inputs
   - Use parameterized queries

3. **Secure Headers**

   ```typescript
   // next.config.ts
   const securityHeaders = [
     {
       key: "X-Frame-Options",
       value: "DENY",
     },
     {
       key: "X-Content-Type-Options",
       value: "nosniff",
     },
     {
       key: "Referrer-Policy",
       value: "strict-origin-when-cross-origin",
     },
   ];
   ```

4. **Content Security Policy**
   ```typescript
   {
     key: 'Content-Security-Policy',
     value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
   }
   ```

---

## Third-Party Security

### Clerk

- SOC 2 Type II certified
- GDPR compliant
- Regular security audits
- [Clerk Security](https://clerk.com/security)

### Supabase

- SOC 2 Type II certified
- HIPAA compliant (Enterprise)
- Encrypted at rest and in transit
- [Supabase Security](https://supabase.com/security)

### Google Gemini AI

- Enterprise-grade security
- Data processed per Google's AI Principles
- [Google AI Privacy](https://ai.google/responsibility/principles/)

---

## Data Privacy

### What We Collect

- Email address (via Clerk)
- Financial transaction data (expenses, income, budgets)
- Usage analytics (optional)

### What We DON'T Collect

- Payment card numbers
- Bank account details
- Social Security numbers
- Passwords (managed by Clerk)

### Data Retention

- Active accounts: Data retained while account is active
- Deleted accounts: Data removed within 30 days
- Backups: Retained for 7 days after deletion

### Data Export

Users can export their data at any time via the dashboard settings.

### Data Deletion

Users can request complete data deletion by:

1. Deleting their account through the dashboard
2. Contacting the maintainer directly

---

## Vulnerability Disclosure Timeline

| Day   | Action                            |
| ----- | --------------------------------- |
| 0     | Vulnerability reported            |
| 1-2   | Acknowledgment sent               |
| 3-7   | Initial assessment                |
| 8-14  | Fix developed                     |
| 15-30 | Fix deployed                      |
| 30+   | Public disclosure (if applicable) |

---

## Security Checklist

### Deployment

- [ ] All environment variables configured
- [ ] Debug mode disabled
- [ ] HTTPS enforced
- [ ] Security headers configured
- [ ] RLS policies enabled
- [ ] API rate limiting configured

### Regular Maintenance

- [ ] Weekly dependency audits
- [ ] Monthly access review
- [ ] Quarterly security assessment
- [ ] Annual penetration testing (recommended)

---

## Contact

For security concerns, please reach out to the repository maintainer directly. Do not open public issues for security vulnerabilities.

---

_Last updated: February 2026_
