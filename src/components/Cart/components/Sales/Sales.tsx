import React from 'react';
import { Box } from '@mui/material';
import styles from './Sales.module.scss';
import { Moment } from 'moment';

interface SalesProps {
  pcs: number;
  timer: Moment;
  bought: number;
}

const Sales: React.FC<SalesProps> = ({ pcs, timer, bought }) => {
  return (
    <Box
      className={styles.sales}
      sx={{ display: 'flex', alignItems: 'center' }}
    >
      <Box
        className={styles.sales__offer}
        sx={{ display: 'flex', marginRight: '16px' }}
      >
        <Box
          className={styles['sales__offer-pcs']}
          sx={{ padding: '5px 13px' }}
        >
          {pcs} шт.
        </Box>
        <Box
          className={styles['sales__offer-timer']}
          sx={{ padding: '5px 13px' }}
        >
          за {timer.format('hh:mm:ss')}
        </Box>
      </Box>

      <Box className={styles.sales__bought} sx={{ display: 'flex' }}>
        Куплено:
        <Box className={styles['sales__bought-count']}>{bought} шт.</Box>
      </Box>
    </Box>
  );
};

export default Sales;
