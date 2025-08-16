import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { COLORS, FONTS, FONT_SIZES } from '../../constants/theme';
import Card from '../../components/Card';
import LoadingOverlay from '../../components/LoadingOverlay';

const screenWidth = Dimensions.get('window').width;

interface AnalyticsData {
  totalBookings: number;
  totalRevenue: number;
  avgRating: number;
  customerRetention: number;
  topServices: Array<{
    name: string;
    bookings: number;
    revenue: number;
  }>;
  monthlyRevenue: Array<{
    month: string;
    revenue: number;
    bookings: number;
  }>;
  customerMetrics: {
    newCustomers: number;
    returningCustomers: number;
    totalCustomers: number;
  };
  providerMetrics: {
    totalProviders: number;
    activeProviders: number;
    avgProviderRating: number;
  };
  serviceDistribution: Array<{
    name: string;
    percentage: number;
    color: string;
  }>;
  revenueGrowth: {
    percentage: number;
    trend: 'up' | 'down';
  };
}

const AnalyticsDashboardScreen: React.FC = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');

  const timeRanges = [
    { key: 'week', label: 'Week' },
    { key: 'month', label: 'Month' },
    { key: 'quarter', label: 'Quarter' },
    { key: 'year', label: 'Year' },
  ];

  // Mock analytics data
  const mockAnalyticsData: AnalyticsData = {
    totalBookings: 2847,
    totalRevenue: 456780,
    avgRating: 4.7,
    customerRetention: 78.5,
    topServices: [
      { name: 'House Cleaning', bookings: 892, revenue: 142880 },
      { name: 'AC Repair', bookings: 567, revenue: 98450 },
      { name: 'Plumbing', bookings: 423, revenue: 76140 },
      { name: 'Electrical Work', bookings: 389, revenue: 68230 },
      { name: 'Appliance Repair', bookings: 298, revenue: 52340 },
    ],
    monthlyRevenue: [
      { month: 'Jan', revenue: 35000, bookings: 189 },
      { month: 'Feb', revenue: 42000, bookings: 234 },
      { month: 'Mar', revenue: 38000, bookings: 198 },
      { month: 'Apr', revenue: 45000, bookings: 267 },
      { month: 'May', revenue: 52000, bookings: 298 },
      { month: 'Jun', revenue: 48000, bookings: 276 },
    ],
    customerMetrics: {
      newCustomers: 456,
      returningCustomers: 1234,
      totalCustomers: 1690,
    },
    providerMetrics: {
      totalProviders: 189,
      activeProviders: 145,
      avgProviderRating: 4.6,
    },
    serviceDistribution: [
      { name: 'Cleaning', percentage: 35, color: '#FF6B6B' },
      { name: 'Repairs', percentage: 28, color: '#4ECDC4' },
      { name: 'Maintenance', percentage: 22, color: '#45B7D1' },
      { name: 'Installation', percentage: 15, color: '#96CEB4' },
    ],
    revenueGrowth: {
      percentage: 23.5,
      trend: 'up',
    },
  };

  useEffect(() => {
    loadAnalyticsData();
  }, [selectedTimeRange]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setAnalyticsData(mockAnalyticsData);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const chartConfig = {
    backgroundColor: COLORS.surface,
    backgroundGradientFrom: COLORS.surface,
    backgroundGradientTo: COLORS.surface,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(70, 130, 200, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: COLORS.primary,
    },
  };

  const renderOverviewCards = () => (
    <View style={styles.overviewGrid}>
      <Card style={styles.overviewCard}>
        <View style={styles.cardIcon}>
          <Ionicons name="calendar" size={24} color={COLORS.primary} />
        </View>
        <Text style={styles.cardValue}>{analyticsData?.totalBookings.toLocaleString()}</Text>
        <Text style={styles.cardLabel}>Total Bookings</Text>
        <View style={styles.cardTrend}>
          <Ionicons name="trending-up" size={16} color="#4CAF50" />
          <Text style={styles.trendText}>+12%</Text>
        </View>
      </Card>

      <Card style={styles.overviewCard}>
        <View style={styles.cardIcon}>
          <Ionicons name="cash" size={24} color="#4CAF50" />
        </View>
        <Text style={styles.cardValue}>₹{analyticsData?.totalRevenue.toLocaleString()}</Text>
        <Text style={styles.cardLabel}>Total Revenue</Text>
        <View style={styles.cardTrend}>
          <Ionicons 
            name={analyticsData?.revenueGrowth.trend === 'up' ? 'trending-up' : 'trending-down'} 
            size={16} 
            color={analyticsData?.revenueGrowth.trend === 'up' ? '#4CAF50' : '#F44336'} 
          />
          <Text style={[
            styles.trendText,
            { color: analyticsData?.revenueGrowth.trend === 'up' ? '#4CAF50' : '#F44336' }
          ]}>
            {analyticsData?.revenueGrowth.trend === 'up' ? '+' : '-'}{analyticsData?.revenueGrowth.percentage}%
          </Text>
        </View>
      </Card>

      <Card style={styles.overviewCard}>
        <View style={styles.cardIcon}>
          <Ionicons name="star" size={24} color="#FFD700" />
        </View>
        <Text style={styles.cardValue}>{analyticsData?.avgRating}</Text>
        <Text style={styles.cardLabel}>Avg Rating</Text>
        <View style={styles.ratingStars}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Ionicons
              key={star}
              name={star <= Math.floor(analyticsData?.avgRating || 0) ? 'star' : 'star-outline'}
              size={12}
              color="#FFD700"
            />
          ))}
        </View>
      </Card>

      <Card style={styles.overviewCard}>
        <View style={styles.cardIcon}>
          <Ionicons name="people" size={24} color="#9C27B0" />
        </View>
        <Text style={styles.cardValue}>{analyticsData?.customerRetention}%</Text>
        <Text style={styles.cardLabel}>Retention Rate</Text>
        <View style={styles.cardTrend}>
          <Ionicons name="trending-up" size={16} color="#4CAF50" />
          <Text style={styles.trendText}>+5%</Text>
        </View>
      </Card>
    </View>
  );

  const renderRevenueChart = () => {
    if (!analyticsData) return null;

    const data = {
      labels: analyticsData.monthlyRevenue.map(item => item.month),
      datasets: [
        {
          data: analyticsData.monthlyRevenue.map(item => item.revenue / 1000), // Convert to thousands
          color: (opacity = 1) => `rgba(70, 130, 200, ${opacity})`,
          strokeWidth: 2,
        }
      ],
    };

    return (
      <Card style={styles.chartCard}>
        <Text style={styles.chartTitle}>Revenue Trend (₹ in thousands)</Text>
        <LineChart
          data={data}
          width={screenWidth - 64}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      </Card>
    );
  };

  const renderBookingsChart = () => {
    if (!analyticsData) return null;

    const data = {
      labels: analyticsData.monthlyRevenue.map(item => item.month),
      datasets: [
        {
          data: analyticsData.monthlyRevenue.map(item => item.bookings),
        }
      ],
    };

    return (
      <Card style={styles.chartCard}>
        <Text style={styles.chartTitle}>Monthly Bookings</Text>
        <BarChart
          data={data}
          width={screenWidth - 64}
          height={220}
          yAxisLabel=""
          yAxisSuffix=""
          chartConfig={chartConfig}
          style={styles.chart}
        />
      </Card>
    );
  };

  const renderServiceDistribution = () => {
    if (!analyticsData) return null;

    const data = analyticsData.serviceDistribution.map(item => ({
      name: item.name,
      population: item.percentage,
      color: item.color,
      legendFontColor: COLORS.text,
      legendFontSize: 14,
    }));

    return (
      <Card style={styles.chartCard}>
        <Text style={styles.chartTitle}>Service Distribution</Text>
        <PieChart
          data={data}
          width={screenWidth - 64}
          height={220}
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          style={styles.chart}
        />
      </Card>
    );
  };

  const renderTopServices = () => (
    <Card style={styles.topServicesCard}>
      <Text style={styles.chartTitle}>Top Performing Services</Text>
      {analyticsData?.topServices.map((service, index) => (
        <View key={service.name} style={styles.serviceItem}>
          <View style={styles.serviceRank}>
            <Text style={styles.rankText}>{index + 1}</Text>
          </View>
          <View style={styles.serviceInfo}>
            <Text style={styles.serviceName}>{service.name}</Text>
            <Text style={styles.serviceStats}>
              {service.bookings} bookings • ₹{service.revenue.toLocaleString()}
            </Text>
          </View>
          <View style={styles.servicePercentage}>
            <Text style={styles.percentageText}>
              {Math.round((service.bookings / (analyticsData?.totalBookings || 1)) * 100)}%
            </Text>
          </View>
        </View>
      ))}
    </Card>
  );

  const renderCustomerMetrics = () => (
    <View style={styles.metricsRow}>
      <Card style={styles.metricCard}>
        <Text style={styles.metricTitle}>Customer Metrics</Text>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>New Customers</Text>
          <Text style={styles.metricValue}>{analyticsData?.customerMetrics.newCustomers}</Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Returning Customers</Text>
          <Text style={styles.metricValue}>{analyticsData?.customerMetrics.returningCustomers}</Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Total Customers</Text>
          <Text style={styles.metricValue}>{analyticsData?.customerMetrics.totalCustomers}</Text>
        </View>
      </Card>

      <Card style={styles.metricCard}>
        <Text style={styles.metricTitle}>Provider Metrics</Text>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Total Providers</Text>
          <Text style={styles.metricValue}>{analyticsData?.providerMetrics.totalProviders}</Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Active Providers</Text>
          <Text style={styles.metricValue}>{analyticsData?.providerMetrics.activeProviders}</Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Avg Provider Rating</Text>
          <Text style={styles.metricValue}>{analyticsData?.providerMetrics.avgProviderRating}</Text>
        </View>
      </Card>
    </View>
  );

  if (loading) {
    return <LoadingOverlay visible={true} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Analytics Dashboard</Text>
        <TouchableOpacity>
          <Ionicons name="download-outline" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      {/* Time Range Selector */}
      <View style={styles.timeRangeContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {timeRanges.map((range) => (
            <TouchableOpacity
              key={range.key}
              style={[
                styles.timeRangeButton,
                selectedTimeRange === range.key && styles.timeRangeButtonActive
              ]}
              onPress={() => setSelectedTimeRange(range.key as any)}
            >
              <Text style={[
                styles.timeRangeText,
                selectedTimeRange === range.key && styles.timeRangeTextActive
              ]}>
                {range.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Overview Cards */}
        {renderOverviewCards()}

        {/* Revenue Chart */}
        {renderRevenueChart()}

        {/* Bookings Chart */}
        {renderBookingsChart()}

        {/* Service Distribution */}
        {renderServiceDistribution()}

        {/* Top Services */}
        {renderTopServices()}

        {/* Customer & Provider Metrics */}
        {renderCustomerMetrics()}
      </ScrollView>
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
  timeRangeContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  timeRangeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    backgroundColor: COLORS.background,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  timeRangeButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  timeRangeText: {
    fontSize: 14,
    color: COLORS.text,
  },
  timeRangeTextActive: {
    color: '#fff',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  overviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 16,
  },
  overviewCard: {
    width: '48%',
    padding: 16,
    marginBottom: 12,
    position: 'relative',
  },
  cardIcon: {
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  cardLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
  },
  cardTrend: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  ratingStars: {
    flexDirection: 'row',
    position: 'absolute',
    top: 16,
    right: 16,
  },
  chartCard: {
    padding: 16,
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  chart: {
    borderRadius: 16,
  },
  topServicesCard: {
    padding: 16,
    marginBottom: 16,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  serviceRank: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rankText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  serviceStats: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  servicePercentage: {
    alignItems: 'flex-end',
  },
  percentageText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metricCard: {
    width: '48%',
    padding: 16,
  },
  metricTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  metricItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  metricLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
});

export default AnalyticsDashboardScreen;
