import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Auth.scss';
import { FaEnvelope, FaLock, FaGoogle, FaGithub, FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signInWithGoogle, signInWithGithub } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        navigate('/');
      } else {
        setError(result.error || 'Kirishda xatolik yuz berdi');
      }
    } catch (err) {
      setError('Xatolik yuz berdi. Iltimos qayta urinib ko\'ring.');
      console.error(err);
    }
    
    setLoading(false);
  };

  const handleSocialLogin = async (provider) => {
    try {
      setError('');
      setLoading(true);
      
      let result;
      if (provider === 'google') {
        result = await signInWithGoogle();
      } else if (provider === 'github') {
        result = await signInWithGithub();
      }
      
      if (result?.success) {
        navigate('/');
      } else {
        setError(result?.error || 'Kirishda xatolik yuz berdi');
      }
    } catch (err) {
      setError('Xatolik yuz berdi. Iltimos qayta urinib ko\'ring.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-decorations">
        <div className="decoration"></div>
        <div className="decoration"></div>
        <div className="decoration"></div>
      </div>
      
      <div className="auth-box">
        <h2>Tizimga Kirish</h2>
        {error && <div className="error-message">{error}</div>}
        
        <div className="social-login">
          <button 
            type="button" 
            className="social-button"
            onClick={() => handleSocialLogin('google')}
            disabled={loading}
          >
            <FaGoogle className="social-icon" />
            Google
          </button>
          <button 
            type="button" 
            className="social-button"
            onClick={() => handleSocialLogin('github')}
            disabled={loading}
          >
            <FaGithub className="social-icon" />
            GitHub
          </button>
        </div>
        
        <div className="auth-divider">
          <span>yoki</span>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email manzil</label>
            <div className="input-wrapper">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="example@email.com"
                autoComplete="username"
                disabled={loading}
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Parol</label>
            <div className="input-wrapper">
              <FaLock className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                autoComplete="current-password"
                disabled={loading}
              />
              <button 
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          
          <div className="auth-footer">
            <Link to="/forgot-password">Parolni unutdingizmi?</Link>
          </div>
          
          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="button-loader"></span>
                Kirilmoqda...
              </>
            ) : 'Kirish'}
          </button>
        </form>
        
        <div className="auth-switch">
          <p>Akkauntingiz yo'qmi?</p>
          <Link to="/register" className="switch-button">
            Ro'yxatdan o'tish
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;