import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProductListPage from './pages/ProductListPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import OrderCheckoutPage from './pages/OrderCheckoutPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import OrderDetailsPage from './pages/OrderDetailsPage';
import { fetchEntities } from './api';
import { useDispatch } from 'react-redux';
import PageWithBannerSide from './pages/PageWithBannerSide';

const App: React.FC = () => {
  const dispatch = useDispatch();

  // Глобальная загрузка данных
  useEffect(() => {
    async function loadData() {
      try {
        const categories = await fetchEntities('Categories', {
          sort: ['name', 'ASC'],
        });
        dispatch({
          type: 'data/loaded',
          payload: { categories},
        });
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      }
    }
    loadData();
  }, [dispatch]);

  return (
    <BrowserRouter>
      <div className="app-container">
        <main className="app-main">
          <Routes>
            <Route path="/" element={<PageWithBannerSide><ProductListPage /></PageWithBannerSide>} />
            <Route path="/product/:id" element={<PageWithBannerSide><ProductPage /></PageWithBannerSide>} />
            <Route path="/cart" element={
              <PageWithBannerSide>
                <CartPage />
              </PageWithBannerSide>
            } />
            <Route path="/checkout" element={<PageWithBannerSide><OrderCheckoutPage /></PageWithBannerSide>} />
            <Route path="/orders" element={<PageWithBannerSide><OrderHistoryPage /></PageWithBannerSide>} />
            <Route path="/orders/:id" element={<PageWithBannerSide><OrderDetailsPage /></PageWithBannerSide>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;
