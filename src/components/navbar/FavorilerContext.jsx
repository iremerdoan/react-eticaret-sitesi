import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useShop } from './navbar/ShopContext';
import { IoClose, IoHeartDislike, IoStarSharp, IoChevronForward } from 'react-icons/io5';
import { BsCart3 } from 'react-icons/bs';
 
const Stars = ({ rating }) => (
  <div className='flex items-center gap-0.5'>
    {[1, 2, 3, 4, 5].map((s) => (
      <IoStarSharp
        key={s}
        className={`text-xs ${s <= Math.round(rating) ? 'text-amber-400' : 'text-gray-200'}`}
      />
    ))}
    <span className='text-xs text-gray-500 ml-1'>{rating}</span>
  </div>
);
 
const FavoritesPage = () => {
  const { favorites, removeFromFavorites, addToCart } = useShop();
  const navigate = useNavigate();
 
  if (favorites.length === 0) {
    return (
      <div className='min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-5 px-4'>
        <div className='w-24 h-24 bg-pink-50 rounded-full flex items-center justify-center'>
          <IoHeartDislike className='text-5xl text-pink-300' />
        </div>
        <div className='text-center'>
          <h2 className='text-xl font-bold text-gray-800 mb-2'>Favori listeniz boş</h2>
          <p className='text-gray-500 text-sm'>
            Beğendiğiniz ürünleri favorilere ekleyerek daha sonra kolayca bulabilirsiniz.
          </p>
        </div>
        <Link
          to='/women'
          className='bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors'
        >
          Alışverişe Başla
        </Link>
      </div>
    );
  }
 
  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Breadcrumb */}
      <div className='bg-white border-b border-gray-100 px-4 py-2.5'>
        <div className='max-w-screen-xl mx-auto flex items-center gap-2 text-xs text-gray-400'>
          <Link to='/' className='hover:text-purple-600'>
            Anasayfa
          </Link>
          <IoChevronForward className='text-xs' />
          <span className='text-gray-700 font-medium'>Favorilerim</span>
        </div>
      </div>
 
      <div className='max-w-screen-xl mx-auto px-4 py-8'>
        {/* Başlık */}
        <div className='flex items-center justify-between mb-6'>
          <div>
            <h1 className='text-2xl font-bold text-gray-900'>Favorilerim</h1>
            <p className='text-sm text-gray-500 mt-0.5'>{favorites.length} ürün</p>
          </div>
        </div>
 
        {/* Ürün Kartları */}
        <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
          {favorites.map((product) => (
            <FavoriteCard
              key={product.id}
              product={product}
              onRemove={() => removeFromFavorites(product.id)}
              onAddToCart={() => addToCart(product, null, null, 1)}
              onClick={() => navigate(`/product/${product.category}/${product.id}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
 
const FavoriteCard = ({ product, onRemove, onAddToCart, onClick }) => {
  const [added, setAdded] = React.useState(false);
 
  const handleAddToCart = (e) => {
    e.stopPropagation();
    onAddToCart();
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };
 
  return (
    <div
      className='bg-white rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-200 overflow-hidden group cursor-pointer relative'
      onClick={onClick}
    >
      {/* Favoriden Kaldır — çarpı */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className='absolute top-2 right-2 z-10 w-7 h-7 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-red-50 hover:scale-110 transition-all'
        title='Favorilerden kaldır'
      >
        <IoClose className='text-gray-500 hover:text-red-500 text-base transition-colors' />
      </button>
 
      {/* Görsel */}
      <div className='relative overflow-hidden w-full' style={{ aspectRatio: '3/4' }}>
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className='w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300'
          />
        ) : (
          <div
            className='w-full h-full flex items-center justify-center'
            style={{ backgroundColor: product.placeholderColor || '#e5e7eb' }}
          >
            <span className='text-white/60 text-xs text-center px-2'>{product.name}</span>
          </div>
        )}
        {product.discount && (
          <span className='absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full'>
            %{product.discount}
          </span>
        )}
        {product.isBestseller && (
          <span className='absolute bottom-2 left-2 bg-amber-400 text-white text-xs font-bold px-2 py-0.5 rounded-full'>
            Çok Satan
          </span>
        )}
      </div>
 
      {/* Bilgi */}
      <div className='p-3'>
        <p className='text-xs text-purple-600 font-semibold mb-0.5'>{product.brand}</p>
        <h3 className='text-sm font-medium text-gray-800 truncate mb-1'>{product.name}</h3>
        <Stars rating={product.rating} />
        <div className='mt-1.5 flex items-center gap-2 flex-wrap'>
          {product.originalPrice && (
            <span className='text-xs text-gray-400 line-through'>
              {product.originalPrice.toLocaleString('tr-TR')} TL
            </span>
          )}
          <span className='text-sm font-bold text-gray-900'>
            {product.price.toLocaleString('tr-TR')} TL
          </span>
        </div>
        {product.freeShipping && (
          <p className='text-xs text-green-600 font-medium mt-1'>✓ Ücretsiz Kargo</p>
        )}
 
        {/* Sepete Ekle */}
        <button
          onClick={handleAddToCart}
          className={`w-full mt-3 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
            added
              ? 'bg-green-500 text-white'
              : 'bg-purple-600 hover:bg-purple-700 text-white'
          }`}
        >
          <BsCart3 />
          {added ? 'Eklendi ✓' : 'Sepete Ekle'}
        </button>
      </div>
    </div>
  );
};
 
export default FavoritesPage;