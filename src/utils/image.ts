                                                                import * as ImagePicker from 'expo-image-picker';
// import * as ImageManipulator from 'expo-image-manipulator'; // Optional - install if needed
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

export interface ImageOptions {
  quality?: number; // 0-1
  maxWidth?: number;
  maxHeight?: number;
  allowsEditing?: boolean;
  aspect?: [number, number];
}

export interface ProcessedImage {
  uri: string;
  width: number;
  height: number;
  size: number;
  base64?: string;
  type: 'image';
  fileName: string;
}

export class ImageService {
  // Default image options
  private static readonly DEFAULT_OPTIONS: ImageOptions = {
    quality: 0.8,
    maxWidth: 1024,
    maxHeight: 1024,
    allowsEditing: true,
    aspect: [1, 1],
  };

  // Request camera permissions
  static async requestCameraPermissions(): Promise<boolean> {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting camera permissions:', error);
      return false;
    }
  }

  // Request media library permissions
  static async requestMediaLibraryPermissions(): Promise<boolean> {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting media library permissions:', error);
      return false;
    }
  }

  // Take photo from camera
  static async takePhoto(options: ImageOptions = {}): Promise<ProcessedImage | null> {
    try {
      const hasPermission = await this.requestCameraPermissions();
      if (!hasPermission) {
        throw new Error('Camera permission not granted');
      }

      const mergedOptions = { ...this.DEFAULT_OPTIONS, ...options };

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: mergedOptions.allowsEditing,
        aspect: mergedOptions.aspect,
        quality: mergedOptions.quality,
        base64: false,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return null;
      }

      return this.processImage(result.assets[0], mergedOptions);
    } catch (error) {
      console.error('Error taking photo:', error);
      return null;
    }
  }

  // Pick image from gallery
  static async pickImage(options: ImageOptions = {}): Promise<ProcessedImage | null> {
    try {
      const hasPermission = await this.requestMediaLibraryPermissions();
      if (!hasPermission) {
        throw new Error('Media library permission not granted');
      }

      const mergedOptions = { ...this.DEFAULT_OPTIONS, ...options };

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: mergedOptions.allowsEditing,
        aspect: mergedOptions.aspect,
        quality: mergedOptions.quality,
        base64: false,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return null;
      }

      return this.processImage(result.assets[0], mergedOptions);
    } catch (error) {
      console.error('Error picking image:', error);
      return null;
    }
  }

  // Pick multiple images
  static async pickMultipleImages(options: ImageOptions = {}, maxCount: number = 5): Promise<ProcessedImage[]> {
    try {
      const hasPermission = await this.requestMediaLibraryPermissions();
      if (!hasPermission) {
        throw new Error('Media library permission not granted');
      }

      const mergedOptions = { ...this.DEFAULT_OPTIONS, ...options };

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false, // Disable editing for multiple selection
        quality: mergedOptions.quality,
        allowsMultipleSelection: true,
        selectionLimit: maxCount,
        base64: false,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return [];
      }

      const processedImages = await Promise.all(
        result.assets.map(asset => this.processImage(asset, mergedOptions))
      );

      return processedImages.filter(image => image !== null) as ProcessedImage[];
    } catch (error) {
      console.error('Error picking multiple images:', error);
      return [];
    }
  }

  // Process and resize image
  static async processImage(asset: ImagePicker.ImagePickerAsset, options: ImageOptions): Promise<ProcessedImage | null> {
    try {
      // For now, return the image as-is without manipulation
      // To enable image manipulation, install expo-image-manipulator and uncomment the manipulation code
      
      const imageInfo = await FileSystem.getInfoAsync(asset.uri);
      const size = imageInfo.exists ? (imageInfo as any).size || 0 : 0;
      
      const fileName = this.generateFileName(asset.fileName || 'image.jpg');

      return {
        uri: asset.uri,
        width: asset.width,
        height: asset.height,
        size,
        type: 'image',
        fileName,
      };
    } catch (error) {
      console.error('Error processing image:', error);
      return null;
    }
  }

  // Convert image to base64
  static async imageToBase64(uri: string): Promise<string | null> {
    try {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return base64;
    } catch (error) {
      console.error('Error converting image to base64:', error);
      return null;
    }
  }

  // Create thumbnail
  static async createThumbnail(uri: string, size: number = 150): Promise<ProcessedImage | null> {
    try {
      // For now, return the image as-is without thumbnail creation
      // To enable thumbnail creation, install expo-image-manipulator
      
      const info = await FileSystem.getInfoAsync(uri);
      const fileSize = info.exists ? (info as any).size || 0 : 0;

      return {
        uri,
        width: size,
        height: size,
        size: fileSize,
        type: 'image',
        fileName: `thumbnail_${this.generateFileName('image.jpg')}`,
      };
    } catch (error) {
      console.error('Error creating thumbnail:', error);
      return null;
    }
  }

  // Crop image to specific aspect ratio
  static async cropImage(uri: string, aspectRatio: [number, number]): Promise<ProcessedImage | null> {
    try {
      // For now, return the image as-is without cropping
      // To enable image cropping, install expo-image-manipulator
      
      const info = await FileSystem.getInfoAsync(uri);
      const size = info.exists ? (info as any).size || 0 : 0;

      return {
        uri,
        width: 300, // Default width
        height: 300, // Default height
        size,
        type: 'image',
        fileName: `cropped_${this.generateFileName('image.jpg')}`,
      };
    } catch (error) {
      console.error('Error cropping image:', error);
      return null;
    }
  }

  // Show image picker options (camera or gallery)
  static showImagePickerOptions(): Promise<'camera' | 'gallery' | null> {
    return new Promise((resolve) => {
      // In a real app, you would show an action sheet here
      // For now, we'll default to gallery
      resolve('gallery');
    });
  }

  // Delete image file
  static async deleteImage(uri: string): Promise<boolean> {
    try {
      await FileSystem.deleteAsync(uri);
      return true;
    } catch (error) {
      console.error('Error deleting image:', error);
      return false;
    }
  }

  // Generate unique filename
  private static generateFileName(originalName: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    const extension = originalName.split('.').pop() || 'jpg';
    return `image_${timestamp}_${random}.${extension}`;
  }

  // Get image dimensions
  static async getImageDimensions(uri: string): Promise<{ width: number; height: number } | null> {
    try {
      // For now, return default dimensions
      // To get actual dimensions, install expo-image-manipulator
      return { width: 300, height: 300 };
    } catch (error) {
      console.error('Error getting image dimensions:', error);
      return null;
    }
  }

  // Validate image file
  static validateImage(image: ProcessedImage, maxSizeMB: number = 5): { isValid: boolean; error?: string } {
    if (!image.uri) {
      return { isValid: false, error: 'Invalid image' };
    }

    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (image.size > maxSizeBytes) {
      return { isValid: false, error: `Image size must be less than ${maxSizeMB}MB` };
    }

    if (image.width < 100 || image.height < 100) {
      return { isValid: false, error: 'Image must be at least 100x100 pixels' };
    }

    return { isValid: true };
  }

  // Get image file info
  static async getImageInfo(uri: string): Promise<{
    exists: boolean;
    size: number;
    modificationTime: number;
  } | null> {
    try {
      const info = await FileSystem.getInfoAsync(uri);
      return {
        exists: info.exists,
        size: info.exists ? (info as any).size || 0 : 0,
        modificationTime: info.exists ? (info as any).modificationTime || 0 : 0,
      };
    } catch (error) {
      console.error('Error getting image info:', error);
      return null;
    }
  }
}

export default ImageService;
