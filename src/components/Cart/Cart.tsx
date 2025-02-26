// src/components/Cart.tsx
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { removeFromCart } from '../../slices/cartSlice';
import { orm } from '../../models';
import { fetchEntityById } from '../../api';
import { useNavigate } from 'react-router-dom';

const Cart: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  // Формируем маппинг продуктов из Redux‑ORM
  const productsMap = useSelector((state: RootState) => {
    const session = orm.session(state.orm);
    const productsArray = session.Product.all().toModelArray();
    const map: Record<number, { id: number; name: string; description: string }> = {};
    productsArray.forEach(prod => {
      map[Number(prod.id)] = {
        id: Number(prod.id),
        name: prod.name,
        description: prod.description,
      };
    });
    return map;
  });

  // Формируем маппинг вариаций из Redux‑ORM
  const variationsMap = useSelector((state: RootState) => {
    const session = orm.session(state.orm);
    const variationsArray = session.ProductVariation.all().toModelArray();
    const map: Record<number, { id: number; price: number; stock: number }> = {};
    variationsArray.forEach(variation => {
      map[Number(variation.id)] = {
        id: Number(variation.id),
        price: Number(variation.price),
        stock: Number(variation.stock),
      };
    });
    return map;
  });

  // При монтировании проверяем наличие продуктов в маппинге для элементов корзины
  useEffect(() => {
    async function loadMissingProducts() {
      for (const item of cartItems) {
        if (!productsMap[item.productId]) {
          try {
            const product = await fetchEntityById('Products', item.productId);
            // Добавляем загруженный продукт в Redux‑ORM через экшн 'data/loaded'
            dispatch({ type: 'data/loaded', payload: { products: [product] } });
          } catch (error) {
            console.error(`Ошибка загрузки продукта с id ${item.productId}:`, error);
          }
        }
      }
    }
    loadMissingProducts();
  }, [cartItems, productsMap, dispatch]);

  const handleRemove = (productId: number, variationId: number) => {
    dispatch(removeFromCart({ productId, variationId }));
  };

  const handleCheckout = () => {
    // Переход на страницу оформления заказа
    navigate('/checkout');
  };

  return (
    <div>
      <h2>Корзина</h2>
      {cartItems.length === 0 ? (
        <p>Корзина пуста</p>
      ) : (
        <ul>
          {cartItems.map(item => {
            const product = productsMap[item.productId];
            const variation = variationsMap[item.variationId];
            return (
              <li key={`${item.productId}-${item.variationId}`} style={{ marginBottom: '10px' }}>
                {product ? (
                  <>
                    <strong>{product.name}</strong> —{' '}
                    {variation ? (
                      <>
                        Цена: ${variation.price} × {item.quantity} = ${variation.price * item.quantity}
                      </>
                    ) : (
                      <span>Вариация не найдена</span>
                    )}
                    <button
                      onClick={() => handleRemove(item.productId, item.variationId)}
                      style={{ marginLeft: '10px' }}
                    >
                      Удалить
                    </button>
                  </>
                ) : (
                  <span>Продукт с id {item.productId} не найден</span>
                )}
              </li>
            );
          })}
        </ul>
      )}
      {cartItems.length > 0 && (
        <button onClick={handleCheckout} style={{ marginTop: '20px' }}>
          Оформить заказ
        </button>
      )}
    </div>
  );
};

export default Cart;
