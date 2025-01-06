import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import './Landing.css';

const Landing = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const handleGetStarted = () => {
    navigate('/login');
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const handleScroll = () => {
      const position = window.pageYOffset;
      setScrollPosition(position);
    };

    const handleVisibility = () => {
      if (!isVisible && window.pageYOffset > 100) {
        setIsVisible(true);
      } else if (isVisible && window.pageYOffset <= 100) {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('scroll', handleVisibility);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', handleVisibility);
    };
  }, [isVisible]);

  // Stats data
  const stats = [
    { value: '98%', label: 'Customer Satisfaction' },
    { value: '24/7', label: 'Support Available' },
    { value: '50K+', label: 'Active Users' },
    { value: '$10M+', label: 'Money Saved' }
  ];

  // Enhanced floating action button - scroll to top only
  const FloatingActionButton = () => {
    const handleClick = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    };

    return (
      <div className="fixed bottom-8 right-8 z-50 flex flex-col items-center">
        <div
          className={`bg-white text-gray-700 text-sm py-2 px-4 rounded-lg shadow-lg mb-2 transition-all duration-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
        >
          Back to top
        </div>
        <button
          onClick={handleClick}
          className={`bg-blue-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 hover:bg-blue-700 hover:shadow-xl flex items-center justify-center ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
          }`}
          aria-label="Scroll to top"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      </div>
    );
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 min-h-screen">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2850&q=80"
            alt="Background"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        
        {/* Navigation */}
        <nav className="relative z-10 bg-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <span className="text-3xl font-bold text-white">FinSight</span>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate('/login')}
                  className="text-white hover:text-gray-200"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition duration-300"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 px-4 py-24 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="lg:grid lg:grid-cols-12 lg:gap-8">
              <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                  <span className="block">Smart Expense</span>
                  <span className="block text-indigo-200">Tracking with AI</span>
                </h1>
                <p className="mt-3 text-base text-gray-300 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                  Take control of your finances with our intelligent expense tracking solution. Get AI-powered insights and make smarter financial decisions.
                </p>
                <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left">
                  <button
                    onClick={handleGetStarted}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-gray-50 transition duration-300"
                  >
                    Get Started
                    <svg
                      className="ml-2 -mr-1 w-5 h-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
                <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
                  <div className="relative block w-full bg-white rounded-lg overflow-hidden">
                    <img
                      className="w-full"
                      src="https://github.com/user-attachments/assets/50beb66c-c65a-4e78-b587-390c4d314735"
                      alt="Dashboard Preview"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section with Screenshots */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-24 lg:text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Powerful Features for Your Finances
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Everything you need to manage your expenses effectively and make informed financial decisions.
            </p>
          </div>

          {/* Feature Screenshots - Each taking full page */}
          <div className="space-y-0">
            {/* Feature 1 - Full Page */}
            <div className="min-h-screen flex items-center">
              <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
                <div className="relative">
                  <img
                    className="w-full rounded-xl shadow-2xl ring-1 ring-black ring-opacity-5"
                    src="https://github.com/user-attachments/assets/d6bbc630-a9df-40b1-8c06-5afab2be0026"
                    alt="Analytics Dashboard"
                  />
                </div>
                <div className="mt-10 lg:mt-0 lg:ml-8">
                  <h3 className="text-3xl font-extrabold text-gray-900">
                    Comprehensive Analytics Dashboard
                  </h3>
                  <p className="mt-6 text-xl text-gray-500 leading-relaxed">
                    Get a complete overview of your finances with our intuitive dashboard. Track expenses, monitor trends, and make data-driven decisions. Our comprehensive analytics provide you with deep insights into your spending patterns and financial health.
                  </p>
                  <div className="mt-8">
                    <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2 - Full Page */}
            <div className="min-h-screen flex items-center bg-white">
              <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
                <div className="lg:order-2">
                  <img
                    className="w-full rounded-xl shadow-2xl ring-1 ring-black ring-opacity-5"
                    src="https://github.com/user-attachments/assets/5fca3ebd-4524-41cd-a63d-5242f152c382"
                    alt="Transaction Management"
                  />
                </div>
                <div className="mt-10 lg:mt-0 lg:mr-8 lg:order-1">
                  <h3 className="text-3xl font-extrabold text-gray-900">
                    Smart Transaction Management
                  </h3>
                  <p className="mt-6 text-xl text-gray-500 leading-relaxed">
                    Easily manage and categorize your transactions with our intelligent system. Our AI helps you identify patterns and optimize your spending habits, making financial management effortless and insightful.
                  </p>
                  <div className="mt-8">
                    <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                      Explore Features
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 3 - Full Page */}
            <div className="min-h-screen flex items-center bg-gray-50">
              <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
                <div className="relative">
                  <img
                    className="w-full rounded-xl shadow-2xl ring-1 ring-black ring-opacity-5"
                    src="https://github.com/user-attachments/assets/7a3db24e-fc6c-43f6-9cc8-fc245520832d"
                    alt="AI Insights"
                  />
                </div>
                <div className="mt-10 lg:mt-0 lg:ml-8">
                  <h3 className="text-3xl font-extrabold text-gray-900">
                    AI-Powered Insights
                  </h3>
                  <p className="mt-6 text-xl text-gray-500 leading-relaxed">
                    Get personalized financial insights and recommendations powered by advanced AI algorithms. Our system learns from your spending patterns to provide tailored advice for better financial decisions.
                  </p>
                  <div className="mt-8">
                    <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                      View Insights
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 4 - Full Page */}
            <div className="min-h-screen flex items-center bg-white">
              <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
                <div className="lg:order-2">
                  <img
                    className="w-full rounded-xl shadow-2xl ring-1 ring-black ring-opacity-5"
                    src="https://github.com/user-attachments/assets/f118af7d-43b8-4acd-a420-ce4f82056203"
                    alt="Budget Planning"
                  />
                </div>
                <div className="mt-10 lg:mt-0 lg:mr-8 lg:order-1">
                  <h3 className="text-3xl font-extrabold text-gray-900">
                    Advanced Budget Planning
                  </h3>
                  <p className="mt-6 text-xl text-gray-500 leading-relaxed">
                    Set and track budgets with ease. Get real-time notifications and stay on top of your financial goals. Our advanced planning tools help you achieve your financial objectives faster.
                  </p>
                  <div className="mt-8">
                    <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                      Start Planning
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Section: Interactive Stats */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="bg-white/10 backdrop-blur-lg rounded-lg p-6 text-center transform hover:scale-105 transition-all duration-300"
              >
                <dt className="text-4xl font-extrabold text-white mb-2">{stat.value}</dt>
                <dd className="text-blue-200">{stat.label}</dd>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* New Section: Interactive Features Grid */}
      <div className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900">Why Choose FinSight?</h2>
            <p className="mt-4 text-xl text-gray-600">Experience the future of financial management</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Real-Time Sync',
                description: 'Your data is synchronized across all devices in real-time',
                icon: (
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                )
              },
              {
                title: 'Bank-Level Security',
                description: 'Your financial data is protected with enterprise-grade encryption',
                icon: (
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                )
              },
              {
                title: 'Smart Notifications',
                description: 'Get intelligent alerts about your spending and saving patterns',
                icon: (
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                )
              }
            ].map((feature, index) => (
              <div
                key={feature.title}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="bg-blue-50 rounded-lg p-3 inline-block">
                  {feature.icon}
                </div>
                <h3 className="mt-4 text-xl font-semibold text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* New Section: App Preview */}
      <div className="bg-white py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
              <div className="relative">
                <h3 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
                  Experience FinSight on Any Device
                </h3>
                <p className="mt-4 text-lg text-gray-600">
                  Access your financial dashboard anywhere, anytime. Our responsive design ensures a seamless experience across all your devices.
                </p>
                <div className="mt-8 flex gap-4">
                  <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M17.6,9.2l-1.2-1.2l-1.2,1.2l-1.2-1.2l-1.2,1.2L12,8.4l-1.2,1.2L9.6,8.4L8.4,9.6L7.2,8.4L6,9.6L4.8,8.4L3.6,9.6L2.4,8.4L1.2,9.6L0,8.4v8.4h19.2V8.4L17.6,9.2z M3.6,13.2H2.4v-1.2h1.2V13.2z M6,13.2H4.8v-1.2H6V13.2z M8.4,13.2H7.2v-1.2h1.2V13.2z M10.8,13.2H9.6v-1.2h1.2V13.2z M13.2,13.2H12v-1.2h1.2V13.2z M15.6,13.2h-1.2v-1.2h1.2V13.2z M18,13.2h-1.2v-1.2H18V13.2z"/>
                    </svg>
                    Web App
                  </button>
                  <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10,1.6c-4.639,0-8.4,3.761-8.4,8.4s3.761,8.4,8.4,8.4s8.4-3.761,8.4-8.4S14.639,1.6,10,1.6z M15,11h-4v4H9v-4H5V9h4V5h2v4h4V11z"/>
                    </svg>
                    Mobile App
                  </button>
                </div>
              </div>
              <div className="mt-10 lg:mt-0 relative">
                <div className="relative mx-auto w-full rounded-lg shadow-lg overflow-hidden">
                  <img
                    className="w-full"
                    src="https://github.com/user-attachments/assets/50beb66c-c65a-4e78-b587-390c4d314735"
                    alt="App Preview"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton />

      {/* CTA Section */}
      <div className="bg-blue-600">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to take control?</span>
            <span className="block">Start using FinSight today.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-blue-200">
            Join thousands of users who are already making smarter financial decisions with FinSight.
          </p>
          <button
            onClick={handleGetStarted}
            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 sm:w-auto"
          >
            Get started
          </button>
        </div>
      </div>

      {/* Modern Footer */}
      <footer className="bg-gray-900">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                Product
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link to="/features" className="text-base text-gray-300 hover:text-white">
                    Features
                  </Link>
                </li>
                <li>
                  <Link to="/pricing" className="text-base text-gray-300 hover:text-white">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link to="/security" className="text-base text-gray-300 hover:text-white">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                Company
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link to="/about" className="text-base text-gray-300 hover:text-white">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/blog" className="text-base text-gray-300 hover:text-white">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                Support
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link to="/help" className="text-base text-gray-300 hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link to="/guides" className="text-base text-gray-300 hover:text-white">
                    Guides
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-base text-gray-300 hover:text-white">
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                Connect
              </h3>
              <ul className="mt-4 space-y-4">
                <li className="flex items-center">
                  <a href="#" className="text-gray-300 hover:text-white">
                    <span className="sr-only">Facebook</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z M3.6,13.2H2.4v-1.2h1.2V13.2z M6,13.2H4.8v-1.2H6V13.2z M8.4,13.2H7.2v-1.2h1.2V13.2z M10.8,13.2H9.6v-1.2h1.2V13.2z M13.2,13.2H12v-1.2h1.2V13.2z M15.6,13.2h-1.2v-1.2h1.2V13.2z M18,13.2h-1.2v-1.2H18V13.2z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-300 hover:text-white ml-6">
                    <span className="sr-only">Twitter</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-300 hover:text-white ml-6">
                    <span className="sr-only">LinkedIn</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                    </svg>
                  </a>
                </li>
              </ul>
              <div className="mt-8">
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                  Subscribe to our newsletter
                </h3>
                <form className="mt-4 sm:flex sm:max-w-md">
                  <label htmlFor="email-address" className="sr-only">Email address</label>
                  <input
                    type="email"
                    name="email-address"
                    id="email-address"
                    autoComplete="email"
                    required
                    className="appearance-none min-w-0 w-full bg-white border border-transparent rounded-md py-2 px-4 text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-white focus:border-white focus:placeholder-gray-400"
                    placeholder="Enter your email"
                  />
                  <div className="mt-3 rounded-md sm:mt-0 sm:ml-3 sm:flex-shrink-0">
                    <button
                      type="submit"
                      className="w-full bg-blue-600 border border-transparent rounded-md py-2 px-4 flex items-center justify-center text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-white"
                    >
                      Subscribe
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-800 pt-8">
            <p className="text-base text-gray-400 xl:text-center">
              &copy; 2025 FinSight. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
