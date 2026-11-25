import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useShop } from './ShopContext';
import {
  IoClose,
  IoChevronForward,
  IoAddOutline,
  IoRemoveOutline,
  IoCartOutline,
  IoShieldCheckmarkOutline,
  IoReturnUpBackOutline,
} from 'react-icons/io5';
import { BsLightningChargeFill } from 'react-icons/bs';
import { MdLocalShipping } from 'react-icons/md';
 
const FREE_SHIPPING_THRESHOLD = 500;
 
const CartPage = () => {
  const { cart, removeFromCart, updateQty, cartSubtotal, clearCart } = useShop();
  const navigate = useNavigate();
 
  const remaining = FREE_SHIPPING_THRESHOLD - cartSubtotal;
  const shippingFree = cartSubtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingCost = shippingFree ? 0 : 39.90;
  const total = cartSubtotal + shippingCost;
  const discountAmount = Math.round(total * 0.05);
  const discountedTotal = Math.round(total - discountAmount);
 
  if (cart.length === 0) {
    return (
      <div className='min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-5 px-4'>
        <div className='w-24 h-24 bg-purple-50 rounded-full flex items-center justify-center'>
          <IoCartOutline className='text-5xl text-purple-300' />
        </div>
        <div className='text-center'>
          <h2 className='text-xl font-bold text-gray-800 mb-2'>Sepetiniz boş</h2>
          <p className='text-gray-500 text-sm'>
            Alışverişe başlamak için kategorilere göz atın.
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
      <div className='bg-white border-b border-gray-100 px-4 py-2.5'>
        <div className='max-w-screen-xl mx-auto flex items-center gap-2 text-xs text-gray-400'>
          <Link to='/' className='hover:text-purple-600'>Anasayfa</Link>
          <IoChevronForward className='text-xs' />
          <span className='text-gray-700 font-medium'>Sepetim</span>
        </div>
      </div>
 
      <div className='max-w-screen-xl mx-auto px-4 py-8'>
        <h1 className='text-2xl font-bold text-gray-900 mb-6'>
          Sepetim{' '}
          <span className='text-base font-normal text-gray-400'>
            ({cart.reduce((s, i) => s + i.qty, 0)} ürün)
          </span>
        </h1>
 
        {!shippingFree ? (
          <div className='mb-5 bg-purple-50 border border-purple-200 rounded-xl px-5 py-3 flex items-center gap-3'>
            <MdLocalShipping className='text-purple-600 text-xl flex-shrink-0' />
            <div className='flex-1'>
              <p className='text-sm text-purple-800 font-semibold'>
                Ücretsiz kargo için{' '}
                <span className='text-purple-600'>
                  {Math.ceil(remaining).toLocaleString('tr-TR')} TL
                </span>{' '}
                daha ekleyin!
              </p>
              <div className='mt-2 h-2 bg-purple-100 rounded-full overflow-hidden'>
                <div
                  className='h-full bg-purple-500 rounded-full transition-all duration-500'
                  style={{
                    width: `${Math.min((cartSubtotal / FREE_SHIPPING_THRESHOLD) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className='mb-5 bg-green-50 border border-green-200 rounded-xl px-5 py-3 flex items-center gap-3'>
            <MdLocalShipping className='text-green-600 text-xl flex-shrink-0' />
            <p className='text-sm text-green-800 font-semibold'>
              Tebrikler! Ücretsiz kargo kazandınız 🎉
            </p>
          </div>
        )}
 
        <div className='flex flex-col lg:flex-row gap-6'>
          <div className='flex-1 min-w-0 flex flex-col gap-4'>
            {cart.map((item) => {
              const key = `${item.product.id}-${item.color}-${item.size}`;
              return (
                <div
                  key={key}
                  className='bg-white rounded-xl border border-gray-100 hover:shadow-md transition-shadow duration-200 flex overflow-hidden'
                >
                  <div
                    className='w-32 sm:w-40 flex-shrink-0 cursor-pointer overflow-hidden'
                    style={{ aspectRatio: '3/4' }}
                    onClick={() => navigate(`/product/${item.product.category}/${item.product.id}`)}
                  >
                    {item.product.image ? (
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className='w-full h-full object-cover object-top hover:scale-105 transition-transform duration-300'
                      />
                    ) : (
                      <div
                        className='w-full h-full flex items-center justify-center'
                        style={{ backgroundColor: item.product.placeholderColor || '#e5e7eb' }}
                      >
                        <span className='text-white/60 text-xs text-center px-2'>
                          {item.product.name}
                        </span>
                      </div>
                    )}
                  </div>
 
                  <div className='flex-1 p-4 flex flex-col justify-between'>
                    <div>
                      <p className='text-xs text-purple-600 font-semibold mb-0.5'>
                        {item.product.brand}
                      </p>
                      <h3
                        className='font-semibold text-gray-800 text-sm mb-1 cursor-pointer hover:text-purple-700 transition-colors'
                        onClick={() => navigate(`/product/${item.product.category}/${item.product.id}`)}
                      >
                        {item.product.name}
                      </h3>
                      {item.color && (
                        <p className='text-xs text-gray-400'>
                          Renk: <span className='text-gray-600 font-medium'>{item.color}</span>
                        </p>
                      )}
                      {item.size && (
                        <p className='text-xs text-gray-400'>
                          Beden: <span className='text-gray-600 font-medium'>{item.size}</span>
                        </p>
                      )}
                    </div>
 
                    <div className='flex items-center justify-between mt-3 flex-wrap gap-3'>
                      <div className='flex items-center border border-gray-200 rounded-lg overflow-hidden'>
                        <button
                          onClick={() => updateQty(item.product.id, item.color, item.size, item.qty - 1)}
                          className='px-2.5 py-1.5 hover:bg-gray-100 transition-colors text-gray-600'
                        >
                          <IoRemoveOutline />
                        </button>
                        <span className='px-3 text-sm font-bold text-gray-800'>{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.product.id, item.color, item.size, item.qty + 1)}
                          className='px-2.5 py-1.5 hover:bg-gray-100 transition-colors text-gray-600'
                        >
                          <IoAddOutline />
                        </button>
                      </div>
 
                      <div className='flex items-center gap-3'>
                        <div className='text-right'>
                          {item.product.originalPrice && (
                            <p className='text-xs text-gray-400 line-through'>
                              {(item.product.originalPrice * item.qty).toLocaleString('tr-TR')} TL
                            </p>
                          )}
                          <p className='text-base font-bold text-gray-900'>
                            {(item.product.price * item.qty).toLocaleString('tr-TR')} TL
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product.id, item.color, item.size)}
                          className='p-2 rounded-full hover:bg-red-50 transition-colors text-gray-400 hover:text-red-500'
                        >
                          <IoClose className='text-lg' />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
 
            <div className='flex justify-end'>
              <button
                onClick={clearCart}
                className='text-xs text-gray-400 hover:text-red-500 transition-colors hover:underline'
              >
                Sepeti Temizle
              </button>
            </div>
          </div>
 
          <div className='lg:w-80 flex-shrink-0'>
            <div className='bg-white rounded-xl border border-gray-100 p-5 sticky top-4'>
              <h2 className='font-bold text-gray-900 text-base mb-4'>Sipariş Özeti</h2>
 
              <div className='space-y-3 text-sm'>
                <div className='flex justify-between text-gray-600'>
                  <span>Ürünler Toplamı</span>
                  <span>{cartSubtotal.toLocaleString('tr-TR')} TL</span>
                </div>
                <div className='flex justify-between text-gray-600'>
                  <span>Kargo</span>
                  {shippingFree ? (
                    <span className='text-green-600 font-medium'>Ücretsiz</span>
                  ) : (
                    <span>{shippingCost.toFixed(2).replace('.', ',')} TL</span>
                  )}
                </div>
                <div className='flex justify-between text-purple-700 font-medium'>
                  <span>Sepet İndirimi (%5)</span>
                  <span>-{discountAmount.toLocaleString('tr-TR')} TL</span>
                </div>
                <div className='border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-900 text-base'>
                  <span>Ödenecek Tutar</span>
                  <span className='text-purple-700'>
                    {discountedTotal.toLocaleString('tr-TR')} TL
                  </span>
                </div>
              </div>
 
              <button className='w-full mt-5 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-lg shadow-purple-200'>
                <BsLightningChargeFill />
                Sepeti Onayla
              </button>
 
              <div className='mt-4 space-y-2'>
                <div className='flex items-center gap-2 text-xs text-gray-400'>
                  <IoShieldCheckmarkOutline className='text-base flex-shrink-0' />
                  Güvenli ödeme garantisi
                </div>
                <div className='flex items-center gap-2 text-xs text-gray-400'>
                  <IoReturnUpBackOutline className='text-base flex-shrink-0' />
                  30 gün ücretsiz iade
                </div>
                {shippingFree && (
                  <div className='flex items-center gap-2 text-xs text-green-600 font-medium'>
                    <MdLocalShipping className='text-base flex-shrink-0' />
                    Ücretsiz kargo
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default CartPage;
 