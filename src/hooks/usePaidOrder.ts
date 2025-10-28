import {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from '../store/hooks';
import {getPaidOrder} from '../store/slices/orderSlice';

/**
 * Custom hook to fetch and manage paid order data
 * @param orderId - The ID of the order to fetch
 * @returns Object containing order data, loading state, and error
 */
export const usePaidOrder = (orderId: string | number) => {
  const dispatch = useAppDispatch();
  const {currentOrder, loading, error} = useAppSelector(state => state.order);

  useEffect(() => {
    if (orderId) {
      dispatch(getPaidOrder(orderId.toString()));
    }
  }, [orderId, dispatch]);

  return {
    order: currentOrder,
    loading,
    error,
    refetch: () => dispatch(getPaidOrder(orderId.toString())),
  };
};
