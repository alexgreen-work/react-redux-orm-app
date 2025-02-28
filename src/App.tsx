// src/App.tsx
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProductListPage from './pages/ProductListPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import OrderCheckoutPage from './pages/OrderCheckoutPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import OrderDetailsPage from './pages/OrderDetailsPage';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import { fetchEntities } from './api';
import { useDispatch } from 'react-redux';
import PageWithBannerSide from './pages/PageWithBannerSide';

const App: React.FC = () => {
  const dispatch = useDispatch();

  // Глобальная загрузка данных продуктов, категорий и вариаций
  useEffect(() => {
    async function loadData() {
      try {
        const products = await fetchEntities('Products', {
          sort: ['name', 'ASC'],
          range: [0, 10],
        });
        const categories = await fetchEntities('Categories', {
          sort: ['name', 'ASC'],
        });
        const variations = await fetchEntities('ProductVariations', {
          sort: ['price', 'ASC'],
          filter: {
            product_id: products.map((product) => product.id)
          }
        });
        dispatch({
          type: 'data/loaded',
          payload: { products, categories, variations },
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
        {/* <Header /> */}
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
        {/* <Footer /> */}
      </div>
    </BrowserRouter>
  );
};

export default App;
