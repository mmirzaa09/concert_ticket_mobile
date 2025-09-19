import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Clipboard,
  Alert,
  BackHandler,
  Image,
} from 'react-native';
import {RouteProp, useRoute, useFocusEffect} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {launchImageLibrary, MediaType} from 'react-native-image-picker';
import {RootStackParamList} from '../../types';
import {COLORS} from '../../constants';
import {responsiveFontSize, spacing} from '../../utils';
import {useAppSelector, useAppDispatch} from '../../store/hooks';
import {
  selectIsOrderExpired,
  selectOrderTimeRemaining,
} from '../../store/slices/orderSlice';
import {fetchPaymentMethodsById} from '../../store/slices/paymentMethodSlice';
import images from '../../assets';

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

interface UploadedFile {
  uri: string;
  name: string;
  type: string;
  size?: number;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);

const formatTimeRemaining = (expiryDate: Date) => {
  const now = new Date();
  const diff = expiryDate.getTime() - now.getTime();

  if (diff <= 0) {
    return 'Expired';
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return `${hours}h ${minutes}m ${seconds}s`;
};

const PaymentInstructionsScreen: React.FC<Props> = ({navigation}) => {
  const route = useRoute<PaymentInstructionsRouteProp>();

  // Redux state
  const dispatch = useAppDispatch();
  const {currentOrder} = useAppSelector(state => state.order);
  const isOrderExpired = useAppSelector(selectIsOrderExpired);
  const timeRemainingMs = useAppSelector(selectOrderTimeRemaining);

  // State management
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const {currentPaymentMethod, isLoading, error} = useAppSelector(
    state => state.paymentMethod,
  );

  // Get payment details from Redux state or fallback to route params
  const paymentAmount = currentOrder?.total_price;
  const orderIdToShow = currentOrder?.id_order;

  // Calculate payment deadline from order or default to 3 hours
  const paymentDeadline = React.useMemo(() => {
    if (currentOrder?.reservation_expired) {
      return new Date(currentOrder.reservation_expired);
    }
    return new Date(Date.now() + 3 * 60 * 60 * 1000); // 3 hours from now
  }, [currentOrder?.reservation_expired]);

  // Get bank details from Redux state or fallback to default
  const bankDetails = React.useMemo(() => {
    if (currentPaymentMethod) {
      return {
        bankName: currentPaymentMethod.name,
        accountNumber: currentPaymentMethod.number,
        accountHolderName: currentPaymentMethod.account_name,
      };
    }

    // Fallback for unknown payment methods
    return {
      bankName: 'Unknown Payment Method',
      accountNumber: 'N/A',
      accountHolderName: 'N/A',
    };
  }, [currentPaymentMethod]);

  // Update countdown timer - use Redux state if available
  useEffect(() => {
    const updateTimer = () => {
      if (timeRemainingMs > 0) {
        setTimeRemaining(formatTimeRemaining(paymentDeadline));
      } else if (currentOrder) {
        // Use Redux time remaining
        const hours = Math.floor(timeRemainingMs / (1000 * 60 * 60));
        const minutes = Math.floor(
          (timeRemainingMs % (1000 * 60 * 60)) / (1000 * 60),
        );
        const seconds = Math.floor((timeRemainingMs % (1000 * 60)) / 1000);

        if (timeRemainingMs <= 0) {
          setTimeRemaining('Expired');
        } else {
          setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
        }
      } else {
        setTimeRemaining(formatTimeRemaining(paymentDeadline));
      }
    };

    updateTimer(); // Initial call
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [paymentDeadline, timeRemainingMs, currentOrder]);

  // Fetch payment methods if not already loaded
  useEffect(() => {
    dispatch(fetchPaymentMethodsById(route.params.id_method));
  }, [dispatch, route.params.id_method]);

  // Handle hardware back button and navigation back button
  const handleBackPress = React.useCallback(() => {
    navigation.reset({
      index: 0,
      routes: [{name: 'MainTabs'}],
    });
    return true; // Prevent default back behavior
  }, [navigation]);

  // Override hardware back button
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        handleBackPress();
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [handleBackPress]),
  );

  // Set custom header with back button
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={handleBackPress}
          style={styles.headerBackButton}>
          <Image
              source={images.arrowLeft}
              style={styles.headerBackText}
              resizeMode="contain"
            />
        </TouchableOpacity>
      ),
      headerStyle: {
        backgroundColor: COLORS.primary,
      },
      headerTintColor: COLORS.white,
      headerTitle: 'Payment Instructions',
    });
  }, [navigation, handleBackPress]);

  const copyToClipboard = (text: string) => {
    Clipboard.setString(text);
    Alert.alert('Copied', 'Account details copied to clipboard');
  };

  const handleFileUpload = () => {
    Alert.alert('Upload Proof of Payment', 'Choose an option', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Photo Library',
        onPress: () => {
          const options = {
            mediaType: 'photo' as MediaType,
            quality: 0.8,
          };

          launchImageLibrary(options, response => {
            if (response.assets && response.assets[0]) {
              const asset = response.assets[0];
              setUploadedFile({
                uri: asset.uri || '',
                name: asset.fileName || 'payment_proof.jpg',
                type: asset.type || 'image/jpeg',
                size: asset.fileSize,
              });
            }
          });
        },
      },
    ]);
  };

  const handleSubmitPayment = async () => {
    if (!uploadedFile) {
      Alert.alert('Error', 'Please upload proof of payment');
      return;
    }

    if (isOrderExpired) {
      Alert.alert(
        'Order Expired',
        'This order has expired. Please create a new order.',
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.reset({
                index: 0,
                routes: [{name: 'MainTabs'}],
              });
            },
          },
        ],
      );
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        'Payment Submitted',
        'Your payment proof has been submitted successfully. We will verify your payment within 1-2 business days.',
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.reset({
                index: 0,
                routes: [{name: 'MainTabs'}],
              });
            },
          },
        ],
      );
    }, 2000);
  };

  const removeUploadedFile = () => {
    setUploadedFile(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Payment Instructions</Text>
          <Text style={styles.orderInfo}>Order ID: {orderIdToShow}</Text>
          {currentOrder && (
            <Text style={styles.orderStatus}>
              Status: {currentOrder.status.toUpperCase()}
            </Text>
          )}
        </View>

        {/* Show loading indicator if order is loading */}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading order details...</Text>
          </View>
        )}

        {/* Show error if there's an error */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Total Payment Amount */}
        <View style={styles.amountSection}>
          <Text style={styles.amountLabel}>Total Payment</Text>
          <Text style={styles.amountValue}>{formatPrice(paymentAmount)}</Text>
          {currentOrder && (
            <Text style={styles.quantityInfo}>
              Quantity: {currentOrder.quantity} ticket(s)
            </Text>
          )}
        </View>

        {/* Payment Deadline */}
        <View style={styles.deadlineSection}>
          <Text style={styles.deadlineLabel}>Payment Deadline</Text>
          <Text
            style={[
              styles.deadlineValue,
              isOrderExpired && styles.expiredText,
            ]}>
            {timeRemaining}
          </Text>
          <Text style={styles.deadlineDate}>
            {paymentDeadline.toLocaleDateString('id-ID', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
          {isOrderExpired && (
            <Text style={styles.expiredWarning}>⚠️ This order has expired</Text>
          )}
        </View>

        {/* Bank Account Details */}
        <View style={styles.bankDetailsSection}>
          <Text style={styles.sectionTitle}>Transfer to:</Text>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading payment details...</Text>
            </View>
          ) : (
            <>
              <View style={styles.bankDetailRow}>
                <Text style={styles.bankDetailLabel}>Bank Name</Text>
                <Text style={styles.bankDetailValue}>
                  {bankDetails.bankName}
                </Text>
              </View>

              <View style={styles.bankDetailRow}>
                <Text style={styles.bankDetailLabel}>Account Number</Text>
                <View style={styles.accountNumberContainer}>
                  <Text style={styles.bankDetailValue}>
                    {bankDetails.accountNumber}
                  </Text>
                  <TouchableOpacity
                    style={styles.copyButton}
                    onPress={() => copyToClipboard(bankDetails.accountNumber)}>
                    <Text style={styles.copyButtonText}>Copy</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.bankDetailRow}>
                <Text style={styles.bankDetailLabel}>Account Holder</Text>
                <Text style={styles.bankDetailValue}>
                  {bankDetails.accountHolderName}
                </Text>
              </View>

              {currentPaymentMethod && (
                <View style={styles.paymentTypeIndicator}>
                  <Text style={styles.paymentTypeText}>
                    Payment Type: {currentPaymentMethod.type.toUpperCase()}
                  </Text>
                </View>
              )}
            </>
          )}
        </View>

        {/* Upload Proof Section */}
        <View style={styles.uploadSection}>
          <Text style={styles.sectionTitle}>Upload Proof of Payment</Text>
          <Text style={styles.uploadDescription}>
            Upload a screenshot or photo of your transfer receipt
          </Text>

          {uploadedFile ? (
            <View style={styles.uploadedFileContainer}>
              <View style={styles.fileInfo}>
                <Text style={styles.fileName}>{uploadedFile.name}</Text>
                <Text style={styles.fileSize}>
                  {uploadedFile.size
                    ? `${(uploadedFile.size / 1024).toFixed(1)} KB`
                    : 'Unknown size'}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.removeFileButton}
                onPress={removeUploadedFile}>
                <Text style={styles.removeFileText}>Remove</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={handleFileUpload}>
              <Text style={styles.uploadButtonText}>+ Choose File</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            (!uploadedFile || isSubmitting || isOrderExpired) &&
              styles.submitButtonDisabled,
          ]}
          onPress={handleSubmitPayment}
          disabled={!uploadedFile || isSubmitting || isOrderExpired}>
          <Text style={styles.submitButtonText}>
            {isSubmitting
              ? 'Submitting...'
              : isOrderExpired
              ? 'Order Expired'
              : 'Submit Payment Proof'}
          </Text>
        </TouchableOpacity>

        {/* Important Notes */}
        <View style={styles.notesContainer}>
          <Text style={styles.sectionTitle}>Important Notes</Text>
          <Text style={styles.noteText}>
            • Transfer the exact amount: {formatPrice(paymentAmount)}
          </Text>
          <Text style={styles.noteText}>
            • Payment must be completed before the deadline
          </Text>
          <Text style={styles.noteText}>
            • Upload clear image of your transfer receipt
          </Text>
          <Text style={styles.noteText}>
            • Verification process takes 1-2 business days
          </Text>
          <Text style={styles.noteText}>
            • Contact customer service if you need assistance
          </Text>
          {currentOrder && (
            <Text style={styles.noteText}>
              • Order expires on:{' '}
              {new Date(currentOrder.reservation_expired).toLocaleString(
                'id-ID',
              )}
            </Text>
          )}
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
  orderStatus: {
    fontSize: responsiveFontSize(12),
    color: COLORS.gold,
    marginTop: spacing.xs,
    fontWeight: '600',
  },
  // Loading and Error States
  loadingContainer: {
    margin: spacing.md,
    padding: spacing.lg,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: responsiveFontSize(14),
    color: COLORS.textSecondary,
  },
  errorContainer: {
    margin: spacing.md,
    padding: spacing.lg,
    borderRadius: 12,
    backgroundColor: COLORS.error,
    opacity: 0.1,
  },
  // Amount Section
  amountSection: {
    margin: spacing.md,
    padding: spacing.xl,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  amountLabel: {
    fontSize: responsiveFontSize(16),
    color: COLORS.textSecondary,
    marginBottom: spacing.sm,
  },
  amountValue: {
    fontSize: responsiveFontSize(32),
    fontWeight: 'bold',
    color: COLORS.text,
  },
  quantityInfo: {
    fontSize: responsiveFontSize(14),
    color: COLORS.textSecondary,
    marginTop: spacing.sm,
  },
  // Deadline Section
  deadlineSection: {
    margin: spacing.md,
    marginTop: 0,
    padding: spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  deadlineLabel: {
    fontSize: responsiveFontSize(14),
    color: COLORS.textSecondary,
    marginBottom: spacing.xs,
  },
  deadlineValue: {
    fontSize: responsiveFontSize(24),
    fontWeight: 'bold',
    color: COLORS.error,
    marginBottom: spacing.xs,
  },
  deadlineDate: {
    fontSize: responsiveFontSize(12),
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  expiredText: {
    color: COLORS.error,
  },
  expiredWarning: {
    fontSize: responsiveFontSize(14),
    color: COLORS.error,
    fontWeight: 'bold',
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  // Bank Details Section
  bankDetailsSection: {
    margin: spacing.md,
    marginTop: 0,
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
  bankDetailRow: {
    marginBottom: spacing.md,
  },
  bankDetailLabel: {
    fontSize: responsiveFontSize(12),
    color: COLORS.textSecondary,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  bankDetailValue: {
    fontSize: responsiveFontSize(16),
    fontWeight: '600',
    color: COLORS.text,
  },
  accountNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.background,
    padding: spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  copyButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 6,
    marginLeft: spacing.sm,
  },
  copyButtonText: {
    fontSize: responsiveFontSize(12),
    color: COLORS.text,
    fontWeight: '600',
  },
  paymentTypeIndicator: {
    marginTop: spacing.md,
    padding: spacing.sm,
    backgroundColor: COLORS.surface,
    borderRadius: 6,
    alignItems: 'center',
  },
  paymentTypeText: {
    fontSize: responsiveFontSize(12),
    color: COLORS.gold,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  // Upload Section
  uploadSection: {
    margin: spacing.md,
    marginTop: 0,
    padding: spacing.lg,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  uploadDescription: {
    fontSize: responsiveFontSize(14),
    color: COLORS.textSecondary,
    marginBottom: spacing.md,
  },
  uploadButton: {
    borderWidth: 2,
    borderColor: COLORS.text,
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: spacing.xl,
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  uploadButtonText: {
    fontSize: responsiveFontSize(16),
    color: COLORS.text,
    fontWeight: '600',
  },
  uploadedFileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: responsiveFontSize(14),
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: spacing.xs,
  },
  fileSize: {
    fontSize: responsiveFontSize(12),
    color: COLORS.textSecondary,
  },
  removeFileButton: {
    backgroundColor: COLORS.error,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 6,
  },
  removeFileText: {
    fontSize: responsiveFontSize(12),
    color: COLORS.white,
    fontWeight: '600',
  },
  // Submit Button
  submitButton: {
    backgroundColor: COLORS.primary,
    margin: spacing.md,
    marginTop: 0,
    paddingVertical: spacing.lg,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: COLORS.textSecondary,
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: responsiveFontSize(16),
    color: COLORS.white,
    fontWeight: 'bold',
  },
  // Notes Section
  notesContainer: {
    margin: spacing.md,
    marginTop: 0,
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
  headerBackButton: {
    padding: 10,
    marginLeft: 5,
  },
  headerBackText: {
    width: 20,
    height: 20,
    tintColor: COLORS.text,
  },
});

export default PaymentInstructionsScreen;
