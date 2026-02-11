# Firebase Setup Instructions

## 🚨 IMPORTANT: Fix for Firebase Permissions Error

The application was experiencing "Missing or insufficient permissions" errors. This has been fixed by updating the Firestore security rules.

## Quick Fix Steps

1. **Deploy the updated security rules:**
```bash
npm run firebase:deploy
```

Or alternatively:
```bash
node deploy-firebase-rules.js
```

2. **Manual deployment (if scripts don't work):**
```bash
firebase deploy --only firestore:rules
```

## What Was Fixed

### Security Rules Update (`firestore.rules`)
- **Before**: Any authenticated user could access any user's data
- **After**: Users can only access their own data using `request.auth.uid == userId`

### Statistics Service Improvements
- Added better error handling for permission issues
- Added automatic initialization of user stats for new users
- Improved user-friendly error messages

### Profile Component Updates
- Enhanced error handling with user-friendly messages
- Better handling of empty statistics data
- Improved authentication state management

## Firestore Security Rules

The application requires Firestore security rules to be properly configured. The rules file `firestore.rules` has been updated with the following permissions:

### Current Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to authenticated users for their own data only
    match /userStats/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /userSearchHistory/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow read access to public data (if any)
    match /public/{document=**} {
      allow read: if true;
    }
  }
}
```

## Testing the Fix

After deploying the security rules:

1. **Clear browser cache** and refresh the application
2. **Open browser console** (F12) - you should no longer see permission errors
3. **Test statistics functionality:**
   - Navigate to Profile page
   - Click on Statistics tab
   - The statistics should load without permission errors

## Common Issues & Solutions

1. **Permission Denied Errors:**
   - ✅ **Fixed**: Deploy the updated security rules
   - Make sure you're logged in with a valid Firebase account

2. **Firebase Not Initialized:**
   - Check that Firebase configuration is correct in `src/firebase.js`
   - Verify environment variables are set

3. **User Not Authenticated:**
   - Statistics tracking only works for authenticated users
   - Make sure users are properly logged in

## Deployment Scripts

New deployment scripts have been added to `package.json`:

```json
{
  "scripts": {
    "deploy:rules": "node deploy-firebase-rules.js",
    "firebase:deploy": "firebase deploy --only firestore:rules"
  }
}
```

## Statistics Service Features

The enhanced statistics service provides:
- ✅ Search tracking for authenticated users
- ✅ Monthly search statistics  
- ✅ Popular locations tracking
- ✅ Search history
- ✅ Cached statistics (5-minute cache)
- ✅ **NEW**: Better error handling and fallbacks
- ✅ **NEW**: Automatic user stats initialization
- ✅ **NEW**: User-friendly error messages

## Environment Setup

If you haven't set up Firebase CLI:

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase in your project (if not already done):
```bash
firebase init firestore
```

4. Deploy the security rules:
```bash
npm run firebase:deploy
```
