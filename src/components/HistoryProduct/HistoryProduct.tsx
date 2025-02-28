import React from 'react';
import { Box } from '@mui/material';
import styles from './HistoryProduct.module.scss';
import { Product, ProductVariation } from '../../types';
import productImage from '../../images/product.png';
import { CartItem } from '../../slices/cartSlice';

interface HistoryProductProps {
  product: Product;
  variation: ProductVariation;
  cartItem: CartItem;
}

const HistoryProduct: React.FC<HistoryProductProps> = ({
  cartItem,
  product,
  variation,
}) => (
  <Box className={styles.product}>
    <Box className={styles.product__image}>
      <img src={productImage} />
    </Box>
    <Box className={styles.product__content}>
      <Box className={styles['product__content-name']}>
        {product.name} {variation.id}
      </Box>
      <Box className={styles.product__info}>
        <Box className={styles['product__info-price']}>
          {variation.price}₽ / шт.
        </Box>
        <Box className={styles['product__info-quantity']}>
          {cartItem.quantity}/{cartItem.quantity} шт.
        </Box>
      </Box>
    </Box>
  </Box>
);

export default HistoryProduct;
