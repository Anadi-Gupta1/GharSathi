# 🔑 GharSathi App - Credentials Setup Guide

Your Firebase credentials have been successfully configured! Here's what's set up and what you still need:

## ✅ **Already Configured**

### **Firebase** 
- ✅ API Key: AIzaSyBfXpuB6unaF3A1TdPOQ3p16ChMPI95MWE
- ✅ Project ID: gharsathi
- ✅ Auth Domain: gharsathi.firebaseapp.com
- ✅ Storage Bucket: gharsathi.firebasestorage.app
- ✅ App ID: 1:84563901929:web:bc4ab5221459a0bc185f78

### **Google OAuth**
- ✅ Web Client ID: 84563901929-bcpq2hbnkqga6anoj6fr9fhb4vlir8ql.apps.googleusercontent.com

## 📋 **Still Need to Configure**

### **1. Google Maps API Key** (Required for location features)
**Steps to get API key:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project or create a new one
3. Enable these APIs:
   - Maps SDK for Android
   - Maps SDK for iOS
   - Places API
   - Geocoding API
   - Directions API
4. Create credentials → API Key
5. Restrict the API key to your app (Android/iOS bundle IDs)

**Add to:** `.env` file as `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY`

### **2. Google OAuth Mobile Client IDs** (For mobile app login)
**Steps:**
1. In Google Cloud Console → APIs & Services → Credentials
2. Create OAuth 2.0 Client ID for Android:
   - Application type: Android
   - Package name: com.yourcompany.gharsathi
   - SHA-1 fingerprint: Get from `expo credentials:manager`
3. Create OAuth 2.0 Client ID for iOS:
   - Application type: iOS
   - Bundle ID: com.yourcompany.gharsathi

**Add to:** `src/services/firebase/firebaseconfig.ts`

### **3. Razorpay Account** (For payments in India)
**Steps:**
1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Create account and verify business
3. Get API keys from Settings → API Keys
4. Test Mode: `rzp_test_xxxxxxxxxx`
5. Live Mode: `rzp_live_xxxxxxxxxx`

**Add to:** `.env` file as `EXPO_PUBLIC_RAZORPAY_KEY_ID`

### **4. Additional Services (Optional)**

#### **Twilio (For SMS OTP)**
- Account SID and Auth Token from [Twilio Console](https://console.twilio.com/)
- Purchase a phone number for sending SMS

#### **Stripe (Alternative payment gateway)**
- Publishable Key and Secret Key from [Stripe Dashboard](https://dashboard.stripe.com/)

## 🚀 **Quick Start Commands**

```bash
# 1. Copy environment file
cp .env.example .env

# 2. Edit .env with your actual keys
# nano .env  (or use your preferred editor)

# 3. Install dependencies
npm install

# 4. Start the development server
npm start

# 5. Run on device/emulator
npm run android  # for Android
npm run ios      # for iOS
```

## 🔐 **Security Notes**

1. **Never commit actual credentials** to version control
2. **Keep .env file in .gitignore** (already configured)
3. **Use test keys for development**
4. **Use live keys only in production**
5. **Restrict API keys** to specific platforms/domains

## 📱 **Firebase Console Setup**

Make sure to enable these in Firebase Console:
1. **Authentication** → Sign-in methods:
   - Phone authentication ✅
   - Google sign-in ✅
   - Email/Password ✅
   
2. **Firestore Database**:
   - Create database in production mode
   - Set up security rules
   
3. **Storage**:
   - Enable for file uploads
   - Configure storage rules

4. **Cloud Messaging**:
   - Enable for push notifications

## 🎯 **Priority Order**

**Immediate (to run the app):**
1. Google Maps API Key
2. Complete Google OAuth setup

**Soon (for full functionality):**
1. Razorpay account for payments
2. Firebase Firestore rules
3. Firebase Storage rules

**Later (for production):**
1. Twilio for SMS
2. Analytics setup
3. Crashlytics/monitoring

## 🆘 **Need Help?**

If you need help with any of these setups:
1. Provide which service you want to set up
2. Share any error messages you encounter
3. Let me know your target platforms (iOS/Android/Web)

Your app is ready to run once you add the Google Maps API key! 🚀
