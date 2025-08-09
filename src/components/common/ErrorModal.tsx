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

interface ErrorModalProps {
  visible: boolean;
  title?: string;
  message: string;
  statusCode?: number;
  onClose: () => void;
  onRetry?: () => void;
  retryText?: string;
  closeText?: string;
}

const {width} = Dimensions.get('window');

const ErrorModal: React.FC<ErrorModalProps> = ({
  visible,
  title = 'Error',
  message,
  statusCode,
  onClose,
  onRetry,
  retryText = 'Retry',
  closeText = 'Close',
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

  const getErrorIcon = () => {
    if (statusCode) {
      switch (statusCode) {
        case 400:
          return '📝'; // Bad Request
        case 401:
          return '🔒'; // Unauthorized
        case 403:
          return '🚫'; // Forbidden
        case 404:
          return '🔍'; // Not Found
        case 408:
          return '⏱️'; // Request Timeout
        case 422:
          return '⚠️'; // Unprocessable Entity
        case 429:
          return '🚦'; // Too Many Requests
        case 500:
          return '🔧'; // Internal Server Error
        case 502:
        case 503:
        case 504:
          return '📡'; // Server/Network errors
        default:
          return '❌'; // Generic error
      }
    }

    // Fallback to message-based detection
    if (message.toLowerCase().includes('network')) {
      return '📡';
    }
    if (message.toLowerCase().includes('timeout')) {
      return '⏱️';
    }
    if (message.toLowerCase().includes('unauthorized')) {
      return '🔒';
    }
    if (message.toLowerCase().includes('server')) {
      return '🔧';
    }
    return '⚠️';
  };

  const getErrorType = () => {
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

    // Fallback to message-based detection
    if (message.toLowerCase().includes('network')) {
      return 'Network Error';
    }
    if (message.toLowerCase().includes('timeout')) {
      return 'Request Timeout';
    }
    if (message.toLowerCase().includes('unauthorized')) {
      return 'Authentication Error';
    }
    if (message.toLowerCase().includes('server')) {
      return 'Server Error';
    }
    return title;
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
          <View style={styles.iconContainer}>
            <Text style={styles.errorIcon}>{getErrorIcon()}</Text>
          </View>

          <Text style={styles.title}>{getErrorType()}</Text>

          <Text style={styles.message}>{message}</Text>

          <View style={styles.buttonContainer}>
            {onRetry && (
              <TouchableOpacity
                style={[styles.button, styles.retryButton]}
                onPress={onRetry}>
                <Text style={styles.retryButtonText}>{retryText}</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[
                styles.button,
                styles.closeButton,
                !onRetry && styles.singleButton,
              ]}
              onPress={onClose}>
              <Text style={styles.closeButtonText}>{closeText}</Text>
            </TouchableOpacity>
          </View>
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
    backgroundColor: COLORS.error + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  errorIcon: {
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
  },
  button: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginHorizontal: spacing.xs,
  },
  singleButton: {
    marginHorizontal: 0,
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

export default ErrorModal;
