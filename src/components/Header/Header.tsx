// src/components/Header.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import StyledButton from '../StyledButton/StyledButton';
import { Box, Typography } from '@mui/material';
import SearchBar from './components/SearchBar/SearchBar';

const Header: React.FC = () => (
  <header className="app-header">
    <Box className="header-left">
      <Link to="/">React</Link>
      <Link to="/orders">
        История заказов
      </Link>
    </Box>
    <Box className="header-right">
      <SearchBar/>
      {/* <Link to="/cart" className="cart-link">Корзина</Link>
      <Link to="/orders" className="orders-link" style={{ marginLeft: '15px' }}>История заказов</Link>
      <div className="profile-icon" style={{ marginLeft: '15px' }}>Иконка профиля</div>
      <div className="address" style={{ marginLeft: '15px' }}>Ваш адрес</div> */}
    </Box>
    <StyledButton>test</StyledButton>
  </header>
);

export default Header;
