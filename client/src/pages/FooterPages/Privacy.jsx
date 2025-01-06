import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Privacy = () => {
  const [activeSectionId, setActiveSectionId] = useState(null);

  const sections = [
    {
      id: 'collection',
      title: 'Information Collection',
      content: `We collect information that you provide directly to us, including:
        • Personal information (name, email, phone number)
        • Financial information (transaction data, account balances)
        • Device and usage information
        • Communication preferences
        
        This information is collected when you:
        • Create an account
        • Connect your financial accounts
        • Use our services
        • Contact our support team
        • Subscribe to our newsletter`,
    },
    {
      id: 'usage',
      title: 'How We Use Your Information',
      content: `We use the collected information to:
        • Provide and maintain our services
        • Process your transactions
        • Send you important updates
        • Improve our services
        • Detect and prevent fraud
        • Comply with legal obligations
        
        Your data helps us personalize your experience and provide better financial insights.`,
    },
    {
      id: 'sharing',
      title: 'Information Sharing',
      content: `We may share your information with:
        • Service providers
        • Financial institutions
        • Legal authorities when required
        • Business partners (with your consent)
        
        We never sell your personal information to third parties.`,
    },
    {
      id: 'security',
      title: 'Data Security',
      content: `We implement robust security measures:
        • End-to-end encryption
        • Regular security audits
        • Access controls
        • Secure data storage
        • Employee training
        
        We follow industry best practices to protect your data.`,
    },
    {
      id: 'rights',
      title: 'Your Rights',
      content: `You have the right to:
        • Access your data
        • Correct inaccurate data
        • Delete your data
        • Object to processing
        • Data portability
        • Withdraw consent
        
        Contact us to exercise these rights.`,
    },
    {
      id: 'cookies',
      title: 'Cookies & Tracking',
      content: `We use cookies and similar technologies to:
        • Remember your preferences
        • Analyze site traffic
        • Improve user experience
        • Personalize content
        
        You can control cookie settings in your browser.`,
    },
    {
      id: 'changes',
      title: 'Changes to Policy',
      content: `We may update this policy periodically. We will notify you of any material changes via:
        • Email
        • App notifications
        • Website announcements
        
        Continue using our services after changes constitutes acceptance.`,
    },
    {
      id: 'contact',
      title: 'Contact Us',
      content: `For privacy-related questions:
        • Email: privacy@finsight.com
        • Phone: 1-800-FINSIGHT
        • Address: 123 Privacy Street, Tech City, TC 12345
        
        We aim to respond within 48 hours.`,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl font-extrabold text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
              Privacy Policy
            </h1>
            <p className="mt-5 text-xl text-gray-300">
              Your privacy is our top priority. Learn how we protect your data.
            </p>
            <p className="mt-3 text-sm text-gray-400">
              Last updated: January 6, 2025
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Sidebar Navigation */}
          <div className="hidden lg:block lg:col-span-3">
            <nav className="sticky top-4 space-y-1">
              {sections.map((section, index) => (
                <motion.button
                  key={section.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onClick={() => setActiveSectionId(section.id)}
                  className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md ${
                    activeSectionId === section.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {section.title}
                </motion.button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <main className="mt-8 lg:mt-0 lg:col-span-9">
            <div className="space-y-16">
              {sections.map((section, index) => (
                <motion.div
                  key={section.id}
                  id={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative"
                >
                  <div className="relative">
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight sm:text-3xl">
                      {section.title}
                    </h2>
                    <div className="mt-3 text-gray-600 space-y-4 whitespace-pre-line">
                      {section.content}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </main>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Have questions about our privacy policy?
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Our privacy team is here to help you understand how we protect your data.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-8 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Contact Privacy Team
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
