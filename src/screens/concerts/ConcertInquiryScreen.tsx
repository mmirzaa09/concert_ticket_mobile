import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {RouteProp, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../types';
import {COLORS} from '../../constants';
import {responsiveFontSize, spacing} from '../../utils';
import {useAuth} from '../../context/AuthContext';
import {APP_CONFIG} from '../../constants';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {fetchConcertById} from '../../store/slices/concertsSlice';

// Navigation types
export type ConcertInquiryScreenRouteProp = RouteProp<
  RootStackParamList,
  'ConcertInquiry'
>;
export type ConcertInquiryScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ConcertInquiry'
>;

interface Props {
  navigation: ConcertInquiryScreenNavigationProp;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const ConcertInquiryScreen: React.FC<Props> = ({navigation}) => {
  const route = useRoute<ConcertInquiryScreenRouteProp>();
  const {concertId} = route.params;
  const dispatch = useAppDispatch();
  const {selectedConcert, loading} = useAppSelector(state => state.concerts);
  const [ticketCount, setTicketCount] = useState(1);
  const {state} = useAuth();

  const user = state.user;

  useEffect(() => {
    console.log('Concert ID from route params:', route.params);
    console.log('Concert ID:', user);
    if (concertId) {
      dispatch(fetchConcertById(concertId));
    }
  }, [concertId, dispatch, route.params, user]);

  if (loading || !selectedConcert) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading concert details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const concert = selectedConcert;

  const handleDecrease = () => {
    if (ticketCount > 1) {
      setTicketCount(ticketCount - 1);
    }
  };
  const handleIncrease = () => {
    if (ticketCount < concert.available_tickets) {
      setTicketCount(ticketCount + 1);
    }
  };

  const totalPrice = concert.price * ticketCount;

  const handleProceed = () => {
    // Navigate to Payment screen with order data
    navigation.navigate('Payment', {
      concert: concert,
      quantity: ticketCount,
      totalPrice: totalPrice,
      idUser: user?.id,
      nameUser: user?.name,
      idConcert: concert.id,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* <Text style={styles.title}>Confirm Your Ticket Purchase</Text> */}
        <View style={styles.card}>
          <Image
            source={{uri: `${APP_CONFIG.API_IMAGE}${concert.image_url}`}}
            style={styles.concertImage}
            resizeMode="cover"
          />
          <Text style={styles.concertTitle}>{concert.title}</Text>
          <Text style={styles.artist}>by {concert.artist}</Text>
          <Text style={styles.venue}>{concert.venue}</Text>
          <Text style={styles.date}>
            {formatDate(concert.date)} | {formatTime(concert.date)} WIB
          </Text>
        </View>
        <View style={styles.ticketSection}>
          <Text style={styles.sectionLabel}>Number of Tickets</Text>
          <View style={styles.stepperRow}>
            <TouchableOpacity
              style={[
                styles.stepperButton,
                ticketCount === 1 && styles.stepperButtonDisabled,
              ]}
              onPress={handleDecrease}
              disabled={ticketCount === 1}>
              <Text style={styles.stepperButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.ticketCount}>{ticketCount}</Text>
            <TouchableOpacity
              style={[
                styles.stepperButton,
                ticketCount === concert.available_tickets &&
                  styles.stepperButtonDisabled,
              ]}
              onPress={handleIncrease}
              disabled={ticketCount === concert.available_tickets}>
              <Text style={styles.stepperButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.pricePerTicket}>
            Price per ticket: {formatPrice(concert.price)}
          </Text>
        </View>
        <View style={styles.totalSection}>
          <Text style={styles.totalLabel}>Total Price</Text>
          <Text style={styles.totalPrice}>{formatPrice(totalPrice)}</Text>
        </View>
        <TouchableOpacity style={styles.proceedButton} onPress={handleProceed}>
          <Text style={styles.proceedButtonText}>Proceed to Payment</Text>
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
    padding: spacing.lg,
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: responsiveFontSize(22),
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  concertImage: {
    width: '100%',
    height: 160,
    borderRadius: 12,
    marginBottom: spacing.md,
  },
  concertTitle: {
    fontSize: responsiveFontSize(20),
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  artist: {
    fontSize: responsiveFontSize(16),
    color: COLORS.gold,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  venue: {
    fontSize: responsiveFontSize(14),
    color: COLORS.textSecondary,
    marginBottom: spacing.xs,
  },
  date: {
    fontSize: responsiveFontSize(14),
    color: COLORS.textMuted,
    marginBottom: spacing.md,
  },
  ticketSection: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    fontSize: responsiveFontSize(16),
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: spacing.sm,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  stepperButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    marginHorizontal: spacing.md,
  },
  stepperButtonDisabled: {
    backgroundColor: COLORS.textMuted,
  },
  stepperButtonText: {
    color: COLORS.background,
    fontSize: responsiveFontSize(20),
    fontWeight: 'bold',
  },
  ticketCount: {
    fontSize: responsiveFontSize(20),
    fontWeight: 'bold',
    color: COLORS.text,
    minWidth: 40,
    textAlign: 'center',
  },
  pricePerTicket: {
    fontSize: responsiveFontSize(14),
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  totalSection: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  totalLabel: {
    fontSize: responsiveFontSize(16),
    color: COLORS.text,
    fontWeight: '600',
  },
  totalPrice: {
    fontSize: responsiveFontSize(22),
    color: COLORS.gold,
    fontWeight: 'bold',
    marginTop: spacing.xs,
  },
  proceedButton: {
    backgroundColor: COLORS.gold,
    borderRadius: 12,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  proceedButtonText: {
    color: COLORS.background,
    fontSize: responsiveFontSize(18),
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    color: COLORS.text,
    fontSize: responsiveFontSize(16),
    marginTop: spacing.md,
  },
});

export default ConcertInquiryScreen;
