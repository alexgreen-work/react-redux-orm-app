import { Box } from '@mui/material';
import React from 'react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import BannerSide from '../components/BannerSide/BannerSide';
import styles from './Page.module.scss';
import { useWidth } from '../sizes/devices';
import selfStyles from './PageWithBannerSide.module.scss';


interface PageWithBannerSideProps {
    children: any;
}

const PageWithBannerSide: React.FC<PageWithBannerSideProps> = ({ children }) => {
    const {isXlg, isLessLg, isMoreXlg} = useWidth();
    return (
        <Box className={selfStyles.wrapper}>
            <Box className={selfStyles.wrapper__body}>
                <Box className={selfStyles['wrapper__body-wrapper']}>
                    <Header />
                    {isLessLg ? <BannerSide /> : ''}
                    <Box className={styles.page}>{children}</Box>
                </Box>
                {(isXlg || isMoreXlg) && !isLessLg ? <BannerSide /> : ''}
            </Box>
            <Footer />
        </Box>
    )
};

export default PageWithBannerSide;

