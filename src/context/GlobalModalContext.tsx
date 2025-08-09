import React, {createContext, useContext, ReactNode} from 'react';
import GlobalModal from '../components/common/GlobalModal';
import {useGlobalModal} from '../hooks/useGlobalModal';

// Create context
const GlobalModalContext = createContext<
  ReturnType<typeof useGlobalModal> | undefined
>(undefined);

// Provider component
interface GlobalModalProviderProps {
  children: ReactNode;
}

export const GlobalModalProvider: React.FC<GlobalModalProviderProps> = ({
  children,
}) => {
  const modalState = useGlobalModal();

  return (
    <GlobalModalContext.Provider value={modalState}>
      {children}

      <GlobalModal
        visible={modalState.isVisible}
        type={modalState.modalType}
        title={modalState.title}
        message={modalState.message}
        statusCode={modalState.statusCode}
        onClose={modalState.hideModal}
        onConfirm={modalState.confirmAction}
        onRetry={modalState.retryAction}
        showCloseButton={modalState.showCloseButton}
        showConfirmButton={modalState.showConfirmButton}
        showRetryButton={modalState.showRetryButton}
      />
    </GlobalModalContext.Provider>
  );
};

// Hook to use the global modal
export const useGlobalModalContext = () => {
  const context = useContext(GlobalModalContext);
  if (context === undefined) {
    throw new Error(
      'useGlobalModalContext must be used within a GlobalModalProvider',
    );
  }
  return context;
};

export default GlobalModalProvider;
