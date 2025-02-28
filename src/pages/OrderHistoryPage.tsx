// src/pages/OrderHistoryPage.tsx
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { orm } from '../models';
import { Order } from '../slices/ordersSlice';
import { Link } from 'react-router-dom';
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
        // <ul>
        //   {orders.map((order: Order) => {
        //     const totalCost = calculateTotal(order.items);
        //     return (
        //       <li
        //         key={order.id}
        //         style={{
        //           marginBottom: '20px',
        //           borderBottom: '1px solid #ccc',
        //           paddingBottom: '10px',
        //         }}
        //       >
        //         <p>
        //           <strong>Заказ №{order.id}</strong> — Общая стоимость:{' '}
        //           ${totalCost.toFixed(2)}
        //         </p>
        //         <p>Имя: {order.name}</p>
        //         <p>Адрес: {order.address}</p>
        //         <p>Телефон: {order.phone}</p>
        //         <p>Время: {order.time}</p>
        //         <p>
        //           Дата оформления:{' '}
        //           {new Date(order.createdAt).toLocaleString()}
        //         </p>
        //         <p>Товаров в заказе: {order.items.length}</p>
        //         {/* Кнопка "Подробнее" */}
        //         <Link to={`/orders/${order.id}`}>
        //           <button style={{ marginTop: '10px' }}>Подробнее</button>
        //         </Link>
        //       </li>
        //     );
        //   })}
        // </ul>
      )}
    </div>
  );
};

export default OrderHistoryPage;
