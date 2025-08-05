# QueueLess - React Native Architecture

This project follows the React Native new architecture with a clean and scalable folder structure.

## 📁 Folder Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI components (Button, Input, etc.)
│   └── common/         # Common composite components
├── screens/            # Screen components organized by feature
│   ├── auth/           # Authentication screens
│   ├── home/           # Home and dashboard screens
│   ├── onboarding/     # Onboarding flow
│   ├── concerts/       # Concert-related screens
│   └── tickets/        # Ticket management screens
├── navigation/         # Navigation configuration
├── services/           # API and external service integrations
│   └── api/           # API service layer
├── hooks/             # Custom React hooks
├── utils/             # Utility functions and helpers
├── types/             # TypeScript type definitions
├── constants/         # App constants and configuration
├── context/           # React Context providers
├── styles/            # Global styles and themes
└── assets/           # Static assets
    ├── images/        # Image files
    └── icons/         # Icon files
```

## 🎯 Architecture Principles

### 1. **Separation of Concerns**
- UI components are separated from business logic
- Navigation is centralized
- API calls are abstracted into services

### 2. **Type Safety**
- Full TypeScript implementation
- Centralized type definitions
- Strict typing for navigation

### 3. **Reusability**
- Modular component design
- Custom hooks for shared logic
- Utility functions for common operations

### 4. **Scalability**
- Feature-based screen organization
- Consistent file naming conventions
- Clear import/export patterns

## 🚀 Key Features

### Components
- **UI Components**: Basic building blocks (Button, LoadingSpinner)
- **Screen Components**: Full-screen layouts with navigation
- **Context Providers**: State management solutions

### Services
- **API Service**: Centralized API communication
- **Auth Service**: Authentication handling
- **Concert Service**: Concert data management

### Utils
- **Responsive Design**: Screen size calculations
- **Validation**: Form validation helpers
- **Formatting**: Price and date formatting

### Types
- **Navigation Types**: Type-safe navigation
- **API Types**: Request/response interfaces
- **Business Logic Types**: Domain models

## 🎨 Theming

The app uses a concert/music theme with:
- **Dark background** with gold accents
- **Concert imagery** for immersive experience
- **Responsive design** for all screen sizes
- **Consistent spacing** and typography

## 📱 Navigation Structure

```
App
├── Onboarding (Stack)
├── Auth (Stack)
│   ├── Login
│   └── Register
└── Main (Tab/Stack)
    ├── Home
    ├── Concerts
    ├── Tickets
    └── Profile
```

## 🔧 Development Guidelines

### File Naming
- Components: PascalCase (e.g., `LoginScreen.tsx`)
- Utils/Services: camelCase (e.g., `apiService.ts`)
- Constants: UPPER_SNAKE_CASE (e.g., `API_ENDPOINTS`)

### Import Organization
1. React/React Native imports
2. Third-party library imports
3. Internal imports (types, utils, components)
4. Relative imports

### Component Structure
```tsx
// 1. Imports
import React from 'react';
import {View, Text} from 'react-native';

// 2. Types
interface Props {
  title: string;
}

// 3. Component
const Component: React.FC<Props> = ({title}) => {
  return (
    <View>
      <Text>{title}</Text>
    </View>
  );
};

// 4. Styles
const styles = StyleSheet.create({
  // styles here
});

// 5. Export
export default Component;
```

## 🧪 Testing Strategy

- **Unit Tests**: Component logic and utilities
- **Integration Tests**: Navigation and API calls
- **E2E Tests**: Complete user flows

## 🚀 Getting Started

1. Install dependencies: `npm install`
2. Run iOS: `npx react-native run-ios`
3. Run Android: `npx react-native run-android`

## 📈 Future Enhancements

- [ ] Implement actual API integration
- [ ] Add state management (Redux/Zustand)
- [ ] Implement push notifications
- [ ] Add offline support
- [ ] Implement real-time queue updates
- [ ] Add analytics and crash reporting
