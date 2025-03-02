import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import styles from './ProductCard.module.scss';
import { cx } from '@emotion/css';
import { freeProductsIcon } from '../../../../icons';
import StyledButton from '../../../StyledButton/StyledButton';
import { Category, Product, ProductVariation, ProductVariationPropertyListValues, ProductVariationPropertyValues, PropertyVariation } from '../../../../types';
import colors from '/src/colors/baseColors.module.scss';
import _ from 'lodash';

interface ProductCardProps {
  variations: ProductVariation[];
  selectedVariation: ProductVariation | null;
  product: Product;
  category?: Category | null;
  handleAddToCart: () => void;
  handleVariationChange: (variation: ProductVariation) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  variations,
  selectedVariation,
  product,
  category,
  handleAddToCart,
  handleVariationChange,
}) => {
  const [properties, setProperties] = useState({});

  useEffect(() => {
    calcVariation()
  }, [variations])
  const calcVariation = () => {
    const res = {};
    variations.forEach((variation) => {
      if (!variation.values) return;
      variation.values.forEach((value) => {
        if (!value.Properties) return;
        value.Properties.forEach((property) => {
          if (property.type === 3) {
            if (!res[property.name]) {
              res[property.name] = []
            }
            res[property.name].push({ value: value.ValuesList[0].value, variation });
          } else {
            res[property.name] = value.value_float || value.value_int || value.value_string
          }
        });
      });
    });
    setProperties(res);
  };

  const showVariationList = (propertyVariations: PropertyVariation[]) => propertyVariations.map((propertyVariation)=>
    <Box className={styles['variation__list-item']}>
  <StyledButton
    bgcolor="transparent"
    color={
      propertyVariation.variation.id === selectedVariation?.id
        ? colors.primaryColor
        : colors.textColor
    }
    onClick={() => handleVariationChange(propertyVariation.variation)}
  >
    <>
    {propertyVariation.value ? propertyVariation.value : ''}
    {propertyVariation.variation.price >= (selectedVariation?.price || 0) ? '+' : '-'}{' '}
    {Math.abs(propertyVariation.variation.price - (selectedVariation?.price || 0))}₽
    </>
  </StyledButton>
</Box>
)

  const showVariations = () =>
    Object.keys(properties).map((propertyName) =>
    (
      <>
        <Box className={styles.variation__title}>{propertyName}</Box>
        <Box className={styles.variation__list}>
          {Array.isArray(properties[propertyName]) ? <>
            {showVariationList(properties[propertyName])}
          </> 
            : <Box className={styles['variation__list-item']}>{properties[propertyName]}</Box>}
        </Box>
      </>
    ))

  return (
    <Box
      className={styles.card}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        padding: '20px',
        backgroundColor: colors.borderColor,
        borderRadius: '20px',
      }}
    >
      <Box
        className={styles.card__price}
        sx={{ display: 'flex', alignItems: 'end' }}
      >
        <Box className={styles['card__price-price']}>
          {selectedVariation?.price}₽{' '}
        </Box>
        за шт.
      </Box>
      <Box className={styles.card__category}>
        Категория: {category?.name}
      </Box>
      <Box
        className={styles.card__variation}
        sx={{ display: 'flex', flexDirection: 'column' }}
      >
        {showVariations()}
      </Box>
      <StyledButton onClick={handleAddToCart}>
        В корзину за {selectedVariation?.price}₽
      </StyledButton>
    </Box>
  );
};

export default ProductCard;
