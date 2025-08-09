import React, {useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../types';
import {COLORS} from '../../constants';
import {globalStyles} from '../../styles/globalStyles';
import {responsiveFontSize, spacing} from '../../utils';
import {useAppSelector, useAppDispatch} from '../../store/hooks';
import {restoreUserSession} from '../../store/slices/authSlice';

type OnboardingScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Onboarding'
>;

interface Props {
  navigation: OnboardingScreenNavigationProp;
}

const {width, height} = Dimensions.get('window');

const OnboardingScreen: React.FC<Props> = ({navigation}) => {
  const dispatch = useAppDispatch();
  const {token, isAuthenticated, isLoading} = useAppSelector(
    state => state.auth,
  );

  useEffect(() => {
    // Check if user is already logged in
    const checkAuthStatus = async () => {
      try {
        // Restore user session from AsyncStorage
        await dispatch(restoreUserSession());
        // If user has valid token, redirect to main app
        if (token && isAuthenticated) {
          console.log('User is already logged in, token:', token);
          navigation.navigate('MainTabs');
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      }
    };

    checkAuthStatus();
  }, [dispatch, navigation, token, isAuthenticated]);

  // Auto-redirect when authentication state changes
  useEffect(() => {
    if (isAuthenticated && token && !isLoading) {
      console.log('User authenticated, redirecting to MainTabs');
      navigation.navigate('MainTabs');
    }
  }, [isAuthenticated, token, isLoading, navigation]);

  const handleGetStarted = (): void => {
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <ImageBackground
        source={{
          uri: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        }}
        style={styles.backgroundImage}
        resizeMode="cover">
        <View style={styles.overlay}>
          <View style={styles.content}>
            <View style={styles.textContainer}>
              <Text style={styles.title}>QueueLess</Text>
              <Text style={styles.subtitle}>
                Skip the queue, enjoy the show
              </Text>
              <Text style={styles.description}>
                Get instant access to your favorite concerts without waiting in
                long lines. Book tickets and join virtual queues seamlessly.
              </Text>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.getStartedButton}
                onPress={handleGetStarted}>
                <Text style={styles.getStartedButtonText}>Get Started</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.loginButton}
                onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginButtonText}>
                  Already have an account? Sign In
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: width,
    height: height,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xxl,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: responsiveFontSize(48),
    fontWeight: 'bold',
    color: COLORS.gold,
    textAlign: 'center',
    marginBottom: spacing.md,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: responsiveFontSize(24),
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  description: {
    fontSize: responsiveFontSize(16),
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: spacing.md,
  },
  buttonContainer: {
    marginBottom: spacing.lg,
  },
  getStartedButton: {
    backgroundColor: COLORS.gold,
    borderRadius: 25,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.md,
    shadowColor: COLORS.gold,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  getStartedButtonText: {
    fontSize: responsiveFontSize(18),
    fontWeight: 'bold',
    color: COLORS.background,
  },
  loginButton: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  loginButtonText: {
    fontSize: responsiveFontSize(14),
    color: COLORS.textSecondary,
    textDecorationLine: 'underline',
  },
});

export default OnboardingScreen;
