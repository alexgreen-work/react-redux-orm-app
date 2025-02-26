// src/pages/OrderHistoryPage.tsx
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { orm } from '../models';
import { Order } from '../slices/ordersSlice';
import { Link } from 'react-router-dom';

const OrderHistoryPage: React.FC = () => {
  const orders = useSelector((state: RootState) => state.orders.orders);

  // Маппинг вариаций нужен для расчёта общей стоимости заказа
  const variationsMap = useSelector((state: RootState) => {
    const session = orm.session(state.orm);
    const variationsArray = session.ProductVariation.all().toModelArray();
    const map: Record<number, { id: number; price: number }> = {};
    variationsArray.forEach(variation => {
      map[Number(variation.id)] = {
        id: Number(variation.id),
        price: Number(variation.price),
      };
    });
    return map;
  });

  const calculateTotal = (items: any[]): number => {
    return items.reduce((sum, item) => {
      const variation = variationsMap[item.variationId];
      const price = variation ? variation.price : 0;
      return sum + price * item.quantity;
    }, 0);
  };

  return (
    <div className="page-container">
      <h2>История заказов</h2>
      {orders.length === 0 ? (
        <p>Заказов пока нет</p>
      ) : (
        <ul>
          {orders.map((order: Order) => {
            const totalCost = calculateTotal(order.items);
            return (
              <li
                key={order.id}
                style={{
                  marginBottom: '20px',
                  borderBottom: '1px solid #ccc',
                  paddingBottom: '10px',
                }}
              >
                <p>
                  <strong>Заказ №{order.id}</strong> — Общая стоимость:{' '}
                  ${totalCost.toFixed(2)}
                </p>
                <p>Имя: {order.name}</p>
                <p>Адрес: {order.address}</p>
                <p>Телефон: {order.phone}</p>
                <p>Время: {order.time}</p>
                <p>
                  Дата оформления:{' '}
                  {new Date(order.createdAt).toLocaleString()}
                </p>
                <p>Товаров в заказе: {order.items.length}</p>
                {/* Кнопка "Подробнее" */}
                <Link to={`/orders/${order.id}`}>
                  <button style={{ marginTop: '10px' }}>Подробнее</button>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default OrderHistoryPage;
