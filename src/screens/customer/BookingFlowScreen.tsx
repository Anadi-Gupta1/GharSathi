import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import DateTimePicker from '@react-native-community/datetimepicker';
import { theme } from '../../theme/theme';
import Button from '../../components/Button';
import Card from '../../components/Card';
import LoadingOverlay from '../../components/LoadingOverlay';
import { CustomerStackParamList } from '../../types';

type BookingFlowNavigationProp = StackNavigationProp<CustomerStackParamList, 'BookingFlow'>;

interface BookingData {
  serviceId: string;
  providerId?: string;
  date: Date;
  timeSlot: string;
  address: {
    street: string;
    apartment: string;
    city: string;
    pincode: string;
    landmark: string;
  };
  specialInstructions: string;
  contactNumber: string;
  alternateNumber?: string;
}

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
  price: number;
}

interface Service {
  id: string;
  name: string;
  price: number;
  duration: string;
}

const BookingFlowScreen: React.FC = () => {
  const navigation = useNavigation<BookingFlowNavigationProp>();
  const route = useRoute();
  const { serviceId, providerId } = route.params as { serviceId: string; providerId?: string };

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  const [bookingData, setBookingData] = useState<BookingData>({
    serviceId,
    providerId,
    date: new Date(),
    timeSlot: '',
    address: {
      street: '',
      apartment: '',
      city: 'Mumbai',
      pincode: '',
      landmark: '',
    },
    specialInstructions: '',
    contactNumber: '',
    alternateNumber: '',
  });

  const [service] = useState<Service>({
    id: serviceId,
    name: 'Deep Home Cleaning',
    price: 2500,
    duration: '3-4 hours',
  });

  const [timeSlots] = useState<TimeSlot[]>([
    { id: '1', time: '9:00 AM - 12:00 PM', available: true, price: 2500 },
    { id: '2', time: '12:00 PM - 3:00 PM', available: true, price: 2500 },
    { id: '3', time: '3:00 PM - 6:00 PM', available: false, price: 2500 },
    { id: '4', time: '6:00 PM - 9:00 PM', available: true, price: 2700 },
  ]);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setBookingData(prev => ({ ...prev, date: selectedDate }));
    }
  };

  const handleTimeSlotSelect = (slot: TimeSlot) => {
    if (!slot.available) return;
    setBookingData(prev => ({ ...prev, timeSlot: slot.time }));
  };

  const handleAddressChange = (field: keyof BookingData['address'], value: string) => {
    setBookingData(prev => ({
      ...prev,
      address: { ...prev.address, [field]: value }
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return bookingData.date && bookingData.timeSlot !== '';
      case 2:
        return (
          bookingData.address.street !== '' &&
          bookingData.address.pincode !== '' &&
          bookingData.contactNumber !== ''
        );
      case 3:
        return true; // Review step, no validation needed
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      handleConfirmBooking();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigation.goBack();
    }
  };

  const handleConfirmBooking = async () => {
    try {
      setLoading(true);
      
      // Mock API call - replace with actual booking API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Navigate to payment screen
      navigation.navigate('PaymentScreen', {
        bookingData,
        service,
        totalAmount: 2500,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {[1, 2, 3].map((step) => (
        <View key={step} style={styles.stepContainer}>
          <View style={[
            styles.stepCircle,
            step <= currentStep && styles.stepCircleActive
          ]}>
            <Text style={[
              styles.stepNumber,
              step <= currentStep && styles.stepNumberActive
            ]}>
              {step}
            </Text>
          </View>
          <Text style={[
            styles.stepLabel,
            step <= currentStep && styles.stepLabelActive
          ]}>
            {step === 1 ? 'Date & Time' : step === 2 ? 'Address' : 'Review'}
          </Text>
          {step < 3 && <View style={[
            styles.stepLine,
            step < currentStep && styles.stepLineActive
          ]} />}
        </View>
      ))}
    </View>
  );

  const renderStep1 = () => (
    <ScrollView style={styles.stepContent}>
      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Select Date</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Ionicons name="calendar" size={20} color={theme.colors.primary} />
          <Text style={styles.dateText}>
            {bookingData.date.toLocaleDateString('en-IN', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </Text>
          <Ionicons name="chevron-down" size={20} color={theme.colors.textSecondary} />
        </TouchableOpacity>
        
        {showDatePicker && (
          <DateTimePicker
            value={bookingData.date}
            mode="date"
            display="default"
            minimumDate={new Date()}
            onChange={handleDateChange}
          />
        )}
      </Card>

      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Select Time Slot</Text>
        {timeSlots.map((slot) => (
          <TouchableOpacity
            key={slot.id}
            style={[
              styles.timeSlot,
              bookingData.timeSlot === slot.time && styles.timeSlotSelected,
              !slot.available && styles.timeSlotDisabled
            ]}
            onPress={() => handleTimeSlotSelect(slot)}
            disabled={!slot.available}
          >
            <View style={styles.timeSlotContent}>
              <Text style={[
                styles.timeSlotText,
                bookingData.timeSlot === slot.time && styles.timeSlotTextSelected,
                !slot.available && styles.timeSlotTextDisabled
              ]}>
                {slot.time}
              </Text>
              {!slot.available && (
                <Text style={styles.unavailableText}>Not Available</Text>
              )}
            </View>
            <Text style={[
              styles.timeSlotPrice,
              bookingData.timeSlot === slot.time && styles.timeSlotPriceSelected
            ]}>
              ₹{slot.price}
            </Text>
          </TouchableOpacity>
        ))}
      </Card>
    </ScrollView>
  );

  const renderStep2 = () => (
    <ScrollView style={styles.stepContent}>
      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Service Address</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Street Address *</Text>
          <TextInput
            style={styles.textInput}
            value={bookingData.address.street}
            onChangeText={(text: string) => handleAddressChange('street', text)}
            placeholder="Enter your street address"
            multiline
          />
        </View>

        <View style={styles.inputRow}>
          <View style={[styles.inputGroup, styles.inputHalf]}>
            <Text style={styles.inputLabel}>Apartment/Floor</Text>
            <TextInput
              style={styles.textInput}
              value={bookingData.address.apartment}
              onChangeText={(text: string) => handleAddressChange('apartment', text)}
              placeholder="Apt, Floor, etc."
            />
          </View>

          <View style={[styles.inputGroup, styles.inputHalf]}>
            <Text style={styles.inputLabel}>Pincode *</Text>
            <TextInput
              style={styles.textInput}
              value={bookingData.address.pincode}
              onChangeText={(text: string) => handleAddressChange('pincode', text)}
              placeholder="400001"
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Landmark</Text>
          <TextInput
            style={styles.textInput}
            value={bookingData.address.landmark}
            onChangeText={(text: string) => handleAddressChange('landmark', text)}
            placeholder="Nearby landmark (optional)"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>City</Text>
          <TextInput
            style={[styles.textInput, styles.textInputDisabled]}
            value={bookingData.address.city}
            editable={false}
          />
        </View>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Contact Information</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Primary Contact Number *</Text>
          <TextInput
            style={styles.textInput}
            value={bookingData.contactNumber}
            onChangeText={(text: string) => setBookingData(prev => ({ ...prev, contactNumber: text }))}
            placeholder="+91 9876543210"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Alternate Contact Number</Text>
          <TextInput
            style={styles.textInput}
            value={bookingData.alternateNumber || ''}
            onChangeText={(text: string) => setBookingData(prev => ({ ...prev, alternateNumber: text }))}
            placeholder="+91 9876543210 (optional)"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Special Instructions</Text>
          <TextInput
            style={[styles.textInput, styles.textInputMultiline]}
            value={bookingData.specialInstructions}
            onChangeText={(text: string) => setBookingData(prev => ({ ...prev, specialInstructions: text }))}
            placeholder="Any special instructions for the service provider..."
            multiline
            numberOfLines={3}
          />
        </View>
      </Card>
    </ScrollView>
  );

  const renderStep3 = () => (
    <ScrollView style={styles.stepContent}>
      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Service Details</Text>
        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>Service:</Text>
          <Text style={styles.reviewValue}>{service.name}</Text>
        </View>
        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>Duration:</Text>
          <Text style={styles.reviewValue}>{service.duration}</Text>
        </View>
        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>Price:</Text>
          <Text style={styles.reviewValue}>₹{service.price}</Text>
        </View>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Schedule</Text>
        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>Date:</Text>
          <Text style={styles.reviewValue}>
            {bookingData.date.toLocaleDateString('en-IN')}
          </Text>
        </View>
        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>Time:</Text>
          <Text style={styles.reviewValue}>{bookingData.timeSlot}</Text>
        </View>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Service Address</Text>
        <Text style={styles.addressText}>
          {bookingData.address.street}
          {bookingData.address.apartment && `, ${bookingData.address.apartment}`}
          {'\n'}{bookingData.address.city} - {bookingData.address.pincode}
          {bookingData.address.landmark && `\nNear ${bookingData.address.landmark}`}
        </Text>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Contact</Text>
        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>Primary:</Text>
          <Text style={styles.reviewValue}>{bookingData.contactNumber}</Text>
        </View>
        {bookingData.alternateNumber && (
          <View style={styles.reviewItem}>
            <Text style={styles.reviewLabel}>Alternate:</Text>
            <Text style={styles.reviewValue}>{bookingData.alternateNumber}</Text>
          </View>
        )}
      </Card>

      {bookingData.specialInstructions && (
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Special Instructions</Text>
          <Text style={styles.addressText}>{bookingData.specialInstructions}</Text>
        </Card>
      )}

      <Card style={styles.totalCard}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalAmount}>₹{service.price}</Text>
        </View>
      </Card>
    </ScrollView>
  );

  if (loading) {
    return <LoadingOverlay visible={true} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Book Service</Text>
        <View style={{ width: 24 }} />
      </View>

      {renderStepIndicator()}

      {currentStep === 1 && renderStep1()}
      {currentStep === 2 && renderStep2()}
      {currentStep === 3 && renderStep3()}

      <View style={styles.bottomContainer}>
        <Button
          title={currentStep === 3 ? 'Proceed to Payment' : 'Next'}
          variant="primary"
          onPress={handleNext}
          disabled={!validateStep(currentStep)}
          style={styles.nextButton}
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
  stepIndicator: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: theme.colors.surface,
  },
  stepContainer: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  stepCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepCircleActive: {
    backgroundColor: theme.colors.primary,
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.textSecondary,
  },
  stepNumberActive: {
    color: '#fff',
  },
  stepLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  stepLabelActive: {
    color: theme.colors.text,
    fontWeight: '600',
  },
  stepLine: {
    position: 'absolute',
    top: 15,
    left: '50%',
    right: '-50%',
    height: 2,
    backgroundColor: theme.colors.border,
  },
  stepLineActive: {
    backgroundColor: theme.colors.primary,
  },
  stepContent: {
    flex: 1,
    padding: 20,
  },
  card: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 16,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: 12,
  },
  dateText: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text,
  },
  timeSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 8,
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  timeSlotSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: `${theme.colors.primary}10`,
  },
  timeSlotDisabled: {
    opacity: 0.5,
  },
  timeSlotContent: {
    flex: 1,
  },
  timeSlotText: {
    fontSize: 16,
    color: theme.colors.text,
  },
  timeSlotTextSelected: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  timeSlotTextDisabled: {
    color: theme.colors.textSecondary,
  },
  unavailableText: {
    fontSize: 12,
    color: theme.colors.error,
    marginTop: 2,
  },
  timeSlotPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
  timeSlotPriceSelected: {
    color: theme.colors.primary,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  inputHalf: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text,
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: theme.colors.text,
    backgroundColor: theme.colors.background,
  },
  textInputDisabled: {
    backgroundColor: theme.colors.surface,
    color: theme.colors.textSecondary,
  },
  textInputMultiline: {
    height: 80,
    textAlignVertical: 'top',
  },
  reviewItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewLabel: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  reviewValue: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text,
  },
  addressText: {
    fontSize: 16,
    color: theme.colors.text,
    lineHeight: 24,
  },
  totalCard: {
    backgroundColor: theme.colors.primary + '10',
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  bottomContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  nextButton: {
    width: '100%',
  },
});

export default BookingFlowScreen;
