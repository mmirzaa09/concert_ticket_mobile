import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Clipboard,
  Alert,
} from 'react-native';
import {RouteProp, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../types';
import {COLORS} from '../../constants';
import {responsiveFontSize, spacing} from '../../utils';

// Navigation types
export type PaymentInstructionsRouteProp = RouteProp<
  RootStackParamList,
  'PaymentInstructions'
>;
export type PaymentInstructionsNavigationProp = StackNavigationProp<
  RootStackParamList,
  'PaymentInstructions'
>;

interface Props {
  navigation: PaymentInstructionsNavigationProp;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);

const getPaymentInstructions = (paymentMethod: string) => {
  switch (paymentMethod) {
    case 'bca':
      return {
        title: 'BCA Virtual Account',
        accountNumber: '8012 3456 7890 1234',
        steps: [
          'Open BCA mobile app or visit ATM',
          'Select "Transfer" menu',
          'Choose "Virtual Account"',
          'Enter the virtual account number',
          'Confirm payment details',
          'Complete the transaction',
        ],
      };
    case 'mandiri':
      return {
        title: 'Mandiri Virtual Account',
        accountNumber: '8901 2345 6789 0123',
        steps: [
          'Open Livin by Mandiri app or visit ATM',
          'Select "Bayar/Beli" menu',
          'Choose "Virtual Account"',
          'Enter the virtual account number',
          'Confirm payment details',
          'Complete the transaction',
        ],
      };
    case 'dana':
      return {
        title: 'DANA E-Wallet',
        accountNumber: 'DANA-12345678',
        steps: [
          'Open DANA application',
          'Select "Pay" or "Transfer"',
          'Scan QR code or enter merchant code',
          'Enter payment amount',
          'Confirm payment with PIN',
          'Payment completed',
        ],
      };
    case 'qris':
      return {
        title: 'QRIS Payment',
        accountNumber: 'QRIS-87654321',
        steps: [
          'Open any QRIS-compatible app',
          'Select "Scan QR" feature',
          'Scan the QR code below',
          'Confirm payment amount',
          'Enter your app PIN',
          'Payment completed',
        ],
      };
    default:
      return {
        title: 'Payment Instructions',
        accountNumber: 'N/A',
        steps: ['Please contact customer service for payment instructions'],
      };
  }
};

const PaymentInstructionsScreen: React.FC<Props> = ({navigation}) => {
  const route = useRoute<PaymentInstructionsRouteProp>();
  const {orderId, paymentMethod, amount} = route.params;

  const instructions = getPaymentInstructions(paymentMethod);

  const copyToClipboard = (text: string) => {
    Clipboard.setString(text);
    Alert.alert('Copied', 'Payment details copied to clipboard');
  };

  const handleBackToHome = () => {
    // Navigate back to home screen
    navigation.reset({
      index: 0,
      routes: [{name: 'MainTabs'}],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Payment Instructions</Text>
          <Text style={styles.orderInfo}>Order ID: {orderId}</Text>
        </View>

        {/* Payment Details */}
        <View style={styles.paymentDetails}>
          <Text style={styles.sectionTitle}>{instructions.title}</Text>

          <View style={styles.amountContainer}>
            <Text style={styles.amountLabel}>Total Amount</Text>
            <Text style={styles.amountValue}>{formatPrice(amount)}</Text>
          </View>

          {instructions.accountNumber !== 'N/A' && (
            <View style={styles.accountContainer}>
              <Text style={styles.accountLabel}>
                {paymentMethod === 'qris'
                  ? 'QR Code ID'
                  : 'Virtual Account Number'}
              </Text>
              <View style={styles.accountNumberContainer}>
                <Text style={styles.accountNumber}>
                  {instructions.accountNumber}
                </Text>
                <TouchableOpacity
                  style={styles.copyButton}
                  onPress={() => copyToClipboard(instructions.accountNumber)}>
                  <Text style={styles.copyButtonText}>Copy</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.sectionTitle}>Payment Steps</Text>
          {instructions.steps.map((step, index) => (
            <View key={index} style={styles.stepContainer}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>

        {/* Important Notes */}
        <View style={styles.notesContainer}>
          <Text style={styles.sectionTitle}>Important Notes</Text>
          <Text style={styles.noteText}>
            • Payment must be completed within 3 days
          </Text>
          <Text style={styles.noteText}>
            • Tickets will be sent to your email after successful payment
          </Text>
          <Text style={styles.noteText}>
            • Contact customer service if you encounter any issues
          </Text>
          <Text style={styles.noteText}>
            • Keep your transaction receipt for reference
          </Text>
        </View>

        {/* Action Button */}
        <TouchableOpacity style={styles.backButton} onPress={handleBackToHome}>
          <Text style={styles.backButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingBottom: spacing.xl,
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: spacing.lg,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: responsiveFontSize(20),
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: spacing.xs,
  },
  orderInfo: {
    fontSize: responsiveFontSize(14),
    color: COLORS.white,
    opacity: 0.9,
  },
  paymentDetails: {
    backgroundColor: COLORS.white,
    margin: spacing.md,
    padding: spacing.lg,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: responsiveFontSize(18),
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: spacing.md,
  },
  amountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginBottom: spacing.md,
  },
  amountLabel: {
    fontSize: responsiveFontSize(16),
    color: COLORS.textSecondary,
  },
  amountValue: {
    fontSize: responsiveFontSize(18),
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  accountContainer: {
    marginTop: spacing.md,
  },
  accountLabel: {
    fontSize: responsiveFontSize(14),
    color: COLORS.textSecondary,
    marginBottom: spacing.sm,
  },
  accountNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  accountNumber: {
    flex: 1,
    fontSize: responsiveFontSize(16),
    fontWeight: 'bold',
    color: COLORS.text,
    fontFamily: 'monospace',
  },
  copyButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 6,
  },
  copyButtonText: {
    fontSize: responsiveFontSize(12),
    color: COLORS.white,
    fontWeight: '600',
  },
  instructionsContainer: {
    backgroundColor: COLORS.white,
    margin: spacing.md,
    padding: spacing.lg,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    marginTop: 2,
  },
  stepNumberText: {
    fontSize: responsiveFontSize(12),
    color: COLORS.white,
    fontWeight: 'bold',
  },
  stepText: {
    flex: 1,
    fontSize: responsiveFontSize(14),
    color: COLORS.text,
    lineHeight: 20,
  },
  notesContainer: {
    backgroundColor: COLORS.white,
    margin: spacing.md,
    padding: spacing.lg,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  noteText: {
    fontSize: responsiveFontSize(14),
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  backButton: {
    backgroundColor: COLORS.primary,
    margin: spacing.md,
    paddingVertical: spacing.lg,
    borderRadius: 8,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: responsiveFontSize(16),
    color: COLORS.white,
    fontWeight: 'bold',
  },
});

export default PaymentInstructionsScreen;
