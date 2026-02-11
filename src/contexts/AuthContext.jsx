import { createContext, useState, useContext, useEffect } from 'react';
import { 
  auth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from '../firebase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          // Add any additional user properties you need
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      setUser({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        // Add any additional user properties
      });
      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      const { email, password, name } = userData;
      
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update user profile with display name
      await updateProfile(user, {
        displayName: name
      });
      
      // Update local state
      setUser({
        uid: user.uid,
        email: user.email,
        displayName: name
      });
      
      return { success: true };
    } catch (error) {
      console.error('Registration failed:', error);
      let errorMessage = 'Ro\'yxatdan o\'tishda xatolik yuz berdi';
      
      // More user-friendly error messages
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Bu email allaqachon ro\'yxatdan o\'tgan';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Noto\'g\'ri email formati';
          break;
        case 'auth/weak-password':
          errorMessage = 'Parol juda oson, kamida 6 ta belgi bo\'lishi kerak';
          break;
      }
      
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const value = {
    currentUser: user,
    user,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
