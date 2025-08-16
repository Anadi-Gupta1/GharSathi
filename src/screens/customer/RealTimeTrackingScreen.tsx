import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { COLORS, FONTS, FONT_SIZES } from '../../constants/theme';
import Card from '../../components/Card';
import Button from '../../components/Button';
import LoadingOverlay from '../../components/LoadingOverlay';

interface TrackingData {
  providerLocation: {
    latitude: number;
    longitude: number;
  };
  customerLocation: {
    latitude: number;
    longitude: number;
  };
  estimatedArrival: string;
  status: 'on_way' | 'arrived' | 'in_progress' | 'completed';
  distance: string;
  provider: {
    name: string;
    phone: string;
    photo: string;
    vehicle: string;
  };
  route: {
    latitude: number;
    longitude: number;
  }[];
}

const RealTimeTrackingScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { bookingId } = route.params as { bookingId: string };
  
  const [loading, setLoading] = useState(true);
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [mapReady, setMapReady] = useState(false);

  // Mock tracking data - In real app, this would come from WebSocket/API
  const mockTrackingData: TrackingData = {
    providerLocation: {
      latitude: 19.0760,
      longitude: 72.8777,
    },
    customerLocation: {
      latitude: 19.0896,
      longitude: 72.8656,
    },
    estimatedArrival: '15 minutes',
    status: 'on_way',
    distance: '2.3 km',
    provider: {
      name: 'Rajesh Kumar',
      phone: '+91 9876543210',
      photo: 'https://example.com/photo.jpg',
      vehicle: 'Bike - MH 01 AB 1234',
    },
    route: [
      { latitude: 19.0760, longitude: 72.8777 },
      { latitude: 19.0780, longitude: 72.8750 },
      { latitude: 19.0820, longitude: 72.8720 },
      { latitude: 19.0850, longitude: 72.8690 },
      { latitude: 19.0896, longitude: 72.8656 },
    ],
  };

  useEffect(() => {
    initializeTracking();
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      updateProviderLocation();
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const initializeTracking = async () => {
    try {
      // Get user location permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required for tracking');
        return;
      }

      // Get current location
      const location = await Location.getCurrentPositionAsync({});
      setUserLocation(location);
      
      // Set mock tracking data
      setTrackingData(mockTrackingData);
      setLoading(false);
    } catch (error) {
      console.error('Error initializing tracking:', error);
      setLoading(false);
      Alert.alert('Error', 'Failed to initialize tracking');
    }
  };

  const updateProviderLocation = () => {
    if (!trackingData) return;

    // Simulate provider movement
    const newLat = trackingData.providerLocation.latitude + (Math.random() - 0.5) * 0.001;
    const newLng = trackingData.providerLocation.longitude + (Math.random() - 0.5) * 0.001;

    setTrackingData(prev => prev ? {
      ...prev,
      providerLocation: {
        latitude: newLat,
        longitude: newLng,
      },
      // Update ETA based on distance (simplified)
      estimatedArrival: Math.floor(Math.random() * 20 + 5) + ' minutes',
    } : null);
  };

  const callProvider = () => {
    if (trackingData?.provider.phone) {
      Linking.openURL(`tel:${trackingData.provider.phone}`);
    }
  };

  const sendMessage = () => {
    if (trackingData?.provider.phone) {
      const message = "Hi, I'm tracking your location. Please let me know if there are any delays.";
      const url = Platform.OS === 'ios' 
        ? `sms:${trackingData.provider.phone}&body=${message}`
        : `sms:${trackingData.provider.phone}?body=${message}`;
      Linking.openURL(url);
    }
  };

  const shareLocation = async () => {
    if (!userLocation) return;

    const locationUrl = `https://maps.google.com/?q=${userLocation.coords.latitude},${userLocation.coords.longitude}`;
    
    Alert.alert(
      'Share Location',
      'Share your location with the provider?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Share',
          onPress: () => {
            // In real app, send location to provider via API
            Alert.alert('Success', 'Location shared with provider');
          }
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on_way':
        return '#FF9800';
      case 'arrived':
        return '#4CAF50';
      case 'in_progress':
        return COLORS.primary;
      case 'completed':
        return '#4CAF50';
      default:
        return COLORS.textSecondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'on_way':
        return 'Provider is on the way';
      case 'arrived':
        return 'Provider has arrived';
      case 'in_progress':
        return 'Service in progress';
      case 'completed':
        return 'Service completed';
      default:
        return 'Unknown status';
    }
  };

  if (loading) {
    return <LoadingOverlay visible={true} />;
  }

  if (!trackingData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="location-outline" size={48} color={COLORS.textSecondary} />
          <Text style={styles.errorTitle}>Tracking Unavailable</Text>
          <Text style={styles.errorMessage}>
            Real-time tracking is not available for this booking.
          </Text>
          <Button
            title="Go Back"
            variant="primary"
            onPress={() => navigation.goBack()}
            style={styles.errorButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Live Tracking</Text>
        <TouchableOpacity onPress={shareLocation}>
          <Ionicons name="share-outline" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      {/* Map */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          onMapReady={() => setMapReady(true)}
          initialRegion={{
            latitude: (trackingData.providerLocation.latitude + trackingData.customerLocation.latitude) / 2,
            longitude: (trackingData.providerLocation.longitude + trackingData.customerLocation.longitude) / 2,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          showsUserLocation={true}
          showsMyLocationButton={true}
        >
          {/* Provider Location */}
          <Marker
            coordinate={trackingData.providerLocation}
            title="Service Provider"
            description={trackingData.provider.name}
          >
            <View style={styles.providerMarker}>
              <Ionicons name="person" size={20} color="#fff" />
            </View>
          </Marker>

          {/* Customer Location */}
          <Marker
            coordinate={trackingData.customerLocation}
            title="Your Location"
            description="Service destination"
          >
            <View style={styles.customerMarker}>
              <Ionicons name="home" size={20} color="#fff" />
            </View>
          </Marker>

          {/* Route */}
          <Polyline
            coordinates={trackingData.route}
            strokeColor={COLORS.primary}
            strokeWidth={3}
            lineDashPattern={[5, 5]}
          />
        </MapView>

        {/* Status Overlay */}
        <View style={styles.statusOverlay}>
          <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(trackingData.status) }]}>
            <Text style={styles.statusText}>{getStatusText(trackingData.status)}</Text>
          </View>
        </View>
      </View>

      {/* Bottom Panel */}
      <View style={styles.bottomPanel}>
        {/* Provider Info */}
        <Card style={styles.providerCard}>
          <View style={styles.providerInfo}>
            <View style={styles.providerAvatar}>
              <Ionicons name="person" size={24} color={COLORS.primary} />
            </View>
            <View style={styles.providerDetails}>
              <Text style={styles.providerName}>{trackingData.provider.name}</Text>
              <Text style={styles.providerVehicle}>{trackingData.provider.vehicle}</Text>
              <View style={styles.etaContainer}>
                <Ionicons name="time-outline" size={16} color={COLORS.primary} />
                <Text style={styles.etaText}>ETA: {trackingData.estimatedArrival}</Text>
              </View>
            </View>
            <View style={styles.providerActions}>
              <TouchableOpacity style={styles.actionButton} onPress={callProvider}>
                <Ionicons name="call" size={20} color={COLORS.primary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={sendMessage}>
                <Ionicons name="chatbubble-outline" size={20} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </Card>

        {/* Distance Info */}
        <Card style={styles.distanceCard}>
          <View style={styles.distanceInfo}>
            <View style={styles.distanceItem}>
              <Ionicons name="location-outline" size={20} color={COLORS.primary} />
              <Text style={styles.distanceLabel}>Distance</Text>
              <Text style={styles.distanceValue}>{trackingData.distance}</Text>
            </View>
            <View style={styles.distanceItem}>
              <Ionicons name="time-outline" size={20} color={COLORS.primary} />
              <Text style={styles.distanceLabel}>ETA</Text>
              <Text style={styles.distanceValue}>{trackingData.estimatedArrival}</Text>
            </View>
          </View>
        </Card>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button
            title="Call Provider"
            variant="primary"
            onPress={callProvider}
            style={styles.callButton}
          />
          <Button
            title="Send Message"
            variant="outline"
            onPress={sendMessage}
            style={styles.messageButton}
          />
        </View>

        {/* Emergency Contact */}
        <TouchableOpacity 
          style={styles.emergencyButton}
          onPress={() => Linking.openURL('tel:911')}
        >
          <Ionicons name="warning" size={16} color="#FF6B6B" />
          <Text style={styles.emergencyText}>Emergency Contact</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  statusOverlay: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
  },
  statusIndicator: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
  },
  providerMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  customerMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  bottomPanel: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '50%',
  },
  providerCard: {
    padding: 16,
    marginBottom: 12,
  },
  providerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  providerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  providerDetails: {
    flex: 1,
  },
  providerName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  providerVehicle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  etaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  etaText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.primary,
    marginLeft: 4,
  },
  providerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  distanceCard: {
    padding: 16,
    marginBottom: 16,
  },
  distanceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  distanceItem: {
    alignItems: 'center',
    flex: 1,
  },
  distanceLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
    marginBottom: 2,
  },
  distanceValue: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  callButton: {
    flex: 1,
  },
  messageButton: {
    flex: 1,
  },
  emergencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: '#FFF5F5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFE5E5',
  },
  emergencyText: {
    fontSize: 14,
    color: '#FF6B6B',
    fontWeight: '500',
    marginLeft: 6,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  errorButton: {
    minWidth: 120,
  },
});

export default RealTimeTrackingScreen;
