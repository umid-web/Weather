// Main Components
export { default as Navbar } from '../Main/Navbar/Navbar';
export { default as Footer } from '../Main/Footer/Footer';

// Page Components
export { default as Home } from '../Components/HomeComponenta/Home';
export { default as About } from '../Components/About/About';
export { default as Service } from '../Components/ServiceComponents/Service';
export { default as Weather } from '../Components/Weather/Weather';

// Auth Components
export { default as Login } from '../Components/Auth/Login';
export { default as Register } from '../Components/Auth/Register';
export { default as Profile } from '../Components/Profile/Profile';

// Services
export { weatherService } from '../services/api';
export { statisticsService } from '../services/statisticsService';

// Context
export { AuthProvider, useAuth } from '../contexts/AuthContext';
