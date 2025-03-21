import React, { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Box } from '@mui/material';
import { useDispatch } from 'react-redux';
import { fetchEntities, fetchEntityById } from '../../api';
import { addToCart } from '../../slices/cartSlice';
import styles from './Product.module.scss';
import Carousel from './components/Carousel/Carousel';
import { Category, Product as ProductType, ProductVariation } from '../../types';
import ProductCard from './components/ProductCard/ProductCard';

const Product: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [category, setCategory]  = useState<Category | null>(null);
  const [variations, setVariations] = useState<ProductVariation[]>([]);
  const [selectedVariation, setSelectedVariation] =
    useState<ProductVariation | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    async function loadProduct() {
      try {
        const products: ProductType[] = await fetchEntities('Products', {
          filter: {id: Number(id)},
          isGetExtra: true,
        });
        setProduct(products[0])
        const variationsData = await fetchEntities('ProductVariations', {
          filter: { product_id: Number(id) },
          isGetExtra: true,
        });
        setVariations(variationsData);

        const categories = await fetchEntities('Categories', {
          sort: ['name', 'ASC'],
          filter: {id: products[0].category_id}
        });
        setCategory(categories[0]);
        if (variationsData && variationsData.length > 0) {
          setSelectedVariation(variationsData[0]);
        }
        setLoading(false);
      } catch (error) {
        console.error('Ошибка загрузки товара или его вариаций', error);
        setLoading(false);
      }
    }
    loadProduct();
  }, [id]);

  const handleVariationChange = (variation: ProductVariation) => {
    setSelectedVariation(variation);
  };

  const handleAddToCart = () => {
    if (!selectedVariation || !product) return;
    dispatch(
      addToCart({ productId: product.id, variationId: selectedVariation.id })
    );
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (!product) {
    return <div>Товар не найден</div>;
  }

  return (
    <Box className={styles.product}>
      <Box className={styles.product__back}>
        <Link to={location.state?.from || '/'}>{'<'} Назад </Link>
      </Box>
      <Box className={styles.product__title}>{product.name}</Box>
      <Box className={styles.product__content}>
        <Box className={styles.content__left}>
          {product.images ? <Carousel images={product.images} /> : ''}
        </Box>
        <Box
          className={styles.content__right}
          sx={{ width: '100%', maxWidth: '477px' }}
        >
          <ProductCard
            handleAddToCart={handleAddToCart}
            handleVariationChange={handleVariationChange}
            variations={variations}
            selectedVariation={selectedVariation}
            product={product}
            category={category}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Product;
