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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { COLORS, FONTS, FONT_SIZES } from '../../constants/theme';
import Card from '../../components/Card';
import Button from '../../components/Button';
import LoadingOverlay from '../../components/LoadingOverlay';

interface PaymentMethod {
  id: string;
  type: 'card' | 'upi' | 'wallet' | 'netbanking' | 'emi';
  name: string;
  details: string;
  icon: string;
  isDefault: boolean;
  supportedFor?: string[];
}

interface PaymentGateway {
  id: string;
  name: string;
  icon: string;
  processingFee: number;
  features: string[];
  isAvailable: boolean;
}

interface BookingDetails {
  id: string;
  serviceName: string;
  providerName: string;
  amount: number;
  taxes: number;
  platformFee: number;
  discount: number;
  totalAmount: number;
}

const AdvancedPaymentScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { bookingId, amount } = route.params as { bookingId: string; amount: number };

  const [loading, setLoading] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [selectedGateway, setSelectedGateway] = useState<string>('razorpay');
  const [saveCard, setSaveCard] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [gateways, setGateways] = useState<PaymentGateway[]>([]);
  const [showAddCard, setShowAddCard] = useState(false);
  const [cardForm, setCardForm] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
  });

  const mockBookingDetails: BookingDetails = {
    id: bookingId,
    serviceName: 'House Cleaning Service',
    providerName: 'CleanPro Services',
    amount: amount || 800,
    taxes: 144,
    platformFee: 20,
    discount: 50,
    totalAmount: 914,
  };

  const mockPaymentMethods: PaymentMethod[] = [
    {
      id: '1',
      type: 'card',
      name: 'Credit Card',
      details: '**** **** **** 4532',
      icon: 'card',
      isDefault: true,
      supportedFor: ['instant', 'scheduled'],
    },
    {
      id: '2',
      type: 'upi',
      name: 'UPI',
      details: 'user@paytm',
      icon: 'phone-portrait',
      isDefault: false,
      supportedFor: ['instant'],
    },
    {
      id: '3',
      type: 'wallet',
      name: 'Paytm Wallet',
      details: '₹2,450 available',
      icon: 'wallet',
      isDefault: false,
      supportedFor: ['instant'],
    },
    {
      id: '4',
      type: 'netbanking',
      name: 'Net Banking',
      details: 'HDFC Bank',
      icon: 'business',
      isDefault: false,
      supportedFor: ['instant', 'scheduled'],
    },
    {
      id: '5',
      type: 'emi',
      name: 'EMI Options',
      details: '3-24 months available',
      icon: 'calendar',
      isDefault: false,
      supportedFor: ['instant'],
    },
  ];

  const mockGateways: PaymentGateway[] = [
    {
      id: 'razorpay',
      name: 'Razorpay',
      icon: 'card-outline',
      processingFee: 2.5,
      features: ['Instant Refunds', 'EMI Options', 'International Cards'],
      isAvailable: true,
    },
    {
      id: 'stripe',
      name: 'Stripe',
      icon: 'card',
      processingFee: 2.9,
      features: ['Advanced Security', 'Multi-currency', 'Apple Pay'],
      isAvailable: true,
    },
    {
      id: 'payu',
      name: 'PayU',
      icon: 'wallet-outline',
      processingFee: 2.0,
      features: ['Local Payment Methods', 'Quick Checkout', 'Fraud Detection'],
      isAvailable: true,
    },
  ];

  useEffect(() => {
    initializePayment();
  }, []);

  const initializePayment = async () => {
    setLoading(true);
    try {
      // Mock API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
      setBookingDetails(mockBookingDetails);
      setPaymentMethods(mockPaymentMethods);
      setGateways(mockGateways);
      setSelectedPaymentMethod(mockPaymentMethods[0].id);
    } catch (error) {
      console.error('Error initializing payment:', error);
      Alert.alert('Error', 'Failed to load payment methods');
    } finally {
      setLoading(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleAddCard = async () => {
    if (!cardForm.number || !cardForm.name || !cardForm.expiry || !cardForm.cvv) {
      Alert.alert('Error', 'Please fill all card details');
      return;
    }

    setLoading(true);
    try {
      // Mock API call to add card
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newCard: PaymentMethod = {
        id: Date.now().toString(),
        type: 'card',
        name: 'Credit Card',
        details: `**** **** **** ${cardForm.number.slice(-4)}`,
        icon: 'card',
        isDefault: false,
        supportedFor: ['instant', 'scheduled'],
      };

      setPaymentMethods(prev => [...prev, newCard]);
      setShowAddCard(false);
      setCardForm({ number: '', name: '', expiry: '', cvv: '' });
      Alert.alert('Success', 'Card added successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to add card');
    } finally {
      setLoading(false);
    }
  };

  const processPayment = async () => {
    if (!selectedPaymentMethod) {
      Alert.alert('Error', 'Please select a payment method');
      return;
    }

    setLoading(true);
    try {
      // Mock payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Simulate payment success/failure
      const success = Math.random() > 0.1; // 90% success rate
      
      if (success) {
        Alert.alert(
          'Payment Successful!',
          `Your payment of ₹${bookingDetails?.totalAmount} has been processed successfully.`,
          [
            {
              text: 'OK',
              onPress: () => {
                console.log('Payment completed for booking:', bookingId);
                navigation.goBack();
              },
            }
          ]
        );
      } else {
        Alert.alert(
          'Payment Failed',
          'Your payment could not be processed. Please try again with a different payment method.',
          [
            { text: 'Retry', onPress: () => processPayment() },
            { text: 'Cancel', style: 'cancel' },
          ]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Payment processing failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderPaymentSummary = () => (
    <Card style={styles.summaryCard}>
      <Text style={styles.summaryTitle}>Payment Summary</Text>
      
      <View style={styles.summaryItem}>
        <Text style={styles.summaryLabel}>{bookingDetails?.serviceName}</Text>
        <Text style={styles.summaryValue}>₹{bookingDetails?.amount}</Text>
      </View>
      
      <View style={styles.summaryItem}>
        <Text style={styles.summaryLabel}>Taxes & Fees</Text>
        <Text style={styles.summaryValue}>₹{bookingDetails?.taxes}</Text>
      </View>
      
      <View style={styles.summaryItem}>
        <Text style={styles.summaryLabel}>Platform Fee</Text>
        <Text style={styles.summaryValue}>₹{bookingDetails?.platformFee}</Text>
      </View>
      
      {bookingDetails && bookingDetails.discount > 0 && (
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryLabel, { color: '#4CAF50' }]}>Discount</Text>
          <Text style={[styles.summaryValue, { color: '#4CAF50' }]}>-₹{bookingDetails.discount}</Text>
        </View>
      )}
      
      <View style={[styles.summaryItem, styles.totalItem]}>
        <Text style={styles.totalLabel}>Total Amount</Text>
        <Text style={styles.totalValue}>₹{bookingDetails?.totalAmount}</Text>
      </View>
    </Card>
  );

  const renderPaymentMethods = () => (
    <Card style={styles.methodsCard}>
      <Text style={styles.sectionTitle}>Select Payment Method</Text>
      
      {paymentMethods.map((method) => (
        <TouchableOpacity
          key={method.id}
          style={[
            styles.methodItem,
            selectedPaymentMethod === method.id && styles.methodItemSelected
          ]}
          onPress={() => setSelectedPaymentMethod(method.id)}
        >
          <View style={styles.methodIcon}>
            <Ionicons name={method.icon as any} size={24} color={COLORS.primary} />
          </View>
          <View style={styles.methodInfo}>
            <Text style={styles.methodName}>{method.name}</Text>
            <Text style={styles.methodDetails}>{method.details}</Text>
          </View>
          {method.isDefault && (
            <View style={styles.defaultBadge}>
              <Text style={styles.defaultText}>Default</Text>
            </View>
          )}
          <View style={styles.radioButton}>
            {selectedPaymentMethod === method.id && (
              <View style={styles.radioSelected} />
            )}
          </View>
        </TouchableOpacity>
      ))}
      
      <TouchableOpacity
        style={styles.addMethodButton}
        onPress={() => setShowAddCard(true)}
      >
        <Ionicons name="add-circle-outline" size={20} color={COLORS.primary} />
        <Text style={styles.addMethodText}>Add New Payment Method</Text>
      </TouchableOpacity>
    </Card>
  );

  const renderAddCard = () => (
    <Card style={styles.addCardCard}>
      <View style={styles.addCardHeader}>
        <Text style={styles.sectionTitle}>Add New Card</Text>
        <TouchableOpacity onPress={() => setShowAddCard(false)}>
          <Ionicons name="close" size={24} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.formLabel}>Card Number</Text>
        <TextInput
          style={styles.formInput}
          value={cardForm.number}
          onChangeText={(text: string) => setCardForm(prev => ({ ...prev, number: formatCardNumber(text) }))}
          placeholder="1234 5678 9012 3456"
          keyboardType="numeric"
          maxLength={19}
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.formLabel}>Cardholder Name</Text>
        <TextInput
          style={styles.formInput}
          value={cardForm.name}
          onChangeText={(text: string) => setCardForm(prev => ({ ...prev, name: text }))}
          placeholder="John Doe"
          autoCapitalize="words"
        />
      </View>
      
      <View style={styles.formRow}>
        <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
          <Text style={styles.formLabel}>Expiry Date</Text>
          <TextInput
            style={styles.formInput}
            value={cardForm.expiry}
            onChangeText={(text: string) => setCardForm(prev => ({ ...prev, expiry: formatExpiry(text) }))}
            placeholder="MM/YY"
            keyboardType="numeric"
            maxLength={5}
          />
        </View>
        
        <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
          <Text style={styles.formLabel}>CVV</Text>
          <TextInput
            style={styles.formInput}
            value={cardForm.cvv}
            onChangeText={(text: string) => setCardForm(prev => ({ ...prev, cvv: text }))}
            placeholder="123"
            keyboardType="numeric"
            maxLength={4}
            secureTextEntry
          />
        </View>
      </View>
      
      <View style={styles.saveCardContainer}>
        <Switch
          value={saveCard}
          onValueChange={setSaveCard}
          trackColor={{ false: '#E0E0E0', true: COLORS.primary + '30' }}
          thumbColor={saveCard ? COLORS.primary : '#f4f3f4'}
        />
        <Text style={styles.saveCardText}>Save card for future payments</Text>
      </View>
      
      <Button
        title="Add Card"
        variant="primary"
        onPress={handleAddCard}
        style={styles.addCardButton}
      />
    </Card>
  );

  const renderGatewayOptions = () => (
    <Card style={styles.gatewayCard}>
      <Text style={styles.sectionTitle}>Payment Gateway</Text>
      
      {gateways.map((gateway) => (
        <TouchableOpacity
          key={gateway.id}
          style={[
            styles.gatewayItem,
            selectedGateway === gateway.id && styles.gatewayItemSelected
          ]}
          onPress={() => setSelectedGateway(gateway.id)}
        >
          <View style={styles.gatewayInfo}>
            <Text style={styles.gatewayName}>{gateway.name}</Text>
            <Text style={styles.gatewayFee}>Processing fee: {gateway.processingFee}%</Text>
            <View style={styles.gatewayFeatures}>
              {gateway.features.slice(0, 2).map((feature, index) => (
                <Text key={index} style={styles.featureText}>• {feature}</Text>
              ))}
            </View>
          </View>
          <View style={styles.radioButton}>
            {selectedGateway === gateway.id && (
              <View style={styles.radioSelected} />
            )}
          </View>
        </TouchableOpacity>
      ))}
    </Card>
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
        <Text style={styles.title}>Payment</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Payment Summary */}
        {renderPaymentSummary()}

        {/* Payment Methods */}
        {renderPaymentMethods()}

        {/* Add Card Form */}
        {showAddCard && renderAddCard()}

        {/* Gateway Options */}
        {renderGatewayOptions()}

        {/* Security Info */}
        <Card style={styles.securityCard}>
          <View style={styles.securityHeader}>
            <Ionicons name="shield-checkmark" size={20} color="#4CAF50" />
            <Text style={styles.securityTitle}>Secure Payment</Text>
          </View>
          <Text style={styles.securityText}>
            Your payment information is encrypted and secure. We never store your card details.
          </Text>
        </Card>
      </ScrollView>

      {/* Payment Button */}
      <View style={styles.paymentButtonContainer}>
        <Button
          title={`Pay ₹${bookingDetails?.totalAmount}`}
          variant="primary"
          onPress={processPayment}
          style={styles.paymentButton}
        />
      </View>
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
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  summaryCard: {
    padding: 16,
    marginTop: 16,
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
  },
  totalItem: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    marginTop: 8,
    paddingTop: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  methodsCard: {
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  methodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 8,
    backgroundColor: COLORS.surface,
  },
  methodItemSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '10',
  },
  methodIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  methodInfo: {
    flex: 1,
  },
  methodName: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 4,
  },
  methodDetails: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  defaultBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  defaultText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  addMethodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    borderRadius: 8,
    marginTop: 8,
  },
  addMethodText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
    marginLeft: 8,
  },
  addCardCard: {
    padding: 16,
    marginBottom: 16,
  },
  addCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 8,
  },
  formInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.text,
    backgroundColor: COLORS.surface,
  },
  formRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  saveCardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  saveCardText: {
    fontSize: 14,
    color: COLORS.text,
    marginLeft: 12,
  },
  addCardButton: {
    marginTop: 8,
  },
  gatewayCard: {
    padding: 16,
    marginBottom: 16,
  },
  gatewayItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 8,
    backgroundColor: COLORS.surface,
  },
  gatewayItemSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '10',
  },
  gatewayInfo: {
    flex: 1,
  },
  gatewayName: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 4,
  },
  gatewayFee: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  gatewayFeatures: {
    marginTop: 4,
  },
  featureText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  securityCard: {
    padding: 16,
    marginBottom: 100,
    backgroundColor: '#F0F9F0',
    borderWidth: 1,
    borderColor: '#E0F0E0',
  },
  securityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  securityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
    marginLeft: 8,
  },
  securityText: {
    fontSize: 14,
    color: '#2E7D32',
    lineHeight: 20,
  },
  paymentButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.surface,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  paymentButton: {
    width: '100%',
  },
});

export default AdvancedPaymentScreen;
