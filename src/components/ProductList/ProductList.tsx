import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { orm } from '../../models';
import { RootState } from '../../store';
import { ProductListItem } from './types';
import ItemCard from './components/ItemCard/ItemCard';
import styles from './ProductList.module.scss';
import { Category, Product, ProductVariation } from '../../types';

interface ProductListProps {
  selectedCategoryId?: number | null;
  hasMore?: boolean;
  loading?: boolean;
  loaderRef: React.RefObject<HTMLDivElement>;
}

const ProductList: React.FC<ProductListProps> = ({ selectedCategoryId = null, hasMore, loaderRef, loading }) => {
  const products: ProductListItem[] = useSelector((state: RootState) => {
    const session = orm.session(state.orm);
    return session.Product.all().toModelArray().map((productModel: Product) => {
      const variations: ProductVariation[] = session.ProductVariation.all()
        .toModelArray()
        .filter((variation: ProductVariation) => Number(variation.product_id) === Number(productModel.id));
      const validVariations = variations.filter(v => {
        const price = Number(v.price);
        return v.price != null && !isNaN(price);
      });
      let minPrice: number | null = null;
      if (validVariations.length > 0) {
        minPrice = validVariations.reduce((min, curr) => {
          const price = Number(curr.price);
          return min === null ? price : Math.min(min, price);
        }, null as number | null);
      }
      return {
        id: productModel.id,
        name: productModel.name,
        category_id: Number(productModel.category_id),
        minPrice,
      };
    });
  });

  const categories = useSelector((state: RootState) => {
    const session = orm.session(state.orm);
    return session.Category.all().toModelArray().reduce((acc: Category[], curr: Category) => {
      acc[curr.id] = curr;
      return acc;
    }, {});
  });

  const filteredProducts = useMemo(() => {
    return selectedCategoryId
      ? products.filter(p => p.category_id === selectedCategoryId)
      : products;
  }, [selectedCategoryId, products]);

  return (
    <div className={styles.itemsWrapper}>
      {filteredProducts.map(product => {
        return (
          <ItemCard key={product.id} product={product} categoryName={categories[product.category_id]?.name} />
        )
      })}
      <div ref={loaderRef} style={{ height: '20px', textAlign: 'center', margin: '16px 0' }}>
        {loading && <p>Загрузка...</p>}
        {!hasMore && <p>Больше товаров нет</p>}
      </div>
    </div>
  );
};

export default ProductList;
