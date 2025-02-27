// src/pages/ProductPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchEntityById, fetchEntities } from '../api';
import { addToCart } from '../slices/cartSlice';
import Product from '../components/Product/Product';
import styles from './Page.module.scss';
import { Box } from '@mui/material';

const ProductPage: React.FC = () => {
 
  return (
    <Box className={styles.page}>
    <Product/>
    </Box>
  );
};

export default ProductPage;
