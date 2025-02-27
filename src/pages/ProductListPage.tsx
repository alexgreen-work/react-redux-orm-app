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

  // Выбранная категория (null – показывать все товары)
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  // Параметры infinite scroll
  const [offset, setOffset] = useState(0);
  const limit = 25;
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);

  // При смене категории сбрасываем offset и список (если необходимо)
  useEffect(() => {
    setOffset(0);
    setHasMore(true);
    loadProducts(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  const loadProducts = async (reset = false) => {
    if (loading) return;
    setLoading(true);
    // Формируем фильтр по категории, если выбрана
    let filter = {};
    if (selectedCategory !== null) {
      filter = { category_id: selectedCategory };
    }
    try {
      const products = await fetchEntities('Products', {
        sort: ['name', 'ASC'],
        range: [offset, offset + limit - 1],
        filter,
      });
      const variations = await fetchEntities('ProductVariations', {
        sort: ['price', 'ASC'],
        filter: {
          product_id: products.map((product) => product.id)
        }
      });
      // Диспатчим полученные продукты. В ormReducer используется upsert, чтобы избежать дублей.
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

  // Изначальная загрузка (без фильтра, если ещё не загружено)
  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Настраиваем IntersectionObserver для infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadProducts();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMore, loading]);

  // Получаем список категорий из Redux‑ORM
  const categories = useSelector((state: RootState) => {
    const session = orm.session(state.orm);
    return session.Category.all().toModelArray();
  });

  return (
    <div className="page-container">
      <h3 className={styles.pageName}>Категории товаров</h3>
      {/* Секция выбора категории */}
      <div className={styles.badgesSection} style={{ marginBottom: '16px' }}>
        <Badge content="Все категории" onClick={() => setSelectedCategory(null)} isSelected={selectedCategory === null} />
        {categories.map((cat: any) => (
          <Badge key={cat.id} content={cat.name} onClick={() => setSelectedCategory(Number(cat.id))} isSelected={selectedCategory === Number(cat.id)} />
        ))}
      </div>
      {/* Компонент списка товаров принимает выбранную категорию */}
      <ProductList loaderRef={loaderRef} loading={loading} hasMore={hasMore} selectedCategoryId={selectedCategory} />
    </div>
  );
};

export default ProductListPage;
