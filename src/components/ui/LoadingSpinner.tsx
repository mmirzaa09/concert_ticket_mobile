import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {COLORS} from '../../constants';
import {responsiveFontSize, spacing} from '../../utils';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = COLORS.gold,
  text,
}) => {
  const getSpinnerSize = (): number => {
    switch (size) {
      case 'small':
        return 20;
      case 'large':
        return 50;
      default:
        return 35;
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.spinner,
          {
            width: getSpinnerSize(),
            height: getSpinnerSize(),
            borderColor: `${color}30`,
            borderTopColor: color,
          },
        ]}
      />
      {text && <Text style={styles.text}>{text}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
  },
  spinner: {
    borderWidth: 3,
    borderRadius: 50,
    // Animation would be added with react-native-reanimated
  },
  text: {
    marginTop: spacing.sm,
    fontSize: responsiveFontSize(14),
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

export default LoadingSpinner;
