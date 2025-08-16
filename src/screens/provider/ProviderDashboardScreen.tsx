import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONTS, FONT_SIZES } from '../../constants/theme';
import Card from '../../components/Card';
import Button from '../../components/Button';
import LoadingOverlay from '../../components/LoadingOverlay';

interface ProviderStats {
  totalJobs: number;
  completedJobs: number;
  rating: number;
  totalEarnings: number;
  monthlyEarnings: number;
  pendingJobs: number;
}

interface Job {
  id: string;
  title: string;
  customer: string;
  address: string;
  date: string;
  time: string;
  amount: number;
  status: 'pending' | 'accepted' | 'in-progress' | 'completed' | 'cancelled';
  urgent?: boolean;
}

const ProviderDashboardScreen: React.FC = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  const providerStats: ProviderStats = {
    totalJobs: 145,
    completedJobs: 138,
    rating: 4.8,
    totalEarnings: 45600,
    monthlyEarnings: 8900,
    pendingJobs: 3,
  };

  const recentJobs: Job[] = [
    {
      id: '1',
      title: 'House Cleaning',
      customer: 'Priya Sharma',
      address: 'Bandra West, Mumbai',
      date: '2024-01-15',
      time: '10:00 AM',
      amount: 800,
      status: 'pending',
      urgent: true,
    },
    {
      id: '2',
      title: 'AC Repair',
      customer: 'Rajesh Kumar',
      address: 'Andheri East, Mumbai',
      date: '2024-01-15',
      time: '2:00 PM',
      amount: 1200,
      status: 'accepted',
    },
    {
      id: '3',
      title: 'Plumbing Service',
      customer: 'Meera Patel',
      address: 'Powai, Mumbai',
      date: '2024-01-16',
      time: '11:00 AM',
      amount: 950,
      status: 'pending',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#FF9800';
      case 'accepted':
      case 'in-progress':
        return COLORS.primary;
      case 'completed':
        return '#4CAF50';
      case 'cancelled':
        return '#F44336';
      default:
        return COLORS.textSecondary;
    }
  };

  const handleJobAction = (job: Job, action: 'accept' | 'reject' | 'start' | 'complete') => {
    Alert.alert(
      `${action.charAt(0).toUpperCase() + action.slice(1)} Job`,
      `Are you sure you want to ${action} this job?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: action.charAt(0).toUpperCase() + action.slice(1),
          onPress: async () => {
            setLoading(true);
            // Mock API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            setLoading(false);
            Alert.alert('Success', `Job ${action}ed successfully!`);
          }
        },
      ]
    );
  };

  const toggleOnlineStatus = () => {
    setIsOnline(!isOnline);
    Alert.alert(
      isOnline ? 'Going Offline' : 'Going Online',
      `You are now ${isOnline ? 'offline' : 'online'}. ${isOnline ? 'You will not receive new job requests.' : 'You can now receive new job requests.'}`,
      [{ text: 'OK' }]
    );
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
        <Text style={styles.title}>Provider Dashboard</Text>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Online Status */}
        <Card style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <Text style={styles.statusTitle}>
              You are {isOnline ? 'Online' : 'Offline'}
            </Text>
            <TouchableOpacity
              style={[styles.statusToggle, isOnline && styles.statusToggleOn]}
              onPress={toggleOnlineStatus}
            >
              <View style={[styles.statusToggleCircle, isOnline && styles.statusToggleCircleOn]} />
            </TouchableOpacity>
          </View>
          <Text style={styles.statusDescription}>
            {isOnline 
              ? 'You are visible to customers and can receive job requests'
              : 'Turn on to start receiving job requests'
            }
          </Text>
        </Card>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>₹{providerStats.monthlyEarnings.toLocaleString()}</Text>
            <Text style={styles.statLabel}>This Month</Text>
            <View style={styles.statChange}>
              <Ionicons name="trending-up" size={16} color="#4CAF50" />
              <Text style={styles.statChangeText}>+12%</Text>
            </View>
          </Card>

          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{providerStats.completedJobs}</Text>
            <Text style={styles.statLabel}>Jobs Completed</Text>
            <View style={styles.statBadge}>
              <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
            </View>
          </Card>

          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{providerStats.rating}</Text>
            <Text style={styles.statLabel}>Average Rating</Text>
            <View style={styles.ratingStars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons
                  key={star}
                  name={star <= Math.floor(providerStats.rating) ? 'star' : 'star-outline'}
                  size={14}
                  color="#FFD700"
                />
              ))}
            </View>
          </Card>

          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{providerStats.pendingJobs}</Text>
            <Text style={styles.statLabel}>Pending Jobs</Text>
            {providerStats.pendingJobs > 0 && (
              <View style={styles.pendingBadge}>
                <Text style={styles.pendingBadgeText}>Action Required</Text>
              </View>
            )}
          </Card>
        </View>

        {/* Recent Jobs */}
        <Card style={styles.recentJobsCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Recent Jobs</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {recentJobs.map((job) => (
            <View key={job.id} style={styles.jobItem}>
              <View style={styles.jobHeader}>
                <View>
                  <Text style={styles.jobTitle}>{job.title}</Text>
                  {job.urgent && (
                    <View style={styles.urgentBadge}>
                      <Ionicons name="flash" size={12} color="#fff" />
                      <Text style={styles.urgentText}>Urgent</Text>
                    </View>
                  )}
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(job.status) + '20' }]}>
                  <Text style={[styles.statusBadgeText, { color: getStatusColor(job.status) }]}>
                    {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                  </Text>
                </View>
              </View>
              <Text style={styles.jobCustomer}>{job.customer}</Text>
              <Text style={styles.jobDetails}>{job.address}</Text>
              <View style={styles.jobFooter}>
                <Text style={styles.jobAmount}>₹{job.amount}</Text>
                <Text style={styles.jobTime}>{job.date} • {job.time}</Text>
              </View>
              
              {/* Job Actions */}
              {job.status === 'pending' && (
                <View style={styles.jobActions}>
                  <Button
                    title="Accept"
                    variant="primary"
                    onPress={() => handleJobAction(job, 'accept')}
                    style={styles.actionBtn}
                  />
                  <Button
                    title="Reject"
                    variant="outline"
                    onPress={() => handleJobAction(job, 'reject')}
                    style={styles.actionBtn}
                  />
                </View>
              )}
            </View>
          ))}
        </Card>

        {/* Quick Actions */}
        <Card style={styles.actionsCard}>
          <Text style={styles.cardTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="calendar" size={24} color={COLORS.primary} />
              <Text style={styles.actionText}>Schedule</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="card" size={24} color={COLORS.primary} />
              <Text style={styles.actionText}>Earnings</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="person" size={24} color={COLORS.primary} />
              <Text style={styles.actionText}>Profile</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="help-circle" size={24} color={COLORS.primary} />
              <Text style={styles.actionText}>Support</Text>
            </TouchableOpacity>
          </View>
        </Card>
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
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  statusCard: {
    padding: 16,
    marginBottom: 16,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  statusToggle: {
    width: 50,
    height: 28,
    backgroundColor: '#E0E0E0',
    borderRadius: 14,
    padding: 2,
    justifyContent: 'center',
  },
  statusToggleOn: {
    backgroundColor: COLORS.primary,
  },
  statusToggleCircle: {
    width: 24,
    height: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusToggleCircleOn: {
    alignSelf: 'flex-end',
  },
  statusDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    width: '48%',
    padding: 16,
    marginBottom: 8,
    position: 'relative',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
  },
  statChange: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statChangeText: {
    fontSize: 12,
    color: '#4CAF50',
    marginLeft: 4,
    fontWeight: '500',
  },
  statBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  ratingStars: {
    flexDirection: 'row',
    position: 'absolute',
    top: 12,
    right: 12,
  },
  pendingBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  pendingBadgeText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '500',
  },
  recentJobsCard: {
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  viewAllText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
  },
  jobItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  jobHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  urgentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  urgentText: {
    fontSize: 10,
    color: '#fff',
    marginLeft: 2,
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  jobCustomer: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 4,
  },
  jobDetails: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  jobFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  jobAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  jobTime: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  jobActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    flex: 1,
  },
  actionsCard: {
    padding: 16,
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  actionButton: {
    width: '48%',
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    color: COLORS.text,
    marginTop: 4,
    textAlign: 'center',
  },
});

export default ProviderDashboardScreen;
