# Foretrack AI - Expense Tracking & Budgeting

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)](https://supabase.com/)
[![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF?logo=clerk)](https://clerk.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A modern, AI-powered expense tracking and budgeting application built with Next.js, Supabase, Clerk authentication, and Google Gemini AI. Take control of your finances with smart categorization, personalized insights, and an intelligent financial assistant.

![Foretrack AI Dashboard](https://via.placeholder.com/800x400?text=Foretrack+AI+Dashboard)

## ✨ Features

- 📊 **Expense Tracking**: Log and categorize your expenses easily with an intuitive interface
- 💰 **Budget Management**: Set budgets for different categories and track your spending in real-time
- 📈 **Income Tracking**: Track multiple income sources and monitor your cash flow
- 🤖 **AI-Powered Insights**: Get personalized financial insights powered by Google Gemini
- ✨ **Smart Categorization**: AI automatically suggests categories based on expense descriptions
- 💬 **AI Financial Assistant**: Chat with an AI assistant about your finances
- 🏷️ **Custom Categories & Tags**: Organize expenses with custom categories and tags
- 🎯 **Savings Goals**: Set and track progress towards your financial goals
- 💱 **Multi-Currency Support**: Track expenses in multiple currencies
- 🔐 **Secure Authentication**: User authentication powered by Clerk
- 💾 **Cloud Storage**: All data securely stored in Supabase with RLS
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- 🌙 **Modern UI**: Beautiful interface with smooth animations powered by Framer Motion

## 🛠️ Tech Stack

| Category           | Technology                             |
| ------------------ | -------------------------------------- |
| **Framework**      | Next.js 16 with App Router             |
| **Language**       | TypeScript 5.x                         |
| **Authentication** | Clerk                                  |
| **Database**       | Supabase (PostgreSQL)                  |
| **AI**             | Google Gemini (gemini-3-flash-preview) |
| **Styling**        | Tailwind CSS 4.x                       |
| **Animations**     | Framer Motion                          |
| **Icons**          | Lucide React                           |

## 🔒 Security

This project implements several security measures:

- **Authentication**: Secure user auth via Clerk
- **Data Isolation**: Row Level Security (RLS) on all tables
- **API Protection**: Server-side API routes for sensitive operations
- **Environment Variables**: Secrets never exposed to client

> 🔐 See [SECURITY.md](SECURITY.md) for our security policy and vulnerability reporting.

## ✨ Features Overview

### 💸 Expense Tracking

- Add expenses with amount, category, description, and date
- View recent expenses with edit/delete functionality
- AI-powered automatic categorization
- Tag expenses for better organization

### 📈 Income Management

- Track multiple income sources
- Support for recurring income
- Income vs. expense analytics

### 💰 Budget Management

- Set daily, weekly, monthly, or yearly budgets per category
- Visual progress bars showing budget usage
- Color-coded warnings (green, yellow, red) based on spending
- Automatic calculation of spending trends

### 🤖 AI Features

- **Smart Categorization**: AI suggests categories based on descriptions
- **Financial Insights**: Personalized tips and warnings
- **Chat Assistant**: Ask questions about your finances
- **Spending Analysis**: Pattern recognition and recommendations

### 🔐 User Authentication

- Secure sign-up and sign-in with Clerk
- Social login support (Google, GitHub, etc.)
- Protected routes requiring authentication
- User-specific data isolation

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
- [Supabase](https://supabase.com/) - Open source Firebase alternative
- [Clerk](https://clerk.com/) - Authentication and user management
- [Google Gemini](https://ai.google.dev/) - AI-powered features
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Lucide](https://lucide.dev/) - Beautiful open source icons

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/ashutoshswamy">ashutoshswamy</a>
</p>
