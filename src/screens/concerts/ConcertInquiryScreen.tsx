import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {RouteProp, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../types';
import {COLORS} from '../../constants';
import {responsiveFontSize, spacing} from '../../utils';
import {useAuth} from '../../context/AuthContext';
import {APP_CONFIG} from '../../constants';

// Navigation types
export type ConcertPurchaseInquiryDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  'TicketPurchase'
>;
export type ConcertPurchaseInquiryDetailScreenNavigationProp =
  StackNavigationProp<RootStackParamList, 'TicketPurchase'>;

interface Props {
  navigation: ConcertPurchaseInquiryDetailScreenNavigationProp;
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
  // In real app, get concert and ticketCount from params or redux
  const route = useRoute<ConcertPurchaseInquiryDetailScreenRouteProp>();
  const concert = route.params.concert;
  const [ticketCount, setTicketCount] = useState(1);
  const {state} = useAuth();

  const user = state.user;

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
    const payloadData = {
      idUser: user?.id,
      nameUser: user?.name,
      idConcert: concert.id,
      quantity: ticketCount,
      totalPrice: totalPrice,
    };

    console.log('Proceeding to payment with data:', payloadData);
    // navigation.navigate('TicketPurchase', {
    //   concertId: concert.id,
    //   quantity: ticketCount,
    // });
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
});

export default ConcertInquiryScreen;
