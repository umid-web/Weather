import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Auth.scss';
import { FaUser, FaEnvelope, FaLock, FaGoogle, FaGithub, FaEye, FaEyeSlash } from 'react-icons/fa';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, signInWithGoogle, signInWithGithub } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const passwordStrength = (password) => {
    if (!password) return { score: 0, label: '' };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    const labels = ['', 'Zaif', 'Oʻrta', 'Kuchli', 'Juda kuchli'];
    return { score, label: labels[score] };
  };

  const strength = passwordStrength(formData.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!agreed) {
      return setError("Foydalanish shartlarini qabul qilishingiz kerak");
    }
    
    if (formData.password !== formData.confirmPassword) {
      return setError("Parollar mos emas!");
    }
    
    if (strength.score < 2) {
      return setError("Parolingiz juda zaif. Iltimos, kuchliroq parol tanlang");
    }

    try {
      setError('');
      setLoading(true);
      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      
      if (result.success) {
        navigate('/');
      } else {
        setError(result.error || 'Ro\'yxatdan o\'tishda xatolik yuz berdi');
      }
    } catch (err) {
      setError('Xatolik yuz berdi. Iltimos qayta urinib ko\'ring.');
      console.error(err);
    }
    
    setLoading(false);
  };

  const handleSocialRegister = async (provider) => {
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
        setError(result?.error || 'Ro\'yxatdan o\'tishda xatolik yuz berdi');
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
        <h2>Ro'yxatdan O'tish</h2>
        {error && <div className="error-message">{error}</div>}
        
        <div className="social-login">
          <button 
            type="button" 
            className="social-button"
            onClick={() => handleSocialRegister('google')}
            disabled={loading}
          >
            <FaGoogle className="social-icon" />
            Google
          </button>
          <button 
            type="button" 
            className="social-button"
            onClick={() => handleSocialRegister('github')}
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
            <label>Ism Familiya</label>
            <div className="input-wrapper">
              <FaUser className="input-icon" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="To'liq ismingiz"
                disabled={loading}
              />
            </div>
          </div>
          
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
                placeholder="Kamida 8 ta belgi"
                minLength={6}
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
            
            {formData.password && (
              <div className="password-strength-meter">
                <div className="strength-levels">
                  {[1, 2, 3, 4].map((level) => (
                    <div 
                      key={level}
                      className={`level ${level <= strength.score ? 'active' : ''} ${
                        level === 1 ? 'weak' :
                        level === 2 ? 'medium' :
                        level === 3 ? 'strong' :
                        'very-strong'
                      }`}
                    />
                  ))}
                </div>
                <div className="strength-label">
                  {strength.label}
                </div>
              </div>
            )}
          </div>
          
          <div className="form-group">
            <label>Parolni Tasdiqlash</label>
            <div className="input-wrapper">
              <FaLock className="input-icon" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Parolni qayta kiriting"
                minLength={6}
                disabled={loading}
              />
              <button 
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={loading}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          
          <div className="form-group">
            <label className="terms-checkbox">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                disabled={loading}
              />
              <span className="checkbox-custom"></span>
              <span className="checkbox-label">
                Men <Link to="/terms" target="_blank">foydalanish shartlari</Link> va{' '}
                <Link to="/privacy" target="_blank">maxfiylik siyosati</Link> bilan tanishdim va qabul qilaman
              </span>
            </label>
          </div>
          
          <button 
            type="submit" 
            className="auth-button"
            disabled={loading || !agreed}
          >
            {loading ? (
              <>
                <span className="button-loader"></span>
                Yaratilmoqda...
              </>
            ) : "Ro'yxatdan o'tish"}
          </button>
        </form>
        
        <div className="auth-switch">
          <p>Akkauntingiz bormi?</p>
          <Link to="/login" className="switch-button">
            Tizimga kirish
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;