import * as Location from 'expo-location';
import * as Camera from 'expo-camera';
// import * as MediaLibrary from 'expo-media-library'; // Optional - install if needed
// import * as Contacts from 'expo-contacts'; // Optional - install if needed
import * as Notifications from 'expo-notifications';
import { Alert, Linking, Platform } from 'react-native';

export type PermissionType = 
  | 'location'
  | 'camera' 
  | 'microphone'
  | 'mediaLibrary'
  | 'contacts'
  | 'notifications'
  | 'locationForeground'
  | 'locationBackground';

export type PermissionStatus = 'granted' | 'denied' | 'undetermined' | 'restricted';

export interface PermissionResult {
  status: PermissionStatus;
  canAskAgain: boolean;
  granted: boolean;
}

export class PermissionService {
  // Check if permission is granted
  static async checkPermission(permission: PermissionType): Promise<PermissionResult> {
    try {
      let result: any;
      
      switch (permission) {
        case 'location':
        case 'locationForeground':
          result = await Location.getForegroundPermissionsAsync();
          break;
          
        case 'locationBackground':
          result = await Location.getBackgroundPermissionsAsync();
          break;
          
        case 'camera':
          // For expo-camera v16+, we'll handle this differently
          result = { status: 'granted', canAskAgain: true }; // Simplified for now
          break;
          
        case 'mediaLibrary':
          // result = await MediaLibrary.getPermissionsAsync(); // Requires expo-media-library
          result = { status: 'granted', canAskAgain: true }; // Simplified for now
          break;
          
        case 'contacts':
          // result = await Contacts.getPermissionsAsync(); // Requires expo-contacts
          result = { status: 'granted', canAskAgain: true }; // Simplified for now
          break;
          
        case 'notifications':
          result = await Notifications.getPermissionsAsync();
          break;
          
        default:
          throw new Error(`Unknown permission type: ${permission}`);
      }

      return {
        status: result.status,
        canAskAgain: result.canAskAgain !== false,
        granted: result.status === 'granted',
      };
    } catch (error) {
      console.error(`Error checking ${permission} permission:`, error);
      return {
        status: 'denied',
        canAskAgain: false,
        granted: false,
      };
    }
  }

  // Request permission
  static async requestPermission(permission: PermissionType): Promise<PermissionResult> {
    try {
      let result: any;
      
      switch (permission) {
        case 'location':
        case 'locationForeground':
          result = await Location.requestForegroundPermissionsAsync();
          break;
          
        case 'locationBackground':
          result = await Location.requestBackgroundPermissionsAsync();
          break;
          
        case 'camera':
          // For expo-camera v16+, we'll handle this differently
          result = { status: 'granted', canAskAgain: true }; // Simplified for now
          break;
          
        case 'mediaLibrary':
          // result = await MediaLibrary.requestPermissionsAsync(); // Requires expo-media-library
          result = { status: 'granted', canAskAgain: true }; // Simplified for now
          break;
          
        case 'contacts':
          // result = await Contacts.requestPermissionsAsync(); // Requires expo-contacts
          result = { status: 'granted', canAskAgain: true }; // Simplified for now
          break;
          
        case 'notifications':
          result = await Notifications.requestPermissionsAsync();
          break;
          
        default:
          throw new Error(`Unknown permission type: ${permission}`);
      }

      return {
        status: result.status,
        canAskAgain: result.canAskAgain !== false,
        granted: result.status === 'granted',
      };
    } catch (error) {
      console.error(`Error requesting ${permission} permission:`, error);
      return {
        status: 'denied',
        canAskAgain: false,
        granted: false,
      };
    }
  }

  // Check and request permission with user-friendly flow
  static async requestPermissionWithDialog(
    permission: PermissionType,
    options: {
      title?: string;
      message?: string;
      onDenied?: () => void;
      onGranted?: () => void;
    } = {}
  ): Promise<boolean> {
    try {
      // First check current status
      const currentStatus = await this.checkPermission(permission);
      
      if (currentStatus.granted) {
        options.onGranted?.();
        return true;
      }

      // If permission was denied and can't ask again, show settings dialog
      if (currentStatus.status === 'denied' && !currentStatus.canAskAgain) {
        this.showPermissionSettingsDialog(permission, options);
        return false;
      }

      // Show rationale if needed
      if (currentStatus.status === 'undetermined') {
        const shouldShowRationale = await this.shouldShowPermissionRationale(permission);
        if (shouldShowRationale) {
          const userWantsToGrantPermission = await this.showPermissionRationale(permission, options);
          if (!userWantsToGrantPermission) {
            options.onDenied?.();
            return false;
          }
        }
      }

      // Request the permission
      const result = await this.requestPermission(permission);
      
      if (result.granted) {
        options.onGranted?.();
        return true;
      } else {
        // Show settings dialog if permission was denied and can't ask again
        if (!result.canAskAgain) {
          this.showPermissionSettingsDialog(permission, options);
        }
        options.onDenied?.();
        return false;
      }
    } catch (error) {
      console.error('Error in permission flow:', error);
      options.onDenied?.();
      return false;
    }
  }

  // Check multiple permissions at once
  static async checkMultiplePermissions(permissions: PermissionType[]): Promise<Record<PermissionType, PermissionResult>> {
    const results: Record<string, PermissionResult> = {};
    
    for (const permission of permissions) {
      results[permission] = await this.checkPermission(permission);
    }
    
    return results as Record<PermissionType, PermissionResult>;
  }

  // Request multiple permissions
  static async requestMultiplePermissions(permissions: PermissionType[]): Promise<Record<PermissionType, PermissionResult>> {
    const results: Record<string, PermissionResult> = {};
    
    for (const permission of permissions) {
      results[permission] = await this.requestPermission(permission);
    }
    
    return results as Record<PermissionType, PermissionResult>;
  }

  // Get permission description for user
  static getPermissionDescription(permission: PermissionType): {
    title: string;
    description: string;
    reason: string;
  } {
    const descriptions = {
      location: {
        title: 'Location Access',
        description: 'Access your location to find nearby service providers',
        reason: 'We use your location to show you service providers in your area and provide accurate service estimates.',
      },
      locationBackground: {
        title: 'Background Location',
        description: 'Track your service provider in real-time',
        reason: 'This allows us to provide real-time tracking of your service provider even when the app is in the background.',
      },
      camera: {
        title: 'Camera Access',
        description: 'Take photos for service requests and profile',
        reason: 'Camera access is needed to take photos for service documentation, profile pictures, and before/after photos.',
      },
      mediaLibrary: {
        title: 'Photo Library Access',
        description: 'Select photos from your gallery',
        reason: 'Access to your photo library allows you to select existing photos for your service requests and profile.',
      },
      contacts: {
        title: 'Contacts Access',
        description: 'Share app with friends and family',
        reason: 'Contacts access helps you easily invite friends and family to use GharSathi services.',
      },
      notifications: {
        title: 'Notifications',
        description: 'Receive updates about your bookings',
        reason: 'Push notifications keep you informed about booking confirmations, provider updates, and service reminders.',
      },
      microphone: {
        title: 'Microphone Access',
        description: 'Record audio for service requests',
        reason: 'Microphone access is needed for voice messages and audio recordings in service requests.',
      },
      locationForeground: {
        title: 'Location Access',
        description: 'Access your location to find nearby service providers',
        reason: 'We use your location to show you service providers in your area and provide accurate service estimates.',
      },
    } as const;

    return descriptions[permission] || {
      title: 'Permission Required',
      description: 'This feature requires permission to work properly',
      reason: 'This permission is needed for the app to function correctly.',
    };
  }

  // Show permission rationale dialog
  private static async showPermissionRationale(
    permission: PermissionType,
    options: { title?: string; message?: string } = {}
  ): Promise<boolean> {
    return new Promise((resolve) => {
      const permissionInfo = this.getPermissionDescription(permission);
      
      Alert.alert(
        options.title || permissionInfo.title,
        options.message || permissionInfo.reason,
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => resolve(false),
          },
          {
            text: 'Grant Permission',
            onPress: () => resolve(true),
          },
        ]
      );
    });
  }

  // Show settings dialog when permission is permanently denied
  private static showPermissionSettingsDialog(
    permission: PermissionType,
    options: { title?: string; message?: string } = {}
  ): void {
    const permissionInfo = this.getPermissionDescription(permission);
    
    Alert.alert(
      'Permission Required',
      `${permissionInfo.reason} Please go to Settings to enable ${permissionInfo.title.toLowerCase()}.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Open Settings',
          onPress: () => this.openAppSettings(),
        },
      ]
    );
  }

  // Check if we should show permission rationale
  private static async shouldShowPermissionRationale(permission: PermissionType): Promise<boolean> {
    // For expo managed workflow, we don't have access to shouldShowRequestPermissionRationale
    // So we'll always show rationale for better UX
    return true;
  }

  // Open app settings
  static async openAppSettings(): Promise<void> {
    try {
      await Linking.openSettings();
    } catch (error) {
      console.error('Error opening app settings:', error);
      Alert.alert(
        'Error',
        'Unable to open settings. Please manually go to Settings > Apps > GharSathi to manage permissions.'
      );
    }
  }

  // Get all app permissions status
  static async getAllPermissionsStatus(): Promise<Record<PermissionType, PermissionResult>> {
    const allPermissions: PermissionType[] = [
      'location',
      'camera',
      'mediaLibrary',
      'contacts',
      'notifications',
    ];

    return this.checkMultiplePermissions(allPermissions);
  }

  // Check if critical permissions are granted
  static async areCriticalPermissionsGranted(): Promise<boolean> {
    const criticalPermissions: PermissionType[] = ['location', 'notifications'];
    const results = await this.checkMultiplePermissions(criticalPermissions);
    
    return criticalPermissions.every(permission => results[permission].granted);
  }

  // Request critical permissions on app start
  static async requestCriticalPermissions(): Promise<boolean> {
    const criticalPermissions: PermissionType[] = ['location', 'notifications'];
    const results = await this.requestMultiplePermissions(criticalPermissions);
    
    return criticalPermissions.every(permission => results[permission].granted);
  }

  // Location-specific methods
  static async getCurrentLocation(): Promise<Location.LocationObject | null> {
    try {
      const hasPermission = await this.requestPermissionWithDialog('location', {
        title: 'Location Required',
        message: 'We need access to your location to find nearby service providers.',
      });

      if (!hasPermission) {
        return null;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      return location;
    } catch (error) {
      console.error('Error getting current location:', error);
      return null;
    }
  }

  // Camera-specific methods
  static async requestCameraWithDialog(): Promise<boolean> {
    return this.requestPermissionWithDialog('camera', {
      title: 'Camera Permission',
      message: 'Camera access is needed to take photos for your service requests.',
    });
  }

  // Media library-specific methods
  static async requestMediaLibraryWithDialog(): Promise<boolean> {
    return this.requestPermissionWithDialog('mediaLibrary', {
      title: 'Photo Library Permission',
      message: 'Photo library access is needed to select images for your service requests.',
    });
  }

  // Notification-specific methods
  static async requestNotificationWithDialog(): Promise<boolean> {
    return this.requestPermissionWithDialog('notifications', {
      title: 'Notification Permission',
      message: 'Notifications keep you updated about your bookings and service provider status.',
    });
  }
}

export default PermissionService;
