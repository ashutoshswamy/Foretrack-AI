"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useUser, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import {
  ArrowRight,
  BarChart3,
  PiggyBank,
  Zap,
  Users,
  TrendingUp,
  Star,
  Shield,
  Clock,
  Smartphone,
  CheckCircle,
  LayoutDashboard,
  Github,
  Mail,
} from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
};

export default function Home() {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-[#0c0c0e] overflow-hidden relative">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[radial-gradient(ellipse,rgba(201,169,110,0.07),transparent_70%)]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(52,211,153,0.04),transparent_70%)]" />
        <div className="grid-pattern absolute inset-0 opacity-50" />
      </div>

      {/* Navigation */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#c9a96e] flex items-center justify-center">
              <PiggyBank className="w-[18px] h-[18px] text-[#0c0c0e]" />
            </div>
            <span className="text-lg font-semibold text-[#ededef] tracking-tight">
              Foretrack AI
            </span>
          </div>

          <SignedOut>
            <div className="flex items-center gap-3 sm:gap-4">
              <Link
                href="/sign-in"
                className="text-sm text-[#8b8b96] hover:text-[#c9a96e] font-medium transition-colors duration-200"
              >
                Sign In
              </Link>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href="/sign-up"
                  className="btn-primary text-sm px-4 py-2 sm:px-5 sm:py-2.5"
                >
                  Get Started
                </Link>
              </motion.div>
            </div>
          </SignedOut>

          <SignedIn>
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 text-sm text-[#8b8b96] hover:text-[#c9a96e] font-medium transition-colors duration-200"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
              <div className="flex items-center gap-3 pl-4 border-l border-[#2a2a32]">
                <span className="text-sm text-[#5a5a66] hidden sm:block">
                  {user?.firstName || "User"}
                </span>
                <UserButton afterSignOutUrl="/" />
              </div>
            </div>
          </SignedIn>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 pb-24">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="text-center"
        >
          <motion.div
            variants={item}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#c9a96e]/10 border border-[#c9a96e]/20 text-xs text-[#c9a96e] font-medium mb-8 tracking-wide uppercase"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#34d399] animate-pulse" />
            AI-Powered Financial Intelligence
          </motion.div>

          <motion.h1
            variants={item}
            className="font-serif text-4xl sm:text-5xl md:text-7xl font-bold text-[#ededef] mb-5 sm:mb-6 leading-[1.1] tracking-tight px-2 sm:px-0"
          >
            Take Control of Your
            <span className="block gradient-text mt-1">Financial Future</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="text-base sm:text-lg text-[#8b8b96] mb-10 sm:mb-14 max-w-xl mx-auto leading-relaxed px-4 sm:px-0"
          >
            Smart expense tracking powered by AI. Personalized insights,
            automated categorization, and intelligent budget recommendations.
          </motion.p>

          <motion.div
            variants={item}
            className="flex flex-col sm:flex-row gap-3 justify-center items-center"
          >
            <SignedOut>
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href="/sign-up"
                  className="group inline-flex items-center gap-2 px-6 py-3 sm:px-8 sm:py-3.5 bg-[#c9a96e] text-[#0c0c0e] rounded-xl font-semibold text-sm sm:text-base shadow-lg shadow-[#c9a96e]/20 hover:shadow-xl hover:shadow-[#c9a96e]/25 transition-all duration-300"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href="/sign-in"
                  className="inline-flex items-center gap-2 px-6 py-3 sm:px-8 sm:py-3.5 bg-[#16161a] text-[#ededef] rounded-xl font-semibold text-sm sm:text-base border border-[#2a2a32] hover:border-[#c9a96e]/40 transition-all duration-300"
                >
                  Sign In
                </Link>
              </motion.div>
            </SignedOut>

            <SignedIn>
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href="/dashboard"
                  className="group inline-flex items-center gap-2 px-8 py-3.5 bg-[#c9a96e] text-[#0c0c0e] rounded-xl font-semibold text-base shadow-lg shadow-[#c9a96e]/20 transition-all duration-300"
                >
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </motion.div>
              <span className="inline-flex items-center gap-2 px-6 py-3 text-[#34d399] text-sm font-medium">
                <CheckCircle className="w-4 h-4" />
                You&apos;re all set
              </span>
            </SignedIn>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={item}
            className="mt-16 sm:mt-20 grid grid-cols-3 gap-4 sm:gap-8 max-w-lg mx-auto px-2 sm:px-0"
          >
            {[
              { value: "50K+", label: "Active Users", icon: Users },
              { value: "$2M+", label: "Money Saved", icon: TrendingUp },
              { value: "4.9", label: "User Rating", icon: Star },
            ].map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                <div className="text-xl sm:text-2xl font-bold text-[#ededef] flex items-center justify-center gap-1.5 mb-1">
                  {stat.value}
                </div>
                <div className="text-xs text-[#5a5a66]">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Features */}
        <motion.div
          id="features"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          viewport={{ once: true }}
          className="mt-36 scroll-mt-24"
        >
          <div className="text-center mb-14">
            <div className="accent-line mx-auto mb-6" />
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#ededef] mb-4 tracking-tight">
              Everything You Need to
              <span className="gradient-text"> Manage Money</span>
            </h2>
            <p className="text-[#8b8b96] max-w-xl mx-auto">
              Powerful features designed to give you complete control over your
              finances
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                title: "Smart Tracking",
                description:
                  "Automatically categorize expenses with AI. Import transactions and see real-time spending analytics.",
                icon: BarChart3,
                accent: "#60a5fa",
              },
              {
                title: "Budget Goals",
                description:
                  "Set personalized budgets for every category. Get alerts before overspending and track progress.",
                icon: PiggyBank,
                accent: "#34d399",
              },
              {
                title: "AI Insights",
                description:
                  "Get personalized recommendations to optimize spending. AI analyzes patterns and suggests savings.",
                icon: Zap,
                accent: "#c9a96e",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                viewport={{ once: true }}
                whileHover={{ y: -4, borderColor: `${feature.accent}30` }}
                className="bg-[#16161a] border border-[#2a2a32] p-7 rounded-2xl group cursor-pointer transition-all duration-300"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                  style={{ backgroundColor: `${feature.accent}15` }}
                >
                  <feature.icon
                    className="w-5 h-5"
                    style={{ color: feature.accent }}
                  />
                </div>
                <h3 className="text-lg font-semibold text-[#ededef] mb-2 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-sm text-[#8b8b96] leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* How It Works */}
        <motion.div
          id="how-it-works"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          viewport={{ once: true }}
          className="mt-36 scroll-mt-24"
        >
          <div className="text-center mb-14">
            <div className="accent-line mx-auto mb-6" />
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#ededef] mb-4 tracking-tight">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="text-[#8b8b96] max-w-xl mx-auto">
              Get started in minutes with our simple three-step process
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-[#2a2a32] to-transparent" />

            {[
              {
                step: "01",
                title: "Create Account",
                description:
                  "Sign up in seconds with email or social login. No credit card required.",
                icon: Users,
              },
              {
                step: "02",
                title: "Add Expenses",
                description:
                  "Log your expenses manually or let AI categorize them automatically.",
                icon: BarChart3,
              },
              {
                step: "03",
                title: "Get Insights",
                description:
                  "Receive personalized AI recommendations and watch your savings grow.",
                icon: TrendingUp,
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.12 }}
                viewport={{ once: true }}
                className="relative text-center"
              >
                <div className="w-24 h-24 mx-auto rounded-2xl bg-[#16161a] border border-[#2a2a32] flex items-center justify-center mb-5 relative">
                  <item.icon className="w-10 h-10 text-[#c9a96e]" />
                  <span className="absolute -top-2 -right-2 w-7 h-7 bg-[#c9a96e] rounded-lg flex items-center justify-center text-[#0c0c0e] font-bold text-xs">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-[#ededef] mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-[#8b8b96]">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          viewport={{ once: true }}
          className="mt-36"
        >
          <div className="bg-[#16161a] border border-[#2a2a32] rounded-2xl p-8 md:p-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Shield,
                  label: "Bank-Level Security",
                  sublabel: "256-bit encryption",
                },
                {
                  icon: Clock,
                  label: "Real-Time Sync",
                  sublabel: "Instant updates",
                },
                {
                  icon: Smartphone,
                  label: "Works Everywhere",
                  sublabel: "Web & Mobile",
                },
              ].map((badge, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="w-12 h-12 mx-auto rounded-xl bg-[#c9a96e]/10 flex items-center justify-center mb-3">
                    <badge.icon className="w-5 h-5 text-[#c9a96e]" />
                  </div>
                  <h4 className="font-semibold text-[#ededef] text-sm">
                    {badge.label}
                  </h4>
                  <p className="text-xs text-[#5a5a66] mt-1">
                    {badge.sublabel}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          viewport={{ once: true }}
          className="mt-36"
        >
          <div className="bg-[#16161a] border border-[#2a2a32] rounded-2xl p-10 sm:p-14 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,169,110,0.05),transparent_70%)]" />
            <div className="relative z-10">
              <div className="w-14 h-14 mx-auto rounded-xl bg-[#c9a96e] flex items-center justify-center mb-6">
                <PiggyBank className="w-7 h-7 text-[#0c0c0e]" />
              </div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#ededef] mb-4 tracking-tight">
                Ready to Transform Your Finances?
              </h2>
              <p className="text-[#8b8b96] mb-8 max-w-md mx-auto">
                Join thousands of users who are already saving more and spending
                smarter with Foretrack AI.
              </p>

              <SignedOut>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    href="/sign-up"
                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#c9a96e] text-[#0c0c0e] rounded-xl font-semibold text-base shadow-lg shadow-[#c9a96e]/20 transition-all duration-300"
                  >
                    Get Started for Free
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
                <p className="text-xs text-[#5a5a66] mt-4">
                  100% Free -- No credit card required
                </p>
              </SignedOut>

              <SignedIn>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#c9a96e] text-[#0c0c0e] rounded-xl font-semibold text-base shadow-lg shadow-[#c9a96e]/20 transition-all duration-300"
                  >
                    Continue to Dashboard
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
                <p className="text-xs text-[#5a5a66] mt-4">
                  Welcome back! Your financial journey continues.
                </p>
              </SignedIn>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mt-20 sm:mt-28 border-t border-[#1f1f27] pt-10 sm:pt-14 px-2 sm:px-0"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-[#c9a96e] flex items-center justify-center">
                  <PiggyBank className="w-4 h-4 text-[#0c0c0e]" />
                </div>
                <span className="text-base font-semibold text-[#ededef]">
                  Foretrack AI
                </span>
              </div>
              <p className="text-[#5a5a66] text-sm leading-relaxed">
                Smart expense tracking powered by AI. Take control of your
                financial future today.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-[#8b8b96] text-xs uppercase tracking-wider mb-4">
                Product
              </h4>
              <ul className="space-y-2.5 text-[#5a5a66] text-sm">
                <li>
                  <Link
                    href="/#features"
                    className="hover:text-[#c9a96e] transition-colors"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#how-it-works"
                    className="hover:text-[#c9a96e] transition-colors"
                  >
                    How It Works
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[#8b8b96] text-xs uppercase tracking-wider mb-4">
                Legal
              </h4>
              <ul className="space-y-2.5 text-[#5a5a66] text-sm">
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-[#c9a96e] transition-colors"
                  >
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="hover:text-[#c9a96e] transition-colors"
                  >
                    Terms
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cookies"
                    className="hover:text-[#c9a96e] transition-colors"
                  >
                    Cookies
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[#8b8b96] text-xs uppercase tracking-wider mb-4">
                Contact
              </h4>
              <ul className="space-y-2.5 text-[#5a5a66] text-sm">
                <li>
                  <a
                    href="https://github.com/ashutoshswamy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 hover:text-[#c9a96e] transition-colors"
                  >
                    <Github className="w-3.5 h-3.5" />
                    ashutoshswamy
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:ashutoshswamy397@gmail.com"
                    className="inline-flex items-center gap-2 hover:text-[#c9a96e] transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    ashutoshswamy397@gmail.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between py-6 border-t border-[#1f1f27]">
            <p className="text-[#5a5a66] text-xs">
              &copy; 2026 Foretrack AI. All rights reserved.
            </p>
            <p className="text-[#5a5a66] text-xs mt-3 md:mt-0">
              Made with care for your finances
            </p>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}
