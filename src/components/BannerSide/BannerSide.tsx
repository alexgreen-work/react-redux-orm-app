import { Box } from '@mui/material';
import React from 'react';
import styles from "./BannerSide.module.scss";
import BannerFree from './components/bannerFree/bannerFree';


const BannerSide: React.FC = () => (
    <Box className={styles.column}>
        <Box className={styles.column__banner}>
            <BannerFree/>
        </Box>
    </Box>
);

export default BannerSide;
