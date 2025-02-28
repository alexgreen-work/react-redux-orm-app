import { Box } from '@mui/material';
import React from 'react';
import styles from './Footer.module.scss';
import {
  appstoreButton,
  facebookIcon,
  googleButton,
  instagramIcon,
  vkIcon,
} from '../../icons';
import { Link } from 'react-router-dom';
import { cx } from '@emotion/css';

const Footer: React.FC = () => (
  <footer className={styles.footer}>
    <Box className={styles.footer__content}>
      <Box className={styles.footer__left}>
        <Box
          className={cx(
            styles['footer__left-item'],
            styles['footer__left-react']
          )}
        >
          React
        </Box>
      </Box>
      <Box className={styles.footer__right}>
        <Box className={styles.right__socials}>
          <Box className={styles.socials__header}>Присоединяйтесь к нам</Box>
          <Box className={styles.socials__icons}>
            <Box className={styles['socials__icons-icon']}>
              <Link to="/">
                <img src={facebookIcon} />
              </Link>
            </Box>
            <Box className={styles['socials__icons-icon']}>
              <Link to="/">
                <img src={vkIcon} />
              </Link>
            </Box>
            <Box className={styles['socials__icons-icon']}>
              <Link to="/">
                <img src={instagramIcon} />
              </Link>
            </Box>
          </Box>
        </Box>
        <Box className={styles.right__apps}>
          <Box className={styles.apps__header}>Устанавливайте приложение</Box>
          <Box className={styles.apps__buttons}>
            <Box className={styles['apps__buttons-button']}>
              <Link to="/">
                <img src={googleButton} />
              </Link>
            </Box>
            <Box className={styles['apps__buttons-button']}>
              <Link to="/">
                {' '}
                <img src={appstoreButton} />
              </Link>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
    <Box className={styles.footer__copyright}>
      <Box className={styles['footer__copyright-item']}>© Sionic</Box>
      <Box className={styles['footer__copyright-item']}>
        <Link to="/">Правовая информация</Link>
      </Box>
      <Box className={styles['footer__copyright-item']}>
        <Link to="/">Политика конфиденциальности</Link>
      </Box>
    </Box>
  </footer>
);

export default Footer;
