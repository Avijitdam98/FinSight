import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { ThemeProvider } from './contexts/ThemeContext';
import { Helmet } from 'react-helmet';

// Components
import Navbar from './components/Navbar';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
import PrivateRoute from './components/PrivateRoute';
import BadgeNotification from './components/BadgeNotification';
import Rewards from './pages/Rewards';
import Features from './pages/FooterPages/Features';
import About from './pages/FooterPages/About';
import Blog from './pages/FooterPages/Blog';
import Pricing from './pages/FooterPages/Pricing';
import Security from './pages/FooterPages/Security';
import HelpCenter from './pages/FooterPages/HelpCenter';
import Guides from './pages/FooterPages/Guides';
import Privacy from './pages/FooterPages/Privacy';
import PageTemplate from './pages/FooterPages/PageTemplate';

function App() {
  // Page content components
  const PricingContent = () => (
    <div className="space-y-6">
      <p>Our flexible pricing plans are designed to meet your needs. Choose the plan that works best for you.</p>
      {/* Add pricing details */}
    </div>
  );

  const SecurityContent = () => (
    <div className="space-y-6">
      <p>We take your security seriously. Learn about our security measures and how we protect your data.</p>
      {/* Add security details */}
    </div>
  );

  const AboutContent = () => (
    <div className="space-y-6">
      <p>FinSight is your trusted partner in personal finance management. Learn about our mission and values.</p>
      {/* Add about content */}
    </div>
  );

  const BlogContent = () => (
    <div className="space-y-6">
      <p>Stay updated with the latest financial tips, insights, and news from our expert team.</p>
      {/* Add blog posts */}
    </div>
  );

  const HelpContent = () => (
    <div className="space-y-6">
      <p>Find answers to common questions and get support when you need it.</p>
      {/* Add help center content */}
    </div>
  );

  const GuidesContent = () => (
    <div className="space-y-6">
      <p>Learn how to make the most of FinSight with our comprehensive guides.</p>
      {/* Add guides */}
    </div>
  );

  const PrivacyContent = () => (
    <div className="space-y-6">
      <p>Learn about how we collect, use, and protect your personal information.</p>
      {/* Add privacy policy */}
    </div>
  );

  return (
    <Provider store={store}>
      <ThemeProvider>
        <Router>
          <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <Helmet>
              <title>FinSight AI | Smart Personal Finance Tracker</title>
              <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
              <meta name="theme-color" content="#000000" />
              <meta name="description" content="FinSight AI - Smart Personal Finance Tracker with AI Insights" />
            </Helmet>
            <Navbar />
            <BadgeNotification />
            <Layout>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/dashboard"
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/transactions"
                  element={
                    <PrivateRoute>
                      <Transactions />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <PrivateRoute>
                      <Settings />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/rewards"
                  element={
                    <PrivateRoute>
                      <Rewards />
                    </PrivateRoute>
                  }
                />
                {/* Footer Pages */}
                <Route path="/features" element={<Features />} />
                <Route path="/about" element={<About />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/security" element={<Security />} />
                <Route path="/help" element={<HelpCenter />} />
                <Route path="/guides" element={<Guides />} />
                <Route path="/privacy" element={<Privacy />} />
              </Routes>
            </Layout>
          </div>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
