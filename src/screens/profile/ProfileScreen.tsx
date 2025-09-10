import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {TabParamList} from '../../types';
import {COLORS} from '../../constants';
import {globalStyles} from '../../styles/globalStyles';
import {responsiveFontSize, spacing} from '../../utils';
import {useAuth} from '../../context/AuthContext';
import {NavigationService} from '../../services/NavigationService';
import {useGlobalModalContext} from '../../context/GlobalModalContext';

type ProfileScreenNavigationProp = BottomTabNavigationProp<
  TabParamList,
  'Profile'
>;

interface Props {
  navigation: ProfileScreenNavigationProp;
}

const ProfileScreen: React.FC<Props> = ({navigation: _navigation}) => {
  const {state, logout, checkAuthStatus} = useAuth();
  const {showConfirm} = useGlobalModalContext();

  // Get user from auth context
  const user = state.user;
  console.log('User data in ProfileScreen:', user);

  // Default avatar if user doesn't have one
  const defaultAvatar =
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80';

  const handleEditProfile = () => {
    Alert.alert('Coming Soon', 'Profile editing will be available soon!');
  };

  const handleSettings = () => {
    Alert.alert('Coming Soon', 'Settings will be available soon!');
  };

  const handleLogout = () => {
    showConfirm(
      'Logout',
      'Are you sure you want to logout?',
      async () => {
        try {
          console.log('Before logout - checking auth status...');
          await checkAuthStatus();

          // Use AuthContext logout method
          await logout();

          console.log('After logout - checking auth status...');
          await checkAuthStatus();

          // Small delay to ensure AsyncStorage operations complete
          setTimeout(() => {
            NavigationService.reset('Login');
          }, 100);
        } catch (error) {
          Alert.alert('Error', 'Failed to logout. Please try again.');
          console.error('Logout error:', error);
        }
      },
      () => {
        console.log('User cancelled logout');
      },
      {
        confirmText: 'Logout',
        cancelText: 'Cancel',
        confirmStyle: 'destructive',
      },
    );
  };

  const handleSupport = () => {
    Alert.alert('Support', 'Contact us at support@queueless.com');
  };

  const menuItems = [
    {
      title: 'Edit Profile',
      subtitle: 'Update your personal information',
      onPress: handleEditProfile,
      icon: '👤',
    },
    {
      title: 'Settings',
      subtitle: 'App preferences and notifications',
      onPress: handleSettings,
      icon: '⚙️',
    },
    {
      title: 'Support',
      subtitle: 'Get help and contact us',
      onPress: handleSupport,
      icon: '🎧',
    },
    {
      title: 'Logout',
      subtitle: 'Sign out of your account',
      onPress: handleLogout,
      icon: '🚪',
      danger: true,
    },
  ];

  // Show loading or error state if user is not available
  if (!user) {
    return (
      <SafeAreaView style={globalStyles.container}>
        <View style={[styles.container, styles.loadingContainer]}>
          <Text style={styles.userName}>Loading user profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={globalStyles.container}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Image
              source={{uri: user.avatar || defaultAvatar}}
              style={styles.avatar}
            />
            <TouchableOpacity
              style={styles.editAvatarButton}
              onPress={handleEditProfile}>
              <Text style={styles.editAvatarText}>📷</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Concerts</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>5</Text>
              <Text style={styles.statLabel}>This Year</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>3</Text>
              <Text style={styles.statLabel}>Upcoming</Text>
            </View>
          </View>
        </View>

        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.menuItem, item.danger && styles.dangerMenuItem]}
              onPress={item.onPress}>
              <View style={styles.menuItemLeft}>
                <Text style={styles.menuIcon}>{item.icon}</Text>
                <View style={styles.menuTextContainer}>
                  <Text
                    style={[
                      styles.menuTitle,
                      item.danger && styles.dangerMenuTitle,
                    ]}>
                    {item.title}
                  </Text>
                  <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                </View>
              </View>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>QueueLess v1.0.0</Text>
          <Text style={styles.footerText}>
            Member since {new Date(user.createdAt).getFullYear()}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: spacing.lg,
    alignItems: 'center',
    paddingBottom: spacing.xxl,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: spacing.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: COLORS.gold,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.gold,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editAvatarText: {
    fontSize: responsiveFontSize(16),
  },
  userName: {
    fontSize: responsiveFontSize(24),
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: spacing.xs,
  },
  userEmail: {
    fontSize: responsiveFontSize(16),
    color: COLORS.textSecondary,
    marginBottom: spacing.lg,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: spacing.md,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: responsiveFontSize(20),
    fontWeight: 'bold',
    color: COLORS.gold,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: responsiveFontSize(12),
    color: COLORS.textSecondary,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: spacing.md,
  },
  menuContainer: {
    padding: spacing.md,
  },
  menuItem: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dangerMenuItem: {
    backgroundColor: 'rgba(255, 68, 68, 0.1)',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    fontSize: responsiveFontSize(24),
    marginRight: spacing.md,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: responsiveFontSize(16),
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: spacing.xs,
  },
  dangerMenuTitle: {
    color: COLORS.error,
  },
  menuSubtitle: {
    fontSize: responsiveFontSize(14),
    color: COLORS.textSecondary,
  },
  menuArrow: {
    fontSize: responsiveFontSize(24),
    color: COLORS.textMuted,
  },
  footer: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  footerText: {
    fontSize: responsiveFontSize(12),
    color: COLORS.textMuted,
    marginBottom: spacing.xs,
  },
});

export default ProfileScreen;
