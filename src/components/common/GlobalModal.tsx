import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {COLORS} from '../../constants';
import {responsiveFontSize, spacing} from '../../utils';
import {ModalType, ModalButton} from '../../hooks/useGlobalModal';

const {width: screenWidth} = Dimensions.get('window');

interface GlobalModalProps {
  visible: boolean;
  type: ModalType;
  title: string;
  message: string;
  buttons: ModalButton[];
  statusCode?: number;
  onClose: () => void;
  onConfirm?: () => void;
  onRetry?: () => void;
  showCloseButton?: boolean;
  showConfirmButton?: boolean;
  showRetryButton?: boolean;
}

const GlobalModal: React.FC<GlobalModalProps> = ({
  visible,
  type,
  title,
  message,
  buttons,
  statusCode,
  onClose,
  onConfirm,
  onRetry,
  showCloseButton = true,
  showConfirmButton = false,
  showRetryButton = false,
}) => {
  const getModalIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      case 'confirm':
        return '❓';
      default:
        return 'ℹ️';
    }
  };

  const getModalColor = () => {
    switch (type) {
      case 'success':
        return COLORS.success;
      case 'error':
        return COLORS.error;
      case 'warning':
        return COLORS.warning;
      case 'info':
        return COLORS.info;
      case 'confirm':
        return COLORS.primary;
      default:
        return COLORS.info;
    }
  };

  const getButtonStyle = (buttonStyle: string) => {
    switch (buttonStyle) {
      case 'destructive':
        return [styles.button, styles.destructiveButton];
      case 'cancel':
        return [styles.button, styles.cancelButton];
      default:
        return [styles.button, styles.defaultButton];
    }
  };

  const getButtonTextStyle = (buttonStyle: string) => {
    switch (buttonStyle) {
      case 'destructive':
        return [styles.buttonText, styles.destructiveButtonText];
      case 'cancel':
        return [styles.buttonText, styles.cancelButtonText];
      default:
        return [styles.buttonText, styles.defaultButtonText];
    }
  };

  const renderButtons = () => {
    // If custom buttons are provided, use them
    if (buttons && buttons.length > 0) {
      return (
        <View style={styles.customButtonContainer}>
          {buttons.map((button, index) => (
            <TouchableOpacity
              key={index}
              style={getButtonStyle(button.style || 'default')}
              onPress={button.onPress}>
              <Text style={getButtonTextStyle(button.style || 'default')}>
                {button.text}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      );
    }

    // Default button rendering for legacy support
    return (
      <View style={styles.buttonContainer}>
        {showRetryButton && onRetry && (
          <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        )}
        {showConfirmButton && onConfirm && (
          <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
            <Text style={styles.confirmButtonText}>OK</Text>
          </TouchableOpacity>
        )}
        {showCloseButton && (
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>
              {showConfirmButton ? 'Cancel' : 'OK'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View
            style={[styles.iconContainer, {backgroundColor: getModalColor()}]}>
            <Text style={styles.icon}>{getModalIcon()}</Text>
          </View>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          {statusCode && (
            <Text style={styles.statusCode}>Error Code: {statusCode}</Text>
          )}

          {renderButtons()}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: spacing.xl,
    alignItems: 'center',
    maxWidth: screenWidth * 0.85,
    minWidth: screenWidth * 0.7,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  icon: {
    fontSize: responsiveFontSize(30),
  },
  title: {
    fontSize: responsiveFontSize(20),
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  message: {
    fontSize: responsiveFontSize(16),
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.lg,
  },
  statusCode: {
    fontSize: responsiveFontSize(12),
    color: COLORS.textMuted,
    marginBottom: spacing.lg,
  },
  // Custom button styles
  customButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: spacing.md,
  },
  button: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  defaultButton: {
    backgroundColor: COLORS.primary,
  },
  cancelButton: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  destructiveButton: {
    backgroundColor: COLORS.error,
  },
  buttonText: {
    fontSize: responsiveFontSize(16),
    fontWeight: '600',
  },
  defaultButtonText: {
    color: COLORS.textSecondary,
  },
  cancelButtonText: {
    color: COLORS.text,
  },
  destructiveButtonText: {
    color: COLORS.surface,
  },
  // Legacy button styles
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: spacing.md,
  },
  closeButton: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    color: COLORS.text,
    fontSize: responsiveFontSize(16),
    fontWeight: '600',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingVertical: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: COLORS.white,
    fontSize: responsiveFontSize(16),
    fontWeight: '600',
  },
  retryButton: {
    flex: 1,
    backgroundColor: COLORS.warning,
    paddingVertical: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  retryButtonText: {
    color: COLORS.surface,
    fontSize: responsiveFontSize(16),
    fontWeight: '600',
  },
});

export default GlobalModal;
