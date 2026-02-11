// Test user creation for development
import { auth, createUserWithEmailAndPassword } from '../firebase';

export const createTestUser = async () => {
  try {
    const testEmail = 'test@example.com';
    const testPassword = 'test123456';
    
    console.log('Creating test user...');
    const userCredential = await createUserWithEmailAndPassword(auth, testEmail, testPassword);
    
    console.log('Test user created successfully:', userCredential.user.uid);
    console.log('Email:', testEmail);
    console.log('Password:', testPassword);
    
    return {
      success: true,
      email: testEmail,
      password: testPassword,
      uid: userCredential.user.uid
    };
  } catch (error) {
    console.error('Error creating test user:', error);
    
    if (error.code === 'auth/email-already-in-use') {
      console.log('Test user already exists. You can use these credentials:');
      console.log('Email: test@example.com');
      console.log('Password: test123456');
      return {
        success: true,
        email: 'test@example.com',
        password: 'test123456',
        existing: true
      };
    }
    
    return {
      success: false,
      error: error.message
    };
  }
};

// Make it available globally for testing
if (typeof window !== 'undefined') {
  window.createTestUser = createTestUser;
  console.log('Test user creation available: window.createTestUser()');
}
