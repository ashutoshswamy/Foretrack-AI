"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useUser, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import {
  ArrowRight,
  PlayCircle,
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
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Home() {
  const { user } = useUser();

  return (
    <div className="min-h-screen animated-bg overflow-hidden">
      {/* Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.3 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl animate-float"
        />
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.3 }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
          className="absolute top-40 -left-40 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        />
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.3 }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.4 }}
          className="absolute bottom-40 right-20 w-60 h-60 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl animate-float"
          style={{ animationDelay: "4s" }}
        />
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.2 }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.6 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl animate-float"
          style={{ animationDelay: "3s" }}
        />
      </div>

      {/* Navigation */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg"
            >
              <PiggyBank className="w-5 h-5 text-white" />
            </motion.div>
            <span className="text-xl font-bold gradient-text">
              Foretrack AI
            </span>
          </div>

          {/* Show different nav based on auth state */}
          <SignedOut>
            <div className="flex items-center gap-2 sm:gap-4">
              <Link
                href="/sign-in"
                className="text-sm sm:text-base text-gray-600 hover:text-indigo-600 font-medium transition-colors"
              >
                Sign In
              </Link>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/sign-up"
                  className="btn-primary text-sm sm:text-base px-3 py-2 sm:px-6 sm:py-3"
                >
                  Get Started
                </Link>
              </motion.div>
            </div>
          </SignedOut>

          <SignedIn>
            <div className="flex items-center gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 text-gray-600 hover:text-indigo-600 font-medium transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
              </motion.div>
              <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                <span className="text-sm text-gray-600 hidden sm:block">
                  Welcome, {user?.firstName || "User"}
                </span>
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-9 h-9 ring-2 ring-indigo-100",
                    },
                  }}
                />
              </div>
            </div>
          </SignedIn>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="text-center"
        >
          <motion.div
            variants={item}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-indigo-100 text-sm text-indigo-600 font-medium mb-8 shadow-sm"
          >
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-green-500"
            />
            AI-Powered Financial Intelligence
          </motion.div>

          <motion.h1
            variants={item}
            className="text-3xl sm:text-5xl md:text-7xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight px-2 sm:px-0"
          >
            Take Control of Your
            <span className="block gradient-text">Financial Future</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="text-base sm:text-xl text-gray-600 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed px-4 sm:px-0"
          >
            Smart expense tracking powered by AI. Get personalized insights,
            automated categorization, and intelligent budget recommendations
            that help you save more.
          </motion.p>

          <motion.div
            variants={item}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <SignedOut>
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href="/sign-up"
                  className="group inline-flex items-center gap-2 px-5 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-semibold text-base sm:text-lg shadow-xl shadow-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/40 transition-all duration-300"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href="/sign-in"
                  className="inline-flex items-center gap-2 px-5 py-3 sm:px-8 sm:py-4 bg-white/80 backdrop-blur-sm text-gray-700 rounded-2xl font-semibold text-base sm:text-lg border-2 border-gray-200 hover:border-indigo-300 hover:text-indigo-600 transition-all duration-300"
                >
                  <PlayCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  Watch Demo
                </Link>
              </motion.div>
            </SignedOut>

            <SignedIn>
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href="/dashboard"
                  className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-semibold text-lg shadow-xl shadow-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/40 transition-all duration-300"
                >
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="inline-flex items-center gap-2 px-8 py-4 bg-white/80 backdrop-blur-sm text-gray-700 rounded-2xl font-semibold text-lg border-2 border-green-200">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  You&apos;re all set!
                </span>
              </motion.div>
            </SignedIn>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={item}
            className="mt-10 sm:mt-16 grid grid-cols-3 gap-3 sm:gap-8 max-w-xl mx-auto px-4 sm:px-0"
          >
            {[
              { value: "50K+", label: "Active Users", icon: Users },
              { value: "$2M+", label: "Money Saved", icon: TrendingUp },
              { value: "4.9★", label: "User Rating", icon: Star },
            ].map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="text-center"
              >
                <div className="text-xl sm:text-3xl font-bold gradient-text flex items-center justify-center gap-1 sm:gap-2">
                  <stat.icon className="w-4 h-4 sm:w-6 sm:h-6 text-indigo-500" />
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-gray-500 mt-1">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Features */}
        <motion.div
          id="features"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-32 scroll-mt-24"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to
              <span className="gradient-text"> Manage Money</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to give you complete control over your
              finances
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Smart Tracking",
                description:
                  "Automatically categorize expenses with AI. Import transactions from any bank and see real-time spending analytics.",
                icon: BarChart3,
                gradient: "from-indigo-500 to-purple-600",
              },
              {
                title: "Budget Goals",
                description:
                  "Set personalized budgets for every category. Get alerts before overspending and track progress with visual insights.",
                icon: PiggyBank,
                gradient: "from-emerald-500 to-teal-600",
              },
              {
                title: "AI Insights",
                description:
                  "Get personalized recommendations to optimize spending. AI analyzes patterns and suggests ways to save more money.",
                icon: Zap,
                gradient: "from-amber-500 to-orange-600",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="glass-card p-8 rounded-3xl group cursor-pointer"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg`}
                >
                  <feature.icon className="w-7 h-7 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* How It Works Section */}
        <motion.div
          id="how-it-works"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-32 scroll-mt-24"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get started in minutes with our simple three-step process
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-16 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-indigo-200 via-purple-200 to-indigo-200" />

            {[
              {
                step: "01",
                title: "Create Account",
                description:
                  "Sign up in seconds with email or social login. No credit card required to start.",
                icon: Users,
              },
              {
                step: "02",
                title: "Add Expenses",
                description:
                  "Log your expenses manually or let AI categorize them automatically for you.",
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
                transition={{ duration: 0.5, delay: index * 0.15 }}
                viewport={{ once: true }}
                className="relative text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-white to-indigo-50 border-4 border-white shadow-xl flex items-center justify-center mb-6 relative z-10"
                >
                  <item.icon className="w-12 h-12 text-indigo-600" />
                  <span className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    {item.step}
                  </span>
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-32"
        >
          <div className="glass-card rounded-3xl p-8 md:p-12">
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
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                  className="text-center"
                >
                  <motion.div
                    whileHover={{ rotate: 5 }}
                    className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mb-4"
                  >
                    <badge.icon className="w-8 h-8 text-indigo-600" />
                  </motion.div>
                  <h4 className="font-semibold text-gray-900">{badge.label}</h4>
                  <p className="text-sm text-gray-500">{badge.sublabel}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-32"
        >
          <div className="glass-card rounded-3xl p-12 text-center relative overflow-hidden">
            <motion.div
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/10 bg-[length:200%_100%]"
            />
            <div className="relative z-10">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 mb-6 shadow-xl shadow-indigo-500/30"
              >
                <PiggyBank className="w-10 h-10 text-white" />
              </motion.div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Ready to Transform Your Finances?
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
                Join thousands of users who are already saving more and spending
                smarter with Foretrack AI.
              </p>

              <SignedOut>
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    href="/sign-up"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-semibold text-lg shadow-xl shadow-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/40 transition-all duration-300"
                  >
                    Get Started for Free
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </motion.div>
                <p className="text-sm text-gray-500 mt-4">
                  ✨ 100% Free • No credit card required
                </p>
              </SignedOut>

              <SignedIn>
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-semibold text-lg shadow-xl shadow-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/40 transition-all duration-300"
                  >
                    Continue to Dashboard
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </motion.div>
                <p className="text-sm text-gray-500 mt-4">
                  ✨ Welcome back! Your financial journey continues.
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
          className="mt-16 sm:mt-24 border-t border-gray-200/50 pt-8 sm:pt-12 px-2 sm:px-0"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <PiggyBank className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold gradient-text">
                  Foretrack AI
                </span>
              </div>
              <p className="text-gray-600 text-sm">
                Smart expense tracking powered by AI. Take control of your
                financial future today.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Product</h4>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>
                  <Link
                    href="/#features"
                    className="hover:text-indigo-600 transition-colors"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#how-it-works"
                    className="hover:text-indigo-600 transition-colors"
                  >
                    How It Works
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-indigo-600 transition-colors"
                  >
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="hover:text-indigo-600 transition-colors"
                  >
                    Terms
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cookies"
                    className="hover:text-indigo-600 transition-colors"
                  >
                    Cookies
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Contact</h4>
              <ul className="space-y-3 text-gray-600 text-sm">
                <li>
                  <a
                    href="https://github.com/ashutoshswamy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 hover:text-indigo-600 transition-colors"
                  >
                    <Github className="w-4 h-4" />
                    ashutoshswamy
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:ashutoshswamy397@gmail.com"
                    className="inline-flex items-center gap-2 hover:text-indigo-600 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    ashutoshswamy397@gmail.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between py-6 border-t border-gray-200/50">
            <p className="text-gray-500 text-sm">
              © 2026 Foretrack AI. All rights reserved.
            </p>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <span className="text-gray-500 text-sm">
                Made with ❤️ for your finances
              </span>
            </div>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}
