"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { PiggyBank, ArrowLeft } from "lucide-react";

export default function TermsOfService() {
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
            Terms of Service
          </h1>
          <p className="text-gray-500 mb-8">Last updated: February 1, 2026</p>

          <div className="prose prose-gray max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                1. Acceptance of Terms
              </h2>
              <p className="text-gray-600 leading-relaxed">
                By accessing and using Foretrack AI, you agree to be bound by
                these Terms of Service. If you do not agree to these terms,
                please do not use our service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                2. Description of Service
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Foretrack AI is a free expense tracking and budgeting
                application that uses artificial intelligence to help users
                manage their finances. Our services include expense tracking,
                budget management, AI-powered categorization, and financial
                insights.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                3. User Accounts
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                When creating an account, you agree to:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Notify us immediately of any unauthorized access</li>
                <li>Be responsible for all activities under your account</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                4. Acceptable Use
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                You agree not to:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Use the service for any illegal purposes</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with or disrupt the service</li>
                <li>Upload malicious code or content</li>
                <li>Violate the rights of others</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                5. Intellectual Property
              </h2>
              <p className="text-gray-600 leading-relaxed">
                The Foretrack AI name, logo, and all related content are owned
                by us. You retain ownership of the financial data you input into
                the application. By using our service, you grant us a limited
                license to process your data to provide our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                6. Disclaimer
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Foretrack AI is provided &ldquo;as is&rdquo; without warranties
                of any kind. Our AI-powered insights are for informational
                purposes only and should not be considered financial advice.
                Always consult with a qualified financial advisor for important
                financial decisions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                7. Limitation of Liability
              </h2>
              <p className="text-gray-600 leading-relaxed">
                We shall not be liable for any indirect, incidental, special, or
                consequential damages arising from your use of the service. Our
                total liability shall not exceed the amount you have paid us
                (which is zero, as our service is free).
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                8. Changes to Terms
              </h2>
              <p className="text-gray-600 leading-relaxed">
                We reserve the right to modify these terms at any time. We will
                notify users of significant changes. Continued use of the
                service after changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                9. Contact Us
              </h2>
              <p className="text-gray-600 leading-relaxed">
                If you have any questions about these Terms of Service, please
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
