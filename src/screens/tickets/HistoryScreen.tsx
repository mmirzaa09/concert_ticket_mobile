import React from 'react';
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
import {TabParamList} from '../../types';
import {COLORS} from '../../constants';
import {globalStyles} from '../../styles/globalStyles';
import {
  formatPrice,
  formatDate,
  responsiveFontSize,
  spacing,
} from '../../utils';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {fetchUserTickets} from '../../store/slices/ticketsSlice';

type HistoryScreenNavigationProp = BottomTabNavigationProp<
  TabParamList,
  'History'
>;

interface Props {
  navigation: HistoryScreenNavigationProp;
}

const HistoryScreen: React.FC<Props> = ({navigation: _navigation}) => {
  const dispatch = useAppDispatch();
  const {tickets, isLoading, error} = useAppSelector(state => state.tickets);
  const {user} = useAppSelector(state => state.auth);

  // Fetch user tickets on component mount
  React.useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserTickets(user.id));
    }
  }, [dispatch, user?.id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return COLORS.success;
      case 'used':
        return COLORS.textMuted;
      case 'cancelled':
        return COLORS.error;
      default:
        return COLORS.textSecondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'used':
        return 'Used';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  };

  const renderTicketItem = ({item}: {item: (typeof tickets)[0]}) => (
    <TouchableOpacity style={styles.ticketCard}>
      <Image source={{uri: item.concertImage}} style={styles.ticketImage} />
      <View style={styles.ticketInfo}>
        <Text style={styles.ticketTitle}>{item.concertTitle}</Text>
        <Text style={styles.ticketVenue}>{item.venue}</Text>
        <Text style={styles.ticketDate}>
          Purchased: {formatDate(item.purchaseDate)}
        </Text>
        <View style={styles.ticketFooter}>
          <Text style={styles.ticketPrice}>{formatPrice(item.price)}</Text>
          <View
            style={[
              styles.statusBadge,
              {backgroundColor: getStatusColor(item.status)},
            ]}>
            <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ticket History</Text>
        <Text style={styles.headerSubtitle}>Your concert journey</Text>
      </View>

      {error ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Error loading tickets</Text>
          <Text style={styles.emptySubtitle}>
            Failed to load your ticket history. Please try again.
          </Text>
        </View>
      ) : tickets.length > 0 ? (
        <FlatList
          data={tickets}
          renderItem={renderTicketItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshing={isLoading}
          onRefresh={() => user?.id && dispatch(fetchUserTickets(user.id))}
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
});

export default HistoryScreen;
