# FinSight - AI-Powered Personal Finance Dashboard

FinSight is a modern, AI-driven personal finance management application built with the MERN stack (MongoDB, Express.js, React.js, Node.js). It helps users track expenses, analyze spending patterns, and receive AI-powered financial insights and recommendations.

![FinSight Dashboard](![Uploading image.png…]()
)

## Features

### Core Features
- **Expense and Income Tracking**
  - Log expenses and income with custom categories
  - Transaction tagging with notes, dates, and categories
  - Advanced search and filter options

- **AI-Generated Insights**
  - TensorFlow.js powered spending analysis
  - Smart saving recommendations
  - Spending pattern detection
  - Predictive spending forecasts

- **Financial Reporting**
  - Interactive monthly/quarterly/yearly reports
  - Spending trends visualization
  - Income vs. expense comparisons
  - Category-wise breakdowns

- **Secure Authentication**
  - JWT-based user authentication
  - Secure session management
  - Encrypted data storage

### Technical Features
- Responsive design with Tailwind CSS
- Dark mode support
- Client-side machine learning using TensorFlow.js
- Interactive charts using Chart.js
- Export functionality (CSV, PDF)

## Tech Stack

### Frontend
- React.js
- Redux Toolkit
- TensorFlow.js
- Chart.js
- Tailwind CSS
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Mongoose

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/Avijitdam98/FinSight.git
cd FinSight
```

2. Install dependencies for both frontend and backend
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

3. Set up environment variables
```bash
# In server directory, create .env file
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret

# In client directory, create .env file
VITE_API_URL=http://localhost:5000/api
```

4. Start the development servers
```bash
# Start backend server (from server directory)
npm run dev

# Start frontend server (from client directory)
npm run dev
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [TensorFlow.js](https://www.tensorflow.org/js) for machine learning capabilities
- [Chart.js](https://www.chartjs.org/) for beautiful charts
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [MongoDB](https://www.mongodb.com/) for database
- All other open-source libraries used in this project
