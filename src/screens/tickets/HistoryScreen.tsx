import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {CompositeNavigationProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {TabParamList, RootStackParamList} from '../../types';
import {COLORS, APP_CONFIG} from '../../constants';
import {globalStyles} from '../../styles/globalStyles';
import {
  formatPrice,
  formatDate,
  responsiveFontSize,
  spacing,
} from '../../utils';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {useAuth} from '../../context/AuthContext';
import {getOrdersByUserId} from '../../store/slices/orderSlice';

type HistoryScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, 'History'>,
  StackNavigationProp<RootStackParamList>
>;

interface Props {
  navigation: HistoryScreenNavigationProp;
}

const HistoryScreen: React.FC<Props> = ({navigation}) => {
  const dispatch = useAppDispatch();
  const {userOrders, loading} = useAppSelector(state => state.order);
  const {state} = useAuth();

  useEffect(() => {
    dispatch(getOrdersByUserId(state.user.id));
  }, [dispatch, state.user.id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return COLORS.success;
      case 'pending':
        return COLORS.textMuted;
      case 'cancelled':
        return COLORS.error;
      default:
        return COLORS.textSecondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return 'paid';
      case 'pending':
        return 'pending';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  };

  const handleRedirectToConcert = (concertId: string) => {
    // Navigate to ConcertDetail screen with concertId
    navigation.navigate('ConcertDetail', {concertId});
  };

  const handlePendingOrderPress = (order: (typeof userOrders)[0]) => {
    if (order.status === 'pending') {
      navigation.navigate('PaymentInstructions', {
        paymentMethod: order.id_method,
        orderId: order.id_order,
        fromHistory: true,
      });
    } else {
      handleRedirectToConcert(order.id_concert);
    }
  };

  const renderTicketItem = ({item}: {item: (typeof userOrders)[0]}) => {
    const concert = item.concert;
    return (
      <TouchableOpacity
        style={styles.ticketCard}
        onPress={() => handlePendingOrderPress(item)}>
        <Image
          source={{uri: `${APP_CONFIG.API_IMAGE}${concert.image_url}`}}
          style={styles.ticketImage}
        />
        <View style={styles.ticketInfo}>
          <Text style={styles.ticketTitle}>{concert.concertTitle}</Text>
          <Text style={styles.ticketVenue}>{concert.venue}</Text>
          <Text style={styles.ticketDate}>
            Event Date: {formatDate(concert.date)}
          </Text>
          <View style={styles.ticketFooter}>
            <Text style={styles.ticketPrice}>{formatPrice(concert.price)}</Text>
            <View
              style={[
                styles.statusBadge,
                {backgroundColor: getStatusColor(item.status)},
              ]}>
              <Text style={styles.statusText}>
                {getStatusText(item.status)}
              </Text>
            </View>
          </View>
          {item.status === 'pending' && (
            <Text style={styles.pendingHint}>Tap to complete payment</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ticket History</Text>
        <Text style={styles.headerSubtitle}>Your concert journey</Text>
      </View>

      {userOrders.length > 0 ? (
        <FlatList
          data={userOrders}
          renderItem={renderTicketItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshing={loading}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No tickets yet</Text>
          <Text style={styles.emptySubtitle}>
            Book your first concert ticket to see your history here
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: spacing.lg,
    backgroundColor: COLORS.primary,
  },
  headerTitle: {
    fontSize: responsiveFontSize(28),
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: responsiveFontSize(16),
    color: COLORS.textSecondary,
  },
  listContainer: {
    padding: spacing.md,
  },
  ticketCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    marginBottom: spacing.md,
    overflow: 'hidden',
    shadowColor: COLORS.text,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  ticketImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  ticketInfo: {
    padding: spacing.md,
  },
  ticketTitle: {
    fontSize: responsiveFontSize(18),
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: spacing.xs,
  },
  ticketVenue: {
    fontSize: responsiveFontSize(14),
    color: COLORS.textSecondary,
    marginBottom: spacing.xs,
  },
  ticketDate: {
    fontSize: responsiveFontSize(12),
    color: COLORS.textMuted,
    marginBottom: spacing.sm,
  },
  ticketFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ticketPrice: {
    fontSize: responsiveFontSize(16),
    fontWeight: 'bold',
    color: COLORS.gold,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  statusText: {
    fontSize: responsiveFontSize(12),
    fontWeight: '600',
    color: COLORS.background,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  emptyTitle: {
    fontSize: responsiveFontSize(24),
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: responsiveFontSize(16),
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  pendingHint: {
    fontSize: responsiveFontSize(12),
    color: COLORS.primary,
    fontStyle: 'italic',
    marginTop: spacing.xs,
    textAlign: 'center',
  },
});

export default HistoryScreen;
