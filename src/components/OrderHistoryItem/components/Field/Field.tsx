import React, { ReactNode } from 'react';
import { Box } from '@mui/material';
import styles from './Field.module.scss';

interface FieldProps {
  label: string;
  value: string | ReactNode;
}

const Field: React.FC<FieldProps> = ({ label, value }) => {
  return (
    <Box className={styles.field}>
      <Box className={styles.field__label}>{label}</Box>
      <Box className={styles.field__value}>{value}</Box>
    </Box>
  );
};

export default Field;
