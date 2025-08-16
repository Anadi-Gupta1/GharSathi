import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ASYNC_STORAGE_KEYS } from '../constants/api';

class ApiService {
  private api: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';
    
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem(ASYNC_STORAGE_KEYS.USER_TOKEN);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle token refresh
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = await AsyncStorage.getItem(ASYNC_STORAGE_KEYS.REFRESH_TOKEN);
            
            if (refreshToken) {
              const response = await axios.post(`${this.baseURL}/auth/refresh-token`, {
                refreshToken,
              });

              const { token } = response.data;
              await AsyncStorage.setItem(ASYNC_STORAGE_KEYS.USER_TOKEN, token);

              // Retry the original request
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return this.api(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed, redirect to login
            await AsyncStorage.multiRemove([
              ASYNC_STORAGE_KEYS.USER_TOKEN,
              ASYNC_STORAGE_KEYS.REFRESH_TOKEN,
              ASYNC_STORAGE_KEYS.USER_DATA,
            ]);
            
            // You can dispatch a logout action here if needed
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Generic request methods
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.api.get(url, config);
    return response.data;
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.api.post(url, data, config);
    return response.data;
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.api.put(url, data, config);
    return response.data;
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.api.patch(url, data, config);
    return response.data;
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.api.delete(url, config);
    return response.data;
  }

  // File upload
  async uploadFile<T = any>(url: string, formData: FormData): Promise<T> {
    const response: AxiosResponse<T> = await this.api.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Auth methods
  async login(email: string, password: string) {
    return this.post('/auth/login', { email, password });
  }

  async signup(userData: { name: string; email: string; phone: string; password: string; role: string }) {
    return this.post('/auth/signup', userData);
  }

  async verifyOTP(phone: string, otp: string) {
    return this.post('/auth/verify-otp', { phone, otp });
  }

  async refreshToken(refreshToken: string) {
    return this.post('/auth/refresh-token', { refreshToken });
  }

  async logout() {
    return this.post('/auth/logout');
  }

  // User methods
  async getUserProfile() {
    return this.get('/user/profile');
  }

  async updateUserProfile(profileData: any) {
    return this.put('/user/profile', profileData);
  }

  async uploadAvatar(imageFile: FormData) {
    return this.uploadFile('/user/avatar', imageFile);
  }

  async getUserAddresses() {
    return this.get('/user/addresses');
  }

  async addUserAddress(addressData: any) {
    return this.post('/user/addresses', addressData);
  }

  async updateUserAddress(addressId: string, addressData: any) {
    return this.put(`/user/addresses/${addressId}`, addressData);
  }

  async deleteUserAddress(addressId: string) {
    return this.delete(`/user/addresses/${addressId}`);
  }

  // Service methods
  async getServices() {
    return this.get('/services');
  }

  async getServicesByCategory(category: string) {
    return this.get(`/services/category/${category}`);
  }

  async searchServices(query: string) {
    return this.get(`/services/search?q=${encodeURIComponent(query)}`);
  }

  async getServiceById(serviceId: string) {
    return this.get(`/services/${serviceId}`);
  }

  // Provider methods
  async getNearbyProviders(serviceId: string, latitude: number, longitude: number, radius: number) {
    return this.get(`/providers/nearby?serviceId=${serviceId}&lat=${latitude}&lng=${longitude}&radius=${radius}`);
  }

  async getProviderById(providerId: string) {
    return this.get(`/providers/${providerId}`);
  }

  async getProviderReviews(providerId: string) {
    return this.get(`/providers/${providerId}/reviews`);
  }

  // Booking methods
  async createBooking(bookingData: any) {
    return this.post('/bookings', bookingData);
  }

  async getUserBookings() {
    return this.get('/bookings');
  }

  async getBookingById(bookingId: string) {
    return this.get(`/bookings/${bookingId}`);
  }

  async acceptBooking(bookingId: string) {
    return this.post(`/bookings/${bookingId}/accept`);
  }

  async rejectBooking(bookingId: string, reason: string) {
    return this.post(`/bookings/${bookingId}/reject`, { reason });
  }

  async startBooking(bookingId: string) {
    return this.post(`/bookings/${bookingId}/start`);
  }

  async completeBooking(bookingId: string, notes?: string) {
    return this.post(`/bookings/${bookingId}/complete`, { notes });
  }

  async cancelBooking(bookingId: string, reason: string) {
    return this.post(`/bookings/${bookingId}/cancel`, { reason });
  }

  async rateBooking(bookingId: string, rating: number, review?: string) {
    return this.post(`/bookings/${bookingId}/rate`, { rating, review });
  }

  async updateBookingLocation(bookingId: string, latitude: number, longitude: number) {
    return this.post(`/bookings/${bookingId}/location`, { latitude, longitude });
  }

  // Payment methods
  async createPaymentOrder(bookingId: string, amount: number, currency: string = 'INR') {
    return this.post('/payments/create-order', { bookingId, amount, currency });
  }

  async verifyPayment(paymentData: any) {
    return this.post('/payments/verify', paymentData);
  }

  async getPaymentHistory() {
    return this.get('/payments/history');
  }

  async requestRefund(paymentId: string, reason: string) {
    return this.post('/payments/refund', { paymentId, reason });
  }

  // KYC methods
  async uploadKYCDocument(documentType: string, documentFile: FormData) {
    return this.uploadFile(`/kyc/upload/${documentType}`, documentFile);
  }

  async getKYCStatus() {
    return this.get('/kyc/status');
  }

  async updateBankDetails(bankData: any) {
    return this.post('/kyc/bank-details', bankData);
  }

  // Notification methods
  async getNotifications() {
    return this.get('/notifications');
  }

  async markNotificationAsRead(notificationId: string) {
    return this.post(`/notifications/${notificationId}/read`);
  }

  async markAllNotificationsAsRead() {
    return this.post('/notifications/read-all');
  }

  // Chat methods
  async getChatRooms() {
    return this.get('/chat/rooms');
  }

  async getChatMessages(roomId: string) {
    return this.get(`/chat/${roomId}/messages`);
  }

  async sendMessage(roomId: string, message: string, type: string = 'text') {
    return this.post(`/chat/${roomId}/send`, { message, type });
  }

  // Dispute methods
  async createDispute(disputeData: any) {
    return this.post('/disputes', disputeData);
  }

  async getDisputes() {
    return this.get('/disputes');
  }

  async getDisputeById(disputeId: string) {
    return this.get(`/disputes/${disputeId}`);
  }

  // Wallet methods
  async getWalletBalance() {
    return this.get('/wallet/balance');
  }

  async getWalletTransactions() {
    return this.get('/wallet/transactions');
  }

  async addMoneyToWallet(amount: number) {
    return this.post('/wallet/add-money', { amount });
  }

  async withdrawFromWallet(amount: number, bankAccountId: string) {
    return this.post('/wallet/withdraw', { amount, bankAccountId });
  }
}

export const apiService = new ApiService();
export default apiService;
