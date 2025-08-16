export interface User {
  id: string;
  name: string;
  fullName?: string; // Adding fullName as optional to maintain compatibility
  email: string;
  phone: string;
  role: 'customer' | 'provider' | 'admin';
  profilePicture?: string;
  isVerified: boolean;
  createdAt: string;
  lastActive: string;
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
}

export interface Provider extends User {
  skills: string[];
  rating: number;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  bankDetails?: BankDetails;
  geoLocation: {
    latitude: number;
    longitude: number;
  };
  availability: boolean;
  completedJobs: number;
  earnings: number;
  documents: VerificationDocument[];
  portfolio: PortfolioItem[];
}

export interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  basePrice: number;
  extras: ServiceExtra[];
  duration: number; // in minutes
  imageUrl?: string;
}

export interface ServiceExtra {
  id: string;
  name: string;
  price: number;
  description: string;
}

export interface Booking {
  id: string;
  userId: string;
  providerId: string;
  serviceId: string;
  status: BookingStatus;
  scheduledAt: string;
  startedAt?: string;
  completedAt?: string;
  amount: number;
  paymentId?: string;
  address: Address;
  notes?: string;
  extras: string[];
  customerLocation: {
    latitude: number;
    longitude: number;
  };
  providerLocation?: {
    latitude: number;
    longitude: number;
  };
  rating?: number;
  review?: string;
}

export type BookingStatus = 
  | 'pending' 
  | 'accepted' 
  | 'rejected' 
  | 'in_progress' 
  | 'completed' 
  | 'cancelled' 
  | 'disputed';

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  gateway: 'razorpay' | 'paytm' | 'stripe';
  status: PaymentStatus;
  transactionId?: string;
  createdAt: string;
  method: PaymentMethod;
}

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type PaymentMethod = 'upi' | 'card' | 'wallet' | 'netbanking' | 'cod';

export interface Review {
  id: string;
  bookingId: string;
  userId: string;
  providerId: string;
  rating: number;
  text: string;
  attachments: string[];
  createdAt: string;
}

export interface VerificationDocument {
  id: string;
  type: DocumentType;
  status: 'pending' | 'verified' | 'rejected';
  documentUrl: string;
  verifiedAt?: string;
  rejectionReason?: string;
}

export type DocumentType = 'aadhaar' | 'pan' | 'police_verification' | 'skill_certificate' | 'address_proof';

export interface BankDetails {
  id: string;
  accountNumber: string;
  ifscCode: string;
  accountHolderName: string;
  bankName: string;
  isVerified: boolean;
}

export interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  label: string;
  address: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  latitude: number;
  longitude: number;
  isDefault: boolean;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  completedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
  data?: any;
}

export type NotificationType = 
  | 'booking_request'
  | 'booking_accepted'
  | 'booking_started'
  | 'booking_completed'
  | 'payment_received'
  | 'rating_received'
  | 'verification_update'
  | 'promotion'
  | 'system';

export interface Chat {
  id: string;
  bookingId: string;
  participants: string[];
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  message: string;
  type: 'text' | 'image' | 'file' | 'location';
  timestamp: string;
  isRead: boolean;
}

export interface Dispute {
  id: string;
  bookingId: string;
  raisedBy: string;
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  reason: string;
  description: string;
  evidence: string[];
  resolution?: string;
  createdAt: string;
  resolvedAt?: string;
}

// Navigation Types
export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Signup: undefined;
  OtpVerification: { phone: string };
  RoleSelection: undefined;
  CompleteProfile: { role: 'customer' | 'provider' };
};

export type CustomerTabParamList = {
  Home: undefined;
  Search: undefined;
  Bookings: undefined;
  Profile: undefined;
  Support: undefined;
};

export type ProviderTabParamList = {
  Dashboard: undefined;
  Jobs: undefined;
  Earnings: undefined;
  Profile: undefined;
  Support: undefined;
};

export type CustomerStackParamList = {
  CustomerTabs: undefined;
  CategoryList: undefined;
  ServiceCategory: { category: string };
  ServiceList: { categoryId: string; categoryName: string };
  ServiceDetail: { serviceId: string };
  ProviderDetail: { providerId: string };
  BookingFlow: { serviceId: string; providerId?: string };
  PaymentScreen: { bookingData: any; service: any; totalAmount: number };
  LiveTracking: { bookingId: string };
  Payment: { bookingId: string };
  RatingReview: { bookingId: string };
  Chat: { bookingId: string };
  ChatScreen: { providerId: string };
  AddAddress: undefined;
  EditProfile: undefined;
  NotificationCenter: undefined;
  Wallet: undefined;
  CustomerSearch: { query?: string; category?: string };
  ReviewScreen: undefined;
};

export type ProviderStackParamList = {
  ProviderTabs: undefined;
  JobDetails: { jobId: string };
  Navigation: { bookingId: string };
  KYCVerification: undefined;
  BankDetails: undefined;
  Portfolio: undefined;
  Chat: { bookingId: string };
  DisputeDetails: { disputeId: string };
  EarningsDetails: undefined;
  NotificationCenter: undefined;
};
