# Foretrack AI - Expense Tracking & Budgeting

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Neon](https://img.shields.io/badge/Neon-PostgreSQL-00E599?logo=postgresql&logoColor=white)](https://neon.tech/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A modern, AI-powered expense tracking and budgeting application built with Next.js, Neon Postgres, Firebase Authentication, and Google Gemini AI. Take control of your finances with smart categorization, personalized insights, and an intelligent financial assistant.

## ✨ Features

- 📊 **Expense Tracking**: Log and categorize your expenses easily with an intuitive interface
- 💰 **Budget Management**: Set budgets per category and period, with visual progress tracking
- 📈 **Income Tracking**: Track income sources and monitor your cash flow
- 🤖 **AI-Powered Insights**: Get personalized financial insights powered by Google Gemini
- ✨ **Smart Categorization**: AI automatically suggests categories based on expense descriptions
- 💬 **AI Financial Assistant**: Chat with an AI assistant about your finances
- 🏷️ **Custom Categories**: Organize expenses with your own categories, icons, and colors
- 💱 **Currency Selection**: Choose your preferred display currency from 15+ supported currencies
- 🔐 **Secure Authentication**: Google sign-in via Firebase, with server-verified session cookies
- 💾 **Cloud Storage**: All data stored in Neon (serverless PostgreSQL)
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- 🌙 **Modern UI**: Beautiful interface with smooth animations powered by Framer Motion

## 🛠️ Tech Stack

| Category           | Technology                        |
| ------------------- | ---------------------------------- |
| **Framework**       | Next.js 16 (App Router, Turbopack) |
| **Language**        | TypeScript 5.x                     |
| **Authentication**  | Firebase Auth (Google sign-in) + server session cookies |
| **Database**        | Neon (serverless PostgreSQL)       |
| **AI**              | Google Gemini (`gemini-3.5-flash-lite`) |
| **Styling**         | Tailwind CSS 4.x                   |
| **Animations**      | Framer Motion                      |
| **Icons**           | Lucide React                       |

## 🔒 Security

This project implements several security measures:

- **Authentication**: Google sign-in via Firebase, exchanged for an `httpOnly` session cookie verified server-side on every request
- **Data Isolation**: Every query is scoped by `user_id` at the API layer (see `lib/session.ts`)
- **API Protection**: All database and AI operations run through server-side Next.js API routes — no credentials reach the client
- **Security Headers & CSP**: HSTS, X-Frame-Options, and a locked-down Content-Security-Policy are set in `next.config.ts`
- **Environment Variables**: Secrets (`DATABASE_URL`, `FIREBASE_*` admin credentials, `GEMINI_API_KEY`) never exposed to the client

> 🔐 See [SECURITY.md](SECURITY.md) for our full security policy and vulnerability reporting.

## ✨ Features Overview

### 💸 Expense Tracking

- Add expenses with amount, category, description, and date
- View, edit, and delete recent expenses
- AI-powered automatic categorization

### 📈 Income Management

- Track income by source (Salary, Freelance, Business, etc.)
- Income vs. expense analytics

### 💰 Budget Management

- Set daily, weekly, monthly, quarterly, or yearly budgets per category
- Visual progress bars showing budget usage
- Color-coded warnings based on spending

### 🤖 AI Features

- **Smart Categorization**: AI suggests a category based on the expense description
- **Financial Insights**: Personalized tips and warnings from Gemini
- **Chat Assistant**: Ask questions about your finances
- **Spending Analysis**: Natural-language summary of spending patterns

### 🔐 User Authentication

- Google sign-in via Firebase Authentication
- Session verified server-side via Firebase Admin on every protected request
- Middleware-protected routes with user-specific data isolation

## 📚 Documentation

- [DOCUMENTATION.md](DOCUMENTATION.md) - Complete technical documentation
- [SECURITY.md](SECURITY.md) - Security policy and guidelines
- [database/schema.sql](database/schema.sql) - Database schema reference

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please read our [SECURITY.md](SECURITY.md) for security-related contributions.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Neon](https://neon.tech/) - Serverless PostgreSQL
- [Firebase](https://firebase.google.com/) - Authentication
- [Google Gemini](https://ai.google.dev/) - AI-powered features
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Lucide](https://lucide.dev/) - Beautiful open source icons

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/ashutoshswamy">ashutoshswamy</a>
</p>
