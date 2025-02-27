import React from 'react';
import Cart from '../components/Cart/Cart';
import styles from './Page.module.scss';
import { Box } from '@mui/material';

const CartPage: React.FC = () => {
  return (
    <Box className={styles.page}>
      <Cart />
    </Box>
  );
};

export default CartPage;
