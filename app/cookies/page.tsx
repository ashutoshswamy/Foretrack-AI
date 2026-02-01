"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { PiggyBank, ArrowLeft } from "lucide-react";

export default function CookiePolicy() {
  return (
    <div className="min-h-screen animated-bg">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <PiggyBank className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">
              Foretrack AI
            </span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card rounded-3xl p-8 md:p-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Cookie Policy
          </h1>
          <p className="text-gray-500 mb-8">Last updated: February 1, 2026</p>

          <div className="prose prose-gray max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                1. What Are Cookies?
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Cookies are small text files that are stored on your device when
                you visit a website. They help websites remember your
                preferences and improve your browsing experience.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                2. How We Use Cookies
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Foretrack AI uses cookies for the following purposes:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>
                  <strong>Authentication:</strong> To keep you signed in and
                  secure your session
                </li>
                <li>
                  <strong>Preferences:</strong> To remember your settings like
                  currency preferences
                </li>
                <li>
                  <strong>Analytics:</strong> To understand how users interact
                  with our application
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                3. Types of Cookies We Use
              </h2>

              <div className="mb-6">
                <h3 className="text-xl font-medium text-gray-800 mb-2">
                  Essential Cookies
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  These cookies are necessary for the application to function
                  properly. They enable core functionality such as user
                  authentication and session management. These cannot be
                  disabled.
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-medium text-gray-800 mb-2">
                  Functional Cookies
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  These cookies remember your preferences and choices to provide
                  a more personalized experience, such as your preferred
                  currency and display settings.
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-medium text-gray-800 mb-2">
                  Analytics Cookies
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  These cookies help us understand how visitors interact with
                  our application by collecting and reporting information
                  anonymously. This helps us improve our services.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                4. Third-Party Cookies
              </h2>
              <p className="text-gray-600 leading-relaxed">
                We use trusted third-party services that may set their own
                cookies:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mt-4">
                <li>
                  <strong>Clerk:</strong> For authentication and user management
                </li>
                <li>
                  <strong>Vercel:</strong> For hosting and analytics
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                5. Managing Cookies
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Most web browsers allow you to control cookies through their
                settings. You can usually find these settings in the
                &ldquo;Options&rdquo; or &ldquo;Preferences&rdquo; menu of your
                browser. However, please note that disabling essential cookies
                may affect the functionality of our application.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                6. Cookie Retention
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Session cookies are deleted when you close your browser.
                Persistent cookies remain on your device for a set period or
                until you delete them. Authentication cookies typically expire
                after 30 days of inactivity.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                7. Updates to This Policy
              </h2>
              <p className="text-gray-600 leading-relaxed">
                We may update this Cookie Policy from time to time. Any changes
                will be posted on this page with an updated revision date.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                8. Contact Us
              </h2>
              <p className="text-gray-600 leading-relaxed">
                If you have any questions about our use of cookies, please
                contact us at{" "}
                <a
                  href="mailto:ashutoshswamy397@gmail.com"
                  className="text-indigo-600 hover:underline"
                >
                  ashutoshswamy397@gmail.com
                </a>
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
