import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Switch,
  Modal,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONTS, FONT_SIZES } from '../../constants/theme';
import Card from '../../components/Card';
import Button from '../../components/Button';
import LoadingOverlay from '../../components/LoadingOverlay';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: 'customer' | 'provider';
  status: 'active' | 'suspended' | 'pending';
  joinDate: string;
  totalBookings?: number;
  rating?: number;
  services?: string[];
}

interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  isActive: boolean;
  serviceCount: number;
  description: string;
}

interface SystemConfig {
  id: string;
  key: string;
  value: string;
  type: 'string' | 'number' | 'boolean' | 'json';
  description: string;
  category: string;
}

interface ContentItem {
  id: string;
  type: 'banner' | 'promotion' | 'notification' | 'policy';
  title: string;
  content: string;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  targetAudience: 'all' | 'customers' | 'providers';
}

const AdminManagementScreen: React.FC = () => {
  const navigation = useNavigation();
  
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'users' | 'services' | 'content' | 'config'>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [services, setServices] = useState<ServiceCategory[]>([]);
  const [configs, setConfigs] = useState<SystemConfig[]>([]);
  const [content, setContent] = useState<ContentItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<SystemConfig | null>(null);

  // New service form state
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    icon: 'home',
  });

  // Mock data
  const mockUsers: User[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+91 9876543210',
      type: 'customer',
      status: 'active',
      joinDate: '2024-01-15',
      totalBookings: 15,
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+91 9876543211',
      type: 'provider',
      status: 'active',
      joinDate: '2024-02-01',
      totalBookings: 45,
      rating: 4.8,
      services: ['House Cleaning', 'Deep Cleaning'],
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike@example.com',
      phone: '+91 9876543212',
      type: 'customer',
      status: 'suspended',
      joinDate: '2024-01-20',
      totalBookings: 3,
    },
  ];

  const mockServices: ServiceCategory[] = [
    {
      id: '1',
      name: 'Home Cleaning',
      icon: 'home',
      isActive: true,
      serviceCount: 12,
      description: 'Professional home cleaning services',
    },
    {
      id: '2',
      name: 'Appliance Repair',
      icon: 'build',
      isActive: true,
      serviceCount: 8,
      description: 'Repair and maintenance of home appliances',
    },
    {
      id: '3',
      name: 'Plumbing',
      icon: 'water',
      isActive: false,
      serviceCount: 5,
      description: 'Plumbing installation and repair services',
    },
  ];

  const mockConfigs: SystemConfig[] = [
    {
      id: '1',
      key: 'platform_commission',
      value: '15',
      type: 'number',
      description: 'Platform commission percentage',
      category: 'billing',
    },
    {
      id: '2',
      key: 'min_booking_amount',
      value: '100',
      type: 'number',
      description: 'Minimum booking amount in INR',
      category: 'booking',
    },
    {
      id: '3',
      key: 'auto_assign_providers',
      value: 'true',
      type: 'boolean',
      description: 'Enable automatic provider assignment',
      category: 'booking',
    },
    {
      id: '4',
      key: 'support_email',
      value: 'support@gharsathi.com',
      type: 'string',
      description: 'Customer support email address',
      category: 'contact',
    },
  ];

  const mockContent: ContentItem[] = [
    {
      id: '1',
      type: 'banner',
      title: 'New Year Special',
      content: '50% off on all cleaning services',
      isActive: true,
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      targetAudience: 'customers',
    },
    {
      id: '2',
      type: 'notification',
      title: 'App Update Available',
      content: 'Please update to the latest version for better experience',
      isActive: true,
      targetAudience: 'all',
    },
  ];

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Mock API calls
      await new Promise(resolve => setTimeout(resolve, 500));
      setUsers(mockUsers);
      setServices(mockServices);
      setConfigs(mockConfigs);
      setContent(mockContent);
    } catch (error) {
      Alert.alert('Error', 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = (user: User, action: 'suspend' | 'activate' | 'delete') => {
    Alert.alert(
      'Confirm Action',
      `Are you sure you want to ${action} user ${user.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes',
          onPress: async () => {
            setLoading(true);
            try {
              await new Promise(resolve => setTimeout(resolve, 1000));
              
              if (action === 'delete') {
                setUsers(prev => prev.filter(u => u.id !== user.id));
              } else {
                const newStatus = action === 'suspend' ? 'suspended' : 'active';
                setUsers(prev =>
                  prev.map(u =>
                    u.id === user.id ? { ...u, status: newStatus } : u
                  )
                );
              }
              
              Alert.alert('Success', `User ${action}d successfully`);
            } catch (error) {
              Alert.alert('Error', `Failed to ${action} user`);
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleServiceToggle = async (serviceId: string, isActive: boolean) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setServices(prev =>
        prev.map(service =>
          service.id === serviceId ? { ...service, isActive } : service
        )
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to update service status');
    } finally {
      setLoading(false);
    }
  };

  const handleAddService = async () => {
    if (!newService.name || !newService.description) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const service: ServiceCategory = {
        id: Date.now().toString(),
        name: newService.name,
        icon: newService.icon,
        isActive: true,
        serviceCount: 0,
        description: newService.description,
      };

      setServices(prev => [...prev, service]);
      setNewService({ name: '', description: '', icon: 'home' });
      setShowAddServiceModal(false);
      Alert.alert('Success', 'Service category added successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to add service category');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateConfig = async (config: SystemConfig, newValue: string) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setConfigs(prev =>
        prev.map(c =>
          c.id === config.id ? { ...c, value: newValue } : c
        )
      );
      setSelectedConfig(null);
      setShowConfigModal(false);
      Alert.alert('Success', 'Configuration updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update configuration');
    } finally {
      setLoading(false);
    }
  };

  const renderTabBar = () => (
    <View style={styles.tabBar}>
      {[
        { key: 'users', title: 'Users', icon: 'people' },
        { key: 'services', title: 'Services', icon: 'list' },
        { key: 'content', title: 'Content', icon: 'document-text' },
        { key: 'config', title: 'Config', icon: 'settings' },
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
  );

  const renderUsersTab = () => (
    <View style={styles.tabContent}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search users..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        data={users.filter(user =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase())
        )}
        keyExtractor={(item: User) => item.id}
        renderItem={({ item: user }: { item: User }) => (
          <Card style={styles.userCard}>
            <View style={styles.userHeader}>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
                <View style={styles.userMeta}>
                  <Text style={styles.userType}>{user.type}</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor:
                          user.status === 'active'
                            ? '#4CAF50'
                            : user.status === 'suspended'
                            ? '#FF9800'
                            : '#9E9E9E',
                      },
                    ]}
                  >
                    <Text style={styles.statusText}>{user.status}</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setSelectedUser(user);
                  setShowUserModal(true);
                }}
              >
                <Ionicons name="ellipsis-vertical" size={20} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.userStats}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Bookings</Text>
                <Text style={styles.statValue}>{user.totalBookings || 0}</Text>
              </View>
              {user.rating && (
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Rating</Text>
                  <Text style={styles.statValue}>{user.rating}⭐</Text>
                </View>
              )}
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Joined</Text>
                <Text style={styles.statValue}>{user.joinDate}</Text>
              </View>
            </View>
          </Card>
        )}
      />
    </View>
  );

  const renderServicesTab = () => (
    <View style={styles.tabContent}>
      <Button
        title="Add Service Category"
        variant="primary"
        onPress={() => setShowAddServiceModal(true)}
        style={styles.addButton}
      />

      <FlatList
        data={services}
        keyExtractor={(item: ServiceCategory) => item.id}
        renderItem={({ item: service }: { item: ServiceCategory }) => (
          <Card style={styles.serviceCard}>
            <View style={styles.serviceHeader}>
              <View style={styles.serviceIcon}>
                <Ionicons name={service.icon as any} size={24} color={COLORS.primary} />
              </View>
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceName}>{service.name}</Text>
                <Text style={styles.serviceDescription}>{service.description}</Text>
                <Text style={styles.serviceCount}>{service.serviceCount} services</Text>
              </View>
              <Switch
                value={service.isActive}
                onValueChange={(value: boolean) => handleServiceToggle(service.id, value)}
                trackColor={{ false: '#E0E0E0', true: COLORS.primary + '30' }}
                thumbColor={service.isActive ? COLORS.primary : '#f4f3f4'}
              />
            </View>
          </Card>
        )}
      />
    </View>
  );

  const renderContentTab = () => (
    <View style={styles.tabContent}>
      <Button
        title="Create Content"
        variant="primary"
        onPress={() => Alert.alert('Info', 'Content creation feature coming soon')}
        style={styles.addButton}
      />

      <FlatList
        data={content}
        keyExtractor={(item: ContentItem) => item.id}
        renderItem={({ item }: { item: ContentItem }) => (
          <Card style={styles.contentCard}>
            <View style={styles.contentHeader}>
              <View style={styles.contentType}>
                <Text style={styles.contentTypeText}>{item.type}</Text>
              </View>
              <Switch
                value={item.isActive}
                onValueChange={(value: boolean) => {
                  setContent(prev =>
                    prev.map(c => c.id === item.id ? { ...c, isActive: value } : c)
                  );
                }}
              />
            </View>
            <Text style={styles.contentTitle}>{item.title}</Text>
            <Text style={styles.contentText}>{item.content}</Text>
            <View style={styles.contentMeta}>
              <Text style={styles.contentAudience}>Target: {item.targetAudience}</Text>
              {item.startDate && (
                <Text style={styles.contentDate}>
                  {item.startDate} - {item.endDate}
                </Text>
              )}
            </View>
          </Card>
        )}
      />
    </View>
  );

  const renderConfigTab = () => (
    <View style={styles.tabContent}>
      <FlatList
        data={configs}
        keyExtractor={(item: SystemConfig) => item.id}
        renderItem={({ item: config }: { item: SystemConfig }) => (
          <Card style={styles.configCard}>
            <TouchableOpacity
              onPress={() => {
                setSelectedConfig(config);
                setShowConfigModal(true);
              }}
            >
              <View style={styles.configHeader}>
                <Text style={styles.configKey}>{config.key}</Text>
                <Text style={styles.configCategory}>{config.category}</Text>
              </View>
              <Text style={styles.configDescription}>{config.description}</Text>
              <Text style={styles.configValue}>
                Current Value: {config.type === 'boolean' ? (config.value === 'true' ? 'Yes' : 'No') : config.value}
              </Text>
            </TouchableOpacity>
          </Card>
        )}
      />
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
        <Text style={styles.title}>Admin Management</Text>
        <View style={{ width: 24 }} />
      </View>

      {renderTabBar()}

      {activeTab === 'users' && renderUsersTab()}
      {activeTab === 'services' && renderServicesTab()}
      {activeTab === 'content' && renderContentTab()}
      {activeTab === 'config' && renderConfigTab()}

      {/* User Actions Modal */}
      <Modal visible={showUserModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>User Actions</Text>
            <Text style={styles.modalSubtitle}>{selectedUser?.name}</Text>
            
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                setShowUserModal(false);
                if (selectedUser) {
                  const action = selectedUser.status === 'active' ? 'suspend' : 'activate';
                  handleUserAction(selectedUser, action);
                }
              }}
            >
              <Ionicons
                name={selectedUser?.status === 'active' ? 'pause' : 'play'}
                size={20}
                color={selectedUser?.status === 'active' ? '#FF9800' : '#4CAF50'}
              />
              <Text style={styles.modalOptionText}>
                {selectedUser?.status === 'active' ? 'Suspend User' : 'Activate User'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                setShowUserModal(false);
                if (selectedUser) {
                  handleUserAction(selectedUser, 'delete');
                }
              }}
            >
              <Ionicons name="trash" size={20} color="#F44336" />
              <Text style={[styles.modalOptionText, { color: '#F44336' }]}>Delete User</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setShowUserModal(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Add Service Modal */}
      <Modal visible={showAddServiceModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Service Category</Text>
            
            <TextInput
              style={styles.modalInput}
              placeholder="Service name"
              value={newService.name}
              onChangeText={(text: string) => setNewService(prev => ({ ...prev, name: text }))}
            />
            
            <TextInput
              style={[styles.modalInput, styles.modalTextArea]}
              placeholder="Description"
              value={newService.description}
              onChangeText={(text: string) => setNewService(prev => ({ ...prev, description: text }))}
              multiline
              numberOfLines={3}
            />
            
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleAddService}
              >
                <Text style={styles.modalButtonText}>Add Service</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSecondary]}
                onPress={() => {
                  setShowAddServiceModal(false);
                  setNewService({ name: '', description: '', icon: 'home' });
                }}
              >
                <Text style={styles.modalButtonTextSecondary}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Config Edit Modal */}
      <Modal visible={showConfigModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Configuration</Text>
            <Text style={styles.modalSubtitle}>{selectedConfig?.description}</Text>
            
            {selectedConfig?.type === 'boolean' ? (
              <View style={styles.switchContainer}>
                <Text>Enable:</Text>
                <Switch
                  value={selectedConfig.value === 'true'}
                  onValueChange={(value: boolean) =>
                    handleUpdateConfig(selectedConfig, value.toString())
                  }
                />
              </View>
            ) : (
              <TextInput
                style={styles.modalInput}
                placeholder="Enter value"
                value={selectedConfig?.value}
                onChangeText={(text: string) => {
                  if (selectedConfig) {
                    handleUpdateConfig(selectedConfig, text);
                  }
                }}
                keyboardType={selectedConfig?.type === 'number' ? 'numeric' : 'default'}
              />
            )}
            
            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setShowConfigModal(false)}
            >
              <Text style={styles.modalCancelText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  searchInput: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  addButton: {
    marginVertical: 16,
  },
  userCard: {
    padding: 16,
    marginBottom: 12,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  userMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userType: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '500',
    textTransform: 'capitalize',
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  userStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 12,
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
  serviceCard: {
    padding: 16,
    marginBottom: 12,
  },
  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
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
  serviceDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  serviceCount: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '500',
  },
  contentCard: {
    padding: 16,
    marginBottom: 12,
  },
  contentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  contentType: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  contentTypeText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  contentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  contentText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  contentMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 8,
  },
  contentAudience: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '500',
  },
  contentDate: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  configCard: {
    padding: 16,
    marginBottom: 12,
  },
  configHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  configKey: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  configCategory: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  configDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
    lineHeight: 20,
  },
  configValue: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: COLORS.background,
    marginBottom: 8,
  },
  modalOptionText: {
    fontSize: 16,
    color: COLORS.text,
    marginLeft: 12,
    fontWeight: '500',
  },
  modalCancel: {
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  modalCancelText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.text,
    backgroundColor: COLORS.background,
    marginBottom: 16,
  },
  modalTextArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  modalButtonSecondary: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 0,
    marginLeft: 8,
  },
  modalButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  modalButtonTextSecondary: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '600',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    marginBottom: 16,
  },
});

export default AdminManagementScreen;
