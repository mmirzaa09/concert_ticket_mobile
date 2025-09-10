import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
  Alert,
  FlatList,
} from 'react-native';
import {RouteProp, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../types';
import {COLORS} from '../../constants';
import {responsiveFontSize, spacing} from '../../utils';
import {useAuth} from '../../context/AuthContext';
import {APP_CONFIG} from '../../constants';
import {fetchPaymentMethods} from '../../store/slices/paymentMethodSlice';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import images from '../../assets';

// Navigation types
export type PaymentScreenRouteProp = RouteProp<RootStackParamList, 'Payment'>;
export type PaymentScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Payment'
>;

interface Props {
  navigation: PaymentScreenNavigationProp;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);

const PaymentScreen: React.FC<Props> = ({navigation}) => {
  const route = useRoute<PaymentScreenRouteProp>();
  const {concert, quantity, totalPrice, orderId} = route.params;
  const {state} = useAuth();
  const dispatch = useAppDispatch();
  const {paymentMethods} = useAppSelector(state => state.paymentMethod);

  // Countdown timer state (3 days = 72 hours = 259200 seconds)
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const user = state.user;

  useEffect(() => {
    dispatch(fetchPaymentMethods());
  }, [dispatch]);

  const handleProceedPayment = async () => {
    if (!selectedPayment) {
      Alert.alert('Error', 'Please select a payment method');
      return;
    }

    setIsProcessing(true);

    try {
      // Here you would integrate with actual payment gateway
      // For demo purposes, we'll simulate payment processing

      const paymentData = {
        orderId,
        paymentMethod: selectedPayment,
        amount: totalPrice + 5000, // Include admin fee
        userId: user?.id,
      };

      console.log('Processing payment:', paymentData);

      // Simulate API call delay
      setTimeout(() => {
        setIsProcessing(false);

        // Navigate to payment success or show payment instructions
        Alert.alert(
          'Payment Initiated',
          'Please complete your payment using the selected method. You will receive further instructions.',
          [
            {
              text: 'OK',
              onPress: () => {
                // Navigate to payment instructions or success screen
                navigation.navigate('PaymentInstructions', {
                  orderId,
                  paymentMethod: selectedPayment,
                  amount: totalPrice + 5000,
                });
              },
            },
          ],
        );
      }, 2000);
    } catch (error) {
      setIsProcessing(false);
      Alert.alert('Error', 'Failed to process payment. Please try again.');
    }
  };

  const handleCancelPayment = () => {
    Alert.alert(
      'Cancel Payment',
      'Are you sure you want to cancel this payment? Your ticket reservation will be lost.',
      [
        {text: 'No', style: 'cancel'},
        {
          text: 'Yes',
          style: 'destructive',
          onPress: () => navigation.goBack(),
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Order Summary */}
        <View style={styles.orderSummary}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.concertInfo}>
            <Image
              source={{uri: `${APP_CONFIG.API_IMAGE}${concert.image_url}`}}
              style={styles.concertImage}
              resizeMode="cover"
            />
            <View style={styles.concertDetails}>
              <Text style={styles.concertTitle}>{concert.title}</Text>
              <Text style={styles.concertArtist}>by {concert.artist}</Text>
              <Text style={styles.concertVenue}>{concert.venue}</Text>
            </View>
          </View>

          <View style={styles.orderDetails}>
            <View style={styles.orderRow}>
              <Text style={styles.orderLabel}>Quantity:</Text>
              <Text style={styles.orderValue}>{quantity} ticket(s)</Text>
            </View>
            <View style={styles.orderRow}>
              <Text style={styles.orderLabel}>Price per ticket:</Text>
              <Text style={styles.orderValue}>
                {formatPrice(concert.price)}
              </Text>
            </View>
            <View style={styles.orderRow}>
              <Text style={styles.orderLabel}>Admin fee:</Text>
              <Text style={styles.orderValue}>{formatPrice(5000)}</Text>
            </View>
            <View style={[styles.orderRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalValue}>
                {formatPrice(totalPrice + 5000)}
              </Text>
            </View>
          </View>
        </View>

        {/* Payment Methods */}
        <View style={styles.paymentSection}>
          <Text style={styles.sectionTitle}>Select Payment Method</Text>
          <FlatList
            data={paymentMethods}
            keyExtractor={item => item.name}
            renderItem={({item: method}) => (
              <TouchableOpacity
                style={[
                  styles.paymentMethod,
                  selectedPayment === method.name &&
                    styles.selectedPaymentMethod,
                ]}
                onPress={() => setSelectedPayment(method.name)}>
                <Image
                  style={styles.paymentIcon}
                  source={images[method.icon]}
                />
                <View
                  style={[
                    styles.radioButton,
                    selectedPayment === method.name &&
                      styles.radioButtonSelected,
                  ]}>
                  {selectedPayment === method.name && (
                    <View style={styles.radioButtonInner} />
                  )}
                </View>
              </TouchableOpacity>
            )}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[
              styles.proceedButton,
              (!selectedPayment || isProcessing) && styles.disabledButton,
            ]}
            onPress={handleProceedPayment}
            disabled={!selectedPayment || isProcessing}>
            <Text style={styles.proceedButtonText}>
              {isProcessing ? 'Processing...' : 'Proceed to Pay'}
            </Text>
          </TouchableOpacity>
        </View>
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
  orderSummary: {
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
  concertInfo: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  concertImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  concertDetails: {
    flex: 1,
    marginLeft: spacing.md,
  },
  concertTitle: {
    fontSize: responsiveFontSize(16),
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: spacing.xs,
  },
  concertArtist: {
    fontSize: responsiveFontSize(14),
    color: COLORS.textSecondary,
    marginBottom: spacing.xs,
  },
  concertVenue: {
    fontSize: responsiveFontSize(12),
    color: COLORS.textSecondary,
  },
  orderDetails: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: spacing.md,
  },
  orderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  orderLabel: {
    fontSize: responsiveFontSize(14),
    color: COLORS.textSecondary,
  },
  orderValue: {
    fontSize: responsiveFontSize(14),
    color: COLORS.text,
    fontWeight: '500',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: spacing.sm,
    marginTop: spacing.sm,
  },
  totalLabel: {
    fontSize: responsiveFontSize(16),
    fontWeight: 'bold',
    color: COLORS.text,
  },
  totalValue: {
    fontSize: responsiveFontSize(16),
    fontWeight: 'bold',
    color: COLORS.text,
  },
  paymentSection: {
    margin: spacing.md,
    padding: spacing.lg,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  paymentMethod: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    marginBottom: spacing.sm,
  },
  selectedPaymentMethod: {
    borderColor: COLORS.primary,
    backgroundColor: `${COLORS.primary}10`,
  },
  paymentIcon: {
    width: '25%',
    height: 42,
    resizeMode: 'cover',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    borderColor: COLORS.text,
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.text,
  },
  actionButtons: {
    flexDirection: 'row',
    margin: spacing.md,
    gap: spacing.md,
    bottom: 0,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: responsiveFontSize(16),
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  proceedButton: {
    flex: 2,
    backgroundColor: COLORS.primary,
    paddingVertical: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: COLORS.disabled,
  },
  proceedButtonText: {
    fontSize: responsiveFontSize(16),
    color: COLORS.text,
    fontWeight: 'bold',
  },
});

export default PaymentScreen;
