import {useState, useCallback} from 'react';

export type ModalType = 'success' | 'error' | 'warning' | 'info' | 'confirm';

export interface ModalButton {
  text: string;
  onPress: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

interface ModalState {
  isVisible: boolean;
  modalType: ModalType;
  title: string;
  message: string;
  statusCode?: number;
  buttons: ModalButton[];
  showCloseButton: boolean;
  showConfirmButton: boolean;
  showRetryButton: boolean;
}

const initialState: ModalState = {
  isVisible: false,
  modalType: 'info',
  title: '',
  message: '',
  statusCode: undefined,
  buttons: [],
  showCloseButton: true,
  showConfirmButton: false,
  showRetryButton: false,
};

export const useGlobalModal = () => {
  const [modalState, setModalState] = useState<ModalState>(initialState);

  const showModal = useCallback(
    (
      type: ModalType,
      title: string,
      message: string,
      buttons?: ModalButton[],
      options?: {
        statusCode?: number;
        showCloseButton?: boolean;
      },
    ) => {
      setModalState({
        isVisible: true,
        modalType: type,
        title,
        message,
        statusCode: options?.statusCode,
        buttons: buttons || [],
        showCloseButton: options?.showCloseButton ?? true,
        showConfirmButton: false,
        showRetryButton: false,
      });
    },
    [],
  );

  // Single button modals
  const showSuccess = useCallback(
    (title: string, message: string) => {
      showModal('success', title, message);
    },
    [showModal],
  );

  const showError = useCallback(
    (title: string, message: string, statusCode?: number) => {
      showModal('error', title, message, undefined, {statusCode});
    },
    [showModal],
  );

  const showWarning = useCallback(
    (title: string, message: string) => {
      showModal('warning', title, message);
    },
    [showModal],
  );

  const showInfo = useCallback(
    (title: string, message: string) => {
      showModal('info', title, message);
    },
    [showModal],
  );

  // Two button confirmation modal
  const showConfirm = useCallback(
    (
      title: string,
      message: string,
      onConfirm: () => void,
      onCancel?: () => void,
      options?: {
        confirmText?: string;
        cancelText?: string;
        confirmStyle?: 'default' | 'destructive';
      },
    ) => {
      const buttons: ModalButton[] = [
        {
          text: options?.cancelText || 'Cancel',
          onPress: () => {
            hideModal();
            onCancel?.();
          },
          style: 'cancel',
        },
        {
          text: options?.confirmText || 'OK',
          onPress: () => {
            hideModal();
            onConfirm();
          },
          style: options?.confirmStyle || 'default',
        },
      ];

      showModal('confirm', title, message, buttons, {showCloseButton: false});
    },
    [showModal],
  );

  // Custom modal with multiple buttons
  const showCustom = useCallback(
    (type: ModalType, title: string, message: string, buttons: ModalButton[]) => {
      showModal(type, title, message, buttons, {showCloseButton: false});
    },
    [showModal],
  );

  const hideModal = useCallback(() => {
    setModalState(initialState);
  }, []);

  const confirmAction = useCallback(() => {
    if (modalState.buttons.length > 0) {
      const confirmButton = modalState.buttons.find(btn => btn.style !== 'cancel');
      confirmButton?.onPress();
    }
    hideModal();
  }, [modalState.buttons, hideModal]);

  const cancelAction = useCallback(() => {
    if (modalState.buttons.length > 0) {
      const cancelButton = modalState.buttons.find(btn => btn.style === 'cancel');
      cancelButton?.onPress();
    }
    hideModal();
  }, [modalState.buttons, hideModal]);

  const retryAction = useCallback(() => {
    // Handle retry logic here
    hideModal();
  }, [hideModal]);

  return {
    ...modalState,
    showModal,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showConfirm,
    showCustom,
    hideModal,
    confirmAction,
    cancelAction,
    retryAction,
  };
};
