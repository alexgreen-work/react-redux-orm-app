// src/pages/ProductListPage.tsx
import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProductList from '../components/ProductList/ProductList';
import { fetchEntities } from '../api';
import { RootState } from '../store';
import { orm } from '../models';
import Badge from '../components/Badge/Badge';
import styles from './ProductListPage.module.scss';

const ProductListPage: React.FC = () => {
  const dispatch = useDispatch();

  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const [offset, setOffset] = useState(0);
  const limit = 25;
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOffset(0);
    setHasMore(true);
    loadProducts(0);
  }, [selectedCategory]);

  const loadProducts = async (offset: number) => {
    if (loading) return;
    setLoading(true);
    let filter = {};
    if (selectedCategory !== null) {
      filter = { category_id: selectedCategory };
    }
    try {
      const products = await fetchEntities('Products', {
        sort: ['name', 'ASC'],
        range: [offset, offset + limit - 1],
        filter,
        isGetExtra: true,
      });
      const variations = await fetchEntities('ProductVariations', {
        sort: ['price', 'ASC'],
        filter: {
          product_id: products.map((product) => product.id),
        },
      });
      dispatch({ type: 'data/loaded', payload: { products, variations } });
      if (products.length < limit) {
        setHasMore(false);
      }
      setOffset(offset + products.length);
    } catch (error) {
      console.error('Ошибка загрузки продуктов:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadProducts(offset);
        }
      },
      { threshold: 1.0 }
    );
    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }
    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [hasMore, loading]);

  const categories = useSelector((state: RootState) => {
    const session = orm.session(state.orm);
    return session.Category.all().toModelArray();
  });

  return (
    <div className="page-container">
      <h3 className={styles.pageName}>Категории товаров</h3>
      <div className={styles.badgesSection} style={{ marginBottom: '16px' }}>
        <Badge
          content="Все категории"
          colorId={0}
          onClick={() => setSelectedCategory(null)}
          isSelected={selectedCategory === null}
        />
        {categories.map((cat: any) => (
          <Badge
            key={cat.id}
            colorId={cat.id}
            content={cat.name}
            onClick={() => setSelectedCategory(Number(cat.id))}
            isSelected={selectedCategory === Number(cat.id)}
          />
        ))}
      </div>
      <ProductList
        loaderRef={loaderRef}
        loading={loading}
        hasMore={hasMore}
        selectedCategoryId={selectedCategory}
      />
    </div>
  );
};

export default ProductListPage;
