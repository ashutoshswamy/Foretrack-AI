"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { PiggyBank, ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
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
            Privacy Policy
          </h1>
          <p className="text-gray-500 mb-8">Last updated: February 1, 2026</p>

          <div className="prose prose-gray max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                1. Introduction
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Welcome to Foretrack AI. We respect your privacy and are
                committed to protecting your personal data. This privacy policy
                explains how we collect, use, and safeguard your information
                when you use our expense tracking application.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                2. Information We Collect
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We collect the following types of information:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>
                  <strong>Account Information:</strong> Email address and name
                  when you create an account
                </li>
                <li>
                  <strong>Financial Data:</strong> Expense entries, categories,
                  and budget information you input
                </li>
                <li>
                  <strong>Usage Data:</strong> How you interact with our
                  application to improve our services
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                3. How We Use Your Information
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Your information is used to:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Provide and maintain our expense tracking services</li>
                <li>Generate AI-powered insights and recommendations</li>
                <li>Improve and personalize your experience</li>
                <li>Communicate with you about updates and features</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                4. Data Security
              </h2>
              <p className="text-gray-600 leading-relaxed">
                We implement industry-standard security measures to protect your
                data. Your financial information is encrypted both in transit
                and at rest. We use secure authentication through Clerk and
                store data in secure, encrypted databases.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                5. Data Sharing
              </h2>
              <p className="text-gray-600 leading-relaxed">
                We do not sell your personal data. We may share data with
                trusted third-party services (like our AI provider) solely to
                provide our services. These partners are bound by strict
                confidentiality agreements.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                6. Your Rights
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                You have the right to:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Delete your account and associated data</li>
                <li>Export your data</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                7. Contact Us
              </h2>
              <p className="text-gray-600 leading-relaxed">
                If you have any questions about this Privacy Policy, please
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
