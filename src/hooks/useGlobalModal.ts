import {useState, useCallback} from 'react';

export type ModalType = 'success' | 'error' | 'warning' | 'info';

interface ModalOptions {
  showCloseButton?: boolean;
  showConfirmButton?: boolean;
  showRetryButton?: boolean;
  confirmAction?: () => void;
  retryAction?: () => void;
}

export const useGlobalModal = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [modalType, setModalType] = useState<ModalType>('info');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [statusCode, setStatusCode] = useState<number | undefined>(undefined);

  // Button visibility states
  const [showCloseButton, setShowCloseButton] = useState(true);
  const [showConfirmButton, setShowConfirmButton] = useState(false);
  const [showRetryButton, setShowRetryButton] = useState(false);

  // Action states
  const [confirmAction, setConfirmAction] = useState<(() => void) | undefined>(
    undefined,
  );
  const [retryAction, setRetryAction] = useState<(() => void) | undefined>(
    undefined,
  );

  const hideModal = useCallback(() => {
    setIsVisible(false);
    setConfirmAction(undefined);
    setRetryAction(undefined);
  }, []);

  const showModal = useCallback(
    (
      type: ModalType,
      msg: string,
      modalTitle?: string,
      code?: number,
      options?: ModalOptions,
    ) => {
      setModalType(type);
      setMessage(msg);
      setTitle(modalTitle || '');
      setStatusCode(code);
      setIsVisible(true);

      // Set button visibility
      setShowCloseButton(options?.showCloseButton ?? true);
      setShowConfirmButton(options?.showConfirmButton ?? false);
      setShowRetryButton(options?.showRetryButton ?? false);

      // Set actions
      if (options?.confirmAction) {
        setConfirmAction(() => options.confirmAction);
      }
      if (options?.retryAction) {
        setRetryAction(() => options.retryAction);
      }
    },
    [],
  );

  const showSuccess = useCallback(
    (msg: string, modalTitle?: string, options?: ModalOptions) => {
      showModal('success', msg, modalTitle, undefined, {
        showConfirmButton: true,
        showRetryButton: false,
        ...options,
      });
    },
    [showModal],
  );

  const showError = useCallback(
    (
      msg: string,
      modalTitle?: string,
      code?: number,
      options?: ModalOptions,
    ) => {
      showModal('error', msg, modalTitle, code, {
        showRetryButton: false,
        ...options,
      });
    },
    [showModal],
  );

  const showWarning = useCallback(
    (msg: string, modalTitle?: string, options?: ModalOptions) => {
      showModal('warning', msg, modalTitle, undefined, {
        showRetryButton: false,
        ...options,
      });
    },
    [showModal],
  );

  const showInfo = useCallback(
    (msg: string, modalTitle?: string, options?: ModalOptions) => {
      showModal('info', msg, modalTitle, undefined, {
        showRetryButton: false,
        ...options,
      });
    },
    [showModal],
  );

  return {
    // State
    isVisible,
    modalType,
    title,
    message,
    statusCode,
    showCloseButton,
    showConfirmButton,
    showRetryButton,
    confirmAction,
    retryAction,

    // Actions
    hideModal,
    showModal,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};
