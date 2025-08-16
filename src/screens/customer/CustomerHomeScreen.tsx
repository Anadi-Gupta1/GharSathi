import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  RefreshControl,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { RootState, AppDispatch } from '../../store';
import { COLORS, FONTS, FONT_SIZES } from '../../constants/theme';
import { LocationService, PermissionService, StorageService } from '../../utils';
import { setUserLocation } from '../../store/slices/locationSlice';
import { fetchServices } from '../../store/slices/serviceSlice';

const { width } = Dimensions.get('window');

interface ServiceItem {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface QuickAction {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
}

interface Promotion {
  id: string;
  title: string;
  subtitle: string;
  code: string;
  color: string;
}

const SERVICES_DATA: ServiceItem[] = [
  { id: '1', name: 'Cleaning', icon: '🧽', color: COLORS.primary },
  { id: '2', name: 'Plumbing', icon: '🔧', color: '#2196F3' },
  { id: '3', name: 'Electrical', icon: '⚡', color: '#FF9800' },
  { id: '4', name: 'Appliance', icon: '📱', color: '#9C27B0' },
  { id: '5', name: 'Painting', icon: '🎨', color: '#E91E63' },
  { id: '6', name: 'Carpentry', icon: '🔨', color: '#795548' },
  { id: '7', name: 'Beauty', icon: '💅', color: '#F44336' },
  { id: '8', name: 'More', icon: '➕', color: '#607D8B' },
];

const QUICK_ACTIONS: QuickAction[] = [
  { id: '1', title: 'Book Again', subtitle: 'Repeat your last service', icon: 'repeat-outline' },
  { id: '2', title: 'Emergency', subtitle: 'Urgent service needed', icon: 'flash-outline' },
  { id: '3', title: 'Schedule', subtitle: 'Book for later', icon: 'calendar-outline' },
];

const PROMOTIONS: Promotion[] = [
  {
    id: '1',
    title: '50% OFF',
    subtitle: 'First Cleaning Service',
    code: 'FIRST50',
    color: '#4CAF50',
  },
  {
    id: '2',
    title: 'Free Service',
    subtitle: 'On orders above ₹999',
    code: 'FREE999',
    color: '#2196F3',
  },
];

const CustomerHomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { currentLocation, loading: locationLoading } = useSelector((state: RootState) => state.location);
  const { services, loading: servicesLoading } = useSelector((state: RootState) => state.service);

  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    initializeHome();
    setGreetingMessage();
  }, []);

  const initializeHome = async () => {
    await getCurrentLocation();
    await loadSearchHistory();
    if (currentLocation) {
      dispatch(fetchServices());
    }
  };

  const getCurrentLocation = async () => {
    try {
      const location = await PermissionService.getCurrentLocation();
      if (location) {
        dispatch(setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          address: 'Loading address...',
        }));

        const address = await LocationService.getAddressFromCoordinates(
          location.coords.latitude,
          location.coords.longitude
        );
        if (address) {
          dispatch(setUserLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            address: address,
          }));
        }
      }
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const loadSearchHistory = async () => {
    try {
      const history = await StorageService.getSearchHistory();
    } catch (error) {
      console.error('Error loading search history:', error);
    }
  };

  const setGreetingMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Good Morning');
    } else if (hour < 17) {
      setGreeting('Good Afternoon');
    } else {
      setGreeting('Good Evening');
    }
  };

  const handleSearch = async (query: string) => {
    if (query.trim().length > 0) {
      await StorageService.addToSearchHistory(query.trim());
      navigation.navigate('SearchResults', { query: query.trim() });
    }
  };

  const handleServiceSelect = (service: ServiceItem) => {
    if (service.id === '8') {
      // More services - navigate to all categories
      navigation.navigate('CategoryList');
    } else {
      // Navigate to specific service category
      navigation.navigate('ServiceList', { 
        categoryId: service.id, 
        categoryName: service.name 
      });
    }
  };

  const handleQuickAction = (action: QuickAction) => {
    switch (action.id) {
      case '1':
        navigation.navigate('BookingHistory');
        break;
      case '2':
        navigation.navigate('EmergencyBooking');
        break;
      case '3':
        navigation.navigate('ScheduleBooking');
        break;
      default:
        break;
    }
  };

  const handleLocationPress = () => {
    navigation.navigate('LocationSelector');
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await initializeHome();
    setRefreshing(false);
  };

  const renderServiceItem = ({ item }: { item: ServiceItem }) => (
    <TouchableOpacity
      style={styles.serviceItem}
      onPress={() => handleServiceSelect(item)}
      activeOpacity={0.7}
    >
      <View style={[styles.serviceIcon, { backgroundColor: item.color + '20' }]}>
        <Text style={styles.serviceEmoji}>{item.icon}</Text>
      </View>
      <Text style={styles.serviceName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderQuickAction = ({ item }: { item: QuickAction }) => (
    <TouchableOpacity
      style={styles.quickActionItem}
      onPress={() => handleQuickAction(item)}
      activeOpacity={0.7}
    >
      <View style={styles.quickActionIcon}>
        <Ionicons name={item.icon as any} size={24} color={COLORS.primary} />
      </View>
      <View style={styles.quickActionText}>
        <Text style={styles.quickActionTitle}>{item.title}</Text>
        <Text style={styles.quickActionSubtitle}>{item.subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward-outline" size={20} color="#999" />
    </TouchableOpacity>
  );

  const renderPromotion = ({ item }: { item: Promotion }) => (
    <TouchableOpacity style={styles.promotionCard} activeOpacity={0.8}>
      <View style={[styles.promotionContent, { backgroundColor: item.color }]}>
        <View style={styles.promotionText}>
          <Text style={styles.promotionTitle}>{item.title}</Text>
          <Text style={styles.promotionSubtitle}>{item.subtitle}</Text>
          <Text style={styles.promotionCode}>Code: {item.code}</Text>
        </View>
        <View style={styles.promotionImage}>
          <Text style={styles.promotionEmoji}>🎁</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.greetingSection}>
            <Text style={styles.greeting}>{greeting} 👋</Text>
            <Text style={styles.userName}>{user?.fullName || 'User'}</Text>
          </View>
          
          <TouchableOpacity style={styles.profileButton}>
            <Image
              source={{
                uri: user?.profilePicture || 'https://via.placeholder.com/40x40/2196F3/white?text=U',
              }}
              style={styles.profileImage}
            />
          </TouchableOpacity>
        </View>

        {/* Location */}
        <TouchableOpacity style={styles.locationSection} onPress={handleLocationPress}>
          <Ionicons name="location-outline" size={20} color={COLORS.primary} />
          <View style={styles.locationText}>
            <Text style={styles.locationLabel}>Service Location</Text>
            <Text style={styles.locationAddress} numberOfLines={1}>
              {currentLocation?.address || 'Select your location'}
            </Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={20} color="#999" />
        </TouchableOpacity>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search-outline" size={20} color="#999" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for services..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={() => handleSearch(searchQuery)}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle-outline" size={20} color="#999" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <FlatList
            data={QUICK_ACTIONS}
            renderItem={renderQuickAction}
            keyExtractor={(item: QuickAction) => item.id}
            scrollEnabled={false}
          />
        </View>

        {/* Services Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Services</Text>
          <FlatList
            data={SERVICES_DATA}
            renderItem={renderServiceItem}
            keyExtractor={(item: ServiceItem) => item.id}
            numColumns={4}
            scrollEnabled={false}
            columnWrapperStyle={styles.serviceRow}
          />
        </View>

        {/* Promotions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Special Offers</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={PROMOTIONS}
            renderItem={renderPromotion}
            keyExtractor={(item: Promotion) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.promotionsList}
          />
        </View>

        {/* Recent Bookings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Bookings</Text>
            <TouchableOpacity onPress={() => navigation.navigate('BookingHistory')}>
              <Text style={styles.seeAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.emptyState}>
            <Ionicons name="clipboard-outline" size={48} color="#ccc" />
            <Text style={styles.emptyStateText}>No recent bookings</Text>
            <TouchableOpacity style={styles.bookNowButton} onPress={() => navigation.navigate('CategoryList')}>
              <Text style={styles.bookNowText}>Book Your First Service</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.surface,
  },
  greetingSection: {
    flex: 1,
  },
  greeting: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  userName: {
    fontSize: FONT_SIZES.lg,
    fontFamily: FONTS.bold,
    color: COLORS.text,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  locationSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  locationText: {
    flex: 1,
    marginLeft: 12,
  },
  locationLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  locationAddress: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    fontFamily: FONTS.medium,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.surface,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    fontFamily: FONTS.regular,
  },
  section: {
    backgroundColor: COLORS.surface,
    marginTop: 12,
    paddingVertical: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontFamily: FONTS.bold,
    color: COLORS.text,
  },
  seeAllText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.primary,
    fontFamily: FONTS.medium,
  },
  serviceRow: {
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  serviceItem: {
    alignItems: 'center',
    width: (width - 60) / 4,
  },
  serviceIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  serviceEmoji: {
    fontSize: 28,
  },
  serviceName: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
    textAlign: 'center',
    fontFamily: FONTS.regular,
  },
  quickActionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  quickActionText: {
    flex: 1,
  },
  quickActionTitle: {
    fontSize: FONT_SIZES.md,
    fontFamily: FONTS.medium,
    color: COLORS.text,
    marginBottom: 2,
  },
  quickActionSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    fontFamily: FONTS.regular,
  },
  promotionsList: {
    paddingHorizontal: 16,
  },
  promotionCard: {
    marginHorizontal: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  promotionContent: {
    flexDirection: 'row',
    width: 280,
    height: 120,
    borderRadius: 12,
  },
  promotionText: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  promotionTitle: {
    fontSize: FONT_SIZES.lg,
    fontFamily: FONTS.bold,
    color: '#fff',
    marginBottom: 4,
  },
  promotionSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: '#fff',
    marginBottom: 8,
    fontFamily: FONTS.regular,
  },
  promotionCode: {
    fontSize: FONT_SIZES.xs,
    color: '#fff',
    fontFamily: FONTS.medium,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  promotionImage: {
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  promotionEmoji: {
    fontSize: 32,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyStateText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginTop: 12,
    marginBottom: 16,
    fontFamily: FONTS.regular,
  },
  bookNowButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  bookNowText: {
    color: '#fff',
    fontSize: FONT_SIZES.sm,
    fontFamily: FONTS.medium,
  },
});

export default CustomerHomeScreen;
