import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../picture/logo.png';
import { useShop } from './ShopContext';
import {
  IoSearchOutline,
  IoHeartOutline,
  IoHeart,
  IoPersonOutline,
  IoCloseCircle,
} from 'react-icons/io5';
import { BsCart3 } from 'react-icons/bs';
import Categories from './Categories';
 
// Tüm ürünleri tek düz diziye çeviren yardımcı
import { productData } from '../../data/mockProducts';
const ALL_PRODUCTS = Object.values(productData).flat();
 
const Navbar = () => {
  const { cartCount, favorites } = useShop();
  const favCount = favorites.length;
  const navigate = useNavigate();
 
  const [query, setQuery]         = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showDrop, setShowDrop]   = useState(false);
  const inputRef = useRef(null);
  const dropRef  = useRef(null);
 
  // Yazı değişince canlı filtreleme
  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) {
      setSuggestions([]);
      setShowDrop(false);
      return;
    }
    const results = ALL_PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.subcategory?.toLowerCase().includes(q)
    ).slice(0, 6); // dropdown'da max 6 öneri
    setSuggestions(results);
    setShowDrop(true);
  }, [query]);
 
  // Dışarı tıklayınca dropdown kapat
  useEffect(() => {
    const handler = (e) => {
      if (
        dropRef.current && !dropRef.current.contains(e.target) &&
        inputRef.current && !inputRef.current.contains(e.target)
      ) {
        setShowDrop(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);
 
  // Enter → arama sonuçları sayfasına git
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && query.trim().length >= 2) {
      setShowDrop(false);
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };
 
  // Öneri kartına tıklayınca ürün sayfasına git
  const handleSuggestionClick = (product) => {
    setQuery('');
    setShowDrop(false);
    navigate(`/product/${product.category}/${product.id}`);
  };
 
  // Arama ikonuna tıklayınca sonuç sayfasına git
  const handleSearchClick = () => {
    if (query.trim().length >= 2) {
      setShowDrop(false);
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };
 
  return (
    <div className='shadow-md bg-white dark:bg-gray-900 dark:text-white'>
      {/* Üst Navbar */}
      <div className='bg-gradient-to-r from-violet-400 to-purple-300 py-4'>
        <div className='flex justify-between items-center px-4'>
 
          {/* Logo */}
          <Link to='/' className='flex items-center gap-4'>
            <img
              src={logo}
              alt='Logo'
              className='w-24 sm:w-28 h-auto object-contain drop-shadow-lg'
            />
            <span className='font-bold text-3xl sm:text-4xl bg-gradient-to-r from-purple-600 via-violet-600 to-purple-800 bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]'>
              Karma
            </span>
          </Link>
 
          {/* Arama + İkonlar */}
          <div className='flex items-center gap-6'>
 
            {/* Arama kutusu */}
            <div className='relative'>
              <input
                ref={inputRef}
                type='text'
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => suggestions.length > 0 && setShowDrop(true)}
                placeholder='Ürün, marka veya kategori ara...'
                className='w-[220px] sm:w-[280px] focus:w-[340px] transition-all duration-300 rounded-full border-2 border-white/50 bg-white/80 backdrop-blur-sm pl-10 pr-9 py-2 focus:outline-none focus:border-white focus:bg-white shadow-lg text-sm text-gray-900'              />
              {/* Sol ikon — tıklanabilir */}
              <button onClick={handleSearchClick} className='absolute left-3 top-1/2 -translate-y-1/2'>
                <IoSearchOutline className='text-gray-500 text-xl' />
              </button>
              {/* Sağ temizle ikonu */}
              {query && (
                <button
                  onClick={() => { setQuery(''); setSuggestions([]); setShowDrop(false); inputRef.current?.focus(); }}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
                >
                  <IoCloseCircle className='text-lg' />
                </button>
              )}
 
              {/* ── Canlı Öneri Dropdown ── */}
              {showDrop && suggestions.length > 0 && (
                <div
                  ref={dropRef}
                  className='absolute top-full mt-2 left-0 w-[340px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50'
                >
                  {suggestions.map(product => (
                    <div
                      key={product.id}
                      onClick={() => handleSuggestionClick(product)}
                      className='flex items-center gap-3 px-4 py-3 hover:bg-purple-50 cursor-pointer transition-colors border-b border-gray-50 last:border-0'
                    >
                      {/* Küçük ürün görseli */}
                      <div className='w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100'>
                        {product.image
                          ? <img src={product.image} alt={product.name} className='w-full h-full object-cover object-top' />
                          : <div className='w-full h-full' style={{ backgroundColor: product.placeholderColor }} />
                        }
                      </div>
                      {/* Ürün bilgisi */}
                      <div className='flex-1 min-w-0'>
                        <p className='text-sm font-medium text-gray-800 truncate'>{product.name}</p>
                        <p className='text-xs text-purple-600 font-semibold'>{product.brand}</p>
                      </div>
                      {/* Fiyat */}
                      <div className='text-right flex-shrink-0'>
                        {product.originalPrice && (
                          <p className='text-xs text-gray-400 line-through'>
                            {product.originalPrice.toLocaleString('tr-TR')} TL
                          </p>
                        )}
                        <p className='text-sm font-bold text-gray-900'>
                          {product.price.toLocaleString('tr-TR')} TL
                        </p>
                      </div>
                    </div>
                  ))}
 
                  {/* Tümünü gör butonu */}
                  <div
                    onClick={handleSearchClick}
                    className='px-4 py-3 text-center text-sm font-semibold text-purple-600 hover:bg-purple-50 cursor-pointer transition-colors border-t border-gray-100'
                  >
                    "{query}" için tüm sonuçları gör →
                  </div>
                </div>
              )}
 
              {/* Sonuç yok mesajı */}
              {showDrop && query.trim().length >= 2 && suggestions.length === 0 && (
                <div
                  ref={dropRef}
                  className='absolute top-full mt-2 left-0 w-[340px] bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 px-4 py-6 text-center'
                >
                  <p className='text-2xl mb-2'>🔍</p>
                  <p className='text-sm text-gray-500'>
                    "<span className='font-medium text-gray-700'>{query}</span>" için sonuç bulunamadı
                  </p>
                </div>
              )}
            </div>
 
            {/* İkonlar */}
            <div className='flex items-center gap-4'>
 
              {/* Favoriler */}
              <Link to='/favorites' className='relative text-white hover:text-purple-800 transition-colors duration-200'>
                {favCount > 0
                  ? <IoHeart className='text-2xl text-red-400' />
                  : <IoHeartOutline className='text-2xl' />
                }
                {favCount > 0 && (
                  <span className='absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full leading-none'>
                    {favCount > 99 ? '99+' : favCount}
                  </span>
                )}
              </Link>
 
              {/* Hesap */}
              <Link to='/account' className='text-white hover:text-purple-800 transition-colors duration-200'>
                <IoPersonOutline className='text-2xl' />
              </Link>
 
              {/* Sepet */}
              <Link to='/cart' className='relative text-white hover:text-purple-800 transition-colors duration-200'>
                <BsCart3 className='text-2xl' />
                {cartCount > 0 && (
                  <span className='absolute -top-2 -right-2 bg-purple-700 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full leading-none'>
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </div>
 
      {/* Kategoriler Menüsü */}
      <Categories />
    </div>
  );
};
 
export default Navbar;