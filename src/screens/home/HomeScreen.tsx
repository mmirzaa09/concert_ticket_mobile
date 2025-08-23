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
import {CompositeNavigationProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {TabParamList, Concert, RootStackParamList} from '../../types';
import {COLORS} from '../../constants';
import {globalStyles} from '../../styles/globalStyles';
import {formatPrice, responsiveFontSize, spacing} from '../../utils';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {fetchConcerts} from '../../store/slices/concertsSlice';
import images from '../../assets';

type HomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, 'Home'>,
  StackNavigationProp<RootStackParamList>
>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<Props> = ({navigation}) => {
  const dispatch = useAppDispatch();
  const {concerts, isLoading, error} = useAppSelector(state => state.concerts);

  // Fetch concerts on component mount
  React.useEffect(() => {
    dispatch(fetchConcerts());
  }, [dispatch]);

  const renderConcertItem = ({item}: {item: Concert}) => {
    return (
      <TouchableOpacity
        style={styles.concertCard}
        onPress={() =>
          navigation.navigate('ConcertDetail', {concertId: item.id})
        }>
        <Image source={images[item.image]} style={styles.concertImage} />
        <View style={styles.concertInfo}>
          <Text style={styles.concertTitle}>{item.title}</Text>
          <Text style={styles.concertArtist}>{item.artist}</Text>
          <Text style={styles.concertVenue}>{item.venue}</Text>
          <Text style={styles.concertPrice}>{formatPrice(item.price)}</Text>
          <View style={styles.queueInfo}>
            <Text style={styles.availableText}>
              {item.available_tickets} tickets left
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Discover Concerts</Text>
        <Text style={styles.headerSubtitle}>
          Find your next musical adventure
        </Text>
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load concerts</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => dispatch(fetchConcerts())}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={concerts}
          renderItem={renderConcertItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshing={isLoading}
          onRefresh={() => dispatch(fetchConcerts())}
        />
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
  concertCard: {
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
  concertImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  concertInfo: {
    padding: spacing.md,
  },
  concertTitle: {
    fontSize: responsiveFontSize(18),
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: spacing.xs,
  },
  concertArtist: {
    fontSize: responsiveFontSize(16),
    color: COLORS.gold,
    marginBottom: spacing.xs,
  },
  concertVenue: {
    fontSize: responsiveFontSize(14),
    color: COLORS.textSecondary,
    marginBottom: spacing.sm,
  },
  concertPrice: {
    fontSize: responsiveFontSize(20),
    fontWeight: 'bold',
    color: COLORS.gold,
    marginBottom: spacing.sm,
  },
  queueInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  queueText: {
    fontSize: responsiveFontSize(12),
    color: COLORS.warning,
  },
  availableText: {
    fontSize: responsiveFontSize(12),
    color: COLORS.success,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  errorText: {
    fontSize: responsiveFontSize(16),
    color: COLORS.error,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  retryButton: {
    backgroundColor: COLORS.gold,
    borderRadius: 12,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  retryButtonText: {
    fontSize: responsiveFontSize(14),
    fontWeight: '600',
    color: COLORS.background,
  },
});

export default HomeScreen;
