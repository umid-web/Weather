import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useSyncUser } from './hooks/useSyncUser';
import { 
  Navbar, 
  Footer, 
  Home, 
  About, 
  Service, 
  Login, 
  Register, 
  Profile 
} from './components';
import './App.css';

// Private Route Component
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="loading">Yuklanmoqda...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

function AppContent() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  
  // Sync user data with Firestore
  useSyncUser();

  return (
    <div className="App">
      <Navbar setCity={setCity} />
      <main className={isAuthPage ? 'auth-page' : ''}>
        <Routes>
          <Route path="/" element={<Home city={city} setCity={setCity} weather={weather} setWeather={setWeather} />} />
          <Route path="/about" element={<About />} />

          {/* Service sahifasi: PrivateRoute va URL param */}
          <Route path="/service/:city" element={
            <PrivateRoute>
              <Service weather={weather} />
            </PrivateRoute>
          } />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
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






