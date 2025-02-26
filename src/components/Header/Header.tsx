// src/components/Header.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import StyledButton from '../StyledButton/StyledButton';
import { Box, Typography } from '@mui/material';
import SearchBar from './components/SearchBar/SearchBar';
import Avatar from './components/StyledAvatar/StyledAvatar';
import Cart from './components/Cart/Cart';
import styles from './Header.module.scss';
import { cx } from '@emotion/css';

const Header: React.FC = () => (
  <header className={styles.header}>
    <Box className={styles.header__left}>
      <Box className={cx(styles['header__left-item'], styles['header__left-react'])}>
        <Link to="/">React</Link>
      </Box>
      <Box className={cx(styles['header__left-item'], styles['header__left-history'])}>
        <Link to="/orders" >
          История заказов
        </Link>
      </Box>
    </Box>
    <Box className={styles.header__right}>
      <Box className={styles['header__right-item']}>
        <SearchBar />
      </Box>
      <Box className={styles['header__right-item']}>
        <Avatar />
      </Box>
      <Box className={styles['header__right-item']}>
        <Cart />
      </Box>
    </Box>
  </header>
);

export default Header;
