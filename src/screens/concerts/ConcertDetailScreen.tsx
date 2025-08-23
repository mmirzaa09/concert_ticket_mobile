import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {RouteProp, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../types';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {fetchConcertById} from '../../store/slices/concertsSlice';
import {useGlobalModalContext} from '../../context/GlobalModalContext';
import {formatPrice, responsiveFontSize, spacing} from '../../utils';
import {COLORS} from '../../constants';

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

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const ConcertDetailScreen: React.FC<Props> = ({navigation}) => {
  const route = useRoute<ConcertDetailScreenRouteProp>();
  const {concertId} = route.params;

  const dispatch = useAppDispatch();
  const {selectedConcert, isLoading, error} = useAppSelector(
    state => state.concerts,
  );
  const {showError, showSuccess} = useGlobalModalContext();

  const [isJoiningQueue, setIsJoiningQueue] = useState(false);
  const [userInQueue, setUserInQueue] = useState(false);

  useEffect(() => {
    if (concertId) {
      dispatch(fetchConcertById(concertId));
    }
  }, [dispatch, concertId]);

  useEffect(() => {
    if (error) {
      showError(error, 'Error');
    }
  }, [error, showError]);

  const handleJoinQueue = async () => {
    if (!selectedConcert) {
      return;
    }

    setIsJoiningQueue(true);
    try {
      // Call your API to join queue
      // await apiService.joinQueue(selectedConcert.id);
      setUserInQueue(true);
      showSuccess('Successfully joined the queue!', 'Queue Joined');
    } catch (queueError: any) {
      showError(queueError.message || 'Failed to join queue', 'Queue Error');
    } finally {
      setIsJoiningQueue(false);
    }
  };

  const handleLeaveQueue = async () => {
    if (!selectedConcert) {
      return;
    }

    try {
      // await apiService.leaveQueue(selectedConcert.id);
      setUserInQueue(false);
      showSuccess('You have left the queue', 'Queue Left');
    } catch (queueError: any) {
      showError(queueError.message || 'Failed to leave queue', 'Queue Error');
    }
  };

  const handlePurchaseTicket = () => {
    if (!selectedConcert) {
      return;
    }

    if (selectedConcert.availableTickets <= 0) {
      showError('No tickets available', 'Sold Out');
      return;
    }

    // Navigate to purchase screen or show purchase modal
    Alert.alert(
      'Purchase Ticket',
      `Would you like to purchase a ticket for ${selectedConcert.title}?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Purchase',
          onPress: () => {
            // Navigate to purchase screen
            // navigation.navigate('PurchaseTicket', {concertId: selectedConcert.id});
            showSuccess('Purchase functionality coming soon!', 'Info');
          },
        },
      ],
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.gold} />
        <Text style={styles.loadingText}>Loading concert details...</Text>
      </View>
    );
  }

  if (!selectedConcert) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Concert not found</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={{uri: selectedConcert.image}}
          style={styles.concertImage}
          resizeMode="cover"
        />
        <TouchableOpacity
          style={styles.backButtonOverlay}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>{selectedConcert.title}</Text>
        <Text style={styles.artist}>{selectedConcert.artist}</Text>

        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>📅 Date:</Text>
            <Text style={styles.infoValue}>
              {formatDate(selectedConcert.date)}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>📍 Venue:</Text>
            <Text style={styles.infoValue}>{selectedConcert.venue}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>💰 Price:</Text>
            <Text style={styles.price}>
              {formatPrice(selectedConcert.price)}
            </Text>
          </View>
        </View>

        <View style={styles.availabilitySection}>
          <View style={styles.availabilityRow}>
            <Text style={styles.availabilityLabel}>Available Tickets:</Text>
            <Text
              style={[
                styles.availabilityValue,
                selectedConcert.availableTickets <= 0 && styles.soldOut,
              ]}>
              {selectedConcert.availableTickets} /{' '}
              {selectedConcert.totalTickets}
            </Text>
          </View>

          <View style={styles.availabilityRow}>
            <Text style={styles.availabilityLabel}>Queue Count:</Text>
            <Text style={styles.queueCount}>
              {selectedConcert.queueCount} people waiting
            </Text>
          </View>
        </View>

        <View style={styles.descriptionSection}>
          <Text style={styles.descriptionTitle}>About This Concert</Text>
          <Text style={styles.description}>{selectedConcert.description}</Text>
        </View>

        <View style={styles.actionSection}>
          {selectedConcert.availableTickets > 0 ? (
            <TouchableOpacity
              style={styles.purchaseButton}
              onPress={handlePurchaseTicket}>
              <Text style={styles.purchaseButtonText}>Purchase Ticket</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.soldOutContainer}>
              <Text style={styles.soldOutText}>SOLD OUT</Text>
              {!userInQueue ? (
                <TouchableOpacity
                  style={styles.queueButton}
                  onPress={handleJoinQueue}
                  disabled={isJoiningQueue}>
                  <Text style={styles.queueButtonText}>
                    {isJoiningQueue ? 'Joining...' : 'Join Waiting Queue'}
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.leaveQueueButton}
                  onPress={handleLeaveQueue}>
                  <Text style={styles.leaveQueueButtonText}>Leave Queue</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
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
    backgroundColor: COLORS.background,
    padding: spacing.lg,
  },
  errorText: {
    fontSize: responsiveFontSize(18),
    color: COLORS.error,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  imageContainer: {
    position: 'relative',
    height: 300,
  },
  concertImage: {
    width: '100%',
    height: '100%',
  },
  backButtonOverlay: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: COLORS.gold,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 8,
  },
  backButtonText: {
    color: COLORS.text,
    fontSize: responsiveFontSize(18),
    fontWeight: 'bold',
  },
  contentContainer: {
    padding: spacing.lg,
  },
  title: {
    fontSize: responsiveFontSize(28),
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: spacing.xs,
  },
  artist: {
    fontSize: responsiveFontSize(20),
    color: COLORS.gold,
    marginBottom: spacing.lg,
    fontWeight: '600',
  },
  infoSection: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  infoLabel: {
    fontSize: responsiveFontSize(16),
    color: COLORS.textSecondary,
    flex: 1,
  },
  infoValue: {
    fontSize: responsiveFontSize(16),
    color: COLORS.text,
    fontWeight: '600',
    flex: 2,
    textAlign: 'right',
  },
  price: {
    fontSize: responsiveFontSize(18),
    color: COLORS.gold,
    fontWeight: 'bold',
    flex: 2,
    textAlign: 'right',
  },
  availabilitySection: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  availabilityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  availabilityLabel: {
    fontSize: responsiveFontSize(16),
    color: COLORS.textSecondary,
  },
  availabilityValue: {
    fontSize: responsiveFontSize(16),
    fontWeight: 'bold',
    color: COLORS.success,
  },
  soldOut: {
    color: COLORS.error,
  },
  queueCount: {
    fontSize: responsiveFontSize(16),
    color: COLORS.warning,
    fontWeight: '600',
  },
  descriptionSection: {
    marginBottom: spacing.xl,
  },
  descriptionTitle: {
    fontSize: responsiveFontSize(20),
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: responsiveFontSize(16),
    lineHeight: 24,
    color: COLORS.textSecondary,
  },
  actionSection: {
    marginBottom: spacing.xl,
  },
  purchaseButton: {
    backgroundColor: COLORS.gold,
    paddingVertical: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  purchaseButtonText: {
    color: COLORS.background,
    fontSize: responsiveFontSize(18),
    fontWeight: 'bold',
  },
  soldOutContainer: {
    alignItems: 'center',
  },
  soldOutText: {
    fontSize: responsiveFontSize(24),
    fontWeight: 'bold',
    color: COLORS.error,
    marginBottom: spacing.md,
  },
  queueButton: {
    backgroundColor: COLORS.warning,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
  },
  queueButtonText: {
    color: COLORS.background,
    fontSize: responsiveFontSize(16),
    fontWeight: 'bold',
  },
  leaveQueueButton: {
    backgroundColor: COLORS.error,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
  },
  leaveQueueButtonText: {
    color: COLORS.text,
    fontSize: responsiveFontSize(16),
    fontWeight: 'bold',
  },
});

export default ConcertDetailScreen;
