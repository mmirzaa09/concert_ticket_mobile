import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import {RouteProp, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../types';
import {COLORS} from '../../constants';
import {responsiveFontSize, spacing} from '../../utils';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {fetchConcertById} from '../../store/slices/concertsSlice';
import images from '../../assets';
import {APP_CONFIG} from '../../constants';

type ConcertDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  'ConcertDetail'
>;
type ConcertDetailScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ConcertDetail'
>;

interface Props {
  navigation: ConcertDetailScreenNavigationProp;
}

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const ConcertDetailScreen: React.FC<Props> = ({navigation}) => {
  const route = useRoute<ConcertDetailScreenRouteProp>();
  const {concertId} = route.params;
  const dispatch = useAppDispatch();
  const {selectedConcert} = useAppSelector(state => state.concerts);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      dispatch(fetchConcertById(concertId));
      setIsLoading(false);
    }, 1000);
  }, [concertId, dispatch]);

  const handlePurchaseTicket = () => {
    navigation.navigate('ConcertInquiry', {
      concertId: selectedConcert.id_selectedConcert,
    });
  };

  const getAvailabilityPercentage = (): number => {
    if (selectedConcert.total_tickets === 0) {
      return 0;
    }
    return (
      (selectedConcert.available_tickets / selectedConcert.total_tickets) * 100
    );
  };

  const isAvailable = (): boolean => {
    return (
      selectedConcert.available_tickets > 0 && selectedConcert.status === 1
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? null : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.imageContainer}>
            <Image
              source={{
                uri: `${APP_CONFIG.API_IMAGE}${selectedConcert.image_url}`,
              }}
              style={styles.concertImage}
              resizeMode="cover"
            />
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}>
              <Image
                source={images.arrowLeft}
                style={styles.backArrow}
                resizeMode="contain"
              />
            </TouchableOpacity>

            <View
              style={[
                styles.statusBadge,
                isAvailable() ? styles.availableBadge : styles.soldOutBadge,
              ]}>
              <Text style={styles.statusBadgeText}>
                {isAvailable() ? 'Available' : 'Sold Out'}
              </Text>
            </View>
          </View>

          <View style={styles.contentContainer}>
            <View style={styles.titleSection}>
              <Text style={styles.title}>{selectedConcert.title}</Text>
              <Text style={styles.artist}>by {selectedConcert.artist}</Text>
            </View>

            <View style={styles.infoSection}>
              <View style={styles.infoCard}>
                <View style={styles.infoRow}>
                  <View style={styles.iconContainer}>
                    <Text style={styles.icon}>📅</Text>
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Date</Text>
                    <Text style={styles.infoValue}>
                      {formatDate(selectedConcert.date)}
                    </Text>
                  </View>
                </View>

                <View style={styles.infoRow}>
                  <View style={styles.iconContainer}>
                    <Text style={styles.icon}>🕒</Text>
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Time</Text>
                    <Text style={styles.infoValue}>
                      {formatTime(selectedConcert.date)} WIB
                    </Text>
                  </View>
                </View>

                <View style={styles.infoRow}>
                  <View style={styles.iconContainer}>
                    <Text style={styles.icon}>📍</Text>
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Venue</Text>
                    <Text style={styles.infoValue}>
                      {selectedConcert.venue}
                    </Text>
                  </View>
                </View>

                <View style={styles.infoRow}>
                  <View style={styles.iconContainer}>
                    <Text style={styles.icon}>💰</Text>
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Price</Text>
                    <Text style={styles.price}>
                      {formatPrice(selectedConcert.price)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.availabilitySection}>
              <Text style={styles.sectionTitle}>Ticket Availability</Text>
              <View style={styles.availabilityCard}>
                <View style={styles.availabilityHeader}>
                  <Text style={styles.availableCount}>
                    {selectedConcert.available_tickets} tickets remaining
                  </Text>
                  <Text style={styles.totalCount}>
                    of {selectedConcert.total_tickets} total
                  </Text>
                </View>

                <View style={styles.progressBarContainer}>
                  <View style={styles.progressBarBackground}>
                    <View
                      style={[
                        styles.progressBarFill,
                        {width: `${getAvailabilityPercentage()}%`},
                      ]}
                    />
                  </View>
                  <Text style={styles.progressText}>
                    {getAvailabilityPercentage().toFixed(1)}% available
                  </Text>
                </View>

                {selectedConcert.queueCount > 0 && (
                  <View style={styles.queueInfo}>
                    <Text style={styles.queueText}>
                      👥 {selectedConcert.queueCount} people in waiting queue
                    </Text>
                  </View>
                )}
              </View>
            </View>

            <View style={styles.descriptionSection}>
              <Text style={styles.sectionTitle}>About This Event</Text>
              <View style={styles.descriptionCard}>
                <Text style={styles.description}>
                  {selectedConcert.description}
                </Text>
              </View>
            </View>

            <View style={styles.actionSection}>
              {isAvailable() ? (
                <TouchableOpacity
                  style={styles.purchaseButton}
                  onPress={handlePurchaseTicket}>
                  <Text style={styles.purchaseButtonText}>
                    Purchase Ticket - {formatPrice(selectedConcert.price)}
                  </Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.soldOutContainer}>
                  <View style={styles.soldOutBanner}>
                    <Text style={styles.soldOutText}>🎫 SOLD OUT</Text>
                    <Text style={styles.soldOutSubtext}>
                      All tickets have been sold
                    </Text>
                  </View>
                </View>
              )}
            </View>

            <View style={styles.bottomSpacing} />
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  imageContainer: {
    position: 'relative',
    height: 300,
  },
  concertImage: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    color: COLORS.text,
    fontSize: responsiveFontSize(20),
    fontWeight: 'bold',
  },
  backArrow: {
    width: 20,
    height: 20,
    tintColor: COLORS.text,
  },
  statusBadge: {
    position: 'absolute',
    top: 50,
    right: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  availableBadge: {
    backgroundColor: COLORS.success,
  },
  soldOutBadge: {
    backgroundColor: COLORS.error,
  },
  statusBadgeText: {
    color: COLORS.text,
    fontSize: responsiveFontSize(12),
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: spacing.lg,
  },
  titleSection: {
    paddingTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: responsiveFontSize(28),
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: spacing.xs,
    lineHeight: 34,
  },
  artist: {
    fontSize: responsiveFontSize(18),
    color: COLORS.gold,
    fontWeight: '600',
  },
  infoSection: {
    marginBottom: spacing.xl,
  },
  infoCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  icon: {
    fontSize: responsiveFontSize(20),
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: responsiveFontSize(14),
    color: COLORS.textMuted,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: responsiveFontSize(16),
    color: COLORS.text,
    fontWeight: '600',
  },
  price: {
    fontSize: responsiveFontSize(18),
    color: COLORS.gold,
    fontWeight: 'bold',
  },
  availabilitySection: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: responsiveFontSize(20),
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: spacing.md,
  },
  availabilityCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: spacing.lg,
  },
  availabilityHeader: {
    marginBottom: spacing.md,
  },
  availableCount: {
    fontSize: responsiveFontSize(18),
    fontWeight: 'bold',
    color: COLORS.success,
  },
  totalCount: {
    fontSize: responsiveFontSize(14),
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  progressBarContainer: {
    marginBottom: spacing.md,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: COLORS.card,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.gold,
    borderRadius: 4,
  },
  progressText: {
    fontSize: responsiveFontSize(12),
    color: COLORS.textMuted,
    textAlign: 'right',
  },
  queueInfo: {
    backgroundColor: COLORS.warning + '20',
    borderRadius: 8,
    padding: spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.warning,
  },
  queueText: {
    fontSize: responsiveFontSize(14),
    color: COLORS.warning,
    fontWeight: '600',
  },
  descriptionSection: {
    marginBottom: spacing.xl,
  },
  descriptionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: spacing.lg,
  },
  description: {
    fontSize: responsiveFontSize(16),
    lineHeight: 24,
    color: COLORS.textSecondary,
  },
  actionSection: {
    marginBottom: spacing.lg,
  },
  purchaseButton: {
    backgroundColor: COLORS.gold,
    borderRadius: 16,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    shadowColor: COLORS.gold,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  purchaseButtonText: {
    color: COLORS.background,
    fontSize: responsiveFontSize(18),
    fontWeight: 'bold',
  },
  soldOutContainer: {
    alignItems: 'center',
  },
  soldOutBanner: {
    backgroundColor: COLORS.error + '20',
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.md,
    width: '100%',
    borderWidth: 1,
    borderColor: COLORS.error + '40',
  },
  soldOutText: {
    fontSize: responsiveFontSize(20),
    fontWeight: 'bold',
    color: COLORS.error,
  },
  soldOutSubtext: {
    fontSize: responsiveFontSize(14),
    color: COLORS.textMuted,
    marginTop: 4,
  },
  bottomSpacing: {
    height: spacing.xl,
  },
});

export default ConcertDetailScreen;
