import React, { useMemo } from 'react';
import { Box } from '@mui/material';
import styles from './CartItem.module.scss';
import { Product, ProductVariation } from '../../../../types';
import { bucketIcon } from '../../../../icons';
import cartImage from '../../../../images/cartImage.png';
import Counter from '../Counter/Counter';
import Sales from '../Sales/Sales';
import moment from 'moment';

interface CartItemProps {
  itemKey: string;
  product: Product;
  variation: ProductVariation;
  quantity: number;
  onRemoveItem: (productId: number, variationId: number) => void;
  onAddQuantity: (productId: number, variationId: number) => void;
  onDecreaseQuantity: (productId: number, variationId: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({
  product,
  variation,
  quantity,
  onRemoveItem,
  onDecreaseQuantity,
  onAddQuantity,
  itemKey,
}) => {
  const rand = useMemo(() => Math.random() < 0.5, []);
  const timer = useMemo(() => moment(), []);
  return (
    <Box className={styles.item} key={itemKey}>
      <Box className={styles.item__image}>
        <img src={cartImage} />
      </Box>
      <Box
        className={styles.item__label}
        sx={{ display: 'flex', flexDirection: 'column' }}
      >
        <Box className={styles['item__label-product']}>{product.name}</Box>
        <Box className={styles['item__label-variation']}>{variation.id}</Box>
        <Box className={styles['item__label-sales']}>
          {rand ? <Sales timer={timer} pcs={120} bought={150} /> : ''}
        </Box>
      </Box>
      <Box className={styles.item__count}>
        <Counter
          value={quantity}
          handleMinus={() => onDecreaseQuantity(product.id, variation.id)}
          handlePlus={() => onAddQuantity(product.id, variation.id)}
        />
      </Box>
      <Box className={styles.item__price}>{variation.price * quantity} ₽</Box>
      <Box
        className={styles.item__bucket}
        onClick={() => onRemoveItem(product.id, variation.id)}
      >
        <img src={bucketIcon} />
      </Box>
    </Box>
  );
};

export default CartItem;
