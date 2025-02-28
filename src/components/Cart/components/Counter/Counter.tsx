import React from 'react';
import { Box } from '@mui/material';
import styles from './Counter.module.scss';
import { minusIcon, plusIcon } from '../../../../icons';

interface CounterProps {
  handleMinus: () => void;
  handlePlus: () => void;
  value: number;
}

const Counter: React.FC<CounterProps> = ({
  handleMinus,
  handlePlus,
  value,
}) => {
  return (
    <Box className={styles.counter}>
      <Box className={styles.counter__minus} onClick={handleMinus}>
        <img src={minusIcon} />
      </Box>
      <Box className={styles.counter__value}>{value}</Box>
      <Box className={styles.counter__plus} onClick={handlePlus}>
        <img src={plusIcon} />
      </Box>
    </Box>
  );
};

export default Counter;
