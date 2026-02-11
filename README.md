# 🌤️ Weather App - Professional Weather Forecast Application

A modern, responsive weather application built with React, Vite, and Firebase. Features real-time weather data, user authentication, statistics tracking, and beautiful UI/UX.

## ✨ Features

### 🌡️ Weather Information
- Real-time weather data from OpenWeatherMap API
- 4-day weather forecast
- Hourly weather predictions
- Air Quality Index (AQI) analysis
- Detailed weather metrics (temperature, humidity, wind, pressure)

### 👤 User Features
- Firebase Authentication (Login/Register)
- User profile management
- Search history tracking
- Personal statistics dashboard
- Popular locations tracking

### 📊 Statistics & Analytics
- Monthly search statistics
- Popular locations visualization
- Interactive charts using Chart.js
- Search history with timestamps
- User activity tracking

### 🎨 UI/UX
- Responsive design for all devices
- Modern, clean interface
- Dark/Light theme support
- Smooth animations and transitions
- Uzbek language support

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI Framework
- **Vite** - Build Tool & Dev Server
- **React Router** - Client-side Routing
- **SCSS** - Styling with Sass
- **Chart.js** - Data Visualization
- **React Icons** - Icon Library

### Backend & Services
- **Firebase** - Authentication & Database
- **OpenWeatherMap API** - Weather Data
- **Firestore** - NoSQL Database

### Development Tools
- **ESLint** - Code Linting
- **Vite** - Hot Module Replacement

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/weather-app.git
cd weather-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

4. **Configure your API keys in `.env`**
```env
# OpenWeatherMap API Key
VITE_WEATHER_API_KEY=your_openweathermap_api_key

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

5. **Start development server**
```bash
npm run dev
```

6. **Open your browser**
```
http://localhost:5173
```

## 📦 Build & Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Netlify Deployment
1. Connect your repository to Netlify
2. Set environment variables in Netlify dashboard
3. Deploy automatically on push to main branch

### Vercel Deployment
1. Import your repository to Vercel
2. Configure environment variables
3. Deploy with one click

## 🔧 Configuration

### Firebase Setup
1. Create a new Firebase project
2. Enable Authentication (Email/Password)
3. Create Firestore Database
4. Configure Security Rules
5. Copy Firebase config to environment variables

### OpenWeatherMap API
1. Sign up at [OpenWeatherMap](https://openweathermap.org/api)
2. Get your free API key
3. Add to environment variables

## 📁 Project Structure

```
weather-app/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable components
│   │   ├── index.js       # Component exports
│   │   ├── Auth/          # Authentication components
│   │   ├── Profile/       # User profile
│   │   ├── Weather/       # Weather components
│   │   └── ...
│   ├── contexts/          # React contexts
│   ├── services/           # API services
│   ├── Main/              # Layout components
│   ├── Images/            # Image assets
│   ├── App.jsx            # Main app component
│   └── main.jsx           # App entry point
├── .env.example           # Environment template
├── .gitignore            # Git ignore rules
├── netlify.toml          # Netlify configuration
├── firestore.rules       # Firebase security rules
└── package.json          # Dependencies
```

## 🔐 Security

- Environment variables for sensitive data
- Firebase security rules implementation
- Input validation and sanitization
- Secure API key management
- XSS protection

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📱 Responsive Design

- Mobile-first approach
- Tablet and desktop optimizations
- Touch-friendly interface
- Adaptive layouts

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [OpenWeatherMap](https://openweathermap.org/) for weather data API
- [Firebase](https://firebase.google.com/) for authentication and database
- [React](https://reactjs.org/) for the UI framework
- [Vite](https://vitejs.dev/) for the build tool

## 📞 Contact

Your Name - [@yourusername](https://github.com/yourusername)

Project Link: [https://github.com/yourusername/weather-app](https://github.com/yourusername/weather-app)
