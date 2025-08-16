import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { theme } from '../../theme/theme';
import Button from '../../components/Button';
import { CustomerStackParamList } from '../../types';

type ServiceListNavigationProp = StackNavigationProp<CustomerStackParamList>;
import LoadingOverlay from '../../components/LoadingOverlay';

interface Service {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  rating: number;
  reviewCount: number;
  providerCount: number;
  image: string;
  tags: string[];
  popular: boolean;
}

interface Filter {
  id: string;
  name: string;
  selected: boolean;
}

const ServiceListScreen: React.FC = () => {
  const navigation = useNavigation<ServiceListNavigationProp>();
  const route = useRoute<any>();
  const { categoryId, categoryName } = route.params as { categoryId: string; categoryName: string };

  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'price' | 'rating'>('popular');
  const [filters, setFilters] = useState<Filter[]>([]);

  useEffect(() => {
    fetchServices();
    initializeFilters();
  }, [categoryId]);

  useEffect(() => {
    applyFiltersAndSort();
  }, [services, searchQuery, sortBy, filters]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      
      // Mock data for demo - replace with API call
      const mockServices: Service[] = [
        {
          id: '1',
          categoryId: categoryId,
          name: 'Deep Home Cleaning',
          description: 'Comprehensive deep cleaning service for your entire home including all rooms, bathrooms, and kitchen',
          price: 2500,
          duration: '3-4 hours',
          rating: 4.8,
          reviewCount: 245,
          providerCount: 12,
          image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300',
          tags: ['Popular', 'Eco-friendly', 'Same Day'],
          popular: true,
        },
        {
          id: '2',
          categoryId: categoryId,
          name: 'Regular House Cleaning',
          description: 'Weekly or bi-weekly cleaning service to maintain your home\'s cleanliness',
          price: 1800,
          duration: '2-3 hours',
          rating: 4.6,
          reviewCount: 189,
          providerCount: 18,
          image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300',
          tags: ['Weekly', 'Affordable'],
          popular: true,
        },
        {
          id: '3',
          categoryId: categoryId,
          name: 'Kitchen Deep Clean',
          description: 'Specialized deep cleaning for kitchen including appliances, cabinets, and countertops',
          price: 1200,
          duration: '2 hours',
          rating: 4.7,
          reviewCount: 156,
          providerCount: 8,
          image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300',
          tags: ['Specialized', 'Appliances'],
          popular: false,
        },
        {
          id: '4',
          categoryId: categoryId,
          name: 'Bathroom Cleaning',
          description: 'Complete bathroom sanitization and cleaning service',
          price: 800,
          duration: '1 hour',
          rating: 4.5,
          reviewCount: 98,
          providerCount: 15,
          image: 'https://images.unsplash.com/photo-1584622781564-1d987add7afa?w=300',
          tags: ['Sanitization', 'Quick'],
          popular: false,
        },
        {
          id: '5',
          categoryId: categoryId,
          name: 'Move-in/Move-out Cleaning',
          description: 'Comprehensive cleaning service for when you\'re moving in or out of a property',
          price: 3500,
          duration: '4-6 hours',
          rating: 4.9,
          reviewCount: 67,
          providerCount: 6,
          image: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=300',
          tags: ['Moving', 'Deep Clean'],
          popular: false,
        },
      ];

      setServices(mockServices);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const initializeFilters = () => {
    const mockFilters: Filter[] = [
      { id: '1', name: 'Popular', selected: false },
      { id: '2', name: 'Same Day', selected: false },
      { id: '3', name: 'Eco-friendly', selected: false },
      { id: '4', name: 'Under ₹1000', selected: false },
      { id: '5', name: 'Under ₹2000', selected: false },
    ];
    setFilters(mockFilters);
  };

  const applyFiltersAndSort = () => {
    let filtered = services.filter(service =>
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Apply filters
    const activeFilters = filters.filter(f => f.selected);
    if (activeFilters.length > 0) {
      filtered = filtered.filter(service => {
        return activeFilters.some(filter => {
          switch (filter.name) {
            case 'Popular':
              return service.popular;
            case 'Same Day':
              return service.tags.includes('Same Day');
            case 'Eco-friendly':
              return service.tags.includes('Eco-friendly');
            case 'Under ₹1000':
              return service.price < 1000;
            case 'Under ₹2000':
              return service.price < 2000;
            default:
              return false;
          }
        });
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price;
        case 'rating':
          return b.rating - a.rating;
        case 'popular':
        default:
          return b.reviewCount - a.reviewCount;
      }
    });

    setFilteredServices(filtered);
  };

  const toggleFilter = (filterId: string) => {
    setFilters(prev => prev.map(filter => 
      filter.id === filterId 
        ? { ...filter, selected: !filter.selected }
        : filter
    ));
  };

  const handleServicePress = (service: Service) => {
    navigation.navigate('ServiceDetail', { serviceId: service.id });
  };

  const renderServiceCard = ({ item }: { item: Service }) => (
    <TouchableOpacity
      style={styles.serviceCard}
      onPress={() => handleServicePress(item)}
    >
      <Image source={{ uri: item.image }} style={styles.serviceImage} />
      <View style={styles.serviceContent}>
        <View style={styles.serviceHeader}>
          <Text style={styles.serviceName}>{item.name}</Text>
          {item.popular && <View style={styles.popularBadge}>
            <Text style={styles.popularText}>Popular</Text>
          </View>}
        </View>
        <Text style={styles.serviceDescription}>{item.description}</Text>
        
        <View style={styles.tagsContainer}>
          {item.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>

        <View style={styles.serviceStats}>
          <View style={styles.statItem}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.statText}>{item.rating}</Text>
            <Text style={styles.statSubtext}>({item.reviewCount})</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="time" size={16} color={theme.colors.textSecondary} />
            <Text style={styles.statText}>{item.duration}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="people" size={16} color={theme.colors.textSecondary} />
            <Text style={styles.statText}>{item.providerCount} providers</Text>
          </View>
        </View>

        <View style={styles.serviceFooter}>
          <Text style={styles.servicePrice}>₹{item.price}</Text>
          <Button
            title="Book Now"
            variant="primary"
            size="small"
            onPress={() => handleServicePress(item)}
          />
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderFilterChip = ({ item }: { item: Filter }) => (
    <TouchableOpacity
      style={[styles.filterChip, item.selected && styles.filterChipSelected]}
      onPress={() => toggleFilter(item.id)}
    >
      <Text style={[
        styles.filterChipText,
        item.selected && styles.filterChipTextSelected
      ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
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
        <Text style={styles.title}>{categoryName}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('CustomerSearch', { category: categoryName })}>
          <Ionicons name="search" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color={theme.colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search services..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={theme.colors.textSecondary}
          />
        </View>
      </View>

      {/* Sort and Filter Controls */}
      <View style={styles.controlsContainer}>
        <View style={styles.sortContainer}>
          <Text style={styles.sortLabel}>Sort by:</Text>
          <TouchableOpacity
            style={[styles.sortButton, sortBy === 'popular' && styles.sortButtonActive]}
            onPress={() => setSortBy('popular')}
          >
            <Text style={[styles.sortButtonText, sortBy === 'popular' && styles.sortButtonTextActive]}>
              Popular
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortButton, sortBy === 'price' && styles.sortButtonActive]}
            onPress={() => setSortBy('price')}
          >
            <Text style={[styles.sortButtonText, sortBy === 'price' && styles.sortButtonTextActive]}>
              Price
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortButton, sortBy === 'rating' && styles.sortButtonActive]}
            onPress={() => setSortBy('rating')}
          >
            <Text style={[styles.sortButtonText, sortBy === 'rating' && styles.sortButtonTextActive]}>
              Rating
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter Chips */}
      <FlatList
        data={filters}
        renderItem={renderFilterChip}
        keyExtractor={(item: any) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterContainer}
      />

      {/* Results Count */}
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsText}>
          {filteredServices.length} service{filteredServices.length !== 1 ? 's' : ''} found
        </Text>
      </View>

      {/* Services List */}
      <FlatList
        data={filteredServices}
        renderItem={renderServiceCard}
        keyExtractor={(item: any) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.servicesList}
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
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  searchContainer: {
    padding: 20,
    paddingBottom: 0,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: theme.colors.text,
  },
  controlsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sortLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text,
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: theme.colors.border,
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
  filterContainer: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
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
  resultsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  resultsText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  servicesList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  serviceCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  serviceImage: {
    width: '100%',
    height: 120,
  },
  serviceContent: {
    padding: 16,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: '600',
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
  serviceDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  tag: {
    backgroundColor: theme.colors.background,
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
  serviceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  servicePrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
});

export default ServiceListScreen;
