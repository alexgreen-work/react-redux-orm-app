// src/components/Header.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import StyledButton from '../StyledButton/StyledButton';
import { Box, Typography } from '@mui/material';
import SearchBar from './components/SearchBar/SearchBar';
import Avatar from './components/StyledAvatar/StyledAvatar';
import Cart from './components/Cart/Cart';
import styles from './Sales.module.scss';
import { cx } from '@emotion/css';
import { Moment } from 'moment';

interface SalesProps {
    pcs: number;
    timer: Moment;
    bought: number;
}

const Sales: React.FC<SalesProps> = ({pcs, timer, bought}) => {

    return (
        <Box className={styles.sales} sx={{display: 'flex', alignItems: 'center'}}>
            <Box className={styles.sales__offer} sx={{display: 'flex', marginRight: '16px'}}>
                <Box className={styles['sales__offer-pcs']} sx={{padding: '5px 13px'}}>{pcs} шт.</Box>
                <Box className={styles['sales__offer-timer']} sx={{padding: '5px 13px'}}>за {timer.format("hh:mm:ss")}</Box>
            </Box>

            <Box className={styles.sales__bought} sx={{display: 'flex'}}>
                Куплено: 
                <Box className={styles['sales__bought-count']}>
                    {bought} шт.
                </Box>
            </Box>


        </Box>
    )
};

export default Sales;
