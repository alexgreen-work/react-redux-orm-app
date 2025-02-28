// src/pages/OrderDetailsPage.tsx
import React from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { orm } from '../models';
import { Order } from '../slices/ordersSlice';
import { Box } from '@mui/material';
import styles from './OrderDetailsPage.module.scss';
import HistoryProduct from '../components/HistoryProduct/HistoryProduct';
import { Product, ProductVariation } from '../types';

const OrderDetailsPage: React.FC = () => {
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const orderId = Number(id);
  const order = useSelector((state: RootState) =>
    state.orders.orders.find((o: Order) => o.id === orderId)
  );

  // Маппинг продуктов из Redux‑ORM
  const productsMap = useSelector((state: RootState) => {
    const session = orm.session(state.orm);
    const productsArray: Product[] = session.Product.all().toModelArray();
    const map: Record<number, Product> =
      {};
    productsArray.forEach(prod => {
      map[Number(prod.id)] = prod;
    });
    return map;
  });

  // Маппинг вариаций из Redux‑ORM
  const variationsMap = useSelector((state: RootState) => {
    const session = orm.session(state.orm);
    const variationsArray: ProductVariation[] = session.ProductVariation.all().toModelArray();
    const map: Record<number, ProductVariation> = {};
    variationsArray.forEach(variation => {
      map[Number(variation.id)] = variation;
    });
    return map;
  });

  if (!order) {
    return <div>Заказ не найден</div>;
  }

  const calculateTotalForItem = (item: any): number => {
    const variation = variationsMap[item.variationId];
    const price = variation ? variation.price : 0;
    return price * item.quantity;
  };


  const showProducts = () => {
    return order.items.map((item) => {
      const product = productsMap[item.productId];
      const variation = variationsMap[item.variationId];
      console.log({product, variation})
      if(product && variation){
        return <HistoryProduct cartItem={item} product={product} variation={variation} />
      }
    })
  }

  return (
    <Box className={styles.order}>
      <Box className={styles.order__back}>
        <Link to={location.state?.from || '/'}>{'<'} Назад </Link>
      </Box>
      <Box className={styles.order__name}>Заказ №{order.id}</Box>
      <Box className={styles.order__content}>
        <Box className={styles.content__head}>Товары</Box>
        <Box className={styles.content__products}>
          {showProducts()}
        </Box>
      </Box>
    </Box>
    // <div className="page-container">
    //   <h2>Детали заказа №{order.id}</h2>
    //   <p>
    //     <strong>Имя:</strong> {order.name}
    //   </p>
    //   <p>
    //     <strong>Адрес:</strong> {order.address}
    //   </p>
    //   <p>
    //     <strong>Телефон:</strong> {order.phone}
    //   </p>
    //   <p>
    //     <strong>Время:</strong> {order.time}
    //   </p>
    //   <p>
    //     <strong>Дата оформления:</strong>{' '}
    //     {new Date(order.createdAt).toLocaleString()}
    //   </p>
    //   <h3>Товары в заказе</h3>
    //   <ul>
    //     {order.items.map(item => {
    //       const product = productsMap[item.productId];
    //       const variation = variationsMap[item.variationId];
    //       const itemTotal = calculateTotalForItem(item);
    //       return (
    //         <li key={`${item.productId}-${item.variationId}`} style={{ marginBottom: '10px' }}>
    //           {product ? product.name : `Продукт с id ${item.productId}`} –{' '}
    //           {item.quantity} шт.{' '}
    //           {variation
    //             ? `по $${variation.price} = $${itemTotal.toFixed(2)}`
    //             : 'цена не указана'}
    //         </li>
    //       );
    //     })}
    //   </ul>
    //   <p>
    //     <strong>Общая стоимость заказа:</strong> ${totalCost.toFixed(2)}
    //   </p>
    //   <Link to="/orders">
    //     <button>Назад к истории заказов</button>
    //   </Link>
    // </div>
  );
};

export default OrderDetailsPage;
