import { Box } from '@mui/material';
import React from 'react';
import styles from './BannerFree.module.scss';
import { cx } from '@emotion/css';
import { freeProductsIcon } from '../../../../icons';
import StyledButton from '../../../StyledButton/StyledButton';

const BannerFree: React.FC = () => (
  <Box className={styles.banner}>
    <Box className={styles['banner-border']}>
      <Box className={styles.banner__left}>
        <Box className={styles['banner__left-icon']}>
          <img src={freeProductsIcon} />
        </Box>
      </Box>
      <Box className={styles.banner__right}>
        <Box className={styles['banner__right-header']}>
          Получай товары
          <Box className={styles['right__header-subtitle']}>Бесплатно!</Box>
        </Box>
        <Box className={styles['banner__right-button']}>
          <StyledButton>Узнать подробнее</StyledButton>
        </Box>
      </Box>
    </Box>
  </Box>
);

export default BannerFree;
