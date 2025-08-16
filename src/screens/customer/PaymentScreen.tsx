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
import { theme } from '../../theme/theme';
import Button from '../../components/Button';
import Card from '../../components/Card';
import LoadingOverlay from '../../components/LoadingOverlay';

interface PaymentMethod {
  id: string;
  type: 'card' | 'upi' | 'wallet' | 'cash';
  name: string;
  icon: string;
  details?: string;
}

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

interface Service {
  id: string;
  name: string;
  price: number;
  duration: string;
}

const PaymentScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { bookingData, service, totalAmount } = route.params as {
    bookingData: BookingData;
    service: Service;
    totalAmount: number;
  };

  const [loading, setLoading] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [discount, setDiscount] = useState(0);

  const paymentMethods: PaymentMethod[] = [
    {
      id: '1',
      type: 'upi',
      name: 'UPI Payment',
      icon: 'phone-portrait',
      details: 'Pay via Google Pay, PhonePe, Paytm',
    },
    {
      id: '2',
      type: 'card',
      name: 'Credit/Debit Card',
      icon: 'card',
      details: 'Visa, Mastercard, RuPay',
    },
    {
      id: '3',
      type: 'wallet',
      name: 'Digital Wallet',
      icon: 'wallet',
      details: 'Paytm, Amazon Pay, Mobikwik',
    },
    {
      id: '4',
      type: 'cash',
      name: 'Cash on Service',
      icon: 'cash',
      details: 'Pay after service completion',
    },
  ];

  const handlePaymentMethodSelect = (methodId: string) => {
    setSelectedPaymentMethod(methodId);
  };

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === 'FIRST10') {
      setDiscount(250);
      setPromoApplied(true);
      Alert.alert('Success', 'Promo code applied! You saved ₹250');
    } else if (promoCode.toUpperCase() === 'SAVE100') {
      setDiscount(100);
      setPromoApplied(true);
      Alert.alert('Success', 'Promo code applied! You saved ₹100');
    } else {
      Alert.alert('Error', 'Invalid promo code');
    }
  };

  const handleRemovePromo = () => {
    setPromoCode('');
    setPromoApplied(false);
    setDiscount(0);
  };

  const handlePayment = async () => {
    if (!selectedPaymentMethod) {
      Alert.alert('Error', 'Please select a payment method');
      return;
    }

    try {
      setLoading(true);
      
      // Mock payment processing - replace with actual payment gateway
      await new Promise(resolve => setTimeout(resolve, 3000));

      const selectedMethod = paymentMethods.find(m => m.id === selectedPaymentMethod);
      
      if (selectedMethod?.type === 'cash') {
        // For cash on service, directly create booking
        await createBooking();
      } else {
        // For online payments, simulate payment processing
        await processOnlinePayment();
      }
      
    } catch (error) {
      Alert.alert('Error', 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const createBooking = async () => {
    // Mock booking creation - replace with API call
    const bookingId = `BK${Date.now()}`;
    
    Alert.alert('Success', `Booking confirmed! Your booking ID is ${bookingId}`);
    navigation.goBack();
    // TODO: Navigate to BookingConfirmation screen
    /*
    navigation.navigate('BookingConfirmation', {
      bookingId,
      bookingData,
      service,
      totalAmount: finalAmount,
      paymentMethod: paymentMethods.find(m => m.id === selectedPaymentMethod),
      discount,
    });
    */
  };

  const processOnlinePayment = async () => {
    // Mock online payment - integrate with actual payment gateway
    const paymentId = `PAY${Date.now()}`;
    const bookingId = `BK${Date.now()}`;
    
    Alert.alert('Success', `Payment successful! Your booking ID is ${bookingId}`);
    navigation.goBack();
    // TODO: Navigate to BookingConfirmation screen
    /*
    navigation.navigate('BookingConfirmation', {
      bookingId,
      paymentId,
      bookingData,
      service,
      totalAmount: finalAmount,
      paymentMethod: paymentMethods.find(m => m.id === selectedPaymentMethod),
      discount,
    });
    */
  };

  const serviceAmount = service.price;
  const taxes = Math.round(serviceAmount * 0.18); // 18% GST
  const finalAmount = serviceAmount + taxes - discount;

  const renderPaymentMethod = (method: PaymentMethod) => (
    <TouchableOpacity
      key={method.id}
      style={[
        styles.paymentMethod,
        selectedPaymentMethod === method.id && styles.paymentMethodSelected
      ]}
      onPress={() => handlePaymentMethodSelect(method.id)}
    >
      <View style={styles.paymentMethodContent}>
        <Ionicons 
          name={method.icon as any} 
          size={24} 
          color={selectedPaymentMethod === method.id ? theme.colors.primary : theme.colors.textSecondary}
        />
        <View style={styles.paymentMethodInfo}>
          <Text style={[
            styles.paymentMethodName,
            selectedPaymentMethod === method.id && styles.paymentMethodNameSelected
          ]}>
            {method.name}
          </Text>
          <Text style={styles.paymentMethodDetails}>{method.details}</Text>
        </View>
      </View>
      <View style={[
        styles.radioButton,
        selectedPaymentMethod === method.id && styles.radioButtonSelected
      ]}>
        {selectedPaymentMethod === method.id && (
          <View style={styles.radioButtonInner} />
        )}
      </View>
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
        <Text style={styles.title}>Payment</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Service Summary */}
        <Card style={styles.summaryCard}>
          <Text style={styles.cardTitle}>Service Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Service:</Text>
            <Text style={styles.summaryValue}>{service.name}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Date:</Text>
            <Text style={styles.summaryValue}>
              {bookingData.date.toLocaleDateString('en-IN')}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Time:</Text>
            <Text style={styles.summaryValue}>{bookingData.timeSlot}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Duration:</Text>
            <Text style={styles.summaryValue}>{service.duration}</Text>
          </View>
        </Card>

        {/* Promo Code */}
        <Card style={styles.promoCard}>
          <Text style={styles.cardTitle}>Have a Promo Code?</Text>
          {!promoApplied ? (
            <View style={styles.promoInputContainer}>
              <TextInput
                style={styles.promoInput}
                value={promoCode}
                onChangeText={setPromoCode}
                placeholder="Enter promo code"
                autoCapitalize="characters"
              />
              <Button
                title="Apply"
                variant="primary"
                size="small"
                onPress={handleApplyPromo}
                disabled={!promoCode.trim()}
              />
            </View>
          ) : (
            <View style={styles.promoApplied}>
              <View style={styles.promoAppliedInfo}>
                <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                <Text style={styles.promoAppliedText}>
                  Promo code applied! You saved ₹{discount}
                </Text>
              </View>
              <TouchableOpacity onPress={handleRemovePromo}>
                <Ionicons name="close" size={20} color={theme.colors.error} />
              </TouchableOpacity>
            </View>
          )}
        </Card>

        {/* Payment Methods */}
        <Card style={styles.paymentCard}>
          <Text style={styles.cardTitle}>Select Payment Method</Text>
          {paymentMethods.map(renderPaymentMethod)}
        </Card>

        {/* Bill Summary */}
        <Card style={styles.billCard}>
          <Text style={styles.cardTitle}>Bill Summary</Text>
          
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Service Amount</Text>
            <Text style={styles.billValue}>₹{serviceAmount}</Text>
          </View>
          
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Taxes & Fees</Text>
            <Text style={styles.billValue}>₹{taxes}</Text>
          </View>
          
          {discount > 0 && (
            <View style={styles.billRow}>
              <Text style={[styles.billLabel, styles.discountLabel]}>Discount</Text>
              <Text style={[styles.billValue, styles.discountValue]}>-₹{discount}</Text>
            </View>
          )}
          
          <View style={styles.billDivider} />
          
          <View style={styles.billRow}>
            <Text style={styles.billTotalLabel}>Total Amount</Text>
            <Text style={styles.billTotalValue}>₹{finalAmount}</Text>
          </View>
        </Card>
      </ScrollView>

      {/* Payment Button */}
      <View style={styles.bottomContainer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalText}>Total: ₹{finalAmount}</Text>
        </View>
        <Button
          title={`Pay ${selectedPaymentMethod === '4' ? 'After Service' : 'Now'}`}
          variant="primary"
          onPress={handlePayment}
          disabled={!selectedPaymentMethod}
          style={styles.payButton}
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
  summaryCard: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text,
  },
  promoCard: {
    marginBottom: 16,
  },
  promoInputContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  promoInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: theme.colors.text,
    backgroundColor: theme.colors.background,
  },
  promoApplied: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
    padding: 12,
    borderRadius: 8,
  },
  promoAppliedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  promoAppliedText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
  },
  paymentCard: {
    marginBottom: 16,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: theme.colors.background,
  },
  paymentMethodSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + '10',
  },
  paymentMethodContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentMethodInfo: {
    marginLeft: 12,
    flex: 1,
  },
  paymentMethodName: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text,
  },
  paymentMethodNameSelected: {
    color: theme.colors.primary,
  },
  paymentMethodDetails: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: theme.colors.primary,
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.primary,
  },
  billCard: {
    marginBottom: 16,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  billLabel: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  billValue: {
    fontSize: 16,
    color: theme.colors.text,
  },
  discountLabel: {
    color: '#4CAF50',
  },
  discountValue: {
    color: '#4CAF50',
  },
  billDivider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: 12,
  },
  billTotalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
  },
  billTotalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  bottomContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  totalRow: {
    alignItems: 'center',
    marginBottom: 16,
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  payButton: {
    width: '100%',
  },
});

export default PaymentScreen;
