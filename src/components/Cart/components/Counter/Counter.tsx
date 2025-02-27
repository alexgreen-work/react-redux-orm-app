// src/components/Header.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import StyledButton from '../StyledButton/StyledButton';
import { Box, Typography } from '@mui/material';
import SearchBar from './components/SearchBar/SearchBar';
import Avatar from './components/StyledAvatar/StyledAvatar';
import Cart from './components/Cart/Cart';
import styles from './Counter.module.scss';
import { cx } from '@emotion/css';
import moment from 'moment';
import { minusIcon, plusIcon } from '../../../../icons';

interface CounterProps {
    handleMinus: ()=>void;
    handlePlus: ()=>void;
    value: number;
}

const Counter: React.FC<CounterProps> = ({handleMinus, handlePlus, value}) => {

    return (
        <Box className={styles.counter}>
            <Box className={styles.counter__minus} onClick={handleMinus}><img src={minusIcon}/></Box>
            <Box className={styles.counter__value}>{value}</Box>
            <Box className={styles.counter__plus} onClick={handlePlus}><img src={plusIcon}/></Box>
        </Box>
    )
};

export default Counter;
