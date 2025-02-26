// src/pages/ProductPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchEntityById, fetchEntities } from '../api';
import { addToCart } from '../slices/cartSlice';
import Product from '../components/Product/Product';

const ProductPage: React.FC = () => {
 
  return (
    <Product/>
  );
};

export default ProductPage;
