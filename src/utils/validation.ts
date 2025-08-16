import { VALIDATION_RULES } from '../constants/api';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export class ValidationService {
  // Email validation
  static validateEmail(email: string): ValidationResult {
    if (!email || email.trim().length === 0) {
      return { isValid: false, error: 'Email is required' };
    }

    if (!VALIDATION_RULES.EMAIL.PATTERN.test(email)) {
      return { isValid: false, error: 'Please enter a valid email address' };
    }

    return { isValid: true };
  }

  // Phone validation
  static validatePhone(phone: string): ValidationResult {
    if (!phone || phone.trim().length === 0) {
      return { isValid: false, error: 'Phone number is required' };
    }

    // Remove spaces and special characters
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');

    if (cleanPhone.length !== VALIDATION_RULES.PHONE.MIN_LENGTH) {
      return { isValid: false, error: `Phone number must be ${VALIDATION_RULES.PHONE.MIN_LENGTH} digits` };
    }

    if (!VALIDATION_RULES.PHONE.PATTERN.test(cleanPhone)) {
      return { isValid: false, error: 'Please enter a valid Indian phone number' };
    }

    return { isValid: true };
  }

  // Password validation
  static validatePassword(password: string): ValidationResult {
    if (!password || password.length === 0) {
      return { isValid: false, error: 'Password is required' };
    }

    if (password.length < VALIDATION_RULES.PASSWORD.MIN_LENGTH) {
      return { isValid: false, error: `Password must be at least ${VALIDATION_RULES.PASSWORD.MIN_LENGTH} characters long` };
    }

    if (!VALIDATION_RULES.PASSWORD.PATTERN.test(password)) {
      return { 
        isValid: false, 
        error: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character' 
      };
    }

    return { isValid: true };
  }

  // Name validation
  static validateName(name: string): ValidationResult {
    if (!name || name.trim().length === 0) {
      return { isValid: false, error: 'Name is required' };
    }

    if (name.trim().length < VALIDATION_RULES.NAME.MIN_LENGTH) {
      return { isValid: false, error: `Name must be at least ${VALIDATION_RULES.NAME.MIN_LENGTH} characters long` };
    }

    if (name.trim().length > VALIDATION_RULES.NAME.MAX_LENGTH) {
      return { isValid: false, error: `Name must not exceed ${VALIDATION_RULES.NAME.MAX_LENGTH} characters` };
    }

    if (!VALIDATION_RULES.NAME.PATTERN.test(name)) {
      return { isValid: false, error: 'Name can only contain letters and spaces' };
    }

    return { isValid: true };
  }

  // PAN validation
  static validatePAN(pan: string): ValidationResult {
    if (!pan || pan.trim().length === 0) {
      return { isValid: false, error: 'PAN is required' };
    }

    const cleanPAN = pan.toUpperCase().replace(/\s/g, '');

    if (cleanPAN.length !== VALIDATION_RULES.PAN.LENGTH) {
      return { isValid: false, error: `PAN must be ${VALIDATION_RULES.PAN.LENGTH} characters long` };
    }

    if (!VALIDATION_RULES.PAN.PATTERN.test(cleanPAN)) {
      return { isValid: false, error: 'Please enter a valid PAN number' };
    }

    return { isValid: true };
  }

  // Aadhaar validation
  static validateAadhaar(aadhaar: string): ValidationResult {
    if (!aadhaar || aadhaar.trim().length === 0) {
      return { isValid: false, error: 'Aadhaar number is required' };
    }

    const cleanAadhaar = aadhaar.replace(/\s/g, '');

    if (cleanAadhaar.length !== VALIDATION_RULES.AADHAAR.LENGTH) {
      return { isValid: false, error: `Aadhaar must be ${VALIDATION_RULES.AADHAAR.LENGTH} digits long` };
    }

    if (!VALIDATION_RULES.AADHAAR.PATTERN.test(cleanAadhaar)) {
      return { isValid: false, error: 'Please enter a valid Aadhaar number' };
    }

    // Verhoeff algorithm check (basic implementation)
    if (!this.verifyAadhaarChecksum(cleanAadhaar)) {
      return { isValid: false, error: 'Invalid Aadhaar number' };
    }

    return { isValid: true };
  }

  // IFSC code validation
  static validateIFSC(ifsc: string): ValidationResult {
    if (!ifsc || ifsc.trim().length === 0) {
      return { isValid: false, error: 'IFSC code is required' };
    }

    const cleanIFSC = ifsc.toUpperCase().replace(/\s/g, '');

    if (cleanIFSC.length !== VALIDATION_RULES.IFSC.LENGTH) {
      return { isValid: false, error: `IFSC code must be ${VALIDATION_RULES.IFSC.LENGTH} characters long` };
    }

    if (!VALIDATION_RULES.IFSC.PATTERN.test(cleanIFSC)) {
      return { isValid: false, error: 'Please enter a valid IFSC code' };
    }

    return { isValid: true };
  }

  // Account number validation
  static validateAccountNumber(accountNumber: string): ValidationResult {
    if (!accountNumber || accountNumber.trim().length === 0) {
      return { isValid: false, error: 'Account number is required' };
    }

    const cleanAccountNumber = accountNumber.replace(/\s/g, '');

    if (cleanAccountNumber.length < VALIDATION_RULES.ACCOUNT_NUMBER.MIN_LENGTH) {
      return { isValid: false, error: `Account number must be at least ${VALIDATION_RULES.ACCOUNT_NUMBER.MIN_LENGTH} digits long` };
    }

    if (cleanAccountNumber.length > VALIDATION_RULES.ACCOUNT_NUMBER.MAX_LENGTH) {
      return { isValid: false, error: `Account number must not exceed ${VALIDATION_RULES.ACCOUNT_NUMBER.MAX_LENGTH} digits` };
    }

    if (!VALIDATION_RULES.ACCOUNT_NUMBER.PATTERN.test(cleanAccountNumber)) {
      return { isValid: false, error: 'Account number can only contain digits' };
    }

    return { isValid: true };
  }

  // Pincode validation
  static validatePincode(pincode: string): ValidationResult {
    if (!pincode || pincode.trim().length === 0) {
      return { isValid: false, error: 'Pincode is required' };
    }

    const cleanPincode = pincode.replace(/\s/g, '');

    if (cleanPincode.length !== VALIDATION_RULES.PINCODE.LENGTH) {
      return { isValid: false, error: `Pincode must be ${VALIDATION_RULES.PINCODE.LENGTH} digits long` };
    }

    if (!VALIDATION_RULES.PINCODE.PATTERN.test(cleanPincode)) {
      return { isValid: false, error: 'Please enter a valid pincode' };
    }

    return { isValid: true };
  }

  // OTP validation
  static validateOTP(otp: string, length: number = 6): ValidationResult {
    if (!otp || otp.trim().length === 0) {
      return { isValid: false, error: 'OTP is required' };
    }

    if (otp.length !== length) {
      return { isValid: false, error: `OTP must be ${length} digits long` };
    }

    if (!/^\d+$/.test(otp)) {
      return { isValid: false, error: 'OTP can only contain digits' };
    }

    return { isValid: true };
  }

  // Password confirmation validation
  static validatePasswordConfirmation(password: string, confirmPassword: string): ValidationResult {
    if (!confirmPassword || confirmPassword.length === 0) {
      return { isValid: false, error: 'Please confirm your password' };
    }

    if (password !== confirmPassword) {
      return { isValid: false, error: 'Passwords do not match' };
    }

    return { isValid: true };
  }

  // Generic required field validation
  static validateRequired(value: string, fieldName: string): ValidationResult {
    if (!value || value.trim().length === 0) {
      return { isValid: false, error: `${fieldName} is required` };
    }

    return { isValid: true };
  }

  // Validate multiple fields at once
  static validateForm(fields: Record<string, string>, validations: Record<string, (value: string) => ValidationResult>): Record<string, string> {
    const errors: Record<string, string> = {};

    Object.keys(validations).forEach(field => {
      const validation = validations[field](fields[field] || '');
      if (!validation.isValid && validation.error) {
        errors[field] = validation.error;
      }
    });

    return errors;
  }

  // Basic Verhoeff algorithm check for Aadhaar (simplified)
  private static verifyAadhaarChecksum(aadhaar: string): boolean {
    // This is a simplified version. In production, use a proper Verhoeff algorithm implementation
    const multiplication = [
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
      [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
      [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
      [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
      [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
      [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
      [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
      [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
      [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
    ];

    const permutation = [
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
      [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
      [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
      [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
      [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
      [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
      [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]
    ];

    let c = 0;
    const digits = aadhaar.split('').map(Number);

    for (let i = 0; i < digits.length; i++) {
      c = multiplication[c][permutation[((digits.length - i) % 8)][digits[i]]];
    }

    return c === 0;
  }
}

export default ValidationService;
