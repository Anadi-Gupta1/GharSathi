import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../../theme/theme';
import Card from '../../components/Card';
import LoadingOverlay from '../../components/LoadingOverlay';

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'booking' | 'payment' | 'promotion' | 'system' | 'provider';
  read: boolean;
  actionRequired?: boolean;
  bookingId?: string;
}

interface NotificationSettings {
  bookingUpdates: boolean;
  promotions: boolean;
  reminders: boolean;
  providerMessages: boolean;
  systemUpdates: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
}

const NotificationsScreen: React.FC = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>({
    bookingUpdates: true,
    promotions: true,
    reminders: true,
    providerMessages: true,
    systemUpdates: true,
    emailNotifications: false,
    smsNotifications: true,
    pushNotifications: true,
  });
  const [showSettings, setShowSettings] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const mockNotifications: Notification[] = [
    {
      id: '1',
      title: 'Booking Confirmed',
      message: 'Your cleaning service booking for tomorrow at 10:00 AM has been confirmed.',
      timestamp: '2024-01-15T09:30:00Z',
      type: 'booking',
      read: false,
      actionRequired: false,
      bookingId: 'BK001',
    },
    {
      id: '2',
      title: 'Provider On The Way',
      message: 'Rajesh Kumar is on the way to your location. Estimated arrival: 15 minutes.',
      timestamp: '2024-01-15T09:15:00Z',
      type: 'provider',
      read: false,
      actionRequired: false,
      bookingId: 'BK001',
    },
    {
      id: '3',
      title: 'Payment Successful',
      message: '₹800 payment received for cleaning service. Receipt sent to your email.',
      timestamp: '2024-01-15T11:30:00Z',
      type: 'payment',
      read: true,
      actionRequired: false,
    },
    {
      id: '4',
      title: 'Special Offer - 20% Off',
      message: 'Get 20% off on your next home cleaning service. Valid till January 31st.',
      timestamp: '2024-01-14T14:00:00Z',
      type: 'promotion',
      read: true,
      actionRequired: false,
    },
    {
      id: '5',
      title: 'Rate Your Service',
      message: 'How was your cleaning service? Please rate and review your experience.',
      timestamp: '2024-01-15T12:00:00Z',
      type: 'system',
      read: false,
      actionRequired: true,
      bookingId: 'BK001',
    },
    {
      id: '6',
      title: 'Booking Reminder',
      message: 'Don\'t forget! Your plumbing service is scheduled for tomorrow at 2:00 PM.',
      timestamp: '2024-01-14T18:00:00Z',
      type: 'booking',
      read: true,
      actionRequired: false,
      bookingId: 'BK002',
    },
    {
      id: '7',
      title: 'App Update Available',
      message: 'New features available! Update GharSathi to version 2.1.0 for better experience.',
      timestamp: '2024-01-13T10:00:00Z',
      type: 'system',
      read: true,
      actionRequired: false,
    },
  ];

  const filterOptions = [
    { id: 'all', label: 'All', count: mockNotifications.length },
    { id: 'unread', label: 'Unread', count: mockNotifications.filter(n => !n.read).length },
    { id: 'booking', label: 'Bookings', count: mockNotifications.filter(n => n.type === 'booking').length },
    { id: 'promotion', label: 'Offers', count: mockNotifications.filter(n => n.type === 'promotion').length },
  ];

  useEffect(() => {
    setNotifications(mockNotifications);
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return 'calendar';
      case 'payment':
        return 'card';
      case 'promotion':
        return 'gift';
      case 'provider':
        return 'person';
      case 'system':
        return 'information-circle';
      default:
        return 'notifications';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'booking':
        return theme.colors.primary;
      case 'payment':
        return '#4CAF50';
      case 'promotion':
        return '#FF9800';
      case 'provider':
        return '#9C27B0';
      case 'system':
        return '#607D8B';
      default:
        return theme.colors.textSecondary;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else if (diffInMinutes < 10080) {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const handleNotificationPress = (notification: Notification) => {
    // Mark as read
    setNotifications(prev => 
      prev.map(n => 
        n.id === notification.id ? { ...n, read: true } : n
      )
    );

    if (notification.actionRequired) {
      if (notification.bookingId) {
        Alert.alert(
          'Action Required',
          notification.message,
          [
            { text: 'Later', style: 'cancel' },
            { 
              text: 'Take Action', 
              onPress: () => {
                // Navigate to relevant screen based on notification type
                // navigation.navigate('BookingDetail', { bookingId: notification.bookingId });
              }
            },
          ]
        );
      }
    }
  };

  const markAllAsRead = () => {
    Alert.alert(
      'Mark All as Read',
      'Are you sure you want to mark all notifications as read?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Mark All',
          onPress: () => {
            setNotifications(prev => 
              prev.map(n => ({ ...n, read: true }))
            );
          }
        },
      ]
    );
  };

  const clearAllNotifications = () => {
    Alert.alert(
      'Clear All Notifications',
      'This will permanently delete all notifications. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear All',
          style: 'destructive',
          onPress: () => setNotifications([])
        },
      ]
    );
  };

  const updateSetting = (key: keyof NotificationSettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const filteredNotifications = notifications.filter(notification => {
    switch (selectedFilter) {
      case 'unread':
        return !notification.read;
      case 'booking':
        return notification.type === 'booking';
      case 'promotion':
        return notification.type === 'promotion';
      default:
        return true;
    }
  });

  const renderNotification = (notification: Notification) => (
    <TouchableOpacity
      key={notification.id}
      style={[
        styles.notificationItem,
        !notification.read && styles.unreadNotification
      ]}
      onPress={() => handleNotificationPress(notification)}
      activeOpacity={0.7}
    >
      <View style={styles.notificationIcon}>
        <Ionicons
          name={getNotificationIcon(notification.type) as any}
          size={24}
          color={getNotificationColor(notification.type)}
        />
        {!notification.read && <View style={styles.unreadDot} />}
      </View>
      
      <View style={styles.notificationContent}>
        <Text style={[
          styles.notificationTitle,
          !notification.read && styles.unreadTitle
        ]}>
          {notification.title}
        </Text>
        <Text style={styles.notificationMessage} numberOfLines={2}>
          {notification.message}
        </Text>
        <Text style={styles.notificationTime}>
          {formatTimestamp(notification.timestamp)}
        </Text>
      </View>

      {notification.actionRequired && (
        <View style={styles.actionRequired}>
          <Ionicons name="alert-circle" size={16} color="#FF6B6B" />
        </View>
      )}
    </TouchableOpacity>
  );

  const renderSettingsSection = () => (
    <Card style={styles.settingsCard}>
      <Text style={styles.sectionTitle}>Notification Settings</Text>
      
      <View style={styles.settingGroup}>
        <Text style={styles.settingGroupTitle}>Push Notifications</Text>
        
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Booking Updates</Text>
          <Switch
            value={settings.bookingUpdates}
            onValueChange={(value: boolean) => updateSetting('bookingUpdates', value)}
            trackColor={{ false: '#E0E0E0', true: theme.colors.primary + '30' }}
            thumbColor={settings.bookingUpdates ? theme.colors.primary : '#f4f3f4'}
          />
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Promotional Offers</Text>
          <Switch
            value={settings.promotions}
            onValueChange={(value: boolean) => updateSetting('promotions', value)}
            trackColor={{ false: '#E0E0E0', true: theme.colors.primary + '30' }}
            thumbColor={settings.promotions ? theme.colors.primary : '#f4f3f4'}
          />
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Reminders</Text>
          <Switch
            value={settings.reminders}
            onValueChange={(value: boolean) => updateSetting('reminders', value)}
            trackColor={{ false: '#E0E0E0', true: theme.colors.primary + '30' }}
            thumbColor={settings.reminders ? theme.colors.primary : '#f4f3f4'}
          />
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Provider Messages</Text>
          <Switch
            value={settings.providerMessages}
            onValueChange={(value: boolean) => updateSetting('providerMessages', value)}
            trackColor={{ false: '#E0E0E0', true: theme.colors.primary + '30' }}
            thumbColor={settings.providerMessages ? theme.colors.primary : '#f4f3f4'}
          />
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>System Updates</Text>
          <Switch
            value={settings.systemUpdates}
            onValueChange={(value: boolean) => updateSetting('systemUpdates', value)}
            trackColor={{ false: '#E0E0E0', true: theme.colors.primary + '30' }}
            thumbColor={settings.systemUpdates ? theme.colors.primary : '#f4f3f4'}
          />
        </View>
      </View>

      <View style={styles.settingGroup}>
        <Text style={styles.settingGroupTitle}>Other Notifications</Text>
        
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Email Notifications</Text>
          <Switch
            value={settings.emailNotifications}
            onValueChange={(value: boolean) => updateSetting('emailNotifications', value)}
            trackColor={{ false: '#E0E0E0', true: theme.colors.primary + '30' }}
            thumbColor={settings.emailNotifications ? theme.colors.primary : '#f4f3f4'}
          />
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>SMS Notifications</Text>
          <Switch
            value={settings.smsNotifications}
            onValueChange={(value: boolean) => updateSetting('smsNotifications', value)}
            trackColor={{ false: '#E0E0E0', true: theme.colors.primary + '30' }}
            thumbColor={settings.smsNotifications ? theme.colors.primary : '#f4f3f4'}
          />
        </View>
      </View>
    </Card>
  );

  if (loading) {
    return <LoadingOverlay visible={true} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Notifications</Text>
        <TouchableOpacity onPress={() => setShowSettings(!showSettings)}>
          <Ionicons 
            name="settings-outline" 
            size={24} 
            color={theme.colors.text} 
          />
        </TouchableOpacity>
      </View>

      {!showSettings ? (
        <>
          {/* Filter Tabs */}
          <View style={styles.filterTabs}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {filterOptions.map((filter) => (
                <TouchableOpacity
                  key={filter.id}
                  style={[
                    styles.filterTab,
                    selectedFilter === filter.id && styles.activeFilterTab
                  ]}
                  onPress={() => setSelectedFilter(filter.id)}
                >
                  <Text style={[
                    styles.filterTabText,
                    selectedFilter === filter.id && styles.activeFilterTabText
                  ]}>
                    {filter.label}
                  </Text>
                  {filter.count > 0 && (
                    <View style={[
                      styles.filterBadge,
                      selectedFilter === filter.id && styles.activeFilterBadge
                    ]}>
                      <Text style={[
                        styles.filterBadgeText,
                        selectedFilter === filter.id && styles.activeFilterBadgeText
                      ]}>
                        {filter.count}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Action Buttons */}
          {notifications.length > 0 && (
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={markAllAsRead}
              >
                <Ionicons name="checkmark-done" size={16} color={theme.colors.primary} />
                <Text style={styles.actionButtonText}>Mark All Read</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={clearAllNotifications}
              >
                <Ionicons name="trash-outline" size={16} color="#FF6B6B" />
                <Text style={[styles.actionButtonText, { color: '#FF6B6B' }]}>Clear All</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Notifications List */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {filteredNotifications.length > 0 ? (
              <Card style={styles.notificationsCard}>
                {filteredNotifications.map(renderNotification)}
              </Card>
            ) : (
              <Card style={styles.emptyCard}>
                <Ionicons 
                  name="notifications-outline" 
                  size={48} 
                  color={theme.colors.textSecondary} 
                />
                <Text style={styles.emptyTitle}>No Notifications</Text>
                <Text style={styles.emptyMessage}>
                  {selectedFilter === 'all' 
                    ? 'You\'re all caught up! No notifications to show.'
                    : `No ${selectedFilter} notifications found.`
                  }
                </Text>
              </Card>
            )}
          </ScrollView>
        </>
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {renderSettingsSection()}
        </ScrollView>
      )}
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
  },
  filterTabs: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginRight: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  activeFilterTab: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterTabText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  activeFilterTabText: {
    color: '#fff',
  },
  filterBadge: {
    marginLeft: theme.spacing.xs,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.full,
    minWidth: 20,
    alignItems: 'center',
  },
  activeFilterBadge: {
    backgroundColor: '#fff',
  },
  filterBadgeText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  activeFilterBadgeText: {
    color: theme.colors.primary,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  actionButtonText: {
    fontSize: 14,
    color: theme.colors.primary,
    marginLeft: theme.spacing.xs,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
  },
  notificationsCard: {
    marginTop: theme.spacing.sm,
    padding: 0,
    overflow: 'hidden',
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  unreadNotification: {
    backgroundColor: theme.colors.primary + '05',
  },
  notificationIcon: {
    position: 'relative',
    width: 48,
    height: 48,
    backgroundColor: theme.colors.surface,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  unreadDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    backgroundColor: '#FF6B6B',
    borderRadius: 4,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  unreadTitle: {
    fontWeight: '600',
  },
  notificationMessage: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: theme.spacing.xs,
  },
  notificationTime: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  actionRequired: {
    marginLeft: theme.spacing.sm,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
    marginTop: theme.spacing.lg,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  emptyMessage: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  settingsCard: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  settingGroup: {
    marginBottom: theme.spacing.lg,
  },
  settingGroupTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  settingLabel: {
    fontSize: 15,
    color: theme.colors.text,
    flex: 1,
  },
});

export default NotificationsScreen;
