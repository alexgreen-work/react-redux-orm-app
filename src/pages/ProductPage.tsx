// src/pages/ProductPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchEntityById, fetchEntities } from '../api';
import { addToCart } from '../slices/cartSlice';

interface Product {
  id: number;
  name: string;
  category_id: number;
  description: string;
  // Обратите внимание, что поле price отсутствует,
  // т.к. цена возвращается только в вариациях
}

interface ProductVariation {
  id: number;
  product_id: number;
  price: number;
  stock: number;
}

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const [product, setProduct] = useState<Product | null>(null);
  const [variations, setVariations] = useState<ProductVariation[]>([]);
  const [selectedVariationId, setSelectedVariationId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProduct() {
      try {
        // Загружаем данные товара
        const productData = await fetchEntityById('Products', Number(id));
        setProduct(productData);

        // Загружаем варианты для данного товара
        const variationsData = await fetchEntities('ProductVariations', {
          filter: { product_id: Number(id) }
        });
        setVariations(variationsData);
        if (variationsData && variationsData.length > 0) {
          setSelectedVariationId(variationsData[0].id);
        }
        setLoading(false);
      } catch (error) {
        console.error('Ошибка загрузки товара или его вариаций', error);
        setLoading(false);
      }
    }
    loadProduct();
  }, [id]);

  const handleVariationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedVariationId(Number(event.target.value));
  };

  const handleAddToCart = () => {
    if (!selectedVariationId || !product) return;
    // Добавляем товар в корзину с выбранной вариацией
    dispatch(addToCart({ productId: product.id, variationId: selectedVariationId }));
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (!product) {
    return <div>Товар не найден</div>;
  }

  return (
    <div className="page-container">
      <h2>{product.name}</h2>
      {selectedVariationId && (
        <div>
          Цена: $
          {
            variations.find(variation => variation.id === selectedVariationId)
              ?.price
          }
        </div>
      )}
      <div>Категория: {product.category_id}</div>
      <p>{product.description}</p>
      {variations.length > 0 && (
        <div>
          <label htmlFor="variation-select">Выберите вариацию:</label>
          <select
            id="variation-select"
            value={selectedVariationId || ''}
            onChange={handleVariationChange}
          >
            {variations.map(variation => (
              <option key={variation.id} value={variation.id}>
                Цена: ${variation.price} (Остаток: {variation.stock}) (id: {variation.id})
              </option>
            ))}
          </select>
        </div>
      )}
      <button onClick={handleAddToCart}>Добавить в корзину</button>
    </div>
  );
};

export default ProductPage;
