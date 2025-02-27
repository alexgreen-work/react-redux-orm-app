import { Box } from '@mui/material';
import React from 'react';
import styles from "./ProductCard.module.scss";
import { cx } from '@emotion/css';
import { freeProductsIcon } from '../../../../icons';
import StyledButton from '../../../StyledButton/StyledButton';
import { Product, ProductVariation } from '../../../../types';
import colors from '/src/colors/baseColors.module.scss'

interface ProductCardProps {
    variations: ProductVariation[],
    selectedVariation: ProductVariation | null,
    product: Product,
    handleAddToCart: () => void,
    handleVariationChange: (variation: ProductVariation) => void
}

const ProductCard: React.FC<ProductCardProps> = ({ variations, selectedVariation, product, handleAddToCart, handleVariationChange }) => {
    const showVariations = () => {
        return variations.map((variation) => <Box className={styles['variation__list-item']}>
            <StyledButton
                bgcolor='transparent'
                color={variation.id === selectedVariation?.id ? colors.primaryColor : colors.textColor}
                onClick={() => handleVariationChange(variation)}>
                вариант {variation.id} {variation.price >= (selectedVariation?.price || 0) ? '+' : '-'}  {Math.abs(variation.price - (selectedVariation?.price || 0))}₽
            </StyledButton>
        </Box>);
    }
    return (
        <Box className={styles.card} sx={{ display: 'flex', flexDirection: 'column', padding: '20px', backgroundColor: colors.borderColor, borderRadius: '20px' }}>
            <Box className={styles.card__price} sx={{display: 'flex', alignItems: 'end'}}>
            <Box className={styles['card__price-price']}>{selectedVariation?.price}₽ </Box>
                за шт.</Box>
            <Box className={styles.card__category}>Категория: {product.category_id}</Box>
            <Box className={styles.card__variation} sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box className={styles.variation__title}>Вариант</Box>
                <Box className={styles.variation__list}>{showVariations()}</Box>
            </Box>
            <StyledButton onClick={handleAddToCart}>В корзину за {selectedVariation?.price}₽</StyledButton>
        </Box>
    )
};

export default ProductCard;