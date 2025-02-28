// src/components/Cart.tsx
import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { addToCart, clearCart, decreaseFromCart, removeFromCart } from '../../slices/cartSlice';
import { orm } from '../../models';
import { fetchEntities, fetchEntityById } from '../../api';
import { useNavigate } from 'react-router-dom';
import CartItem from './components/CartItem/CartItem';
import { Product, ProductVariation } from '../../types';
import { Box } from '@mui/material';
import styles from './Cart.module.scss';
import SubHeader from './components/SubHeader/SubHeader';

const Cart: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  // Формируем маппинг продуктов из Redux‑ORM
  const productsMap = useSelector((state: RootState) => {
    const session = orm.session(state.orm);
    const productsArray: Product[] = session.Product.all().toModelArray();
    const map: Record<number, Product> = {};
    productsArray.forEach(prod => {
      map[Number(prod.id)] = prod;
    });
    return map;
  });

  // Формируем маппинг вариаций из Redux‑ORM
  const variationsMap = useSelector((state: RootState) => {
    const session = orm.session(state.orm);
    const variationsArray: ProductVariation[] = session.ProductVariation.all().toModelArray();
    const map: Record<number, ProductVariation> = {};
    variationsArray.forEach(variation => {
      map[Number(variation.id)] = variation;
    });
    return map;
  });

  useEffect(() => {
    async function loadMissingProducts() {
      for (const item of cartItems) {
        if (!productsMap[item.productId]) {
          try {
            const product = await fetchEntityById('Products', item.productId);
            dispatch({ type: 'data/loaded', payload: { products: [product] } });
          } catch (error) {
            console.error(`Ошибка загрузки продукта с id ${item.productId}:`, error);
          }

        }
        if (!variationsMap[item.variationId]) {
          const variation = await fetchEntities('ProductVariations', {
            sort: ['price', 'ASC'],
            filter: {
              product_id: [item.productId]
            }
          })
          dispatch({ type: 'data/loaded', payload: { variations: variation } });
        }
      }
    }
    loadMissingProducts();
  }, [cartItems, productsMap, variationsMap, dispatch]);

  const handleRemove = (productId: number, variationId: number) => {
    dispatch(removeFromCart({ productId, variationId }));
  };

  const handleAddQuantity = (productId: number, variationId: number) => {
    dispatch(addToCart({ productId: productId, variationId: variationId }));
  }

  const handleDecreaseQuantity = (productId: number, variationId: number) => {
    dispatch(decreaseFromCart({ productId: productId, variationId: variationId }));
  }

  const handleClearCart = () => {
    dispatch(clearCart());
  }

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const totalPrice = useMemo(() => {
    let total = 0;
    cartItems.forEach((item) => {
      total = total + variationsMap[item.variationId]?.price * item.quantity;
    })
    return total
  }, [cartItems, variationsMap])

  return (
    <Box className={styles.cart}>
      <Box className={styles.header}>
        <Box className={styles.header__label}>
          Корзина
        </Box>
        <Box className={styles.header__control} onClick={handleClearCart}>
          Очистить корзину
        </Box>
      </Box>
    <Box className={styles.wrapper}>
      <Box className={styles.subHeader}>
        <SubHeader disabledButton={!!!(cartItems.length > 0)} totalPrice={totalPrice} label='Xiaomi' onSubmit={handleCheckout} />
      </Box>
      <Box className={styles.content}>
        {cartItems.length === 0 ? (
          <p>Корзина пуста</p>
        ) : ''}
        {cartItems.map(item => {
          const product = productsMap[item.productId];
          const variation = variationsMap[item.variationId];
          return (
            <>
              {product && variation ? (
                <CartItem itemKey={`${product.id}-${variation.id}`} onAddQuantity={handleAddQuantity} onDecreaseQuantity={handleDecreaseQuantity} product={product} variation={variation} quantity={item.quantity} onRemoveItem={handleRemove} />
              ) : (
                <span>Продукт с id {item.productId} не найден {JSON.stringify(product)} var {JSON.stringify(variation)}</span>
              )}
            </>
          );
        })}
      </Box>
    </Box>
    </Box>
  );
};

export default Cart;
