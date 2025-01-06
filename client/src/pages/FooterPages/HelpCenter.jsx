import React, { useState } from 'react';
import { motion } from 'framer-motion';

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Topics' },
    { id: 'getting-started', name: 'Getting Started' },
    { id: 'account', name: 'Account & Billing' },
    { id: 'features', name: 'Features & Usage' },
    { id: 'security', name: 'Security' },
    { id: 'troubleshooting', name: 'Troubleshooting' },
  ];

  const faqs = [
    {
      category: 'getting-started',
      question: 'How do I get started with FinSight?',
      answer: 'Sign up for an account, connect your bank accounts, and start tracking your expenses. Our AI will automatically categorize your transactions.',
    },
    {
      category: 'account',
      question: 'How do I change my subscription plan?',
      answer: 'Go to Settings > Billing to view and modify your current subscription plan. Changes will take effect in the next billing cycle.',
    },
    {
      category: 'features',
      question: 'How does the AI categorization work?',
      answer: 'Our AI analyzes your transaction patterns and automatically categorizes them based on merchant information and historical data.',
    },
    {
      category: 'security',
      question: 'Is my financial data secure?',
      answer: 'Yes, we use bank-level encryption and security measures to protect your data. We never store your bank credentials.',
    },
    {
      category: 'troubleshooting',
      question: 'What should I do if I cant connect my bank?',
      answer: 'First, ensure your bank credentials are correct. If issues persist, try refreshing the connection or contact our support team.',
    },
  ];

  const filteredFaqs = faqs.filter(
    (faq) =>
      (selectedCategory === 'all' || faq.category === selectedCategory) &&
      (faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-blue-600">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl font-extrabold text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
              How can we help you?
            </h1>
            <p className="mt-5 text-xl text-blue-100">
              Find answers to common questions or contact our support team
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-12 max-w-xl mx-auto"
          >
            <div className="relative">
              <input
                type="text"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm pl-4 pr-10 py-3"
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((category, index) => (
            <motion.button
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-500 hover:text-gray-900 bg-white hover:bg-gray-100'
              } transition-colors duration-200`}
            >
              {category.name}
            </motion.button>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto divide-y-2 divide-gray-200">
          {filteredFaqs.map((faq, index) => (
            <motion.div
              key={faq.question}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="py-8"
            >
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium text-gray-900">{faq.question}</h3>
                <span className="ml-6">
                  <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
              <div className="mt-4">
                <p className="text-base text-gray-500">{faq.answer}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Contact Support Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-24 lg:px-8">
          <div className="divide-y-2 divide-gray-200">
            <div className="lg:grid lg:grid-cols-3 lg:gap-8">
              <h2 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
                Still need help?
              </h2>
              <div className="mt-8 grid grid-cols-1 gap-12 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-12 lg:mt-0 lg:col-span-2">
                <div>
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Email Support
                  </h3>
                  <div className="mt-2 text-base text-gray-500">
                    <p>avijitdam003@gmail.com</p>
                    <p className="mt-1">We'll respond within 24 hours</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Live Chat
                  </h3>
                  <div className="mt-2 text-base text-gray-500">
                    <p>Available 24/7</p>
                    <p className="mt-1">Average response time: 5 minutes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
