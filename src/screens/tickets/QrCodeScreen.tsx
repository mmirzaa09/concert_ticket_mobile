import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  Animated,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {RouteProp, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../../types';
import {COLORS} from '../../constants';
import {responsiveFontSize, spacing} from '../../utils';
import {useAppSelector, useAppDispatch} from '../../store/hooks';
import {getPaidOrder} from '../../store/slices/orderSlice';

type QrCodeScreenRouteProp = RouteProp<RootStackParamList, 'QrCode'>;

const QrCodeScreen: React.FC = () => {
  const route = useRoute<QrCodeScreenRouteProp>();
  const {orderId} = route.params;
  const dispatch = useAppDispatch();

  const {currentOrder, loading, error} = useAppSelector(state => state.order);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (orderId) {
      dispatch(getPaidOrder(orderId.toString()));
    }
  }, [orderId, dispatch]);

  useEffect(() => {
    if (currentOrder && !loading) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [currentOrder, loading, fadeAnim, scaleAnim]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Format time for display
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Show loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading ticket details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show error state
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Error Loading Ticket</Text>
          <Text style={styles.errorMessage}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backgroundGradient} />
      <View style={styles.decorativeCircle1} />
      <View style={styles.decorativeCircle2} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{scale: scaleAnim}],
            },
          ]}>
          <View style={styles.ticketContainer}>
            <View style={styles.headerSection}>
              <Text style={styles.headerTitle}>
                {currentOrder?.concert?.title || 'Event Ticket'}
              </Text>
              <Text style={styles.headerSubtitle}>
                {currentOrder?.concert?.artist || 'Artist'}
              </Text>
            </View>

            <View style={styles.qrSection}>
              {orderId ? (
                <Image
                  source={{
                    uri: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
                      orderId,
                    )}`,
                  }}
                  style={styles.qrImage}
                  resizeMode="contain"
                />
              ) : (
                <Text style={styles.errorText}>
                  No Order ID found to generate QR Code.
                </Text>
              )}
            </View>

            <View style={styles.divider} />

            <View style={styles.detailsSection}>
              <Text style={styles.sectionTitle}>Event Details</Text>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Venue</Text>
                <Text style={styles.detailValue}>
                  {currentOrder?.concert?.venue || '-'}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Date</Text>
                <Text style={styles.detailValue}>
                  {currentOrder?.concert?.date
                    ? formatDate(currentOrder.concert.date)
                    : '-'}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Time</Text>
                <Text style={styles.detailValue}>
                  {currentOrder?.concert?.date
                    ? formatTime(currentOrder.concert.date)
                    : '-'}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Quantity</Text>
                <Text style={styles.detailValue}>
                  {currentOrder?.quantity || 0} ticket(s)
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.footerSection}>
              <Text style={styles.sectionTitle}>Ticket Holder</Text>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Name</Text>
                <Text style={styles.detailValue}>
                  {currentOrder?.user?.name || 'Guest'}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Email</Text>
                <Text style={styles.detailValue}>
                  {currentOrder?.user?.email || '-'}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Order ID</Text>
                <Text style={styles.detailValue}>{orderId}</Text>
              </View>
            </View>
          </View>

          <Text style={styles.instructions}>
            Present this QR code at the event entrance.
          </Text>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: COLORS.primary,
    opacity: 0.1,
  },
  decorativeCircle1: {
    position: 'absolute',
    top: -100,
    left: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: COLORS.primary,
    opacity: 0.08,
  },
  decorativeCircle2: {
    position: 'absolute',
    bottom: -120,
    right: -120,
    width: 350,
    height: 350,
    borderRadius: 175,
    backgroundColor: COLORS.gold,
    opacity: 0.08,
  },
  content: {
    width: '90%',
    alignItems: 'center',
  },
  ticketContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  headerSection: {
    padding: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    alignItems: 'center',
    backgroundColor: COLORS.primary,
  },
  headerTitle: {
    fontSize: responsiveFontSize(22),
    fontWeight: 'bold',
    color: COLORS.gold,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: responsiveFontSize(16),
    color: COLORS.gold,
    textAlign: 'center',
    opacity: 0.9,
  },
  qrSection: {
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
  },
  qrImage: {
    width: 220,
    height: 220,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: spacing.lg,
  },
  detailsSection: {
    padding: spacing.xl,
    backgroundColor: COLORS.surface,
  },
  footerSection: {
    padding: spacing.xl,
    backgroundColor: COLORS.background,
  },
  sectionTitle: {
    fontSize: responsiveFontSize(16),
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  detailLabel: {
    fontSize: responsiveFontSize(14),
    color: COLORS.textSecondary,
    fontWeight: '500',
    flex: 1,
  },
  detailValue: {
    fontSize: responsiveFontSize(14),
    color: COLORS.text,
    fontWeight: '600',
    flex: 2,
    textAlign: 'right',
  },
  statusBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 12,
    flex: 2,
    alignItems: 'flex-end',
  },
  statusText: {
    fontSize: responsiveFontSize(12),
    fontWeight: 'bold',
    color: COLORS.surface,
  },
  instructions: {
    marginTop: spacing.xl,
    fontSize: responsiveFontSize(14),
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
  errorText: {
    fontSize: responsiveFontSize(16),
    color: COLORS.error,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: responsiveFontSize(16),
    color: COLORS.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  errorTitle: {
    fontSize: responsiveFontSize(20),
    fontWeight: 'bold',
    color: COLORS.error,
    marginBottom: spacing.md,
  },
  errorMessage: {
    fontSize: responsiveFontSize(14),
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

export default QrCodeScreen;
