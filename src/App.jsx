import React, { lazy, Suspense, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './Main/Navbar/Navbar';
import Footer from './Main/Footer/Footer';
import Home from './components/HomeComponenta/Home';
import About from './components/About/About';
import Service from './components/ServiceComponents/Service';
import Login from './components/Auth/Login';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useSyncUser } from './hooks/useSyncUser';

const Register = lazy(() => import('./components/Auth/Register'));
const Profile = lazy(() => import('./components/Profile/Profile'));

// Private Route
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="loading">Yuklanmoqda...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function AppContent() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);

  const location = useLocation();

  const isAuthPage =
    location.pathname === '/login' ||
    location.pathname === '/register';

  useSyncUser();

  return (
    <div className="App">
      <Navbar setCity={setCity} />
      <main className={isAuthPage ? 'auth-page' : ''}>
        <Suspense fallback={<div className="loading">Yuklanmoqda...</div>}>
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  city={city}
                  setCity={setCity}
                  weather={weather}
                  setWeather={setWeather}
                />
              }
            />
            <Route path="/about" element={<About />} />
            <Route
              path="/service/:city"
              element={
                <PrivateRoute>
                  <Service weather={weather} />
                </PrivateRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;