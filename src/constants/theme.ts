export const COLORS = {
  primary: '#4A90E2',
  primaryDark: '#357ABD',
  secondary: '#50C878',
  accent: '#FF6B6B',
  background: '#FFFFFF',
  surface: '#F8F9FA',
  text: '#212529',
  textSecondary: '#6C757D',
  textLight: '#ADB5BD',
  border: '#DEE2E6',
  error: '#DC3545',
  warning: '#FFC107',
  success: '#28A745',
  info: '#17A2B8',
  
  // Status Colors
  pending: '#FFC107',
  accepted: '#28A745',
  rejected: '#DC3545',
  inProgress: '#17A2B8',
  completed: '#6F42C1',
  
  // Gradient Colors
  gradientStart: '#4A90E2',
  gradientEnd: '#357ABD',
};

export const FONTS = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
  light: 'System',
};

export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 50,
};

export const SHADOWS = {
  light: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  heavy: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
};

export const SCREEN_DIMENSIONS = {
  width: 375, // Default width for responsive calculations
  height: 812, // Default height for responsive calculations
};

export const SERVICE_CATEGORIES = [
  {
    id: 'cleaning',
    name: 'Cleaning',
    icon: 'cleaning-services',
    color: '#4CAF50',
    services: ['house-cleaning', 'deep-cleaning', 'carpet-cleaning', 'window-cleaning']
  },
  {
    id: 'repair',
    name: 'Repair & Maintenance',
    icon: 'build',
    color: '#FF9800',
    services: ['plumbing', 'electrical', 'appliance-repair', 'furniture-repair']
  },
  {
    id: 'beauty',
    name: 'Beauty & Wellness',
    icon: 'spa',
    color: '#E91E63',
    services: ['haircut', 'facial', 'massage', 'manicure-pedicure']
  },
  {
    id: 'fitness',
    name: 'Fitness',
    icon: 'fitness-center',
    color: '#2196F3',
    services: ['personal-trainer', 'yoga', 'physiotherapy', 'nutrition-consultation']
  },
  {
    id: 'tutoring',
    name: 'Tutoring',
    icon: 'school',
    color: '#9C27B0',
    services: ['academic-tutoring', 'music-lessons', 'language-classes', 'skill-training']
  },
  {
    id: 'transport',
    name: 'Transport',
    icon: 'local-shipping',
    color: '#607D8B',
    services: ['courier', 'moving', 'driver-service', 'goods-transport']
  },
];

export const BOOKING_STATUSES = {
  pending: { label: 'Pending', color: COLORS.warning },
  accepted: { label: 'Accepted', color: COLORS.success },
  rejected: { label: 'Rejected', color: COLORS.error },
  in_progress: { label: 'In Progress', color: COLORS.info },
  completed: { label: 'Completed', color: COLORS.success },
  cancelled: { label: 'Cancelled', color: COLORS.error },
  disputed: { label: 'Disputed', color: COLORS.error },
};

export const PAYMENT_METHODS = [
  { id: 'upi', name: 'UPI', icon: 'account-balance-wallet' },
  { id: 'card', name: 'Credit/Debit Card', icon: 'credit-card' },
  { id: 'wallet', name: 'Wallet', icon: 'account-balance-wallet' },
  { id: 'netbanking', name: 'Net Banking', icon: 'account-balance' },
  { id: 'cod', name: 'Cash on Delivery', icon: 'money' },
];

export const DOCUMENT_TYPES = {
  aadhaar: { name: 'Aadhaar Card', required: true },
  pan: { name: 'PAN Card', required: true },
  police_verification: { name: 'Police Verification', required: true },
  skill_certificate: { name: 'Skill Certificate', required: false },
  address_proof: { name: 'Address Proof', required: true },
};
