// Navigation Types
export type RootStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
  MainTabs: undefined;
  ConcertDetail: {concertId: string};
  TicketPurchase: {concertId: string};
  Queue: {concertId: string};
  PaymentInstructions: {
    paymentMethod: string;
    orderId?: string;
    fromHistory?: boolean;
  };
};

export type TabParamList = {
  Home: undefined;
  History: undefined;
  Profile: undefined;
};

// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
}

// Concert Types
export interface Concert {
  id: string;
  title: string;
  artist: string;
  date: string;
  venue: string;
  price: number;
  image: string;
  description: string;
  totalTickets: number;
  availableTickets: number;
  queueCount: number;
}

// Ticket Types
export interface Ticket {
  id: string;
  concertId: string;
  userId: string;
  purchaseDate: string;
  price: number;
  status: 'active' | 'used' | 'cancelled';
  queuePosition?: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Theme Types
export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  accent: string;
  error: string;
  success: string;
  warning: string;
}
