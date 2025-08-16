import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { theme } from '../../theme/theme';
import Button from '../../components/Button';
import LoadingOverlay from '../../components/LoadingOverlay';
import Card from '../../components/Card';
import { CustomerStackParamList } from '../../types';

type ServiceDetailNavigationProp = StackNavigationProp<CustomerStackParamList>;

const { width } = Dimensions.get('window');

interface ServiceDetail {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  rating: number;
  reviewCount: number;
  providerCount: number;
  images: string[];
  tags: string[];
  features: string[];
  requirements: string[];
  category: string;
  popular: boolean;
}

interface Review {
  id: string;
  userName: string;
  userImage: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
}

interface Provider {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviewCount: number;
  experience: string;
  distance: string;
  verified: boolean;
  price: number;
}

const ServiceDetailScreen: React.FC = () => {
  const navigation = useNavigation<ServiceDetailNavigationProp>();
  const route = useRoute<any>();
  const { serviceId } = route.params as { serviceId: string };

  const [service, setService] = useState<ServiceDetail | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'providers'>('overview');

  useEffect(() => {
    fetchServiceDetails();
  }, [serviceId]);

  const fetchServiceDetails = async () => {
    try {
      setLoading(true);
      
      // Mock data for demo - replace with API call
      const mockService: ServiceDetail = {
        id: serviceId,
        name: 'Deep Home Cleaning',
        description: 'Our comprehensive deep cleaning service covers every corner of your home. We use eco-friendly products and professional equipment to ensure your home is spotless and sanitized. Perfect for move-ins, seasonal cleaning, or when you want that extra sparkle.',
        price: 2500,
        duration: '3-4 hours',
        rating: 4.8,
        reviewCount: 245,
        providerCount: 12,
        images: [
          'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400',
          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
          'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
          'https://images.unsplash.com/photo-1584622781564-1d987add7afa?w=400',
        ],
        tags: ['Popular', 'Eco-friendly', 'Same Day', 'Sanitized'],
        features: [
          'Deep cleaning of all rooms',
          'Kitchen appliance cleaning',
          'Bathroom sanitization',
          'Floor mopping and vacuuming',
          'Dusting of all surfaces',
          'Window cleaning (interior)',
          'Trash removal',
          'Eco-friendly products used',
        ],
        requirements: [
          'Access to water and electricity',
          'Clear pathways for cleaning',
          'Secure valuable items',
          'Pets should be secured',
        ],
        category: 'Home Cleaning',
        popular: true,
      };

      const mockReviews: Review[] = [
        {
          id: '1',
          userName: 'Priya Sharma',
          userImage: 'https://images.unsplash.com/photo-1494790108755-2616b69a6e5c?w=100',
          rating: 5,
          comment: 'Excellent service! The team was professional and did a thorough job. My house has never been cleaner.',
          date: '2 days ago',
          helpful: 12,
        },
        {
          id: '2',
          userName: 'Rajesh Kumar',
          userImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
          rating: 4,
          comment: 'Good service overall. They arrived on time and completed the work efficiently. Will book again.',
          date: '1 week ago',
          helpful: 8,
        },
        {
          id: '3',
          userName: 'Anita Patel',
          userImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
          rating: 5,
          comment: 'Outstanding attention to detail. They cleaned places I didn\'t even think needed cleaning!',
          date: '2 weeks ago',
          helpful: 15,
        },
      ];

      const mockProviders: Provider[] = [
        {
          id: '1',
          name: 'CleanPro Services',
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
          rating: 4.9,
          reviewCount: 156,
          experience: '5 years',
          distance: '2.5 km',
          verified: true,
          price: 2400,
        },
        {
          id: '2',
          name: 'Sparkle Clean',
          image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
          rating: 4.7,
          reviewCount: 89,
          experience: '3 years',
          distance: '4.1 km',
          verified: true,
          price: 2500,
        },
        {
          id: '3',
          name: 'HomeShine',
          image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
          rating: 4.6,
          reviewCount: 67,
          experience: '2 years',
          distance: '3.8 km',
          verified: false,
          price: 2300,
        },
      ];

      setService(mockService);
      setReviews(mockReviews);
      setProviders(mockProviders);
    } catch (error) {
      console.error('Error fetching service details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    if (!service?.id) return;
    navigation.navigate('BookingFlow', { serviceId: service.id });
  };

  const handleProviderSelect = (provider: Provider) => {
    navigation.navigate('ProviderDetail', { providerId: provider.id });
  };

  const renderImage = ({ item, index }: { item: string; index: number }) => (
    <Image source={{ uri: item }} style={styles.serviceImage} />
  );

  const renderFeature = ({ item }: { item: string }) => (
    <View style={styles.featureItem}>
      <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
      <Text style={styles.featureText}>{item}</Text>
    </View>
  );

  const renderRequirement = ({ item }: { item: string }) => (
    <View style={styles.requirementItem}>
      <Ionicons name="information-circle" size={20} color={theme.colors.primary} />
      <Text style={styles.requirementText}>{item}</Text>
    </View>
  );

  const renderReview = ({ item }: { item: Review }) => (
    <Card style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <Image source={{ uri: item.userImage }} style={styles.reviewerImage} />
        <View style={styles.reviewerInfo}>
          <Text style={styles.reviewerName}>{item.userName}</Text>
          <View style={styles.reviewRating}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Ionicons
                key={star}
                name={star <= item.rating ? 'star' : 'star-outline'}
                size={16}
                color="#FFD700"
              />
            ))}
            <Text style={styles.reviewDate}>{item.date}</Text>
          </View>
        </View>
      </View>
      <Text style={styles.reviewComment}>{item.comment}</Text>
      <View style={styles.reviewFooter}>
        <TouchableOpacity style={styles.helpfulButton}>
          <Ionicons name="thumbs-up-outline" size={16} color={theme.colors.textSecondary} />
          <Text style={styles.helpfulText}>Helpful ({item.helpful})</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );

  const renderProvider = ({ item }: { item: Provider }) => (
    <TouchableOpacity
      style={styles.providerCard}
      onPress={() => handleProviderSelect(item)}
    >
      <Image source={{ uri: item.image }} style={styles.providerImage} />
      <View style={styles.providerInfo}>
        <View style={styles.providerHeader}>
          <Text style={styles.providerName}>{item.name}</Text>
          {item.verified && (
            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
          )}
        </View>
        <View style={styles.providerStats}>
          <View style={styles.providerStat}>
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text style={styles.providerStatText}>{item.rating} ({item.reviewCount})</Text>
          </View>
          <View style={styles.providerStat}>
            <Ionicons name="time" size={14} color={theme.colors.textSecondary} />
            <Text style={styles.providerStatText}>{item.experience} exp</Text>
          </View>
          <View style={styles.providerStat}>
            <Ionicons name="location" size={14} color={theme.colors.textSecondary} />
            <Text style={styles.providerStatText}>{item.distance}</Text>
          </View>
        </View>
        <View style={styles.providerFooter}>
          <Text style={styles.providerPrice}>₹{item.price}</Text>
          <Button
            title="Select"
            variant="outline"
            size="small"
            onPress={() => handleProviderSelect(item)}
          />
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading || !service) {
    return <LoadingOverlay visible={true} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="heart-outline" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image Gallery */}
        <View style={styles.imageContainer}>
          <FlatList
            data={service.images}
            renderItem={renderImage}
            keyExtractor={(item: any, index: number) => index.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(event: any) => {
              const index = Math.round(event.nativeEvent.contentOffset.x / width);
              setCurrentImageIndex(index);
            }}
          />
          <View style={styles.imageIndicator}>
            <Text style={styles.imageCount}>
              {currentImageIndex + 1} / {service.images.length}
            </Text>
          </View>
        </View>

        {/* Service Info */}
        <View style={styles.serviceInfo}>
          <View style={styles.serviceHeader}>
            <Text style={styles.serviceName}>{service.name}</Text>
            {service.popular && (
              <View style={styles.popularBadge}>
                <Text style={styles.popularText}>Popular</Text>
              </View>
            )}
          </View>

          <Text style={styles.serviceCategory}>{service.category}</Text>

          <View style={styles.serviceStats}>
            <View style={styles.statItem}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.statText}>{service.rating}</Text>
              <Text style={styles.statSubtext}>({service.reviewCount} reviews)</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="time" size={16} color={theme.colors.textSecondary} />
              <Text style={styles.statText}>{service.duration}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="people" size={16} color={theme.colors.textSecondary} />
              <Text style={styles.statText}>{service.providerCount} providers</Text>
            </View>
          </View>

          <View style={styles.tagsContainer}>
            {service.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>

          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Starting from</Text>
            <Text style={styles.price}>₹{service.price}</Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
            onPress={() => setActiveTab('overview')}
          >
            <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>
              Overview
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'reviews' && styles.activeTab]}
            onPress={() => setActiveTab('reviews')}
          >
            <Text style={[styles.tabText, activeTab === 'reviews' && styles.activeTabText]}>
              Reviews ({service.reviewCount})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'providers' && styles.activeTab]}
            onPress={() => setActiveTab('providers')}
          >
            <Text style={[styles.tabText, activeTab === 'providers' && styles.activeTabText]}>
              Providers ({service.providerCount})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        <View style={styles.tabContent}>
          {activeTab === 'overview' && (
            <>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.description}>{service.description}</Text>

              <Text style={styles.sectionTitle}>What's Included</Text>
              <FlatList
                data={service.features}
                renderItem={renderFeature}
                keyExtractor={(item: any, index: number) => index.toString()}
                scrollEnabled={false}
              />

              <Text style={styles.sectionTitle}>Requirements</Text>
              <FlatList
                data={service.requirements}
                renderItem={renderRequirement}
                keyExtractor={(item: any, index: number) => index.toString()}
                scrollEnabled={false}
              />
            </>
          )}

          {activeTab === 'reviews' && (
            <FlatList
              data={reviews}
              renderItem={renderReview}
              keyExtractor={(item: any) => item.id}
              scrollEnabled={false}
            />
          )}

          {activeTab === 'providers' && (
            <FlatList
              data={providers}
              renderItem={renderProvider}
              keyExtractor={(item: any) => item.id}
              scrollEnabled={false}
            />
          )}
        </View>
      </ScrollView>

      {/* Book Now Button */}
      <View style={styles.bottomContainer}>
        <Button
          title="Book Now"
          variant="primary"
          onPress={handleBookNow}
          style={styles.bookButton}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  imageContainer: {
    position: 'relative',
  },
  serviceImage: {
    width,
    height: 250,
  },
  imageIndicator: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  imageCount: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  serviceInfo: {
    padding: 20,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  serviceName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    flex: 1,
  },
  popularBadge: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  popularText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  serviceCategory: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: 16,
  },
  serviceStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 14,
    color: theme.colors.text,
    fontWeight: '500',
  },
  statSubtext: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 16,
  },
  tag: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  tagText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  priceContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.primary,
  },
  tabText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  activeTabText: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  tabContent: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 12,
    marginTop: 16,
  },
  description: {
    fontSize: 16,
    color: theme.colors.text,
    lineHeight: 24,
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  featureText: {
    fontSize: 16,
    color: theme.colors.text,
    flex: 1,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  requirementText: {
    fontSize: 16,
    color: theme.colors.text,
    flex: 1,
  },
  reviewCard: {
    marginBottom: 16,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  reviewerInfo: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  reviewDate: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginLeft: 8,
  },
  reviewComment: {
    fontSize: 16,
    color: theme.colors.text,
    lineHeight: 22,
    marginBottom: 12,
  },
  reviewFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  helpfulButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  helpfulText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  providerCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  providerImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  providerInfo: {
    flex: 1,
  },
  providerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  providerName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
  providerStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  providerStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  providerStatText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  providerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  providerPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  bottomContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  bookButton: {
    width: '100%',
  },
});

export default ServiceDetailScreen;
