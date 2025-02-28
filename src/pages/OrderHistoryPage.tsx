import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Order } from '../slices/ordersSlice';
import { Box } from '@mui/material';
import OrderHistoryItem from '../components/OrderHistoryItem/OrderHistoryItem';
import styles from './OrderHistoryPage.module.scss';

const OrderHistoryPage: React.FC = () => {
  const orders = useSelector((state: RootState) => state.orders.orders);

  const showOrders = () => {

    return orders.map((order: Order) => {
      return <OrderHistoryItem {...order}/>
    })
  }

  return (
    <div className="page-container">
      <Box>История заказов</Box>
      {orders.length === 0 ? (
        <p>Заказов пока нет</p>
      ) : (
        <Box className={styles.orders}>
        {showOrders()}
        </Box>
      )}
    </div>
  );
};

export default OrderHistoryPage;
