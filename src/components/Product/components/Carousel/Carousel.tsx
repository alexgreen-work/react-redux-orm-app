import { Box } from '@mui/material';
import React from 'react';
import styles from "./Carousel.module.scss";
import { cx } from '@emotion/css';
import { freeProductsIcon } from '../../../../icons';
import StyledButton from '../../../StyledButton/StyledButton';
import productImage from "../../../../images/product.png";


const Carousel: React.FC = () => (
    <Box className={styles.carousel} sx={{display: 'flex', flexDirection: 'column'}}>
        <Box className={styles.carousel__main}><img src={productImage} /></Box>
        <Box className={styles.carousel__items} sx={{display: 'flex', flexDirection: 'row'}}>
            <Box className={styles['carousel__items-item']}><img src={productImage} /></Box>
            <Box className={styles['carousel__items-item']}><img src={productImage} /></Box>
            <Box className={styles['carousel__items-item']}><img src={productImage} /></Box>
            <Box className={styles['carousel__items-item']}><img src={productImage} /></Box>
            <Box className={styles['carousel__items-item']}><img src={productImage} /></Box>
        </Box>
    </Box>
);

export default Carousel;