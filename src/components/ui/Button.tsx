import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {COLORS} from '../../constants';
import {responsiveFontSize, spacing} from '../../utils';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle = styles.button;
    
    switch (variant) {
      case 'secondary':
        return {...baseStyle, ...styles.secondaryButton};
      case 'outline':
        return {...baseStyle, ...styles.outlineButton};
      default:
        return {...baseStyle, ...styles.primaryButton};
    }
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle = styles.buttonText;
    
    switch (variant) {
      case 'secondary':
        return {...baseStyle, ...styles.secondaryButtonText};
      case 'outline':
        return {...baseStyle, ...styles.outlineButtonText};
      default:
        return {...baseStyle, ...styles.primaryButtonText};
    }
  };

  return (
    <TouchableOpacity
      style={[
        getButtonStyle(),
        disabled && styles.disabledButton,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}>
      <Text style={[getTextStyle(), textStyle]}>
        {loading ? 'Loading...' : title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  primaryButton: {
    backgroundColor: COLORS.gold,
  },
  secondaryButton: {
    backgroundColor: COLORS.secondary,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.gold,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: responsiveFontSize(16),
    fontWeight: '600',
  },
  primaryButtonText: {
    color: COLORS.background,
  },
  secondaryButtonText: {
    color: COLORS.text,
  },
  outlineButtonText: {
    color: COLORS.gold,
  },
});

export default Button;
