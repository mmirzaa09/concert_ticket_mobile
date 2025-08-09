import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ImageBackground,
  Dimensions,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../types';
import {COLORS} from '../../constants';
import {globalStyles} from '../../styles/globalStyles';
import {isValidEmail, responsiveFontSize, spacing} from '../../utils';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {loginUser, clearError} from '../../store/slices/authSlice';
import {useGlobalModalContext} from '../../context/GlobalModalContext';

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Login'
>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

const {width, height} = Dimensions.get('window');

const LoginScreen: React.FC<Props> = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useAppDispatch();
  const {isLoading, error} = useAppSelector(state => state.auth);

  const {showError, showSuccess} = useGlobalModalContext();

  const handleLogin = async (): Promise<void> => {
    if (!email || !password) {
      showError('Please fill in all fields', 'Missing Information');
      return;
    }

    if (!isValidEmail(email)) {
      showError('Please enter a valid email address', 'Invalid Email');
      return;
    }

    try {
      const result = await dispatch(loginUser({email, password}));
      if (loginUser.fulfilled.match(result)) {
        showSuccess('Login successful!', 'Success');
        navigation.navigate('MainTabs');
      } else {
        // Extract error information from the result
        const errorPayload = result.payload as any;
        const statusCode = errorPayload?.status_code || 400;
        const message =
          errorPayload?.message || 'Login failed. Please try again.';

        showError(message, 'Login Failed', statusCode, {
          showRetryButton: true,
          retryAction: handleLogin,
        });
      }
    } catch (err: any) {
      const statusCode = err?.status_code || 500;
      const message = err?.message || 'An unexpected error occurred';

      showError(message, 'Login Failed', statusCode, {
        showRetryButton: true,
        retryAction: handleLogin,
      });
    }
  };

  // Clear error when component unmounts
  React.useEffect(() => {
    return () => {
      if (error) {
        dispatch(clearError());
      }
    };
  }, [dispatch, error]);

  const handleSocialLogin = (provider: string): void => {
    Alert.alert('Coming Soon', `${provider} login will be available soon!`);
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <ImageBackground
        source={{
          uri: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        }}
        style={styles.backgroundImage}
        resizeMode="cover">
        <View style={styles.overlay}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>
                Sign in to continue your journey
              </Text>
            </View>

            <View style={styles.formContainer}>
              <View style={globalStyles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor={COLORS.textMuted}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View style={globalStyles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor={COLORS.textMuted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>

              <TouchableOpacity
                style={[
                  styles.loginButton,
                  isLoading && styles.loginButtonDisabled,
                ]}
                onPress={handleLogin}
                disabled={isLoading}>
                <Text style={styles.loginButtonText}>
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Text>
              </TouchableOpacity>

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or continue with</Text>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.socialButtons}>
                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={() => handleSocialLogin('Spotify')}>
                  <Text style={styles.socialButtonText}>🎵 Spotify</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={() => handleSocialLogin('Apple Music')}>
                  <Text style={styles.socialButtonText}>🍎 Apple Music</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.registerLink}
                onPress={() => navigation.navigate('Register')}>
                <Text style={styles.registerText}>
                  Don't have an account?{' '}
                  <Text style={styles.registerTextBold}>Sign Up</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
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
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  title: {
    fontSize: responsiveFontSize(32),
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: responsiveFontSize(16),
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: spacing.lg,
    backdropFilter: 'blur(10px)',
  },
  label: {
    fontSize: responsiveFontSize(14),
    color: COLORS.text,
    marginBottom: spacing.xs,
    fontWeight: '500',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: responsiveFontSize(16),
    color: COLORS.text,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  loginButton: {
    backgroundColor: COLORS.gold,
    borderRadius: 12,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    fontSize: responsiveFontSize(16),
    fontWeight: 'bold',
    color: COLORS.background,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  dividerText: {
    fontSize: responsiveFontSize(14),
    color: COLORS.textSecondary,
    marginHorizontal: spacing.md,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  socialButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginHorizontal: spacing.xs,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  socialButtonText: {
    fontSize: responsiveFontSize(14),
    color: COLORS.text,
    fontWeight: '500',
  },
  registerLink: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
  registerText: {
    fontSize: responsiveFontSize(14),
    color: COLORS.textSecondary,
  },
  registerTextBold: {
    color: COLORS.gold,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
