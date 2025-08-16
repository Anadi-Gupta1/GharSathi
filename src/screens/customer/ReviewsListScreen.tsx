import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { theme } from '../../theme/theme';
import Card from '../../components/Card';
import LoadingOverlay from '../../components/LoadingOverlay';

interface Review {
  id: string;
  userName: string;
  userImage: string;
  rating: number;
  serviceRating: number;
  timelinessRating: number;
  cleanlinessRating: number;
  behaviorRating: number;
  comment: string;
  date: string;
  serviceName: string;
  wouldRecommend: boolean;
  helpful: number;
  images?: string[];
  providerResponse?: {
    message: string;
    date: string;
  };
}

interface FilterOption {
  id: string;
  label: string;
  value: number | string;
}

const ReviewsListScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { serviceId, providerId, title } = route.params as { 
    serviceId?: string; 
    providerId?: string; 
    title: string; 
  };

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest');

  const filterOptions: FilterOption[] = [
    { id: 'all', label: 'All', value: 'all' },
    { id: '5', label: '5 Stars', value: 5 },
    { id: '4', label: '4 Stars', value: 4 },
    { id: '3', label: '3 Stars', value: 3 },
    { id: '2', label: '2 Stars', value: 2 },
    { id: '1', label: '1 Star', value: 1 },
  ];

  const sortOptions = [
    { id: 'newest', label: 'Newest First' },
    { id: 'oldest', label: 'Oldest First' },
    { id: 'highest', label: 'Highest Rated' },
    { id: 'lowest', label: 'Lowest Rated' },
  ];

  useEffect(() => {
    fetchReviews();
  }, [serviceId, providerId]);

  useEffect(() => {
    applyFiltersAndSort();
  }, [reviews, selectedFilter, sortBy]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      
      // Mock data - replace with API call
      const mockReviews: Review[] = [
        {
          id: '1',
          userName: 'Priya Sharma',
          userImage: 'https://images.unsplash.com/photo-1494790108755-2616b69a6e5c?w=100',
          rating: 5,
          serviceRating: 5,
          timelinessRating: 5,
          cleanlinessRating: 4,
          behaviorRating: 5,
          comment: 'Excellent service! The team was very professional and did a thorough job. My house has never been cleaner. They arrived on time and completed everything as promised. Highly recommend!',
          date: '2 days ago',
          serviceName: 'Deep Home Cleaning',
          wouldRecommend: true,
          helpful: 12,
          images: [
            'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=200',
            'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200',
          ],
        },
        {
          id: '2',
          userName: 'Rajesh Kumar',
          userImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
          rating: 4,
          serviceRating: 4,
          timelinessRating: 5,
          cleanlinessRating: 4,
          behaviorRating: 4,
          comment: 'Good service overall. They arrived on time and completed the work efficiently. The quality was good but there were a couple of spots they missed initially, though they fixed it when I pointed it out.',
          date: '1 week ago',
          serviceName: 'Regular House Cleaning',
          wouldRecommend: true,
          helpful: 8,
          providerResponse: {
            message: 'Thank you for your feedback! We appreciate you pointing out the missed spots and we\'re glad we could fix them immediately. We\'ll ensure better attention to detail in the future.',
            date: '6 days ago',
          },
        },
        {
          id: '3',
          userName: 'Anita Patel',
          userImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
          rating: 5,
          serviceRating: 5,
          timelinessRating: 4,
          cleanlinessRating: 5,
          behaviorRating: 5,
          comment: 'Outstanding attention to detail! They cleaned places I didn\'t even think needed cleaning. Very polite and professional staff. Worth every penny.',
          date: '2 weeks ago',
          serviceName: 'Kitchen Deep Clean',
          wouldRecommend: true,
          helpful: 15,
        },
        {
          id: '4',
          userName: 'Vikram Singh',
          userImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
          rating: 3,
          serviceRating: 3,
          timelinessRating: 2,
          cleanlinessRating: 4,
          behaviorRating: 4,
          comment: 'Service was okay but they were late by almost an hour. The cleaning quality was decent but for the price, I expected better. Staff was polite though.',
          date: '3 weeks ago',
          serviceName: 'Regular House Cleaning',
          wouldRecommend: false,
          helpful: 5,
        },
        {
          id: '5',
          userName: 'Meera Joshi',
          userImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100',
          rating: 5,
          serviceRating: 5,
          timelinessRating: 5,
          cleanlinessRating: 5,
          behaviorRating: 5,
          comment: 'Absolutely fantastic! They transformed my dirty apartment into a sparkling clean space. Very impressed with their work ethic and professionalism.',
          date: '1 month ago',
          serviceName: 'Deep Home Cleaning',
          wouldRecommend: true,
          helpful: 20,
        },
      ];
      
      setReviews(mockReviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = reviews;

    // Apply rating filter
    if (selectedFilter !== 'all') {
      const ratingFilter = parseInt(selectedFilter);
      filtered = reviews.filter(review => review.rating === ratingFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'oldest':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'highest':
          return b.rating - a.rating;
        case 'lowest':
          return a.rating - b.rating;
        default:
          return 0;
      }
    });

    setFilteredReviews(filtered);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchReviews();
    setRefreshing(false);
  };

  const handleHelpful = (reviewId: string) => {
    setReviews(prev => prev.map(review => 
      review.id === reviewId 
        ? { ...review, helpful: review.helpful + 1 }
        : review
    ));
  };

  const renderStars = (rating: number, size: number = 16) => (
    <View style={styles.stars}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Ionicons
          key={star}
          name={star <= rating ? 'star' : 'star-outline'}
          size={size}
          color="#FFD700"
        />
      ))}
    </View>
  );

  const renderFilterChip = (option: FilterOption) => (
    <TouchableOpacity
      key={option.id}
      style={[
        styles.filterChip,
        selectedFilter === option.id && styles.filterChipSelected
      ]}
      onPress={() => setSelectedFilter(option.id)}
    >
      <Text style={[
        styles.filterChipText,
        selectedFilter === option.id && styles.filterChipTextSelected
      ]}>
        {option.label}
      </Text>
    </TouchableOpacity>
  );

  const renderDetailedRatings = (review: Review) => (
    <View style={styles.detailedRatings}>
      <View style={styles.ratingDetail}>
        <Text style={styles.ratingLabel}>Service</Text>
        {renderStars(review.serviceRating, 14)}
      </View>
      <View style={styles.ratingDetail}>
        <Text style={styles.ratingLabel}>Timeliness</Text>
        {renderStars(review.timelinessRating, 14)}
      </View>
      <View style={styles.ratingDetail}>
        <Text style={styles.ratingLabel}>Cleanliness</Text>
        {renderStars(review.cleanlinessRating, 14)}
      </View>
      <View style={styles.ratingDetail}>
        <Text style={styles.ratingLabel}>Behavior</Text>
        {renderStars(review.behaviorRating, 14)}
      </View>
    </View>
  );

  const renderReview = ({ item }: { item: Review }) => (
    <Card style={styles.reviewCard}>
      {/* Review Header */}
      <View style={styles.reviewHeader}>
        <Image source={{ uri: item.userImage }} style={styles.userImage} />
        <View style={styles.reviewInfo}>
          <View style={styles.reviewNameRow}>
            <Text style={styles.userName}>{item.userName}</Text>
            {item.wouldRecommend && (
              <View style={styles.recommendBadge}>
                <Ionicons name="thumbs-up" size={12} color="#4CAF50" />
                <Text style={styles.recommendText}>Recommends</Text>
              </View>
            )}
          </View>
          <View style={styles.reviewRating}>
            {renderStars(item.rating)}
            <Text style={styles.reviewDate}>{item.date}</Text>
          </View>
          <Text style={styles.serviceName}>{item.serviceName}</Text>
        </View>
      </View>

      {/* Review Comment */}
      <Text style={styles.reviewComment}>{item.comment}</Text>

      {/* Detailed Ratings */}
      {renderDetailedRatings(item)}

      {/* Review Images */}
      {item.images && item.images.length > 0 && (
        <View style={styles.reviewImages}>
          {item.images.map((image, index) => (
            <Image key={index} source={{ uri: image }} style={styles.reviewImage} />
          ))}
        </View>
      )}

      {/* Provider Response */}
      {item.providerResponse && (
        <View style={styles.providerResponse}>
          <View style={styles.providerResponseHeader}>
            <Ionicons name="business" size={16} color={theme.colors.primary} />
            <Text style={styles.providerResponseTitle}>Response from Provider</Text>
            <Text style={styles.providerResponseDate}>{item.providerResponse.date}</Text>
          </View>
          <Text style={styles.providerResponseText}>{item.providerResponse.message}</Text>
        </View>
      )}

      {/* Review Actions */}
      <View style={styles.reviewActions}>
        <TouchableOpacity 
          style={styles.helpfulButton}
          onPress={() => handleHelpful(item.id)}
        >
          <Ionicons name="thumbs-up-outline" size={16} color={theme.colors.textSecondary} />
          <Text style={styles.helpfulText}>Helpful ({item.helpful})</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.rating as keyof typeof distribution]++;
    });
    return distribution;
  };

  const ratingDistribution = getRatingDistribution();

  if (loading) {
    return <LoadingOverlay visible={true} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>{title} Reviews</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={filteredReviews}
        renderItem={renderReview}
        keyExtractor={(item: any) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListHeaderComponent={
          <View style={styles.headerContent}>
            {/* Rating Summary */}
            <Card style={styles.summaryCard}>
              <View style={styles.summaryHeader}>
                <View style={styles.averageRating}>
                  <Text style={styles.averageRatingNumber}>{calculateAverageRating()}</Text>
                  {renderStars(Math.round(parseFloat(String(calculateAverageRating()))), 20)}
                  <Text style={styles.totalReviews}>
                    Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                  </Text>
                </View>
                <View style={styles.ratingBars}>
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <View key={rating} style={styles.ratingBar}>
                      <Text style={styles.ratingNumber}>{rating}</Text>
                      <Ionicons name="star" size={14} color="#FFD700" />
                      <View style={styles.barContainer}>
                        <View 
                          style={[
                            styles.bar,
                            { width: `${(ratingDistribution[rating as keyof typeof ratingDistribution] / reviews.length) * 100}%` }
                          ]} 
                        />
                      </View>
                      <Text style={styles.ratingCount}>
                        {ratingDistribution[rating as keyof typeof ratingDistribution]}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </Card>

            {/* Filters */}
            <View style={styles.filtersContainer}>
              <Text style={styles.filterTitle}>Filter by Rating</Text>
              <View style={styles.filterChips}>
                {filterOptions.map(renderFilterChip)}
              </View>
            </View>

            {/* Sort Options */}
            <View style={styles.sortContainer}>
              <Text style={styles.sortLabel}>Sort by:</Text>
              <View style={styles.sortButtons}>
                {sortOptions.map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.sortButton,
                      sortBy === option.id && styles.sortButtonActive
                    ]}
                    onPress={() => setSortBy(option.id as any)}
                  >
                    <Text style={[
                      styles.sortButtonText,
                      sortBy === option.id && styles.sortButtonTextActive
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Results Count */}
            <Text style={styles.resultsCount}>
              Showing {filteredReviews.length} of {reviews.length} reviews
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  headerContent: {
    padding: 20,
  },
  summaryCard: {
    marginBottom: 20,
  },
  summaryHeader: {
    flexDirection: 'row',
    gap: 24,
  },
  averageRating: {
    flex: 1,
    alignItems: 'center',
  },
  averageRatingNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 8,
  },
  stars: {
    flexDirection: 'row',
    gap: 2,
    marginBottom: 8,
  },
  totalReviews: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  ratingBars: {
    flex: 2,
    gap: 8,
  },
  ratingBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingNumber: {
    fontSize: 14,
    color: theme.colors.text,
    width: 12,
  },
  barContainer: {
    flex: 1,
    height: 8,
    backgroundColor: theme.colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 4,
  },
  ratingCount: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    width: 20,
    textAlign: 'right',
  },
  filtersContainer: {
    marginBottom: 20,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 12,
  },
  filterChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  filterChipSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterChipText: {
    fontSize: 14,
    color: theme.colors.text,
  },
  filterChipTextSelected: {
    color: '#fff',
  },
  sortContainer: {
    marginBottom: 16,
  },
  sortLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text,
    marginBottom: 12,
  },
  sortButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  sortButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  sortButtonText: {
    fontSize: 14,
    color: theme.colors.text,
  },
  sortButtonTextActive: {
    color: '#fff',
  },
  resultsCount: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  listContent: {
    paddingBottom: 20,
  },
  reviewCard: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  reviewHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  reviewInfo: {
    flex: 1,
  },
  reviewNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginRight: 8,
  },
  recommendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    gap: 4,
  },
  recommendText: {
    fontSize: 10,
    color: '#4CAF50',
    fontWeight: '500',
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  reviewDate: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  serviceName: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  reviewComment: {
    fontSize: 16,
    color: theme.colors.text,
    lineHeight: 22,
    marginBottom: 16,
  },
  detailedRatings: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 16,
  },
  ratingDetail: {
    alignItems: 'center',
    gap: 4,
  },
  ratingLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  reviewImages: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  reviewImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  providerResponse: {
    backgroundColor: theme.colors.primary + '10',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  providerResponseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  providerResponseTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.primary,
    flex: 1,
  },
  providerResponseDate: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  providerResponseText: {
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 20,
  },
  reviewActions: {
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
});

export default ReviewsListScreen;
