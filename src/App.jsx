import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar/navbar';
import HomePage from './components/HomePage';
import CategoryPage from './components/CategoryPage';
import ProductDetail from './components/ProductDetail';
import CartPage from './components/navbar/Cartpage';
import FavoritesPage from './components/navbar/favorites';
import { ShopProvider } from './components/navbar/ShopContext';
import AccountPage from './components/navbar/AccountPage'; 
import SearchResults from './components/navbar/SearchResults';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <ShopProvider>
      <Router>
        <ScrollToTop/>
        <div className='min-h-screen bg-gray-50'>
          <Navbar />
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/search' element={<SearchResults />} />
            <Route path='/cart' element={<CartPage />} />
            <Route path='/favorites' element={<FavoritesPage />} />
            <Route path='/account' element={<AccountPage />} />
            <Route path='/product/:category/:productId' element={<ProductDetail />} />  {/* ← Bu satır */}
            <Route path='/:category' element={<CategoryPage />} />
            <Route path='/:category/:subcategory' element={<CategoryPage />} />
          </Routes>
        </div>
      </Router>
    </ShopProvider>
  );
}

export default App;