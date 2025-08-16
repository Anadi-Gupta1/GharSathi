import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { CustomerStackParamList } from '../../types';

type ReviewScreenNavigationProp = StackNavigationProp<CustomerStackParamList>;
import { theme } from '../../theme/theme';
import Button from '../../components/Button';
import Card from '../../components/Card';
import LoadingOverlay from '../../components/LoadingOverlay';

interface ReviewFormData {
  rating: number;
  serviceRating: number;
  timelinessRating: number;
  cleanlinessRating: number;
  behaviorRating: number;
  comment: string;
  images: string[];
  wouldRecommend: boolean;
}

interface BookingDetails {
  id: string;
  serviceName: string;
  providerName: string;
  providerImage: string;
  date: string;
  amount: number;
}

const ReviewScreen: React.FC = () => {
  const navigation = useNavigation<ReviewScreenNavigationProp>();
  const route = useRoute();
  const { bookingId } = route.params as { bookingId: string };

  const [loading, setLoading] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [reviewData, setReviewData] = useState<ReviewFormData>({
    rating: 0,
    serviceRating: 0,
    timelinessRating: 0,
    cleanlinessRating: 0,
    behaviorRating: 0,
    comment: '',
    images: [],
    wouldRecommend: false,
  });

  useEffect(() => {
    fetchBookingDetails();
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      
      // Mock data - replace with API call
      const mockBooking: BookingDetails = {
        id: bookingId,
        serviceName: 'Deep Home Cleaning',
        providerName: 'CleanPro Services',
        providerImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
        date: '15 Aug 2025',
        amount: 2400,
      };
      
      setBookingDetails(mockBooking);
    } catch (error) {
      console.error('Error fetching booking details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRatingChange = (category: keyof ReviewFormData, rating: number) => {
    setReviewData(prev => ({ ...prev, [category]: rating }));
  };

  const handleSubmitReview = async () => {
    if (reviewData.rating === 0) {
      Alert.alert('Error', 'Please provide an overall rating');
      return;
    }

    try {
      setLoading(true);
      
      // Mock API call - replace with actual review submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Review Submitted!',
        'Thank you for your feedback. Your review helps other customers make better decisions.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('CustomerTabs'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStarRating = (
    rating: number,
    onRate: (rating: number) => void,
    size: number = 32
  ) => (
    <View style={styles.starRating}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity
          key={star}
          onPress={() => onRate(star)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={star <= rating ? 'star' : 'star-outline'}
            size={size}
            color="#FFD700"
          />
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderRatingCategory = (
    title: string,
    category: keyof ReviewFormData,
    description: string
  ) => (
    <View style={styles.ratingCategory}>
      <View style={styles.ratingHeader}>
        <Text style={styles.ratingTitle}>{title}</Text>
        <Text style={styles.ratingValue}>{reviewData[category]}/5</Text>
      </View>
      <Text style={styles.ratingDescription}>{description}</Text>
      {renderStarRating(
        reviewData[category] as number,
        (rating) => handleRatingChange(category, rating),
        28
      )}
    </View>
  );

  if (loading && !bookingDetails) {
    return <LoadingOverlay visible={true} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Write Review</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Booking Details */}
        {bookingDetails && (
          <Card style={styles.bookingCard}>
            <View style={styles.bookingHeader}>
              <Image source={{ uri: bookingDetails.providerImage }} style={styles.providerImage} />
              <View style={styles.bookingInfo}>
                <Text style={styles.serviceName}>{bookingDetails.serviceName}</Text>
                <Text style={styles.providerName}>{bookingDetails.providerName}</Text>
                <Text style={styles.bookingDate}>{bookingDetails.date} • ₹{bookingDetails.amount}</Text>
              </View>
            </View>
          </Card>
        )}

        {/* Overall Rating */}
        <Card style={styles.overallRatingCard}>
          <Text style={styles.sectionTitle}>Overall Experience</Text>
          <Text style={styles.sectionDescription}>
            How would you rate your overall experience with this service?
          </Text>
          <View style={styles.overallRatingContainer}>
            {renderStarRating(
              reviewData.rating,
              (rating) => handleRatingChange('rating', rating),
              40
            )}
            <Text style={styles.overallRatingText}>
              {reviewData.rating > 0 ? `${reviewData.rating}/5` : 'Tap to rate'}
            </Text>
          </View>
        </Card>

        {/* Detailed Ratings */}
        <Card style={styles.detailedRatingsCard}>
          <Text style={styles.sectionTitle}>Rate Different Aspects</Text>
          
          {renderRatingCategory(
            'Service Quality',
            'serviceRating',
            'How satisfied were you with the quality of service provided?'
          )}
          
          {renderRatingCategory(
            'Timeliness',
            'timelinessRating',
            'Did the service provider arrive and complete work on time?'
          )}
          
          {renderRatingCategory(
            'Cleanliness',
            'cleanlinessRating',
            'How clean did they keep the work area during and after service?'
          )}
          
          {renderRatingCategory(
            'Professional Behavior',
            'behaviorRating',
            'How professional and courteous was the service provider?'
          )}
        </Card>

        {/* Written Review */}
        <Card style={styles.commentCard}>
          <Text style={styles.sectionTitle}>Share Your Experience</Text>
          <Text style={styles.sectionDescription}>
            Tell others about your experience to help them make informed decisions
          </Text>
          <TextInput
            style={styles.commentInput}
            value={reviewData.comment}
            onChangeText={(text: string) => setReviewData(prev => ({ ...prev, comment: text }))}
            placeholder="Write your review here... (Optional)"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            placeholderTextColor={theme.colors.textSecondary}
          />
        </Card>

        {/* Recommendation */}
        <Card style={styles.recommendationCard}>
          <View style={styles.recommendationHeader}>
            <Text style={styles.sectionTitle}>Would you recommend this service?</Text>
            <TouchableOpacity
              style={[
                styles.recommendToggle,
                reviewData.wouldRecommend && styles.recommendToggleActive
              ]}
              onPress={() => setReviewData(prev => ({ ...prev, wouldRecommend: !prev.wouldRecommend }))}
            >
              <Text style={[
                styles.recommendToggleText,
                reviewData.wouldRecommend && styles.recommendToggleTextActive
              ]}>
                {reviewData.wouldRecommend ? 'Yes' : 'No'}
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.sectionDescription}>
            Help others by letting them know if you'd recommend this service
          </Text>
        </Card>

        {/* Tips for Good Reviews */}
        <Card style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>💡 Tips for writing helpful reviews</Text>
          <View style={styles.tipsList}>
            <Text style={styles.tipItem}>• Be specific about what you liked or didn't like</Text>
            <Text style={styles.tipItem}>• Mention if the provider was punctual and professional</Text>
            <Text style={styles.tipItem}>• Share details about the quality of work</Text>
            <Text style={styles.tipItem}>• Help others by being honest and constructive</Text>
          </View>
        </Card>
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.bottomContainer}>
        <Button
          title="Submit Review"
          variant="primary"
          onPress={handleSubmitReview}
          disabled={reviewData.rating === 0}
          loading={loading}
          style={styles.submitButton}
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  bookingCard: {
    marginBottom: 16,
  },
  bookingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  providerImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  bookingInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  providerName: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  bookingDate: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  overallRatingCard: {
    marginBottom: 16,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  overallRatingContainer: {
    alignItems: 'center',
    gap: 12,
  },
  starRating: {
    flexDirection: 'row',
    gap: 8,
  },
  overallRatingText: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text,
  },
  detailedRatingsCard: {
    marginBottom: 16,
  },
  ratingCategory: {
    marginBottom: 24,
  },
  ratingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text,
  },
  ratingValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  ratingDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 12,
    lineHeight: 18,
  },
  commentCard: {
    marginBottom: 16,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: theme.colors.text,
    backgroundColor: theme.colors.background,
    minHeight: 100,
  },
  recommendationCard: {
    marginBottom: 16,
  },
  recommendationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  recommendToggle: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  recommendToggleActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  recommendToggleText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text,
  },
  recommendToggleTextActive: {
    color: '#fff',
  },
  tipsCard: {
    marginBottom: 16,
    backgroundColor: theme.colors.primary + '10',
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 12,
  },
  tipsList: {
    gap: 6,
  },
  tipItem: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
  bottomContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  submitButton: {
    width: '100%',
  },
});

export default ReviewScreen;
