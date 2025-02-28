// src/components/Header.tsx
import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import StyledButton from '../StyledButton/StyledButton';
import { Box, Typography } from '@mui/material';
import SearchBar from './components/SearchBar/SearchBar';
import Avatar from './components/StyledAvatar/StyledAvatar';
import Cart from './components/Cart/Cart';
import styles from './Field.module.scss';
import { cx } from '@emotion/css';
import { Moment } from 'moment';

interface FieldProps {
    label: string;
    value: string | ReactNode;
}

const Field: React.FC<FieldProps> = ({label, value}) => {

    return (
        <Box className={styles.field}>
            <Box className={styles.field__label}>{label}</Box>
            <Box className={styles.field__value}>{value}</Box>
        </Box>
    )
};

export default Field;
