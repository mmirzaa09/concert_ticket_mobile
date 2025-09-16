import {useAppDispatch, useAppSelector} from '../store/hooks';
import {
  createOrderInquiry,
  clearOrder,
  clearError,
  clearSuccess,
  resetOrderState,
  selectCurrentOrder,
  selectOrderLoading,
  selectOrderError,
  selectOrderSuccess,
  selectIsOrderExpired,
  selectOrderTimeRemaining,
  CreateOrderInquiryPayload,
} from '../store/slices/orderSlice';

export const useOrder = () => {
  const dispatch = useAppDispatch();

  // Selectors
  const currentOrder = useAppSelector(selectCurrentOrder);
  const loading = useAppSelector(selectOrderLoading);
  const error = useAppSelector(selectOrderError);
  const success = useAppSelector(selectOrderSuccess);
  const isOrderExpired = useAppSelector(selectIsOrderExpired);
  const timeRemaining = useAppSelector(selectOrderTimeRemaining);

  // Actions
  const createOrder = async (payload: CreateOrderInquiryPayload) => {
    return dispatch(createOrderInquiry(payload));
  };

  const clearCurrentOrder = () => {
    dispatch(clearOrder());
  };

  const clearErrorMessage = () => {
    dispatch(clearError());
  };

  const clearSuccessMessage = () => {
    dispatch(clearSuccess());
  };

  const resetState = () => {
    dispatch(resetOrderState());
  };

  return {
    // State
    currentOrder,
    loading,
    error,
    success,
    isOrderExpired,
    timeRemaining,

    // Actions
    createOrder,
    clearCurrentOrder,
    clearErrorMessage,
    clearSuccessMessage,
    resetState,
  };
};
