import React, { useState } from 'react';

const subscribeToNewsletter = async (email) => {
  // Implement API request to subscribe to newsletter
  // For demonstration purposes, this function does nothing
};

const NewsletterSubscription = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setMessage('Please enter a valid email address.');
      return;
    }

    try {
      await subscribeToNewsletter(email);
      setMessage('Thank you for subscribing!');
      setEmail('');
    } catch (error) {
      setMessage('Subscription failed. Please try again later.');
    }
  };

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Subscribe to our Newsletter</h2>
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full max-w-xs p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Subscribe
        </button>
      </form>
      {message && <p className="mt-4 text-center text-sm text-gray-600">{message}</p>}
    </div>
  );
};

const PageTemplate = ({ title, content }) => {
  return (
    <div className="min-h-screen bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-8">
          {title}
        </h1>
        <div className="prose prose-lg mx-auto">
          {content}
        </div>
        <NewsletterSubscription />
      </div>
    </div>
  );
};

export default PageTemplate;
