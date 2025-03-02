import { Box } from '@mui/material';
import React from 'react';
import styles from './Carousel.module.scss';
import productImage from '../../../../images/product.png';
import { ProductImage } from '../../../../types';

interface CarouselProps {
  images: ProductImage[]
}

const Carousel: React.FC<CarouselProps> = ({ images }) => {

  const showOthers = () => images.slice(1, images.length).map((image) =>
    <Box className={styles['carousel__items-item']}>
      <img src={image.image_url} />
    </Box>
  )


  return (
    <Box
      className={styles.carousel}
      sx={{ display: 'flex', flexDirection: 'column' }}
    >
      <Box className={styles.carousel__main}>
        <img src={images[0].image_url} />
      </Box>
      <Box
        className={styles.carousel__items}
        sx={{ display: 'flex', flexDirection: 'row' }}
      >
        {showOthers()}
      </Box>
    </Box>
  )
};

export default Carousel;
