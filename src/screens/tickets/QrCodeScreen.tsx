import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  Animated,
} from 'react-native';
import {RouteProp, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../../types';
import {COLORS} from '../../constants';
import {responsiveFontSize, spacing} from '../../utils';
import {useAppSelector} from '../../store/hooks';

type QrCodeScreenRouteProp = RouteProp<RootStackParamList, 'QrCode'>;

const QrCodeScreen: React.FC = () => {
  const route = useRoute<QrCodeScreenRouteProp>();
  const {orderId} = route.params;

  const {currentOrder} = useAppSelector(state => state.order);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Entrance animation
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
  }, [fadeAnim, scaleAnim]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backgroundGradient} />
      <View style={styles.decorativeCircle1} />
      <View style={styles.decorativeCircle2} />

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
              {currentOrder?.concert.concertTitle || 'Event Ticket'}
            </Text>
            <Text style={styles.headerSubtitle}>
              {currentOrder?.concert.venue || 'Event Venue'}
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

          <View style={styles.footerSection}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Name</Text>
              <Text style={styles.detailValue}>
                {currentOrder?.user.name || 'Guest'}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Order ID</Text>
              <Text style={styles.detailValue}>{orderId}</Text>
            </View>
          </View>

          <View style={styles.perforatedEdge} />
          <View style={styles.scanLine} />
        </View>
        <Text style={styles.instructions}>
          Present this QR code at the event entrance.
        </Text>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
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
  },
  headerTitle: {
    fontSize: responsiveFontSize(22),
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: responsiveFontSize(16),
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  qrSection: {
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrImage: {
    width: 220,
    height: 220,
  },
  footerSection: {
    padding: spacing.xl,
    backgroundColor: COLORS.background,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  detailLabel: {
    fontSize: responsiveFontSize(14),
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: responsiveFontSize(14),
    color: COLORS.text,
    fontWeight: '600',
  },
  perforatedEdge: {
    height: 20,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 110, // Adjust based on footer height
  },
  scanLine: {
    position: 'absolute',
    top: '40%',
    left: '10%',
    right: '10%',
    height: 2,
    backgroundColor: COLORS.primary,
    opacity: 0.5,
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
});

export default QrCodeScreen;
