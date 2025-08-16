// Environment configuration for GharSathi app
export const ENV_CONFIG = {
  // Firebase Configuration
  FIREBASE: {
    apiKey: "AIzaSyBfXpuB6unaF3A1TdPOQ3p16ChMPI95MWE",
    authDomain: "gharsathi.firebaseapp.com",
    projectId: "gharsathi",
    storageBucket: "gharsathi.firebasestorage.app",
    messagingSenderId: "84563901929",
    appId: "1:84563901929:web:bc4ab5221459a0bc185f78",
    measurementId: "G-280EECP3G2"
  },

  // Google OAuth Configuration
  GOOGLE_OAUTH: {
    webClientId: "84563901929-bcpq2hbnkqga6anoj6fr9fhb4vlir8ql.apps.googleusercontent.com",
    // Note: You'll need to create iOS and Android client IDs in Google Cloud Console
    iosClientId: "", // Add when you create iOS app in Google Console
    androidClientId: "", // Add when you create Android app in Google Console
  },

  // Google Maps Configuration
  GOOGLE_MAPS: {
    // You'll need to create a Google Maps API key
    apiKey: "", // Add your Google Maps API key here
  },

  // Payment Gateway Configuration
  RAZORPAY: {
    // You'll need to create a Razorpay account for Indian payments
    keyId: "", // Add your Razorpay key ID (rzp_test_xxxx or rzp_live_xxxx)
    keySecret: "", // Add your Razorpay key secret (keep this secure)
  },

  STRIPE: {
    // Alternative payment gateway for international payments
    publishableKey: "", // Add your Stripe publishable key (pk_test_xxxx or pk_live_xxxx)
    secretKey: "", // Add your Stripe secret key (keep this secure)
  },

  // SMS/OTP Service Configuration
  TWILIO: {
    // For SMS-based OTP verification
    accountSid: "", // Add your Twilio Account SID
    authToken: "", // Add your Twilio Auth Token (keep this secure)
    phoneNumber: "", // Add your Twilio phone number
  },

  // API Configuration
  API: {
    baseURL: "https://api.gharsathi.com/v1", // Replace with your backend API URL
    timeout: 10000,
    retryAttempts: 3,
  },

  // App Configuration
  APP: {
    name: "GharSathi",
    version: "1.0.0",
    environment: __DEV__ ? "development" : "production",
    supportEmail: "support@gharsathi.com",
    supportPhone: "+91-1234567890",
  },

  // Feature Flags
  FEATURES: {
    enableAnalytics: true,
    enablePushNotifications: true,
    enableSocialLogin: true,
    enableRealTimeTracking: true,
    enableAIRecommendations: true,
  }
};

// Helper functions to get environment-specific configs
export const isDevelopment = () => __DEV__;
export const isProduction = () => !__DEV__;

export const getApiUrl = (endpoint: string) => `${ENV_CONFIG.API.baseURL}${endpoint}`;

export default ENV_CONFIG;
