import {StyleSheet} from 'react-native';
import {COLORS} from '../constants';
import {responsiveFontSize, spacing} from '../utils';

export const globalStyles = StyleSheet.create({
  // Container Styles
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    flex: 1,
    padding: spacing.md,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  
  // Text Styles
  title: {
    fontSize: responsiveFontSize(28),
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  subtitle: {
    fontSize: responsiveFontSize(20),
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: spacing.md,
  },
  bodyText: {
    fontSize: responsiveFontSize(16),
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
  caption: {
    fontSize: responsiveFontSize(14),
    color: COLORS.textMuted,
  },
  
  // Button Styles
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  buttonText: {
    fontSize: responsiveFontSize(16),
    fontWeight: '600',
    color: COLORS.text,
  },
  
  // Input Styles
  inputContainer: {
    marginBottom: spacing.md,
  },
  inputLabel: {
    fontSize: responsiveFontSize(14),
    color: COLORS.textSecondary,
    marginBottom: spacing.xs,
  },
  textInput: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: responsiveFontSize(16),
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  
  // Card Styles
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: COLORS.text,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  // Layout Styles
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Spacing Styles
  marginTop: {
    marginTop: spacing.md,
  },
  marginBottom: {
    marginBottom: spacing.md,
  },
  paddingHorizontal: {
    paddingHorizontal: spacing.md,
  },
  
  // Status Styles
  errorText: {
    color: COLORS.error,
    fontSize: responsiveFontSize(14),
    marginTop: spacing.xs,
  },
  successText: {
    color: COLORS.success,
    fontSize: responsiveFontSize(14),
    marginTop: spacing.xs,
  },
});
