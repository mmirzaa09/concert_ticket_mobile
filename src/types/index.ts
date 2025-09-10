// Navigation Types
export type RootStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
  MainTabs: undefined;
  ConcertDetail: {concertId: string};
  TicketPurchase: {concertId: string};
  Queue: {concertId: string};
  ConcertInquiry: {concertId: string};
  Payment: {
    concert: Concert;
    quantity: number;
    totalPrice: number;
    orderId: string;
  };
  PaymentInstructions: {
    orderId: string;
    paymentMethod: string;
    amount: number;
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
  image_url: string; // Match backend field name
  description: string;
  total_tickets: number; // Match backend field name
  available_tickets: number; // Match backend field name
  status: number; // 0 = inactive, 1 = active
  id_organizer: string; // Match backend field name
  created_at?: string;
  updated_at?: string;
  queueCount?: number; // For frontend display
}

// Concert API Response Types
export interface ConcertResponse {
  id: string;
  title: string;
  artist: string;
  date: string;
  venue: string;
  price: number;
  image_url: string;
  description: string;
  total_tickets: number;
  available_tickets: number;
  status: number;
  id_organizer: string;
  created_at: string;
  updated_at: string;
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

// Payment Types
export interface PaymentMethod {
  name: string;
  icon: string;
  type: 'bank' | 'ewallet' | 'qris';
  number: string;
  account_name: string;
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
