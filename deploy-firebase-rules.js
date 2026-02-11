#!/usr/bin/env node

// Firebase security rules deployment script
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔥 Deploying Firebase Security Rules...');

try {
  // Check if firebase CLI is installed
  try {
    execSync('firebase --version', { stdio: 'pipe' });
  } catch (error) {
    console.error('❌ Firebase CLI not found. Please install it with: npm install -g firebase-tools');
    process.exit(1);
  }

  // Check if firestore.rules exists
  const rulesPath = path.join(__dirname, 'firestore.rules');
  if (!readFileSync(rulesPath, 'utf8')) {
    console.error('❌ firestore.rules file not found');
    process.exit(1);
  }

  // Deploy only Firestore rules
  console.log('📤 Deploying Firestore security rules...');
  execSync('firebase deploy --only firestore:rules', { stdio: 'inherit' });

  console.log('✅ Firebase security rules deployed successfully!');
  console.log('\n📝 Rules Summary:');
  console.log('- Users can only access their own data (userStats, userSearchHistory, users collections)');
  console.log('- Authentication is required for all user-specific operations');
  console.log('- Public data remains readable by anyone');

} catch (error) {
  console.error('❌ Error deploying Firebase rules:', error.message);
  console.log('\n🔧 Manual deployment steps:');
  console.log('1. Install Firebase CLI: npm install -g firebase-tools');
  console.log('2. Login to Firebase: firebase login');
  console.log('3. Deploy rules: firebase deploy --only firestore:rules');
  process.exit(1);
}
