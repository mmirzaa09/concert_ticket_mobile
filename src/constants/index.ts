// App Configuration
export const APP_CONFIG = {
  APP_NAME: 'QueueLess',
  VERSION: '1.0.0',
  // API_BASE_URL: __DEV__
  //   ? 'http://192.168.1.9:8000'
  //   : 'https://api.queueless.com',
  API_BASE_URL: 'http://192.168.0.199:8000/api',
  API_TIMEOUT: 10000,
};

// Theme Colors
export const COLORS = {
  // Primary Colors
  primary: '#1a1a2e',
  secondary: '#16213e',
  accent: '#0f3460',

  // Concert Theme Colors
  gold: '#ffd700',
  purple: '#8a2be2',
  neon: '#39ff14',

  // Background Colors
  background: '#000000',
  surface: '#1a1a1a',
  card: '#2a2a2a',

  // Text Colors
  text: '#ffffff',
  textSecondary: '#cccccc',
  textMuted: '#888888',

  // Status Colors
  success: '#00ff00',
  error: '#ff4444',
  warning: '#ffaa00',
  info: '#00aaff',

  // Transparent Colors
  overlay: 'rgba(0, 0, 0, 0.7)',
  backdrop: 'rgba(0, 0, 0, 0.5)',
} as const;

// Screen Dimensions
export const SCREEN_PADDING = 20;
export const BORDER_RADIUS = 12;
export const BUTTON_HEIGHT = 50;

// Animation Durations
export const ANIMATION = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  // Auth - User endpoints
  LOGIN: '/user/login',
  REGISTER: '/user/register',
  USERS: '/user/users',

  // Users
  PROFILE: '/users/profile',
  UPDATE_PROFILE: '/users/update',

  // Concerts
  CONCERTS: '/concert',
  CONCERT_DETAIL: '/concert/:id',
  SEARCH_CONCERTS: '/concert/search',

  // Tickets
  TICKETS: '/tickets',
  PURCHASE_TICKET: '/tickets/purchase',
  MY_TICKETS: '/tickets/user/:userId',

  // Queue
  JOIN_QUEUE: '/queue/join',
  QUEUE_STATUS: '/queue/status/:concertId',
  LEAVE_QUEUE: '/queue/leave',
} as const;

// Storage Keys
export const STORAGE_KEYS = {
  USER_TOKEN: '@queueless:userToken',
  USER_DATA: '@queueless:userData',
  ONBOARDING_COMPLETED: '@queueless:onboardingCompleted',
  THEME_PREFERENCE: '@queueless:themePreference',
} as const;
