import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    {
      name: 'Basic',
      price: isAnnual ? 99 : 9,
      features: [
        'Basic expense tracking',
        'Monthly reports',
        'Mobile app access',
        'Email support',
        '2 linked accounts',
      ],
      cta: 'Get Started',
      popular: false,
    },
    {
      name: 'Pro',
      price: isAnnual ? 199 : 19,
      features: [
        'Advanced expense tracking',
        'Real-time AI insights',
        'Unlimited reports',
        'Priority support',
        'Unlimited linked accounts',
        'Custom categories',
        'Data export',
      ],
      cta: 'Start Free Trial',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: isAnnual ? 299 : 29,
      features: [
        'Everything in Pro',
        'Custom AI models',
        'API access',
        'Dedicated support',
        'Team collaboration',
        'Advanced analytics',
        'Custom integrations',
      ],
      cta: 'Contact Sales',
      popular: false,
    },
  ];

  return (
    <div className="bg-gray-50">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            className="h-full w-full object-cover"
            src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2850&q=80"
            alt=""
          />
          <div className="absolute inset-0 bg-blue-600 mix-blend-multiply" />
        </div>
        <div className="relative px-4 py-16 sm:px-6 sm:py-24 lg:py-32 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center"
          >
            <h1 className="text-center text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Simple, transparent pricing
            </h1>
            <p className="mt-6 max-w-lg mx-auto text-center text-xl text-blue-100 sm:max-w-3xl">
              Choose the perfect plan for your needs. All plans include a 14-day free trial.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Pricing toggle */}
      <div className="relative mt-8 flex justify-center">
        <div className="flex items-center space-x-4">
          <span className={`text-sm ${isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>Annual</span>
          <button
            type="button"
            onClick={() => setIsAnnual(!isAnnual)}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              isAnnual ? 'bg-gray-200' : 'bg-blue-600'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                isAnnual ? 'translate-x-0' : 'translate-x-5'
              }`}
            />
          </button>
          <span className={`text-sm ${isAnnual ? 'text-gray-500' : 'text-gray-900'}`}>Monthly</span>
        </div>
      </div>

      {/* Pricing cards */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`rounded-lg shadow-lg divide-y divide-gray-200 ${
                plan.popular ? 'ring-2 ring-blue-600' : ''
              }`}
            >
              <div className="p-6 bg-white rounded-t-lg">
                {plan.popular && (
                  <p className="absolute top-0 -translate-y-1/2 bg-blue-600 text-white px-3 py-1 text-sm font-semibold rounded-full">
                    Most Popular
                  </p>
                )}
                <h2 className="text-lg font-medium text-gray-900">{plan.name}</h2>
                <p className="mt-4">
                  <span className="text-4xl font-extrabold text-gray-900">${plan.price}</span>
                  <span className="text-base font-medium text-gray-500">/{isAnnual ? 'year' : 'month'}</span>
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`mt-8 w-full rounded-md py-2 px-4 text-sm font-semibold text-white shadow-sm ${
                    plan.popular
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                >
                  {plan.cta}
                </motion.button>
              </div>
              <div className="px-6 pt-6 pb-8 bg-white rounded-b-lg">
                <h3 className="text-xs font-medium text-gray-900 tracking-wide uppercase">
                  What's included
                </h3>
                <ul className="mt-6 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex space-x-3">
                      <svg
                        className="flex-shrink-0 h-5 w-5 text-green-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm text-gray-500">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-20 lg:px-8">
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900">
                Frequently asked questions
              </h2>
              <p className="mt-4 text-lg text-gray-500">
                Can't find the answer you're looking for? Contact our support team.
              </p>
            </div>
            <div className="mt-12 lg:mt-0 lg:col-span-2">
              <dl className="space-y-12">
                {[
                  {
                    question: 'How does the free trial work?',
                    answer:
                      'You can try any plan free for 14 days. No credit card required. Cancel anytime.',
                  },
                  {
                    question: 'Can I switch plans later?',
                    answer:
                      'Yes, you can upgrade or downgrade your plan at any time. The change will be reflected in your next billing cycle.',
                  },
                  {
                    question: 'What payment methods do you accept?',
                    answer:
                      'We accept all major credit cards, PayPal, and bank transfers for enterprise customers.',
                  },
                ].map((faq, index) => (
                  <motion.div
                    key={faq.question}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <dt className="text-lg font-medium text-gray-900">
                      {faq.question}
                    </dt>
                    <dd className="mt-2 text-base text-gray-500">{faq.answer}</dd>
                  </motion.div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
