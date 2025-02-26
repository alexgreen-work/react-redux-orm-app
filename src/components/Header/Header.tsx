// src/components/Header.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import StyledButton from '../StyledButton/StyledButton';

const Header: React.FC = () => (
  <header className="app-header">
    <div className="header-left">
      <Link to="/"><h1>Магазин</h1></Link>
    </div>
    <div className="header-right">
      <Link to="/cart" className="cart-link">Корзина</Link>
      <Link to="/orders" className="orders-link" style={{ marginLeft: '15px' }}>История заказов</Link>
      <div className="profile-icon" style={{ marginLeft: '15px' }}>Иконка профиля</div>
      <div className="address" style={{ marginLeft: '15px' }}>Ваш адрес</div>
    </div>
    <StyledButton>test</StyledButton>
  </header>
);

export default Header;
