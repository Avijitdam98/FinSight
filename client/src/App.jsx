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
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Helmet>
              <title>FinSight AI | Smart Personal Finance Tracker</title>
              <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
              <meta name="theme-color" content="#4f46e5" />
              <meta name="description" content="FinSight AI - Smart Personal Finance Tracker with AI Insights" />
            </Helmet>
            <Navbar />
            <Layout>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                } />
                <Route path="/transactions" element={
                  <PrivateRoute>
                    <Transactions />
                  </PrivateRoute>
                } />
              </Routes>
            </Layout>
          </div>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
