// src/components/ProductList.tsx
import React from 'react';
import { useSelector } from 'react-redux';
import { orm } from '../../models';
import { RootState } from '../../store';
import { Link } from 'react-router-dom';

interface ProductListItem {
  id: number;
  name: string;
  category_id: number;
  minPrice: number | null;
}

interface ProductListProps {
  selectedCategoryId?: number | null;
}

const ProductList: React.FC<ProductListProps> = ({ selectedCategoryId = null }) => {
  const products: ProductListItem[] = useSelector((state: RootState) => {
    const session = orm.session(state.orm);
    return session.Product.all().toModelArray().map(productModel => {
      // Получаем вариации для данного товара
      const variations = session.ProductVariation.all()
        .toModelArray()
        .filter(variation => Number(variation.product_id) === Number(productModel.id));
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

  // Фильтруем товары по выбранной категории (если задана)
  const filteredProducts = selectedCategoryId
    ? products.filter(p => p.category_id === selectedCategoryId)
    : products;

  return (
    <div>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {filteredProducts.map(product => (
          <li key={product.id} style={{ marginBottom: '10px', padding: '8px', borderBottom: '1px solid #ccc' }}>
            <Link to={`/product/${product.id}`} style={{ fontWeight: 'bold', textDecoration: 'none', color: '#1976d2' }}>
              {product.name}
            </Link>
            <div>
              {product.minPrice !== null ? (
                <span>от ${product.minPrice}</span>
              ) : (
                <span>Цена не указана</span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
