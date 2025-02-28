import { Box } from '@mui/material';
import React from 'react';
import { cx } from '@emotion/css';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import BannerSide from '../components/BannerSide/BannerSide';
import styles from './Page.module.scss';


interface PageWithBannerSideProps {
    children: any;
}

const PageWithBannerSide: React.FC<PageWithBannerSideProps> = ({ children }) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '100vh' }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', padding: '0 50px' }}>
                <Header />
                <Box className={styles.page}>{children}</Box>
            </Box>
            <BannerSide />
        </Box>
        <Footer />
    </Box>
);

export default PageWithBannerSide;
