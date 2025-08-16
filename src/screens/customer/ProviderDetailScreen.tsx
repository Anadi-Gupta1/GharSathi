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
import Card from '../../components/Card';
import LoadingOverlay from '../../components/LoadingOverlay';
import { CustomerStackParamList } from '../../types';

type ProviderDetailNavigationProp = StackNavigationProp<CustomerStackParamList>;

const { width } = Dimensions.get('window');

interface ProviderDetail {
  id: string;
  name: string;
  profileImage: string;
  rating: number;
  reviewCount: number;
  experience: string;
  distance: string;
  verified: boolean;
  description: string;
  specialties: string[];
  gallery: string[];
  availability: string;
  responseTime: string;
  completedJobs: number;
  certificates: string[];
}

interface Service {
  id: string;
  name: string;
  price: number;
  description: string;
  duration: string;
}

interface Review {
  id: string;
  userName: string;
  userImage: string;
  rating: number;
  comment: string;
  date: string;
  serviceName: string;
}

const ProviderDetailScreen: React.FC = () => {
  const navigation = useNavigation<ProviderDetailNavigationProp>();
  const route = useRoute<any>();
  const { providerId } = route.params as { providerId: string };

  const [provider, setProvider] = useState<ProviderDetail | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'services' | 'reviews' | 'about'>('services');

  useEffect(() => {
    fetchProviderDetails();
  }, [providerId]);

  const fetchProviderDetails = async () => {
    try {
      setLoading(true);
      
      // Mock data for demo - replace with API call
      const mockProvider: ProviderDetail = {
        id: providerId,
        name: 'CleanPro Services',
        profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
        rating: 4.9,
        reviewCount: 156,
        experience: '5 years',
        distance: '2.5 km',
        verified: true,
        description: 'Professional cleaning service with over 5 years of experience. We specialize in deep cleaning, regular maintenance, and eco-friendly solutions. Our team is trained, insured, and committed to providing exceptional service.',
        specialties: ['Deep Cleaning', 'Eco-friendly Products', 'Same Day Service', 'Kitchen Specialist'],
        gallery: [
          'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400',
          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
          'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
          'https://images.unsplash.com/photo-1584622781564-1d987add7afa?w=400',
        ],
        availability: 'Available Today',
        responseTime: '< 1 hour',
        completedJobs: 1247,
        certificates: ['Certified Cleaner', 'Eco-Safe Products', 'Insured Professional'],
      };

      const mockServices: Service[] = [
        {
          id: '1',
          name: 'Deep Home Cleaning',
          price: 2400,
          description: 'Comprehensive deep cleaning service for your entire home',
          duration: '3-4 hours',
        },
        {
          id: '2',
          name: 'Regular House Cleaning',
          price: 1800,
          description: 'Weekly or bi-weekly cleaning service',
          duration: '2-3 hours',
        },
        {
          id: '3',
          name: 'Kitchen Deep Clean',
          price: 1200,
          description: 'Specialized kitchen cleaning with appliances',
          duration: '2 hours',
        },
        {
          id: '4',
          name: 'Post-Construction Cleanup',
          price: 3500,
          description: 'Complete cleanup after construction or renovation',
          duration: '4-6 hours',
        },
      ];

      const mockReviews: Review[] = [
        {
          id: '1',
          userName: 'Priya Sharma',
          userImage: 'https://images.unsplash.com/photo-1494790108755-2616b69a6e5c?w=100',
          rating: 5,
          comment: 'Excellent service! Very professional and thorough. My house has never been cleaner. Highly recommend CleanPro Services.',
          date: '2 days ago',
          serviceName: 'Deep Home Cleaning',
        },
        {
          id: '2',
          userName: 'Rajesh Kumar',
          userImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
          rating: 5,
          comment: 'Amazing work! They cleaned my kitchen appliances better than I ever could. Very satisfied with the service.',
          date: '1 week ago',
          serviceName: 'Kitchen Deep Clean',
        },
        {
          id: '3',
          userName: 'Anita Patel',
          userImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
          rating: 4,
          comment: 'Good service overall. They arrived on time and completed the work efficiently. Will book again.',
          date: '2 weeks ago',
          serviceName: 'Regular House Cleaning',
        },
      ];

      setProvider(mockProvider);
      setServices(mockServices);
      setReviews(mockReviews);
    } catch (error) {
      console.error('Error fetching provider details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookService = (service: Service) => {
    if (!provider?.id) return;
    navigation.navigate('BookingFlow', { 
      serviceId: service.id, 
      providerId: provider.id 
    });
  };

  const handleContactProvider = () => {
    // In a real app, this would open a chat or call interface
    if (!provider?.id) return;
    navigation.navigate('ChatScreen', { providerId: provider.id });
  };

  const renderGalleryImage = ({ item }: { item: string }) => (
    <Image source={{ uri: item }} style={styles.galleryImage} />
  );

  const renderService = ({ item }: { item: Service }) => (
    <Card style={styles.serviceCard}>
      <View style={styles.serviceHeader}>
        <Text style={styles.serviceName}>{item.name}</Text>
        <Text style={styles.servicePrice}>₹{item.price}</Text>
      </View>
      <Text style={styles.serviceDescription}>{item.description}</Text>
      <View style={styles.serviceFooter}>
        <View style={styles.serviceDuration}>
          <Ionicons name="time" size={16} color={theme.colors.textSecondary} />
          <Text style={styles.serviceDurationText}>{item.duration}</Text>
        </View>
        <Button
          title="Book Now"
          variant="primary"
          size="small"
          onPress={() => handleBookService(item)}
        />
      </View>
    </Card>
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
          <Text style={styles.reviewService}>Service: {item.serviceName}</Text>
        </View>
      </View>
      <Text style={styles.reviewComment}>{item.comment}</Text>
    </Card>
  );

  if (loading || !provider) {
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
        {/* Provider Info */}
        <View style={styles.providerInfo}>
          <View style={styles.providerHeader}>
            <Image source={{ uri: provider.profileImage }} style={styles.providerImage} />
            <View style={styles.providerDetails}>
              <View style={styles.providerNameRow}>
                <Text style={styles.providerName}>{provider.name}</Text>
                {provider.verified && (
                  <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                )}
              </View>
              
              <View style={styles.providerStats}>
                <View style={styles.statItem}>
                  <Ionicons name="star" size={16} color="#FFD700" />
                  <Text style={styles.statText}>{provider.rating}</Text>
                  <Text style={styles.statSubtext}>({provider.reviewCount})</Text>
                </View>
                <View style={styles.statItem}>
                  <Ionicons name="briefcase" size={16} color={theme.colors.textSecondary} />
                  <Text style={styles.statText}>{provider.experience}</Text>
                </View>
                <View style={styles.statItem}>
                  <Ionicons name="location" size={16} color={theme.colors.textSecondary} />
                  <Text style={styles.statText}>{provider.distance}</Text>
                </View>
              </View>

              <View style={styles.providerBadges}>
                <View style={[styles.badge, styles.availableBadge]}>
                  <Text style={styles.availableBadgeText}>{provider.availability}</Text>
                </View>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>Responds in {provider.responseTime}</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.quickStats}>
            <View style={styles.quickStat}>
              <Text style={styles.quickStatNumber}>{provider.completedJobs}</Text>
              <Text style={styles.quickStatLabel}>Jobs Completed</Text>
            </View>
            <View style={styles.quickStat}>
              <Text style={styles.quickStatNumber}>{provider.reviewCount}</Text>
              <Text style={styles.quickStatLabel}>Reviews</Text>
            </View>
            <View style={styles.quickStat}>
              <Text style={styles.quickStatNumber}>{provider.experience}</Text>
              <Text style={styles.quickStatLabel}>Experience</Text>
            </View>
          </View>
        </View>

        {/* Gallery */}
        {provider.gallery.length > 0 && (
          <View style={styles.gallerySection}>
            <Text style={styles.sectionTitle}>Work Gallery</Text>
            <FlatList
              data={provider.gallery}
              renderItem={renderGalleryImage}
              keyExtractor={(item: any, index: number) => index.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.galleryList}
            />
          </View>
        )}

        {/* Specialties */}
        <View style={styles.specialtiesSection}>
          <Text style={styles.sectionTitle}>Specialties</Text>
          <View style={styles.specialtiesContainer}>
            {provider.specialties.map((specialty, index) => (
              <View key={index} style={styles.specialtyTag}>
                <Text style={styles.specialtyText}>{specialty}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'services' && styles.activeTab]}
            onPress={() => setActiveTab('services')}
          >
            <Text style={[styles.tabText, activeTab === 'services' && styles.activeTabText]}>
              Services
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'reviews' && styles.activeTab]}
            onPress={() => setActiveTab('reviews')}
          >
            <Text style={[styles.tabText, activeTab === 'reviews' && styles.activeTabText]}>
              Reviews ({provider.reviewCount})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'about' && styles.activeTab]}
            onPress={() => setActiveTab('about')}
          >
            <Text style={[styles.tabText, activeTab === 'about' && styles.activeTabText]}>
              About
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        <View style={styles.tabContent}>
          {activeTab === 'services' && (
            <FlatList
              data={services}
              renderItem={renderService}
              keyExtractor={(item: any) => item.id}
              scrollEnabled={false}
            />
          )}

          {activeTab === 'reviews' && (
            <FlatList
              data={reviews}
              renderItem={renderReview}
              keyExtractor={(item: any) => item.id}
              scrollEnabled={false}
            />
          )}

          {activeTab === 'about' && (
            <>
              <Text style={styles.aboutTitle}>About {provider.name}</Text>
              <Text style={styles.aboutDescription}>{provider.description}</Text>
              
              <Text style={styles.aboutTitle}>Certificates & Credentials</Text>
              {provider.certificates.map((cert, index) => (
                <View key={index} style={styles.certificateItem}>
                  <Ionicons name="medal" size={20} color={theme.colors.primary} />
                  <Text style={styles.certificateText}>{cert}</Text>
                </View>
              ))}
            </>
          )}
        </View>
      </ScrollView>

      {/* Contact Button */}
      <View style={styles.bottomContainer}>
        <Button
          title="Contact Provider"
          variant="outline"
          onPress={handleContactProvider}
          style={styles.contactButton}
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
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  providerInfo: {
    padding: 20,
  },
  providerHeader: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  providerImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  providerDetails: {
    flex: 1,
  },
  providerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  providerName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginRight: 8,
  },
  providerStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
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
  providerBadges: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  availableBadge: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  badgeText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  availableBadgeText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
  },
  quickStat: {
    alignItems: 'center',
  },
  quickStatNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  quickStatLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  gallerySection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginHorizontal: 20,
    marginBottom: 12,
  },
  galleryList: {
    paddingHorizontal: 20,
    gap: 12,
  },
  galleryImage: {
    width: 120,
    height: 90,
    borderRadius: 8,
  },
  specialtiesSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  specialtyTag: {
    backgroundColor: theme.colors.primary + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  specialtyText: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '500',
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
  serviceCard: {
    marginBottom: 16,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    flex: 1,
  },
  servicePrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  serviceDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  serviceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serviceDuration: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  serviceDurationText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
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
    marginBottom: 4,
  },
  reviewDate: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginLeft: 8,
  },
  reviewService: {
    fontSize: 12,
    color: theme.colors.primary,
  },
  reviewComment: {
    fontSize: 16,
    color: theme.colors.text,
    lineHeight: 22,
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 12,
    marginTop: 16,
  },
  aboutDescription: {
    fontSize: 16,
    color: theme.colors.text,
    lineHeight: 24,
    marginBottom: 16,
  },
  certificateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  certificateText: {
    fontSize: 16,
    color: theme.colors.text,
  },
  bottomContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  contactButton: {
    width: '100%',
  },
});

export default ProviderDetailScreen;
