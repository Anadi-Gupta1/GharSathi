import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform, Linking } from 'react-native';

export interface NotificationData {
  title: string;
  body: string;
  data?: Record<string, any>;
  sound?: 'default' | null;
  priority?: 'min' | 'low' | 'high' | 'max';
  categoryId?: string;
}

export interface ScheduledNotification {
  identifier: string;
  trigger: {
    type: 'date' | 'timeInterval' | 'daily' | 'weekly';
    value: Date | number;
  };
  notification: NotificationData;
}

// Configure how notifications are handled when received
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export class NotificationService {
  private static expoPushToken: string | null = null;

  // Initialize notification service
  static async initialize(): Promise<void> {
    try {
      // Request permissions
      await this.requestPermissions();
      
      // Get push token
      await this.registerForPushNotifications();
      
      // Set up notification categories
      await this.setupNotificationCategories();
      
      console.log('Notification service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize notification service:', error);
    }
  }

  // Request notification permissions
  static async requestPermissions(): Promise<boolean> {
    try {
      if (!Device.isDevice) {
        console.warn('Push notifications only work on physical devices');
        return false;
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.warn('Push notification permission not granted');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  }

  // Register for push notifications and get token
  static async registerForPushNotifications(): Promise<string | null> {
    try {
      if (!Device.isDevice) {
        console.warn('Must use physical device for push notifications');
        return null;
      }

      const hasPermissions = await this.requestPermissions();
      if (!hasPermissions) {
        return null;
      }

      // Set channel for Android
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'Default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId: 'your-expo-project-id', // Replace with your actual project ID
      });

      this.expoPushToken = tokenData.data;
      console.log('Expo push token:', this.expoPushToken);

      return this.expoPushToken;
    } catch (error) {
      console.error('Error getting push token:', error);
      return null;
    }
  }

  // Get current push token
  static getPushToken(): string | null {
    return this.expoPushToken;
  }

  // Setup notification categories for actions
  static async setupNotificationCategories(): Promise<void> {
    try {
      await Notifications.setNotificationCategoryAsync('booking', [
        {
          identifier: 'accept',
          buttonTitle: 'Accept',
          options: {
            opensAppToForeground: true,
          },
        },
        {
          identifier: 'decline',
          buttonTitle: 'Decline',
          options: {
            opensAppToForeground: false,
          },
        },
      ]);

      await Notifications.setNotificationCategoryAsync('reminder', [
        {
          identifier: 'snooze',
          buttonTitle: 'Snooze',
          options: {
            opensAppToForeground: false,
          },
        },
        {
          identifier: 'view',
          buttonTitle: 'View Details',
          options: {
            opensAppToForeground: true,
          },
        },
      ]);
    } catch (error) {
      console.error('Error setting up notification categories:', error);
    }
  }

  // Send local notification immediately
  static async sendLocalNotification(notification: NotificationData): Promise<string | null> {
    try {
      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: notification.data || {},
          sound: notification.sound || 'default',
          categoryIdentifier: notification.categoryId,
        },
        trigger: null, // Send immediately
      });

      return identifier;
    } catch (error) {
      console.error('Error sending local notification:', error);
      return null;
    }
  }

  // Schedule local notification
  static async scheduleNotification(
    notification: NotificationData,
    trigger: Date | number | { hour: number; minute: number; repeats?: boolean }
  ): Promise<string | null> {
    try {
      let notificationTrigger: any = null;

      if (trigger instanceof Date) {
        notificationTrigger = trigger;
      } else if (typeof trigger === 'number') {
        notificationTrigger = { seconds: trigger };
      } else {
        notificationTrigger = {
          hour: trigger.hour,
          minute: trigger.minute,
          repeats: trigger.repeats || false,
        };
      }

      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: notification.data || {},
          sound: notification.sound || 'default',
          categoryIdentifier: notification.categoryId,
        },
        trigger: notificationTrigger,
      });

      return identifier;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      return null;
    }
  }

  // Cancel specific notification
  static async cancelNotification(identifier: string): Promise<boolean> {
    try {
      await Notifications.cancelScheduledNotificationAsync(identifier);
      return true;
    } catch (error) {
      console.error('Error canceling notification:', error);
      return false;
    }
  }

  // Cancel all notifications
  static async cancelAllNotifications(): Promise<boolean> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      return true;
    } catch (error) {
      console.error('Error canceling all notifications:', error);
      return false;
    }
  }

  // Get all scheduled notifications
  static async getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error getting scheduled notifications:', error);
      return [];
    }
  }

  // Handle notification responses (when user taps on notification)
  static addNotificationResponseListener(
    listener: (response: Notifications.NotificationResponse) => void
  ): Notifications.Subscription {
    return Notifications.addNotificationResponseReceivedListener(listener);
  }

  // Handle notifications received while app is running
  static addNotificationReceivedListener(
    listener: (notification: Notifications.Notification) => void
  ): Notifications.Subscription {
    return Notifications.addNotificationReceivedListener(listener);
  }

  // Booking-specific notifications
  static async sendBookingConfirmation(bookingId: string, serviceType: string, scheduledTime: Date): Promise<string | null> {
    return this.sendLocalNotification({
      title: 'Booking Confirmed! 🎉',
      body: `Your ${serviceType} service has been confirmed for ${scheduledTime.toLocaleDateString()}`,
      data: { type: 'booking_confirmation', bookingId },
      categoryId: 'booking',
    });
  }

  static async sendProviderAssigned(bookingId: string, providerName: string, estimatedArrival: Date): Promise<string | null> {
    return this.sendLocalNotification({
      title: 'Service Provider Assigned 👨‍🔧',
      body: `${providerName} has been assigned to your booking. Estimated arrival: ${estimatedArrival.toLocaleTimeString()}`,
      data: { type: 'provider_assigned', bookingId, providerName },
    });
  }

  static async sendProviderEnRoute(bookingId: string, providerName: string, eta: number): Promise<string | null> {
    return this.sendLocalNotification({
      title: 'Provider On The Way! 🚗',
      body: `${providerName} is on the way to your location. ETA: ${eta} minutes`,
      data: { type: 'provider_enroute', bookingId, eta },
    });
  }

  static async sendProviderArrived(bookingId: string, providerName: string): Promise<string | null> {
    return this.sendLocalNotification({
      title: 'Provider Arrived! 📍',
      body: `${providerName} has arrived at your location`,
      data: { type: 'provider_arrived', bookingId },
    });
  }

  static async sendServiceCompleted(bookingId: string, serviceType: string): Promise<string | null> {
    return this.sendLocalNotification({
      title: 'Service Completed! ✅',
      body: `Your ${serviceType} service has been completed. Please rate your experience.`,
      data: { type: 'service_completed', bookingId },
    });
  }

  // Reminder notifications
  static async scheduleServiceReminder(bookingId: string, serviceType: string, scheduledTime: Date): Promise<string | null> {
    const reminderTime = new Date(scheduledTime.getTime() - 60 * 60 * 1000); // 1 hour before
    
    if (reminderTime <= new Date()) {
      return null; // Don't schedule past reminders
    }

    return this.scheduleNotification(
      {
        title: 'Upcoming Service Reminder 🔔',
        body: `Your ${serviceType} service is scheduled in 1 hour`,
        data: { type: 'service_reminder', bookingId },
        categoryId: 'reminder',
      },
      reminderTime
    );
  }

  // Promotional notifications
  static async sendPromotionalNotification(title: string, body: string, promoCode?: string): Promise<string | null> {
    // For now, we'll assume promotional notifications are enabled
    // In a real app, you would check user preferences from storage
    
    return this.sendLocalNotification({
      title,
      body,
      data: { type: 'promotion', promoCode },
    });
  }

  // Badge management
  static async setBadgeCount(count: number): Promise<void> {
    try {
      await Notifications.setBadgeCountAsync(count);
    } catch (error) {
      console.error('Error setting badge count:', error);
    }
  }

  static async getBadgeCount(): Promise<number> {
    try {
      return await Notifications.getBadgeCountAsync();
    } catch (error) {
      console.error('Error getting badge count:', error);
      return 0;
    }
  }

  static async clearBadge(): Promise<void> {
    await this.setBadgeCount(0);
  }

  // Utility methods
  static async checkPermissionStatus(): Promise<'granted' | 'denied' | 'undetermined'> {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      return status;
    } catch (error) {
      console.error('Error checking notification permissions:', error);
      return 'denied';
    }
  }

  static async openNotificationSettings(): Promise<void> {
    try {
      // Note: openSettingsAsync is not available in expo-notifications
      // You would need to use Linking.openSettings() instead
      await Linking.openSettings();
    } catch (error) {
      console.error('Error opening notification settings:', error);
    }
  }
}

export default NotificationService;
