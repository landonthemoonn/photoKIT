# Firebase Setup Guide for PhotoKIT

PhotoKIT now uses Firebase for authentication and cloud storage! Follow these steps to set up your Firebase project.

## Prerequisites

- Google account
- Node.js installed
- PhotoKIT repository cloned

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **Add project**
3. Enter project name (e.g., "photokit")
4. Click **Continue**
5. Disable Google Analytics (optional, not needed for this app)
6. Click **Create project**

## Step 2: Register Your Web App

1. In your Firebase project dashboard, click the **Web** icon (`</>`)
2. Enter app nickname (e.g., "PhotoKIT Web App")
3. **Do NOT** check "Also set up Firebase Hosting"
4. Click **Register app**
5. You'll see your Firebase configuration - **keep this page open**

## Step 3: Configure Environment Variables

1. Create a `.env` file in the root of your PhotoKIT project:
   ```bash
   cp .env.example .env
   ```

2. Copy the Firebase config values from the Firebase Console into your `.env` file:
   ```
   VITE_FIREBASE_API_KEY=AIzaSy...
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
   ```

## Step 4: Enable Firebase Authentication

1. In Firebase Console, go to **Authentication** in the left sidebar
2. Click **Get started**
3. Click on the **Sign-in method** tab
4. Enable **Email/Password**:
   - Click on "Email/Password"
   - Toggle **Enable** to ON
   - Click **Save**

## Step 5: Set Up Cloud Firestore

1. In Firebase Console, go to **Firestore Database** in the left sidebar
2. Click **Create database**
3. Choose **Start in production mode** (we'll add security rules next)
4. Select a Cloud Firestore location (choose one close to your users)
5. Click **Enable**

### Add Security Rules

1. Click on the **Rules** tab in Firestore
2. Replace the default rules with these:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Photos collection - users can only read/write their own photos
    match /photos/{photoId} {
      allow read, write: if request.auth != null &&
                           request.auth.uid == resource.data.userId;
      allow create: if request.auth != null &&
                      request.auth.uid == request.resource.data.userId;
    }
  }
}
```

3. Click **Publish**

## Step 6: Set Up Cloud Storage

1. In Firebase Console, go to **Storage** in the left sidebar
2. Click **Get started**
3. Click **Next** to use production mode
4. Select the same location you chose for Firestore
5. Click **Done**

### Add Storage Security Rules

1. Click on the **Rules** tab in Storage
2. Replace the default rules with these:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Photos folder - users can only read/write their own photos
    match /photos/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. Click **Publish**

## Step 7: Install Dependencies and Run

1. Install dependencies (if not already done):
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open your browser to the URL shown (usually http://localhost:5173)

## Step 8: Test the Application

1. You should see the PhotoKIT onboarding screen
2. Create an account with:
   - Your name
   - Email address
   - Password (minimum 6 characters)
   - Organization (optional)
3. Click **Complete Setup**
4. You should now be logged in and see the main PhotoKIT interface
5. Try uploading a photo to test Firebase Storage integration

## Troubleshooting

### "Firebase: Error (auth/...)"

- **auth/email-already-in-use**: This email is already registered. Try signing in instead.
- **auth/weak-password**: Password must be at least 6 characters.
- **auth/invalid-email**: Check that the email format is correct.

### "User not authenticated" errors

- Make sure you're signed in (refresh the page to check auth state)
- Check that your Firebase Auth is enabled in the Firebase Console

### Photos not uploading

- Verify Firebase Storage is enabled
- Check Storage security rules are correctly configured
- Open browser console (F12) to see detailed error messages

### Environment variables not loading

- Make sure `.env` file is in the project root
- Restart the dev server after creating/editing `.env`
- Variables must start with `VITE_` to be accessible in Vite apps

## Production Deployment

When deploying to production (GitHub Pages, Netlify, Vercel, etc.):

1. Add environment variables in your hosting platform's settings
2. Update Firebase Console > Authentication > Settings > Authorized domains
3. Add your production domain to the authorized domains list

## Cost Estimation

Firebase free tier ("Spark Plan") includes:
- **Authentication**: Unlimited users
- **Firestore**: 1GB storage, 50K reads/day, 20K writes/day
- **Storage**: 5GB storage, 1GB downloads/day

For AI generation management with lots of images, you'll likely need the **Blaze Plan** (pay-as-you-go):
- Storage: $0.026/GB/month
- Downloads: $0.12/GB
- Firestore reads: $0.06 per 100K
- Firestore writes: $0.18 per 100K

**Estimated monthly cost** for ~500 images (5GB):
- Storage: ~$0.13
- Total: **$5-10/month** depending on usage

## Next Steps

- Customize security rules for your use case
- Set up Firebase indexes for better query performance
- Add Firebase Analytics (optional)
- Implement additional features like sharing, collections, etc.

## Support

For Firebase-specific issues:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Support](https://firebase.google.com/support)

For PhotoKIT issues:
- [PhotoKIT GitHub Issues](https://github.com/landonthemoonn/photoKIT/issues)
