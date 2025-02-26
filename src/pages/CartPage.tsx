// src/pages/CartPage.tsx
import React from 'react';
import Cart from '../components/Cart/Cart';

const CartPage: React.FC = () => {
  return (
    <div className="page-container">
      <h2>Корзина</h2>
      <Cart />
    </div>
  );
};

export default CartPage;
