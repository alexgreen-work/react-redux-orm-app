import React from 'react';
import { Box } from '@mui/material';
import styles from './SubHeader.module.scss';
import { cx } from '@emotion/css';
import { persentIcon, pinkCartIcon, pinkPaketIcon } from '../../../../icons';
import StyledButton from '../../../StyledButton/StyledButton';

interface SubHeaderProps {
  totalPrice: number;
  label: string;
  onSubmit: () => void;
  disabledButton: boolean;
}

const SubHeader: React.FC<SubHeaderProps> = ({
  totalPrice,
  label,
  onSubmit,
  disabledButton,
}) => {
  return (
    <Box className={styles.subheader}>
      <Box className={styles.subheader__header}>{label}</Box>
      <Box className={styles.subheader__totalprice}>
        <Box className={styles.totalprice__label}>Стоимость корзины:</Box>
        <Box className={styles.totalprice__price}>{totalPrice}</Box>
      </Box>
      <Box className={styles.subheader__controls}>
        <StyledButton onClick={onSubmit} disabled={disabledButton}>
          Оформить
        </StyledButton>
      </Box>
      <Box className={styles.subheader__decor}>
        <img
          className={cx(
            styles['subheader__decor-img'],
            styles['subheader__decor-img-packet']
          )}
          src={pinkPaketIcon}
        />
        <img
          className={cx(
            styles['subheader__decor-img'],
            styles['subheader__decor-img-persent']
          )}
          src={persentIcon}
        />
        <img
          className={cx(
            styles['subheader__decor-img'],
            styles['subheader__decor-img-cart']
          )}
          src={pinkCartIcon}
        />
      </Box>
    </Box>
  );
};

export default SubHeader;
