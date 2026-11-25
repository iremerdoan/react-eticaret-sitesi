import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from './navbar/ShopContext';
import {
  IoHeartOutline, IoHeart, IoStarSharp,
  IoImageOutline, IoCheckmarkCircle,
} from 'react-icons/io5';
import { BsCart3 } from 'react-icons/bs';
 
// ── Yıldız ──────────────────────────────────────────
export const Stars = ({ rating }) => (
  <div className='flex items-center gap-0.5'>
    {[1, 2, 3, 4, 5].map((s) => (
      <IoStarSharp
        key={s}
        className={`text-xs ${s <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-200'}`}
      />
    ))}
    <span className='text-xs text-gray-500 ml-1'>{rating}</span>
  </div>
);
 
// ── Ürün görseli veya placeholder ───────────────────
export const ProductImage = ({ image, placeholderColor, name, className = '' }) => {
  if (image) {
    return (
      <img
        src={image}
        alt={name}
        className={`w-full h-full object-cover object-top ${className}`}
      />
    );
  }
  return (
    <div
      className={`w-full h-full flex flex-col items-center justify-center gap-2 ${className}`}
      style={{ backgroundColor: placeholderColor }}
    >
      <IoImageOutline className='text-4xl text-white/60' />
      <span className='text-xs text-white/60 font-medium px-2 text-center'>{name}</span>
    </div>
  );
};
 
// ── Ürün Kartı ───────────────────────────────────────
const ProductCard = ({ product, isListView = false }) => {
  const navigate = useNavigate();
  const { addToCart, toggleFavorite, isFavorite } = useShop();
  const fav = isFavorite(product.id);
  const [selectedColor, setSelectedColor] = useState(null);
  const [addedToCart, setAddedToCart] = useState(false);
 
  const colorKeys = product.colorImages ? Object.keys(product.colorImages) : [];
  const hasVariants = colorKeys.length > 1;
  const activeImage =
    hasVariants && selectedColor && product.colorImages[selectedColor]
      ? product.colorImages[selectedColor]
      : product.image;
 
  const handleCardClick = () => {
    navigate(`/product/${product.category}/${product.id}`);
  };
 
  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, selectedColor, null, 1);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };
 
  const ColorButtons = () => {
    if (!hasVariants) return null;
    return (
      <div className='flex gap-1 mt-2 flex-wrap'>
        {colorKeys.map((color) => (
          <button
            key={color}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedColor(color);
            }}
            className={`text-xs px-2 py-1 rounded-full border transition-all ${
              selectedColor === color || (!selectedColor && colorKeys[0] === color)
                ? 'bg-purple-600 text-white border-purple-600'
                : 'border-gray-200 text-gray-600 hover:border-purple-400 bg-white'
            }`}
          >
            {color}
          </button>
        ))}
      </div>
    );
  };
 
  // ── Liste görünümü ──────────────────────────────
  if (isListView) {
    return (
      <div
        className='bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all duration-200 flex overflow-hidden group cursor-pointer'
        onClick={handleCardClick}
      >
        <div className='relative w-44 flex-shrink-0 overflow-hidden' style={{ aspectRatio: '3/4' }}>
          <ProductImage
            image={activeImage}
            placeholderColor={product.placeholderColor}
            name={product.name}
            className='group-hover:scale-105 transition-transform duration-300'
          />
          {product.discount && (
            <span className='absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full'>
              %{product.discount}
            </span>
          )}
        </div>
 
        <div className='flex-1 p-5 flex flex-col justify-between'>
          <div>
            <p className='text-xs text-purple-600 font-semibold mb-1'>{product.brand}</p>
            <h3 className='font-semibold text-gray-800 mb-2'>{product.name}</h3>
            <Stars rating={product.rating} />
            <p className='text-xs text-gray-400 mt-1'>{product.reviewCount} değerlendirme</p>
            <ColorButtons />
            {product.freeShipping && (
              <span className='inline-block mt-2 text-xs text-green-600 font-medium'>
                ✓ Ücretsiz Kargo
              </span>
            )}
          </div>
          <div className='flex items-center justify-between mt-3'>
            <div>
              {product.originalPrice && (
                <span className='text-sm text-gray-400 line-through mr-2'>
                  {product.originalPrice.toLocaleString('tr-TR')} TL
                </span>
              )}
              <span className='text-xl font-bold text-gray-900'>
                {product.price.toLocaleString('tr-TR')} TL
              </span>
            </div>
            <div className='flex gap-2'>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(product);
                }}
                className='p-2 rounded-full border border-gray-200 hover:border-red-300 hover:bg-red-50 transition-colors'
              >
                {fav ? (
                  <IoHeart className='text-red-500 text-lg' />
                ) : (
                  <IoHeartOutline className='text-gray-400 text-lg' />
                )}
              </button>
              <button
                onClick={handleAddToCart}
                className={`flex items-center gap-2 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
                  addedToCart ? 'bg-green-500' : 'bg-purple-600 hover:bg-purple-700'
                }`}
              >
                {addedToCart ? (
                  <>
                    <IoCheckmarkCircle /> Eklendi!
                  </>
                ) : (
                  <>
                    <BsCart3 /> Sepete Ekle
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
 
  // ── Grid görünümü ───────────────────────────────
  return (
    <div
      className='bg-white rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-200 overflow-hidden group cursor-pointer'
      onClick={handleCardClick}
    >
      <div className='relative overflow-hidden w-full' style={{ aspectRatio: '3/4' }}>
        <ProductImage
          image={activeImage}
          placeholderColor={product.placeholderColor}
          name={product.name}
          className='group-hover:scale-105 transition-transform duration-300'
        />
 
        {/* Rozetler */}
        <div className='absolute top-2 left-2 flex flex-col gap-1'>
          {product.discount && (
            <span className='bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full'>
              %{product.discount}
            </span>
          )}
          {product.isNew && !product.discount && (
            <span className='bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full'>
              Yeni
            </span>
          )}
          {product.isBestseller && (
            <span className='bg-amber-400 text-white text-xs font-bold px-2 py-1 rounded-full'>
              Çok Satan
            </span>
          )}
        </div>
 
        {/* Favori */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(product);
          }}
          className='absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:scale-110 transition-transform'
        >
          {fav ? (
            <IoHeart className='text-red-500 text-lg' />
          ) : (
            <IoHeartOutline className='text-gray-400 text-lg' />
          )}
        </button>
 
        {/* Hover sepet */}
        <div
          onClick={handleAddToCart}
          className={`absolute bottom-0 left-0 right-0 text-white text-sm font-medium py-2.5 text-center translate-y-full group-hover:translate-y-0 transition-transform duration-200 flex items-center justify-center gap-2 cursor-pointer ${
            addedToCart ? 'bg-green-500' : 'bg-purple-600 hover:bg-purple-700'
          }`}
        >
          {addedToCart ? (
            <>
              <IoCheckmarkCircle /> Eklendi!
            </>
          ) : (
            <>
              <BsCart3 /> Sepete Ekle
            </>
          )}
        </div>
      </div>
 
      <div className='p-3'>
        <p className='text-xs text-purple-600 font-semibold mb-0.5'>{product.brand}</p>
        <h3 className='text-sm font-medium text-gray-800 truncate mb-1'>{product.name}</h3>
        <Stars rating={product.rating} />
        <p className='text-xs text-gray-400'>{product.reviewCount} değerlendirme</p>
        <div className='mt-2 flex items-center gap-2 flex-wrap'>
          {product.originalPrice && (
            <span className='text-xs text-gray-400 line-through'>
              {product.originalPrice.toLocaleString('tr-TR')} TL
            </span>
          )}
          <span className='text-base font-bold text-gray-900'>
            {product.price.toLocaleString('tr-TR')} TL
          </span>
        </div>
        {product.freeShipping && (
          <p className='text-xs text-green-600 font-medium mt-1'>✓ Ücretsiz Kargo</p>
        )}
        <ColorButtons />
      </div>
    </div>
  );
};
 
export default ProductCard;