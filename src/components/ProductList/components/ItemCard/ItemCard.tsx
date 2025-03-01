import React from 'react';
import styles from './ItemCard.module.scss';
import StyledButton from '../../../StyledButton/StyledButton';
import colors from '../../../../colors/baseColors.module.scss';
import { useNavigate } from 'react-router-dom';
import { ProductListItem } from '../../types';
import productImage from '../../../../images/product.png';
import Badge from '../../../Badge/Badge';

interface ItemCardProps {
  product: ProductListItem;
  onAddToCart?: (product: ProductListItem) => void;
  categoryName?: string;
}

const ItemCard = ({ product, onAddToCart, categoryName }: ItemCardProps) => {
  const navigate = useNavigate();

  const handleAddToCart = () => {
    onAddToCart && onAddToCart(product);
    navigate(`/product/${product.id}`);
  };

  return (
    <div className={styles.card}>
      <div className={styles.productDescription}>
        <div className={styles.productPreviewWrapper}>
          <img src={product.image?.image_url} className={styles.productImage} />
          <div className={styles.productCategory}>
            {categoryName && (
              <Badge
                content={categoryName}
                isSelected
                colorId={product.category_id}
              />
            )}
          </div>
        </div>
        <div className={styles.productName}>{product.name}</div>
        <div className={styles.productPrice}>
          {product.minPrice !== null ? (
            <div>
              от {Intl.NumberFormat('ru-RU').format(product.minPrice)} Р
            </div>
          ) : (
            <div>Цена не указана</div>
          )}
        </div>
      </div>
      <StyledButton
        color={colors.primaryColor}
        bgcolor={colors.white}
        onClick={handleAddToCart}
      >
        Добавить в корзину
      </StyledButton>
    </div>
  );
};

export default ItemCard;
