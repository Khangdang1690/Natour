# Natours: Adventure Tours Booking Platform

## Overview
Natours is a comprehensive web application designed for booking adventure tours, offering an intuitive and seamless user experience for travelers seeking exciting outdoor experiences.

## Key Features

### 🌍 Tour Discovery
- Browse a wide range of adventure tours with detailed descriptions
- High-quality images and interactive tour maps
- Comprehensive tour information including difficulty, group sizes, and ratings

### 🔐 User Authentication
- Secure user registration and login
- Profile management
- Password reset functionality

### 💳 Booking System
- Integrated Stripe payment gateway
- Real-time tour booking
- Instant booking confirmations
- Email notifications for successful bookings

### 📱 Responsive Design
- Mobile-friendly interface
- Optimized for various device screen sizes
- Modern, clean, and intuitive user interface

### 🗺️ Interactive Tour Maps
- Visualize tour routes and locations
- Detailed geographical information
- Enhanced tour preview experience

## Technology Stack
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Frontend**: Pug templating, JavaScript
- **Payment**: Stripe
- **Authentication**: JSON Web Tokens (JWT)

### Detailed Technology Breakdown

#### Backend Frameworks & Libraries
- **Express.js**: Web application framework for robust API development
- **Mongoose**: ODM (Object Data Modeling) library for MongoDB and Node.js
- **Nodemailer**: Email sending capabilities
- **Multer**: Multipart/form-data handling for file uploads
- **Sharp**: High-performance image processing

#### Security & Performance
- **bcryptjs**: Password hashing and security
- **JSON Web Tokens (JWT)**: Secure user authentication
- **helmet**: Helps secure Express apps by setting various HTTP headers
- **express-mongo-sanitize**: Prevents NoSQL injection attacks
- **xss-clean**: Middleware to sanitize user input and prevent XSS attacks
- **express-rate-limit**: Limits repeated requests to public APIs and/or endpoints

#### Frontend Technologies
- **Pug**: Template engine for efficient HTML rendering
- **Axios**: Promise-based HTTP client for API requests
- **Parcel**: Web application bundler for JavaScript
- **Slugify**: URL-friendly string conversion

#### Payment & Validation
- **Stripe**: Secure payment processing integration
- **validator.js**: String validation and sanitization

#### Development & Debugging Tools
- **Nodemon**: Automatically restarts the node application when file changes detected
- **Morgan**: HTTP request logger middleware
- **ESLint**: JavaScript linting with Airbnb style guide
- **Prettier**: Code formatting

## Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB
- Stripe Account

### Installation
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Run the application: `npm start`

## Live Demo
🌐 **Deployment**: [https://natour-s2tz.onrender.com/](https://natour-s2tz.onrender.com/)

### Accessing the Demo
- Email: `laura@example.com`
- Password: `test1234`

## Contributing
Contributions are welcome! Please read our contributing guidelines before submitting pull requests.

## License
This project is licensed under the MIT License.
