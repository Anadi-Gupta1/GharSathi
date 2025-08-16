export const API_ENDPOINTS = {
  // Auth
  SIGNUP: '/auth/signup',
  LOGIN: '/auth/login',
  VERIFY_OTP: '/auth/verify-otp',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh-token',
  SOCIAL_LOGIN: '/auth/social',
  
  // User
  PROFILE: '/user/profile',
  UPDATE_PROFILE: '/user/profile',
  UPLOAD_AVATAR: '/user/avatar',
  CHANGE_PASSWORD: '/user/change-password',
  DELETE_ACCOUNT: '/user/delete',
  
  // Services
  SERVICES: '/services',
  SERVICE_BY_ID: '/services/:id',
  SERVICES_BY_CATEGORY: '/services/category/:category',
  SEARCH_SERVICES: '/services/search',
  
  // Providers
  PROVIDERS: '/providers',
  PROVIDER_BY_ID: '/providers/:id',
  NEARBY_PROVIDERS: '/providers/nearby',
  PROVIDER_REVIEWS: '/providers/:id/reviews',
  PROVIDER_PORTFOLIO: '/providers/:id/portfolio',
  
  // Bookings
  BOOKINGS: '/bookings',
  CREATE_BOOKING: '/bookings',
  BOOKING_BY_ID: '/bookings/:id',
  CANCEL_BOOKING: '/bookings/:id/cancel',
  ACCEPT_BOOKING: '/bookings/:id/accept',
  REJECT_BOOKING: '/bookings/:id/reject',
  START_BOOKING: '/bookings/:id/start',
  COMPLETE_BOOKING: '/bookings/:id/complete',
  UPDATE_LOCATION: '/bookings/:id/location',
  
  // Payments
  CREATE_PAYMENT_ORDER: '/payments/create-order',
  VERIFY_PAYMENT: '/payments/verify',
  PAYMENT_HISTORY: '/payments/history',
  REFUND: '/payments/refund',
  
  // Reviews
  CREATE_REVIEW: '/reviews',
  REVIEWS_BY_PROVIDER: '/reviews/provider/:providerId',
  REVIEWS_BY_USER: '/reviews/user/:userId',
  
  // KYC & Verification
  UPLOAD_DOCUMENT: '/kyc/upload',
  KYC_STATUS: '/kyc/status',
  BANK_DETAILS: '/kyc/bank-details',
  
  // Notifications
  NOTIFICATIONS: '/notifications',
  MARK_READ: '/notifications/:id/read',
  MARK_ALL_READ: '/notifications/read-all',
  
  // Chat
  CHAT_ROOMS: '/chat/rooms',
  CHAT_MESSAGES: '/chat/:roomId/messages',
  SEND_MESSAGE: '/chat/:roomId/send',
  
  // Disputes
  DISPUTES: '/disputes',
  CREATE_DISPUTE: '/disputes',
  DISPUTE_BY_ID: '/disputes/:id',
  
  // Wallet
  WALLET_BALANCE: '/wallet/balance',
  WALLET_TRANSACTIONS: '/wallet/transactions',
  ADD_MONEY: '/wallet/add-money',
  WITHDRAW: '/wallet/withdraw',
  
  // Admin (for future use)
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_USERS: '/admin/users',
  ADMIN_PROVIDERS: '/admin/providers',
  ADMIN_BOOKINGS: '/admin/bookings',
  ADMIN_DISPUTES: '/admin/disputes',
  ADMIN_ANALYTICS: '/admin/analytics',
};

export const SOCKET_EVENTS = {
  // Connection
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  JOIN_ROOM: 'join_room',
  LEAVE_ROOM: 'leave_room',
  
  // Booking Events
  BOOKING_REQUEST: 'booking_request',
  BOOKING_ACCEPTED: 'booking_accepted',
  BOOKING_REJECTED: 'booking_rejected',
  BOOKING_STARTED: 'booking_started',
  BOOKING_COMPLETED: 'booking_completed',
  BOOKING_CANCELLED: 'booking_cancelled',
  
  // Location Updates
  LOCATION_UPDATE: 'location_update',
  PROVIDER_LOCATION: 'provider_location',
  
  // Chat
  NEW_MESSAGE: 'new_message',
  MESSAGE_DELIVERED: 'message_delivered',
  MESSAGE_READ: 'message_read',
  TYPING_START: 'typing_start',
  TYPING_STOP: 'typing_stop',
  
  // Notifications
  NOTIFICATION: 'notification',
  PUSH_NOTIFICATION: 'push_notification',
  
  // System
  SYSTEM_ALERT: 'system_alert',
  MAINTENANCE_MODE: 'maintenance_mode',
};

export const ASYNC_STORAGE_KEYS = {
  USER_TOKEN: '@gharsathi:user_token',
  REFRESH_TOKEN: '@gharsathi:refresh_token',
  USER_DATA: '@gharsathi:user_data',
  LANGUAGE: '@gharsathi:language',
  THEME: '@gharsathi:theme',
  FIRST_LAUNCH: '@gharsathi:first_launch',
  LOCATION_PERMISSION: '@gharsathi:location_permission',
  NOTIFICATION_PERMISSION: '@gharsathi:notification_permission',
  ONBOARDING_COMPLETED: '@gharsathi:onboarding_completed',
  ADDRESSES: '@gharsathi:addresses',
  RECENT_SEARCHES: '@gharsathi:recent_searches',
  FAVORITES: '@gharsathi:favorites',
};

export const NOTIFICATION_CHANNELS = {
  BOOKING: 'booking_channel',
  CHAT: 'chat_channel',
  PROMOTION: 'promotion_channel',
  SYSTEM: 'system_channel',
};

export const DEEP_LINK_PREFIXES = [
  'gharsathi://',
  'https://gharsathi.app',
];

export const GOOGLE_PLACES_TYPES = [
  'establishment',
  'geocode',
  'address',
];

export const MAX_FILE_SIZE = {
  IMAGE: 5 * 1024 * 1024, // 5MB
  DOCUMENT: 10 * 1024 * 1024, // 10MB
  VIDEO: 50 * 1024 * 1024, // 50MB
};

export const SUPPORTED_IMAGE_FORMATS = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
];

export const SUPPORTED_DOCUMENT_FORMATS = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
];

export const RATING_CONFIG = {
  MIN: 1,
  MAX: 5,
  DEFAULT: 5,
  STEP: 0.5,
};

export const SEARCH_CONFIG = {
  DEFAULT_RADIUS: 10, // km
  MAX_RADIUS: 50, // km
  MIN_QUERY_LENGTH: 2,
  DEBOUNCE_DELAY: 300, // ms
};

export const LOCATION_CONFIG = {
  ACCURACY: 'high',
  UPDATE_INTERVAL: 5000, // 5 seconds
  DISTANCE_FILTER: 10, // meters
  TIMEOUT: 15000, // 15 seconds
};

export const VALIDATION_RULES = {
  PHONE: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 10,
    PATTERN: /^[6-9]\d{9}$/,
  },
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
    PATTERN: /^[a-zA-Z\s]+$/,
  },
  PINCODE: {
    LENGTH: 6,
    PATTERN: /^[1-9][0-9]{5}$/,
  },
  PAN: {
    LENGTH: 10,
    PATTERN: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
  },
  AADHAAR: {
    LENGTH: 12,
    PATTERN: /^[2-9]{1}[0-9]{11}$/,
  },
  IFSC: {
    LENGTH: 11,
    PATTERN: /^[A-Z]{4}0[A-Z0-9]{6}$/,
  },
  ACCOUNT_NUMBER: {
    MIN_LENGTH: 9,
    MAX_LENGTH: 18,
    PATTERN: /^[0-9]+$/,
  },
};
