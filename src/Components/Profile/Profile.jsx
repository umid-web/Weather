import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { statisticsService } from '../../services/statisticsService';
import { Line, Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend, 
  Filler 
} from "chart.js";
import { 
  FaChartLine, 
  FaUserEdit, 
  FaHistory, 
  FaCog, 
  FaChartBar, 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope, 
  FaSearch, 
  FaSync,
  FaSave,
  FaTimes,
  FaBell,
  FaGlobe,
  FaChartPie,
  FaDatabase,
  FaExternalLinkAlt,
  FaUserCircle
} from 'react-icons/fa';
import './Profile.scss';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Profile = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);
  const [stats, setStats] = useState({
    totalSearches: 0,
    monthlySearches: [],
    popularLocations: [],
    recentSearches: []
  });
  const [formData, setFormData] = useState({
    displayName: '',
    phone: '',
    address: '',
    bio: '',
    joinDate: new Date().toISOString()
  });
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // Dark mode effect - SSR compatible
  useEffect(() => {
    // Check if we're in browser environment
    if (typeof window !== 'undefined') {
      const isDarkMode = localStorage.getItem('darkMode') === 'true' || 
        window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(isDarkMode);
      applyDarkMode(isDarkMode);
    }
  }, []);

  const applyDarkMode = (isDark) => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add('dark-mode');
    } else {
      html.classList.remove('dark-mode');
    }
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode);
    applyDarkMode(newMode);
  };

  // Fetch user statistics
  const fetchUserStatistics = async (userId) => {
    try {
      console.log('Fetching statistics for user:', userId);
      if (!userId) {
        console.log('No user ID provided, returning default stats');
        return getDefaultStats();
      }

      const statsData = await statisticsService.getUserStatistics(userId);
      console.log('Stats data from service:', statsData);
      
      return {
        totalSearches: statsData.totalSearches || 0,
        monthlySearches: statsData.monthlySearches && statsData.monthlySearches.length > 0 
          ? statsData.monthlySearches 
          : getLast6Months().map(month => ({ month, count: 0 })),
        popularLocations: statsData.popularLocations || [],
        recentSearches: statsData.recentSearches || []
      };

    } catch (error) {
      console.error('Error fetching statistics:', error);
      // Show user-friendly error message
      if (error.message && error.message.includes('Missing or insufficient permissions')) {
        setError('Firebasega kirishda xatolik. Iltimos, qayta kirishingiz yoki sahifani yangilashingiz mumkin.');
      } else {
        setError('Statistikani yuklashda xatolik yuz berdi.');
      }
      return getDefaultStats();
    }
  };

  const getDefaultStats = () => {
    const months = getLast6Months();
    return {
      totalSearches: 0,
      monthlySearches: months.map(month => ({ month, count: 0 })),
      popularLocations: [],
      recentSearches: []
    };
  };

  const getLast6Months = () => {
    const months = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push(date.toISOString().slice(0, 7)); // "YYYY-MM" format
    }
    
    return months;
  };

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      console.log('🔍 Profile fetchUserData started for:', currentUser?.uid);
      
      if (!currentUser) {
        console.log('❌ No currentUser, returning');
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        // Fetch user profile from Firestore
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        console.log('📄 User doc exists:', userDoc.exists());
        console.log('📊 User UID:', currentUser.uid);

        // User hujjati hali yo'q bo'lsa kutib olish (yoki default ma'lumot)
        const userData = userDoc.exists() ? userDoc.data() : {};
        console.log('👤 User data from Firestore:', userData);

        setFormData(prev => ({
          ...prev,
          displayName: userData.displayName || currentUser.displayName || '',
          phone: userData.phone || '',
          address: userData.address || '',
          bio: userData.bio || '',
          joinDate: userData.createdAt || new Date().toISOString()
        }));

        // Statistikani fetch qilamiz, hatto userDoc yo'q bo'lsa ham
        console.log('📈 Fetching statistics for user:', currentUser.uid);
        const statsData = await fetchUserStatistics(currentUser.uid);
        console.log('📊 Fetched stats:', statsData);
        setStats(statsData);

      } catch (err) {
        console.error('❌ Profile fetch error:', err);
        setError('Ma\'lumotlarni yuklashda xatolik yuz berdi: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const refreshStatistics = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      console.log('Refreshing statistics...');
      
      // Clear cache if statisticsService has that method
      if (statisticsService.clearCache) {
        statisticsService.clearCache(currentUser.uid);
      }
      
      const statsData = await fetchUserStatistics(currentUser.uid);
      console.log('Refreshed stats:', statsData);
      setStats(statsData);
      
      // Show success message
      setError(null);
    } catch (error) {
      console.error('Error refreshing statistics:', error);
      setError('Statistikani yangilashda xatolik yuz berdi: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    setLoading(true);
    setError(null);

    try {
      console.log('Updating profile...', formData);
      
      // Update Firebase Auth profile
      if (currentUser && formData.displayName) {
        await updateProfile(currentUser, {
          displayName: formData.displayName
        });
        console.log('Auth profile updated');
      }

      // Update Firestore
      const userDocRef = doc(db, 'users', currentUser.uid);
      
      const updateData = {
        displayName: formData.displayName,
        phone: formData.phone || '',
        address: formData.address || '',
        bio: formData.bio || '',
        updatedAt: new Date().toISOString(),
        // Keep existing createdAt if available
        ...(formData.joinDate && { createdAt: formData.joinDate })
      };
      
      await setDoc(userDocRef, updateData, { merge: true });
      console.log('Firestore updated:', updateData);
      
      setEditMode(false);
      
      // Show success message
      alert('Profil muvaffaqiyatli yangilandi!');
      
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Profilni yangilashda xatolik yuz berdi: ' + (err.message || 'Noma\'lum xatolik'));
    } finally {
      setLoading(false);
    }
  };

  // Chart configurations - Improved empty data handling
  const lineChartData = {
    labels: stats.monthlySearches && stats.monthlySearches.length > 0 
      ? stats.monthlySearches.map(search => {
          const date = new Date(search.month + '-01');
          return date.toLocaleDateString('uz-UZ', { month: 'short', year: 'numeric' });
        })
      : getLast6Months().map(month => {
          const date = new Date(month + '-01');
          return date.toLocaleDateString('uz-UZ', { month: 'short', year: 'numeric' });
        }),
    datasets: [{
      label: 'Oylik qidiruvlar',
      data: stats.monthlySearches && stats.monthlySearches.length > 0 
        ? stats.monthlySearches.map(search => search.count || 0)
        : getLast6Months().map(() => 0),
      borderColor: '#4CAF50',
      backgroundColor: 'rgba(76, 175, 80, 0.1)',
      tension: 0.3,
      fill: true,
      pointBackgroundColor: '#4CAF50',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 5
    }]
  };

  const barChartData = {
    labels: stats.popularLocations && stats.popularLocations.length > 0 
      ? stats.popularLocations.map(loc => loc.name || 'Noma\'lum')
      : ['Hali qidiruvlar yo\'q'],
    datasets: [{
      label: 'Qidiruvlar soni',
      data: stats.popularLocations && stats.popularLocations.length > 0 
        ? stats.popularLocations.map(loc => loc.count || 0)
        : [0],
      backgroundColor: [
        '#4CAF50', '#2196F3', '#FFC107', '#9C27B0', '#F44336'
      ],
      borderWidth: 1,
      borderRadius: 5
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: darkMode ? '#fff' : '#333',
          font: {
            size: 14
          }
        }
      },
      title: {
        display: true,
        text: 'Foydalanuvchi faolligi',
        font: {
          size: 16,
          weight: 'bold'
        },
        color: darkMode ? '#fff' : '#333'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          color: darkMode ? '#ccc' : '#666'
        }
      },
      x: {
        grid: {
          color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          color: darkMode ? '#ccc' : '#666'
        }
      }
    }
  };

  // Loading state
  if (loading && activeTab === 'profile') {
    return (
      <div className="profile-fullscreen">
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Ma'lumotlar yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="profile-fullscreen">
        <div className="error-container">
          <div className="error-card">
            <h3>Xatolik yuz berdi</h3>
            <p>{error}</p>
            <div className="error-actions">
              <button onClick={() => setError(null)} className="btn-primary">
                Qayta urinish
              </button>
              <button onClick={() => window.location.reload()} className="btn-secondary">
                Sahifani yangilash
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!currentUser || !isAuthenticated) {
    return (
      <div className="profile-fullscreen">
        <div className="not-logged-in">
          <div className="auth-prompt">
            <FaUserCircle className="prompt-icon" />
            <h2>Profilga kirish</h2>
            <p>Siz hali tizimga kirganingiz yo'q. Profilni ko'rish uchun iltimos, tizimga kiring.</p>
            <div className="auth-buttons">
              <button onClick={() => window.location.href = '/login'} className="btn-primary">
                Kirish
              </button>
              <button onClick={() => window.location.href = '/register'} className="btn-secondary">
                Ro'yxatdan o'tish
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`profile-fullscreen ${darkMode ? 'dark-mode' : ''}`}>
      {/* Header */}
      <div className="profile-header">
        <div className="header-content">
          <div className="header-left">
            <h1>
              <FaUserCircle /> Profil
            </h1>
            <p className="header-subtitle">
              {activeTab === 'profile' && 'Shaxsiy ma\'lumotlaringiz'}
              {activeTab === 'stats' && 'Statistika va hisobotlar'}
              {activeTab === 'activity' && 'Faollik tarixi'}
              {activeTab === 'settings' && 'Sozlamalar'}
            </p>
          </div>
          <div className="header-right">
            {activeTab === 'profile' && !editMode && (
              <button className="edit-profile-btn" onClick={() => setEditMode(true)}>
                <FaUserEdit /> Tahrirlash
              </button>
            )}
            {activeTab === 'stats' && (
              <button className="refresh-btn" onClick={refreshStatistics} disabled={loading}>
                <FaSync className={loading ? 'spin' : ''} /> {loading ? 'Yangilanmoqda...' : 'Yangilash'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="profile-main">
        {/* Sidebar */}
        <div className="profile-sidebar">
          <div className="user-card">
            <div className="user-avatar">
              {currentUser.photoURL ? (
                <img src={currentUser.photoURL} alt={formData.displayName} />
              ) : (
                <div className="avatar-placeholder">
                  {(formData.displayName || currentUser.email || 'U').charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="user-info">
              <h3>{formData.displayName || currentUser.email || 'Foydalanuvchi'}</h3>
              <p className="user-email">{currentUser.email}</p>
              <div className="quick-stats-mini">
                <div className="stat-mini">
                  <span className="stat-number">{stats.totalSearches || 0}</span>
                  <span className="stat-label">Qidiruv</span>
                </div>
                <div className="stat-mini">
                  <span className="stat-number">{stats.popularLocations?.length || 0}</span>
                  <span className="stat-label">Joy</span>
                </div>
              </div>
            </div>
          </div>

          <nav className="sidebar-nav">
            <button 
              className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <FaUserEdit /> Profil
            </button>
            <button 
              className={`nav-item ${activeTab === 'stats' ? 'active' : ''}`}
              onClick={() => setActiveTab('stats')}
            >
              <FaChartLine /> Statistika
            </button>
            <button 
              className={`nav-item ${activeTab === 'activity' ? 'active' : ''}`}
              onClick={() => setActiveTab('activity')}
            >
              <FaHistory /> Faollik
            </button>
            <button 
              className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <FaCog /> Sozlamalar
            </button>
          </nav>

          <div className="sidebar-footer">
            <p className="join-date">
              <FaCalendarAlt /> A'zo: {new Date(formData.joinDate).toLocaleDateString('uz-UZ')}
            </p>
          </div>
        </div>

        {/* Content Area */}
        <div className="profile-content">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            editMode ? (
              <div className="edit-profile-form">
                <div className="form-header">
                  <h2>Profilni tahrirlash</h2>
                  <button className="close-edit" onClick={() => setEditMode(false)}>
                    <FaTimes />
                  </button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Ism Familiya</label>
                      <input
                        type="text"
                        name="displayName"
                        value={formData.displayName}
                        onChange={handleChange}
                        required
                        placeholder="Ismingizni kiriting"
                        disabled={loading}
                      />
                    </div>
                    <div className="form-group">
                      <label>Telefon raqam</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+998901234567"
                        disabled={loading}
                      />
                    </div>
                    <div className="form-group full-width">
                      <label>Manzil</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Manzilingizni kiriting"
                        disabled={loading}
                      />
                    </div>
                    <div className="form-group full-width">
                      <label>O'zim haqimda</label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        rows="4"
                        placeholder="O'zingiz haqingizda qisqacha..."
                        disabled={loading}
                      />
                    </div>
                  </div>
                  {error && <div className="form-error">{error}</div>}
                  <div className="form-actions">
                    <button 
                      type="button" 
                      className="btn-secondary"
                      onClick={() => setEditMode(false)}
                      disabled={loading}
                    >
                      <FaTimes /> Bekor qilish
                    </button>
                    <button 
                      type="submit" 
                      className="btn-primary"
                      disabled={loading}
                    >
                      <FaSave /> {loading ? 'Saqlanmoqda...' : 'Saqlash'}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="profile-view">
                <div className="profile-section">
                  <h2>Shaxsiy ma'lumotlar</h2>
                  <div className="info-grid">
                    <div className="info-item">
                      <label>Ism Familiya</label>
                      <p>{formData.displayName || 'Ko\'rsatilmagan'}</p>
                    </div>
                    <div className="info-item">
                      <label>Email</label>
                      <p>{currentUser.email}</p>
                    </div>
                    <div className="info-item">
                      <label>Telefon</label>
                      <p>{formData.phone || 'Ko\'rsatilmagan'}</p>
                    </div>
                    <div className="info-item">
                      <label>Manzil</label>
                      <p>{formData.address || 'Ko\'rsatilmagan'}</p>
                    </div>
                    {formData.bio && (
                      <div className="info-item full-width">
                        <label>O'zim haqimda</label>
                        <p className="bio-text">{formData.bio}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="stats-overview">
                  <h2>Statistika</h2>
                  <div className="stats-grid">
                    <div className="stat-card" onClick={() => setActiveTab('stats')}>
                      <FaDatabase className="stat-icon" />
                      <div className="stat-content">
                        <h3>{stats.totalSearches || 0}</h3>
                        <p>Jami qidiruvlar</p>
                      </div>
                      <FaExternalLinkAlt className="stat-link" />
                    </div>
                    <div className="stat-card" onClick={() => setActiveTab('stats')}>
                      <FaChartPie className="stat-icon" />
                      <div className="stat-content">
                        <h3>{stats.popularLocations?.length || 0}</h3>
                        <p>Ko'rilgan joylar</p>
                      </div>
                      <FaExternalLinkAlt className="stat-link" />
                    </div>
                  </div>
                </div>
              </div>
            )
          )}

          {/* Stats Tab */}
          {activeTab === 'stats' && (
            <div className="stats-view">
              <div className="stats-header">
                <h2>Statistika va hisobotlar</h2>
                <p>Ob-havo qidirish statistikangiz</p>
              </div>
              
              {(stats.totalSearches > 0 || stats.monthlySearches?.some(s => s.count > 0)) ? (
                <>
                  <div className="stats-summary">
                    <div className="summary-card primary">
                      <h3>{stats.totalSearches || 0}</h3>
                      <p>Jami qidiruvlar</p>
                    </div>
                    <div className="summary-card">
                      <h3>{stats.monthlySearches && stats.monthlySearches.length > 0 
                        ? stats.monthlySearches[stats.monthlySearches.length - 1]?.count || 0 
                        : 0}</h3>
                      <p>Bu oyda</p>
                    </div>
                    <div className="summary-card">
                      <h3>{stats.popularLocations?.length || 0}</h3>
                      <p>Joylar soni</p>
                    </div>
                  </div>

                  <div className="charts-container">
                    <div className="chart-card">
                      <div className="chart-header">
                        <h3>Oylik qidiruvlar statistikasi</h3>
                        <span>Oxirgi 6 oy</span>
                      </div>
                      <div className="chart-wrapper">
                        <Line data={lineChartData} options={chartOptions} />
                      </div>
                    </div>

                    {stats.popularLocations && stats.popularLocations.length > 0 && (
                      <div className="chart-card">
                        <div className="chart-header">
                          <h3>Eng ko'p qidirilgan joylar</h3>
                          <span>Top {Math.min(stats.popularLocations.length, 5)}</span>
                        </div>
                        <div className="chart-wrapper">
                          <Bar data={barChartData} options={chartOptions} />
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="no-stats">
                  <FaChartBar className="no-stats-icon" />
                  <h3>Statistika mavjud emas</h3>
                  <p>Hozircha hech qanday qidiruv amalga oshirilmagan.</p>
                  <button className="btn-primary" onClick={() => window.location.href = '/'}>
                    Ob-havo qidirish
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <div className="activity-view">
              <div className="activity-header">
                <h2>So'nggi faollik</h2>
                <button className="refresh-btn-small" onClick={refreshStatistics} disabled={loading}>
                  <FaSync className={loading ? 'spin' : ''} /> {loading ? 'Yuklanmoqda...' : 'Yangilash'}
                </button>
              </div>
              
              {stats.recentSearches && stats.recentSearches.length > 0 ? (
                <div className="activity-list">
                  {stats.recentSearches.slice(0, 10).map((search, index) => (
                    <div key={index} className="activity-item">
                      <div className="activity-icon">
                        <FaSearch />
                      </div>
                      <div className="activity-content">
                        <h4>{search.location || search.city || 'Noma\'lum joy'} ob-havosi</h4>
                        <p className="activity-desc">
                          {search.weather ? `${search.weather} • ${search.temperature || ''}°C` : 
                           search.description || 'Ob-havo ma\'lumotlari'}
                        </p>
                        <span className="activity-time">
                          {search.timestamp ? new Date(search.timestamp).toLocaleString('uz-UZ') : 
                           search.date || 'Vaqt ko\'rsatilmagan'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-activity">
                  <FaHistory className="no-activity-icon" />
                  <h3>Faollik mavjud emas</h3>
                  <p>Ob-havo qidirish tizimidan foydalanib, faollikni boshlang</p>
                </div>
              )}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="settings-view">
              <h2>Sozlamalar</h2>
              
              <div className="settings-grid">
                <div className="settings-card">
                  <h3>
                    <FaBell /> Bildirishnomalar
                  </h3>
                  <div className="settings-group">
                    <div className="setting-item">
                      <div className="setting-info">
                        <h4>Ob-havo yangiliklari</h4>
                        <p>Ob-havo o'zgarishlari haqida bildirishnoma</p>
                      </div>
                      <label className="toggle-switch">
                        <input 
                          type="checkbox" 
                          checked={notifications}
                          onChange={(e) => setNotifications(e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="settings-card">
                  <h3>
                    <FaUserEdit /> Profil sozlamalari
                  </h3>
                  <div className="settings-group">
                    <button className="setting-action" onClick={() => setActiveTab('profile')}>
                      <span>Profil ma'lumotlarini tahrirlash</span>
                      <FaExternalLinkAlt />
                    </button>
                    <button className="setting-action" onClick={() => {
                      refreshStatistics();
                      setActiveTab('stats');
                    }}>
                      <span>Statistikani yangilash</span>
                      <FaSync />
                    </button>
                  </div>
                </div>

                <div className="settings-card">
                  <h3>
                    <FaGlobe /> Tema
                  </h3>
                  <div className="settings-group">
                    <div className="setting-item">
                      <div className="setting-info">
                        <h4>Qorong'u rejim</h4>
                        <p>Qorong'u yoki yorug' tema tanlang</p>
                      </div>
                      <label className="toggle-switch">
                        <input 
                          type="checkbox" 
                          checked={darkMode}
                          onChange={toggleDarkMode}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;