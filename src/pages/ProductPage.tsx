// src/pages/ProductPage.tsx
import React from 'react';
import Product from '../components/Product/Product';
import styles from './Page.module.scss';
import { Box } from '@mui/material';

const ProductPage: React.FC = () => {
  return (
    <Box className={styles.page}>
      <Product />
    </Box>
  );
};

export default ProductPage;
