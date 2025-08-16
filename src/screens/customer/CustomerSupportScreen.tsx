import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../../theme/theme';
import Button from '../../components/Button';
import Card from '../../components/Card';
import LoadingOverlay from '../../components/LoadingOverlay';

interface SupportOption {
  id: string;
  title: string;
  description: string;
  icon: string;
  action: () => void;
  urgent?: boolean;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const CustomerSupportScreen: React.FC = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const handleCallbackRequest = () => {
    Alert.alert(
      'Request Callback',
      'Our support team will call you back within 15 minutes during business hours (9 AM - 9 PM).',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Request',
          onPress: async () => {
            setLoading(true);
            // Mock API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            setLoading(false);
            Alert.alert('Success', 'Callback requested! We\'ll call you soon.');
          }
        },
      ]
    );
  };

  const supportOptions: SupportOption[] = [
    {
      id: '1',
      title: 'Call Support',
      description: '24/7 customer support helpline',
      icon: 'call',
      action: () => Linking.openURL('tel:+911234567890'),
      urgent: true,
    },
    {
      id: '2',
      title: 'Live Chat',
      description: 'Chat with our support team',
      icon: 'chatbubbles',
      action: () => {}, // navigation.navigate('LiveChat'),
    },
    {
      id: '3',
      title: 'Email Support',
      description: 'Send us an email for detailed queries',
      icon: 'mail',
      action: () => Linking.openURL('mailto:support@gharsathi.com'),
    },
    {
      id: '4',
      title: 'WhatsApp Support',
      description: 'Quick support via WhatsApp',
      icon: 'logo-whatsapp',
      action: () => Linking.openURL('whatsapp://send?phone=911234567890'),
    },
    {
      id: '5',
      title: 'Report an Issue',
      description: 'Report service or app issues',
      icon: 'warning',
      action: () => {}, // navigation.navigate('ReportIssue'),
    },
    {
      id: '6',
      title: 'Request Callback',
      description: 'We\'ll call you back within 15 minutes',
      icon: 'call-outline',
      action: handleCallbackRequest,
    },
  ];

  const faqCategories = [
    { id: 'all', label: 'All' },
    { id: 'booking', label: 'Booking' },
    { id: 'payment', label: 'Payment' },
    { id: 'service', label: 'Service' },
    { id: 'account', label: 'Account' },
  ];

  const faqs: FAQ[] = [
    {
      id: '1',
      question: 'How do I book a service?',
      answer: 'You can book a service by browsing our categories, selecting the service you need, choosing a provider, and completing the booking flow. You can pay online or choose cash on service delivery.',
      category: 'booking',
    },
    {
      id: '2',
      question: 'Can I cancel or reschedule my booking?',
      answer: 'Yes, you can cancel or reschedule your booking up to 2 hours before the scheduled time without any charges. After that, cancellation charges may apply.',
      category: 'booking',
    },
    {
      id: '3',
      question: 'What payment methods do you accept?',
      answer: 'We accept UPI payments, credit/debit cards, digital wallets (Paytm, Amazon Pay), and cash on service delivery. All online payments are secure and encrypted.',
      category: 'payment',
    },
    {
      id: '4',
      question: 'Is my payment secure?',
      answer: 'Yes, all payments are processed through secure payment gateways with 256-bit SSL encryption. We never store your card details on our servers.',
      category: 'payment',
    },
    {
      id: '5',
      question: 'What if I\'m not satisfied with the service?',
      answer: 'If you\'re not satisfied, please contact us immediately. We offer a satisfaction guarantee and will either send the provider back to redo the work or provide a full refund.',
      category: 'service',
    },
    {
      id: '6',
      question: 'Are service providers verified?',
      answer: 'Yes, all our service providers go through a thorough verification process including background checks, skill assessment, and document verification.',
      category: 'service',
    },
    {
      id: '7',
      question: 'How do I change my account information?',
      answer: 'You can update your account information by going to Profile → Settings → Personal Information. Changes to phone number may require OTP verification.',
      category: 'account',
    },
    {
      id: '8',
      question: 'I forgot my password. How do I reset it?',
      answer: 'On the login screen, tap "Forgot Password" and enter your registered phone number. You\'ll receive an OTP to reset your password.',
      category: 'account',
    },
  ];

  const handleSubmitFeedback = async () => {
    if (!feedbackText.trim()) {
      Alert.alert('Error', 'Please enter your feedback');
      return;
    }

    try {
      setLoading(true);
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert('Thank you!', 'Your feedback has been submitted. We appreciate your input.');
      setFeedbackText('');
    } catch (error) {
      Alert.alert('Error', 'Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleFAQ = (faqId: string) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId);
  };

  const filteredFAQs = selectedCategory === 'all' 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);

  const renderSupportOption = (option: SupportOption) => (
    <TouchableOpacity
      key={option.id}
      style={[styles.supportOption, option.urgent && styles.urgentOption]}
      onPress={option.action}
      activeOpacity={0.7}
    >
      <View style={[styles.supportIcon, option.urgent && styles.urgentIcon]}>
        <Ionicons 
          name={option.icon as any} 
          size={24} 
          color={option.urgent ? '#fff' : theme.colors.primary} 
        />
      </View>
      <View style={styles.supportContent}>
        <Text style={[styles.supportTitle, option.urgent && styles.urgentTitle]}>
          {option.title}
        </Text>
        <Text style={styles.supportDescription}>{option.description}</Text>
      </View>
      <Ionicons 
        name="chevron-forward" 
        size={20} 
        color={theme.colors.textSecondary} 
      />
    </TouchableOpacity>
  );

  const renderFAQ = (faq: FAQ) => (
    <TouchableOpacity
      key={faq.id}
      style={styles.faqItem}
      onPress={() => toggleFAQ(faq.id)}
      activeOpacity={0.7}
    >
      <View style={styles.faqHeader}>
        <Text style={styles.faqQuestion}>{faq.question}</Text>
        <Ionicons
          name={expandedFAQ === faq.id ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={theme.colors.textSecondary}
        />
      </View>
      {expandedFAQ === faq.id && (
        <Text style={styles.faqAnswer}>{faq.answer}</Text>
      )}
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
        <Text style={styles.title}>Customer Support</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Emergency Contact */}
        <Card style={styles.emergencyCard}>
          <View style={styles.emergencyHeader}>
            <Ionicons name="warning" size={24} color="#FF6B6B" />
            <Text style={styles.emergencyTitle}>Need Immediate Help?</Text>
          </View>
          <Text style={styles.emergencyText}>
            For urgent service issues or emergencies, call our 24/7 helpline
          </Text>
          <Button
            title="Call Now: +91 1234567890"
            variant="primary"
            onPress={() => Linking.openURL('tel:+911234567890')}
            style={styles.emergencyButton}
          />
        </Card>

        {/* Support Options */}
        <Card style={styles.supportCard}>
          <Text style={styles.sectionTitle}>How can we help you?</Text>
          <View style={styles.supportOptions}>
            {supportOptions.map(renderSupportOption)}
          </View>
        </Card>

        {/* FAQ Section */}
        <Card style={styles.faqCard}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          
          {/* FAQ Categories */}
          <View style={styles.faqCategories}>
            {faqCategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryChip,
                  selectedCategory === category.id && styles.categoryChipSelected
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Text style={[
                  styles.categoryChipText,
                  selectedCategory === category.id && styles.categoryChipTextSelected
                ]}>
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* FAQ List */}
          <View style={styles.faqList}>
            {filteredFAQs.map(renderFAQ)}
          </View>
        </Card>

        {/* Feedback Section */}
        <Card style={styles.feedbackCard}>
          <Text style={styles.sectionTitle}>Share Your Feedback</Text>
          <Text style={styles.feedbackDescription}>
            Help us improve by sharing your thoughts and suggestions
          </Text>
          <TextInput
            style={styles.feedbackInput}
            value={feedbackText}
            onChangeText={setFeedbackText}
            placeholder="Write your feedback here..."
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            placeholderTextColor={theme.colors.textSecondary}
          />
          <Button
            title="Submit Feedback"
            variant="primary"
            onPress={handleSubmitFeedback}
            disabled={!feedbackText.trim()}
            style={styles.feedbackButton}
          />
        </Card>

        {/* Contact Information */}
        <Card style={styles.contactCard}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          
          <View style={styles.contactItem}>
            <Ionicons name="call" size={20} color={theme.colors.primary} />
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>Customer Support</Text>
              <Text style={styles.contactValue}>+91 1234567890</Text>
              <Text style={styles.contactTime}>Available 24/7</Text>
            </View>
          </View>

          <View style={styles.contactItem}>
            <Ionicons name="mail" size={20} color={theme.colors.primary} />
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>Email Support</Text>
              <Text style={styles.contactValue}>support@gharsathi.com</Text>
              <Text style={styles.contactTime}>Response within 24 hours</Text>
            </View>
          </View>

          <View style={styles.contactItem}>
            <Ionicons name="location" size={20} color={theme.colors.primary} />
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>Office Address</Text>
              <Text style={styles.contactValue}>
                GharSathi Technologies{'\n'}
                Mumbai, Maharashtra 400001
              </Text>
              <Text style={styles.contactTime}>Mon-Fri: 9 AM - 6 PM</Text>
            </View>
          </View>
        </Card>
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
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
  },
  emergencyCard: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B6B',
    marginLeft: theme.spacing.sm,
  },
  emergencyText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
    lineHeight: 20,
  },
  emergencyButton: {
    backgroundColor: '#FF6B6B',
  },
  supportCard: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  supportOptions: {
    gap: theme.spacing.xs,
  },
  supportOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.xs,
  },
  urgentOption: {
    backgroundColor: '#FFF5F5',
    borderWidth: 1,
    borderColor: '#FFE5E5',
  },
  supportIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  urgentIcon: {
    backgroundColor: '#FF6B6B',
  },
  supportContent: {
    flex: 1,
  },
  supportTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  urgentTitle: {
    color: '#FF6B6B',
  },
  supportDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  faqCard: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
  },
  faqCategories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.md,
  },
  categoryChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  categoryChipSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  categoryChipText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  categoryChipTextSelected: {
    color: '#fff',
    fontWeight: '500',
  },
  faqList: {
    gap: theme.spacing.xs,
  },
  faqItem: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
  },
  faqQuestion: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: theme.colors.text,
    marginRight: theme.spacing.sm,
  },
  faqAnswer: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },
  feedbackCard: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
  },
  feedbackDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  feedbackInput: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: 14,
    color: theme.colors.text,
    minHeight: 100,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  feedbackButton: {
    marginTop: theme.spacing.sm,
  },
  contactCard: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.md,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  contactInfo: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  contactLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  contactValue: {
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  contactTime: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
});

export default CustomerSupportScreen;
