import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import {COLORS} from '../../constants';
import {responsiveFontSize, spacing} from '../../utils';

export type ModalType = 'success' | 'error' | 'warning' | 'info';

interface GlobalModalProps {
  visible: boolean;
  type: ModalType;
  title?: string;
  message: string;
  statusCode?: number;
  onClose: () => void;
  onConfirm?: () => void;
  onRetry?: () => void;
  confirmText?: string;
  retryText?: string;
  closeText?: string;
  showCloseButton?: boolean;
  showConfirmButton?: boolean;
  showRetryButton?: boolean;
}

const {width} = Dimensions.get('window');

const GlobalModal: React.FC<GlobalModalProps> = ({
  visible,
  type,
  title,
  message,
  statusCode,
  onClose,
  onConfirm,
  onRetry,
  confirmText = 'OK',
  retryText = 'Retry',
  closeText = 'Close',
  showCloseButton = true,
  showConfirmButton = false,
  showRetryButton = false,
}) => {
  const scaleAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    } else {
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, scaleAnim]);

  const getModalConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: '✅',
          iconColor: COLORS.success,
          defaultTitle: 'Success',
        };
      case 'error':
        return {
          icon: getErrorIcon(),
          iconColor: COLORS.error,
          defaultTitle: getErrorTitle(),
        };
      case 'warning':
        return {
          icon: '⚠️',
          iconColor: COLORS.warning,
          defaultTitle: 'Warning',
        };
      case 'info':
        return {
          icon: 'ℹ️',
          iconColor: COLORS.info,
          defaultTitle: 'Information',
        };
      default:
        return {
          icon: '📝',
          iconColor: COLORS.textMuted,
          defaultTitle: 'Message',
        };
    }
  };

  const getErrorIcon = () => {
    if (statusCode) {
      switch (statusCode) {
        case 400:
          return '📝';
        case 401:
          return '🔒';
        case 403:
          return '🚫';
        case 404:
          return '🔍';
        case 408:
          return '⏱️';
        case 422:
          return '⚠️';
        case 429:
          return '🚦';
        case 500:
          return '🔧';
        case 502:
        case 503:
        case 504:
          return '📡';
        default:
          return '❌';
      }
    }
    return '⚠️';
  };

  const getErrorTitle = () => {
    if (statusCode) {
      switch (statusCode) {
        case 400:
          return 'Bad Request';
        case 401:
          return 'Authentication Required';
        case 403:
          return 'Access Denied';
        case 404:
          return 'Not Found';
        case 408:
          return 'Request Timeout';
        case 422:
          return 'Validation Error';
        case 429:
          return 'Too Many Requests';
        case 500:
          return 'Server Error';
        case 502:
          return 'Bad Gateway';
        case 503:
          return 'Service Unavailable';
        case 504:
          return 'Gateway Timeout';
        default:
          return `Error ${statusCode}`;
      }
    }
    return 'Error';
  };

  const config = getModalConfig();
  const modalTitle = title || config.defaultTitle;

  const renderButtons = () => {
    const buttons = [];

    if (showRetryButton && onRetry) {
      buttons.push(
        <TouchableOpacity
          key="retry"
          style={[styles.button, styles.retryButton]}
          onPress={onRetry}>
          <Text style={styles.retryButtonText}>{retryText}</Text>
        </TouchableOpacity>,
      );
    }

    if (showConfirmButton && onConfirm) {
      buttons.push(
        <TouchableOpacity
          key="confirm"
          style={[styles.button, styles.confirmButton]}
          onPress={onConfirm}>
          <Text style={styles.confirmButtonText}>{confirmText}</Text>
        </TouchableOpacity>,
      );
    }

    if (showCloseButton) {
      buttons.push(
        <TouchableOpacity
          key="close"
          style={[
            styles.button,
            styles.closeButton,
            buttons.length === 0 && styles.singleButton,
          ]}
          onPress={onClose}>
          <Text style={styles.closeButtonText}>{closeText}</Text>
        </TouchableOpacity>,
      );
    }

    return buttons;
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [{scale: scaleAnim}],
            },
          ]}>
          <View
            style={[
              styles.iconContainer,
              {backgroundColor: config.iconColor + '20'},
            ]}>
            <Text style={styles.modalIcon}>{config.icon}</Text>
          </View>

          <Text style={styles.title}>{modalTitle}</Text>

          <Text style={styles.message}>{message}</Text>

          <View style={styles.buttonContainer}>{renderButtons()}</View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  modalContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: spacing.xl,
    alignItems: 'center',
    maxWidth: width * 0.9,
    minWidth: width * 0.8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  modalIcon: {
    fontSize: 30,
  },
  title: {
    fontSize: responsiveFontSize(20),
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  message: {
    fontSize: responsiveFontSize(16),
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.xl,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    flexWrap: 'wrap',
  },
  button: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginHorizontal: spacing.xs,
    minWidth: 80,
  },
  singleButton: {
    marginHorizontal: 0,
  },
  confirmButton: {
    backgroundColor: COLORS.success,
  },
  confirmButtonText: {
    fontSize: responsiveFontSize(16),
    fontWeight: 'bold',
    color: COLORS.text,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
  },
  retryButtonText: {
    fontSize: responsiveFontSize(16),
    fontWeight: 'bold',
    color: COLORS.text,
  },
  closeButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.textMuted,
  },
  closeButtonText: {
    fontSize: responsiveFontSize(16),
    fontWeight: '500',
    color: COLORS.textMuted,
  },
});

export default GlobalModal;
