import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONTS, FONT_SIZES } from '../../constants/theme';
import Card from '../../components/Card';
import Button from '../../components/Button';
import LoadingOverlay from '../../components/LoadingOverlay';

interface Recommendation {
  id: string;
  type: 'service' | 'provider' | 'offer' | 'time_slot';
  title: string;
  description: string;
  confidence: number;
  reasoning: string;
  data: any;
  priority: 'high' | 'medium' | 'low';
  category: string;
  imageUrl?: string;
}

interface UserPreference {
  category: string;
  frequency: number;
  lastUsed: string;
  rating: number;
  preferredTime: string;
  budget: { min: number; max: number };
}

interface AIInsight {
  id: string;
  title: string;
  description: string;
  type: 'trend' | 'saving' | 'optimization' | 'prediction';
  impact: 'high' | 'medium' | 'low';
  actionable: boolean;
  data: any;
}

const AIRecommendationsScreen: React.FC = () => {
  const navigation = useNavigation();
  
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [preferences, setPreferences] = useState<UserPreference[]>([]);
  const [activeTab, setActiveTab] = useState<'recommendations' | 'insights' | 'preferences'>('recommendations');

  // Mock data
  const mockRecommendations: Recommendation[] = [
    {
      id: '1',
      type: 'service',
      title: 'House Deep Cleaning',
      description: 'Based on your booking history, deep cleaning is recommended for this month',
      confidence: 0.92,
      reasoning: 'You book deep cleaning every 3 months, and it\'s been 2.5 months since your last booking',
      data: {
        serviceName: 'Deep House Cleaning',
        averagePrice: 1200,
        estimatedDuration: '4-6 hours',
        availableSlots: ['Tomorrow 9 AM', 'Day after 10 AM'],
      },
      priority: 'high',
      category: 'Cleaning',
      imageUrl: 'https://example.com/cleaning.jpg',
    },
    {
      id: '2',
      type: 'provider',
      title: 'CleanPro Services',
      description: 'Top-rated provider matching your preferences and budget',
      confidence: 0.88,
      reasoning: 'This provider has 4.8 stars, works in your area, and charges within your preferred budget range',
      data: {
        providerName: 'CleanPro Services',
        rating: 4.8,
        completedJobs: 250,
        averagePrice: 800,
        specialties: ['House Cleaning', 'Deep Cleaning'],
      },
      priority: 'medium',
      category: 'Provider',
      imageUrl: 'https://example.com/provider.jpg',
    },
    {
      id: '3',
      type: 'offer',
      title: '20% Off on AC Service',
      description: 'Summer AC maintenance offer - perfect timing for you',
      confidence: 0.85,
      reasoning: 'Summer is approaching and you usually book AC service in April',
      data: {
        discount: 20,
        originalPrice: 800,
        discountedPrice: 640,
        validUntil: '2024-04-30',
        serviceType: 'AC Repair & Maintenance',
      },
      priority: 'high',
      category: 'Appliances',
      imageUrl: 'https://example.com/ac.jpg',
    },
    {
      id: '4',
      type: 'time_slot',
      title: 'Optimal Booking Time',
      description: 'Book services on weekday mornings for better rates',
      confidence: 0.79,
      reasoning: 'Historical data shows 15-25% lower prices during weekday mornings',
      data: {
        bestTimes: ['Monday 9-11 AM', 'Tuesday 10-12 PM', 'Wednesday 9-11 AM'],
        averageSavings: '20%',
        providerAvailability: 'High',
      },
      priority: 'medium',
      category: 'Optimization',
    },
  ];

  const mockInsights: AIInsight[] = [
    {
      id: '1',
      title: 'Service Usage Pattern',
      description: 'You tend to book cleaning services every 2-3 weeks, mostly on Saturdays',
      type: 'trend',
      impact: 'medium',
      actionable: true,
      data: {
        frequency: '2-3 weeks',
        preferredDay: 'Saturday',
        averageSpending: 600,
      },
    },
    {
      id: '2',
      title: 'Potential Savings',
      description: 'You could save ₹200/month by booking during off-peak hours',
      type: 'saving',
      impact: 'high',
      actionable: true,
      data: {
        monthlySavings: 200,
        yearlyPotential: 2400,
        actionRequired: 'Book during weekday mornings',
      },
    },
    {
      id: '3',
      title: 'Service Prediction',
      description: 'Based on your history, you\'ll likely need plumbing service in the next 30 days',
      type: 'prediction',
      impact: 'medium',
      actionable: false,
      data: {
        service: 'Plumbing',
        probability: 0.72,
        timeframe: '30 days',
        lastBooked: '6 months ago',
      },
    },
  ];

  const mockPreferences: UserPreference[] = [
    {
      category: 'House Cleaning',
      frequency: 2, // times per month
      lastUsed: '2024-01-15',
      rating: 4.5,
      preferredTime: '10:00 AM',
      budget: { min: 400, max: 800 },
    },
    {
      category: 'Appliance Repair',
      frequency: 1,
      lastUsed: '2024-02-01',
      rating: 4.2,
      preferredTime: '2:00 PM',
      budget: { min: 300, max: 1000 },
    },
    {
      category: 'Plumbing',
      frequency: 0.5, // every 2 months
      lastUsed: '2023-12-20',
      rating: 4.0,
      preferredTime: '9:00 AM',
      budget: { min: 500, max: 1500 },
    },
  ];

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    setLoading(true);
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      setRecommendations(mockRecommendations);
      setInsights(mockInsights);
      setPreferences(mockPreferences);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshRecommendations = async () => {
    setRefreshing(true);
    try {
      await loadRecommendations();
    } finally {
      setRefreshing(false);
    }
  };

  const handleRecommendationAction = (recommendation: Recommendation) => {
    switch (recommendation.type) {
      case 'service':
        console.log('Navigate to Service Details:', recommendation.id);
        // navigation.navigate('ServiceDetails', { serviceId: recommendation.id });
        break;
      case 'provider':
        console.log('Navigate to Provider Profile:', recommendation.data.providerId);
        // navigation.navigate('ProviderProfile', { providerId: recommendation.data.providerId });
        break;
      case 'offer':
        console.log('Navigate to Booking with offer:', recommendation.data);
        // navigation.navigate('BookingScreen', { serviceId: recommendation.id, offer: recommendation.data });
        break;
      case 'time_slot':
        console.log('Navigate to Booking with recommended times:', recommendation.data.bestTimes);
        // navigation.navigate('BookingScreen', { recommendedTimes: recommendation.data.bestTimes });
        break;
    }
  };

  const renderConfidenceBar = (confidence: number) => (
    <View style={styles.confidenceContainer}>
      <Text style={styles.confidenceText}>Confidence: {Math.round(confidence * 100)}%</Text>
      <View style={styles.confidenceBar}>
        <View 
          style={[
            styles.confidenceProgress, 
            { 
              width: `${confidence * 100}%`,
              backgroundColor: confidence > 0.8 ? '#4CAF50' : confidence > 0.6 ? '#FF9800' : '#F44336'
            }
          ]} 
        />
      </View>
    </View>
  );

  const renderRecommendationCard = (recommendation: Recommendation) => (
    <Card key={recommendation.id} style={styles.recommendationCard}>
      <View style={styles.cardHeader}>
        <View style={[
          styles.priorityBadge,
          { backgroundColor: recommendation.priority === 'high' ? '#F44336' : recommendation.priority === 'medium' ? '#FF9800' : '#4CAF50' }
        ]}>
          <Text style={styles.priorityText}>{recommendation.priority}</Text>
        </View>
        <Text style={styles.categoryText}>{recommendation.category}</Text>
      </View>
      
      <Text style={styles.recommendationTitle}>{recommendation.title}</Text>
      <Text style={styles.recommendationDescription}>{recommendation.description}</Text>
      
      {renderConfidenceBar(recommendation.confidence)}
      
      <View style={styles.reasoningContainer}>
        <Text style={styles.reasoningTitle}>Why this recommendation?</Text>
        <Text style={styles.reasoningText}>{recommendation.reasoning}</Text>
      </View>
      
      {recommendation.data && (
        <View style={styles.dataContainer}>
          {Object.entries(recommendation.data).slice(0, 3).map(([key, value]) => (
            <View key={key} style={styles.dataItem}>
              <Text style={styles.dataLabel}>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</Text>
              <Text style={styles.dataValue}>{typeof value === 'object' ? JSON.stringify(value) : String(value)}</Text>
            </View>
          ))}
        </View>
      )}
      
      <Button
        title={`Explore ${recommendation.type === 'service' ? 'Service' : recommendation.type === 'provider' ? 'Provider' : recommendation.type === 'offer' ? 'Offer' : 'Options'}`}
        variant="primary"
        onPress={() => handleRecommendationAction(recommendation)}
        style={styles.actionButton}
      />
    </Card>
  );

  const renderInsightCard = (insight: AIInsight) => (
    <Card key={insight.id} style={styles.insightCard}>
      <View style={styles.insightHeader}>
        <View style={styles.insightIcon}>
          <Ionicons 
            name={
              insight.type === 'trend' ? 'trending-up' :
              insight.type === 'saving' ? 'wallet' :
              insight.type === 'optimization' ? 'settings' : 'flash'
            } 
            size={20} 
            color={COLORS.primary} 
          />
        </View>
        <View style={styles.insightTitleContainer}>
          <Text style={styles.insightTitle}>{insight.title}</Text>
          <View style={[
            styles.impactBadge,
            { backgroundColor: insight.impact === 'high' ? '#4CAF50' : insight.impact === 'medium' ? '#FF9800' : '#9E9E9E' }
          ]}>
            <Text style={styles.impactText}>{insight.impact} impact</Text>
          </View>
        </View>
      </View>
      
      <Text style={styles.insightDescription}>{insight.description}</Text>
      
      {insight.actionable && (
        <View style={styles.actionableContainer}>
          <Ionicons name="bulb" size={16} color="#FF9800" />
          <Text style={styles.actionableText}>Action recommended</Text>
        </View>
      )}
    </Card>
  );

  const renderPreferenceCard = (preference: UserPreference) => (
    <Card key={preference.category} style={styles.preferenceCard}>
      <Text style={styles.preferenceName}>{preference.category}</Text>
      
      <View style={styles.preferenceStats}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Usage</Text>
          <Text style={styles.statValue}>{preference.frequency}/month</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Rating</Text>
          <Text style={styles.statValue}>{preference.rating}⭐</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Budget</Text>
          <Text style={styles.statValue}>₹{preference.budget.min}-{preference.budget.max}</Text>
        </View>
      </View>
      
      <View style={styles.preferenceDetails}>
        <Text style={styles.preferenceDetail}>Preferred Time: {preference.preferredTime}</Text>
        <Text style={styles.preferenceDetail}>Last Used: {new Date(preference.lastUsed).toLocaleDateString()}</Text>
      </View>
    </Card>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'recommendations':
        return (
          <ScrollView 
            style={styles.tabContent}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={refreshRecommendations} />
            }
          >
            <Text style={styles.sectionTitle}>AI-Powered Recommendations</Text>
            <Text style={styles.sectionSubtitle}>
              Personalized suggestions based on your booking history and preferences
            </Text>
            
            {recommendations.map(renderRecommendationCard)}
          </ScrollView>
        );
        
      case 'insights':
        return (
          <ScrollView style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Smart Insights</Text>
            <Text style={styles.sectionSubtitle}>
              Data-driven insights about your service usage patterns
            </Text>
            
            {insights.map(renderInsightCard)}
          </ScrollView>
        );
        
      case 'preferences':
        return (
          <ScrollView style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Your Preferences</Text>
            <Text style={styles.sectionSubtitle}>
              AI-learned preferences based on your behavior
            </Text>
            
            {preferences.map(renderPreferenceCard)}
            
            <Card style={styles.updatePreferencesCard}>
              <Text style={styles.updateTitle}>Update Preferences</Text>
              <Text style={styles.updateDescription}>
                Help AI make better recommendations by updating your preferences
              </Text>
              <Button
                title="Update Preferences"
                variant="outline"
                onPress={() => {
                  console.log('Navigate to Preferences Settings');
                  // navigation.navigate('PreferencesSettings');
                }}
                style={styles.updateButton}
              />
            </Card>
          </ScrollView>
        );
    }
  };

  if (loading) {
    return <LoadingOverlay visible={true} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.title}>AI Recommendations</Text>
        <TouchableOpacity onPress={refreshRecommendations}>
          <Ionicons name="refresh" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Tab Bar */}
      <View style={styles.tabBar}>
        {[
          { key: 'recommendations', title: 'Recommendations', icon: 'bulb' },
          { key: 'insights', title: 'Insights', icon: 'analytics' },
          { key: 'preferences', title: 'Preferences', icon: 'heart' },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tabItem,
              activeTab === tab.key && styles.tabItemActive
            ]}
            onPress={() => setActiveTab(tab.key as any)}
          >
            <Ionicons
              name={tab.icon as any}
              size={20}
              color={activeTab === tab.key ? COLORS.primary : COLORS.textSecondary}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === tab.key && styles.tabTextActive
              ]}
            >
              {tab.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {renderTabContent()}
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
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  tabItemActive: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
    fontWeight: '500',
  },
  tabTextActive: {
    color: COLORS.primary,
  },
  tabContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  recommendationCard: {
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  categoryText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '500',
  },
  recommendationTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  recommendationDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  confidenceContainer: {
    marginBottom: 16,
  },
  confidenceText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
    fontWeight: '500',
  },
  confidenceBar: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  confidenceProgress: {
    height: '100%',
    borderRadius: 2,
  },
  reasoningContainer: {
    backgroundColor: COLORS.background,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  reasoningTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  reasoningText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  dataContainer: {
    marginBottom: 16,
  },
  dataItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  dataLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    flex: 1,
  },
  dataValue: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
    flex: 1,
    textAlign: 'right',
  },
  actionButton: {
    marginTop: 8,
  },
  insightCard: {
    padding: 16,
    marginBottom: 12,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  insightIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  insightTitleContainer: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  impactBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  impactText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  insightDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  actionableContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  actionableText: {
    fontSize: 12,
    color: '#F57C00',
    fontWeight: '500',
    marginLeft: 4,
  },
  preferenceCard: {
    padding: 16,
    marginBottom: 12,
  },
  preferenceName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  preferenceStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  preferenceDetails: {
    marginTop: 8,
  },
  preferenceDetail: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  updatePreferencesCard: {
    padding: 16,
    marginBottom: 100,
    alignItems: 'center',
  },
  updateTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  updateDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  updateButton: {
    width: '100%',
  },
});

export default AIRecommendationsScreen;
