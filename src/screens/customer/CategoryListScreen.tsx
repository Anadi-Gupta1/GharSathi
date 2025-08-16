import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { theme } from '../../theme/theme';
import Button from '../../components/Button';
import LoadingOverlay from '../../components/LoadingOverlay';
import { CustomerStackParamList } from '../../types';

type CategoryListNavigationProp = StackNavigationProp<CustomerStackParamList>;

interface Category {
  id: string;
  name: string;
  icon: string;
  image: string;
  serviceCount: number;
  description: string;
  popular: boolean;
}

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
}

const CategoryListScreen: React.FC = () => {
  const navigation = useNavigation<CategoryListNavigationProp>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredServices, setFeaturedServices] = useState<Service[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      
      // Mock data for demo - replace with API call
      const mockCategories: Category[] = [
        {
          id: '1',
          name: 'Home Cleaning',
          icon: 'home',
          image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300',
          serviceCount: 15,
          description: 'Professional home cleaning services',
          popular: true,
        },
        {
          id: '2',
          name: 'Plumbing',
          icon: 'water',
          image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=300',
          serviceCount: 12,
          description: 'Expert plumbing repairs and installations',
          popular: true,
        },
        {
          id: '3',
          name: 'Electrical',
          icon: 'flash',
          image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=300',
          serviceCount: 10,
          description: 'Licensed electrical work and repairs',
          popular: false,
        },
        {
          id: '4',
          name: 'AC Service',
          icon: 'snow',
          image: 'https://images.unsplash.com/photo-1632934618015-ba778751299b?w=300',
          serviceCount: 8,
          description: 'AC installation, repair, and maintenance',
          popular: true,
        },
        {
          id: '5',
          name: 'Appliance Repair',
          icon: 'build',
          image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300',
          serviceCount: 18,
          description: 'Repair for all home appliances',
          popular: false,
        },
        {
          id: '6',
          name: 'Painting',
          icon: 'brush',
          image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=300',
          serviceCount: 7,
          description: 'Interior and exterior painting services',
          popular: false,
        },
      ];

      const mockFeaturedServices: Service[] = [
        {
          id: '1',
          categoryId: '1',
          name: 'Deep Home Cleaning',
          description: 'Comprehensive deep cleaning for your entire home',
          price: 2500,
          duration: '3-4 hours',
          rating: 4.8,
          reviewCount: 245,
          providerCount: 12,
          image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300',
        },
        {
          id: '2',
          categoryId: '2',
          name: 'Pipe Leak Repair',
          description: 'Quick and reliable pipe leak detection and repair',
          price: 800,
          duration: '1-2 hours',
          rating: 4.6,
          reviewCount: 189,
          providerCount: 8,
          image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=300',
        },
      ];

      setCategories(mockCategories);
      setFeaturedServices(mockFeaturedServices);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryPress = (category: Category) => {
    navigation.navigate('ServiceList', { categoryId: category.id, categoryName: category.name });
  };

  const handleServicePress = (service: Service) => {
    navigation.navigate('ServiceDetail', { serviceId: service.id });
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const popularCategories = categories.filter(cat => cat.popular);

  const renderCategoryCard = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={styles.categoryCard}
      onPress={() => handleCategoryPress(item)}
    >
      <View style={styles.categoryImageContainer}>
        <Image source={{ uri: item.image }} style={styles.categoryImage} />
        <View style={styles.categoryOverlay}>
          <Ionicons name={item.icon as any} size={24} color="#fff" />
        </View>
      </View>
      <View style={styles.categoryContent}>
        <Text style={styles.categoryName}>{item.name}</Text>
        <Text style={styles.categoryDescription}>{item.description}</Text>
        <Text style={styles.serviceCount}>{item.serviceCount} services</Text>
      </View>
    </TouchableOpacity>
  );

  const renderServiceCard = ({ item }: { item: Service }) => (
    <TouchableOpacity
      style={styles.serviceCard}
      onPress={() => handleServicePress(item)}
    >
      <Image source={{ uri: item.image }} style={styles.serviceImage} />
      <View style={styles.serviceContent}>
        <Text style={styles.serviceName}>{item.name}</Text>
        <Text style={styles.serviceDescription}>{item.description}</Text>
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
        </View>
        <View style={styles.serviceFooter}>
          <Text style={styles.servicePrice}>₹{item.price}</Text>
          <Text style={styles.providerCount}>{item.providerCount} providers</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return <LoadingOverlay visible={true} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Categories</Text>
        <TouchableOpacity onPress={() => navigation.navigate('CustomerSearch', {})}>
          <Ionicons name="search" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color={theme.colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for services..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={theme.colors.textSecondary}
            />
          </View>
        </View>

        {/* Popular Categories */}
        {popularCategories.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Popular Categories</Text>
            <FlatList
              data={popularCategories}
              renderItem={renderCategoryCard}
              keyExtractor={(item: Category) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            />
          </View>
        )}

        {/* Featured Services */}
        {featuredServices.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Featured Services</Text>
            <FlatList
              data={featuredServices}
              renderItem={renderServiceCard}
              keyExtractor={(item: Service) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            />
          </View>
        )}

        {/* All Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>All Categories</Text>
          <FlatList
            data={filteredCategories}
            renderItem={renderCategoryCard}
            keyExtractor={(item: Category) => item.id}
            numColumns={2}
            scrollEnabled={false}
            contentContainerStyle={styles.gridList}
            columnWrapperStyle={styles.row}
          />
        </View>
      </ScrollView>
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
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  searchContainer: {
    padding: 20,
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  horizontalList: {
    paddingHorizontal: 20,
    gap: 16,
  },
  gridList: {
    paddingHorizontal: 20,
    gap: 16,
  },
  row: {
    justifyContent: 'space-between',
  },
  categoryCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    overflow: 'hidden',
    width: 160,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoryImageContainer: {
    position: 'relative',
    height: 100,
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  categoryOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 20,
    padding: 8,
  },
  categoryContent: {
    padding: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  serviceCount: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  serviceCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    overflow: 'hidden',
    width: 280,
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
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 12,
  },
  serviceStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  serviceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  servicePrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  providerCount: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
});

export default CategoryListScreen;
