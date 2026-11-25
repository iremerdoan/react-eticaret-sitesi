import { useState } from 'react';
import { useShop } from './ShopContext';
import { useNavigate } from 'react-router-dom';
import { IoStarSharp } from 'react-icons/io5';
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

const ProductCard = ({ product, onAddToCart, onClick }) => {
  const [added, setAdded] = useState(false);

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
        <button
          onClick={handleAddToCart}
          className={`w-full mt-3 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
            added ? 'bg-green-500 text-white' : 'bg-purple-600 hover:bg-purple-700 text-white'
          }`}
        >
          <BsCart3 />
          {added ? 'Eklendi ✓' : 'Sepete Ekle'}
        </button>
      </div>
    </div>
  );
};

export default function AccountPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState({ name: '', email: '' });
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [emailError, setEmailError] = useState('');

  const { products, addToCart } = useShop();
  const navigate = useNavigate();

  const suggestedProducts = products ? products.slice(0, 8) : [];

  const handleSubmit = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setEmailError('Geçerli bir e-posta adresi giriniz.');
      return;
    }
    setEmailError('');
    if (!form.password) return;
    if (!isLogin && !form.name) return;

    setUser({
      name: isLogin ? form.email.split('@')[0] : form.name,
      email: form.email,
    });
    setLoggedIn(true);
  };

  const getGreeting = () => {
    const firstName = user.name.split(' ')[0];
    const capitalized = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
    return `Hoş geldiniz, ${capitalized} Hanım!`;
  };

  if (loggedIn) {
    return (
      <div className='container mx-auto px-4 py-10 max-w-6xl'>
        <div className='text-center mb-10'>
          <div className='w-16 h-16 rounded-full bg-black text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4'>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <h1 className='text-3xl font-bold mb-1'>{getGreeting()}</h1>
          <p className='text-gray-500'>Şimdi alışverişinizi yapabilirsiniz 🛍️</p>
          <button
            onClick={() => { setLoggedIn(false); setForm({ name: '', email: '', password: '' }); }}
            className='mt-3 text-sm text-gray-400 underline hover:text-black'
          >
            Çıkış Yap
          </button>
        </div>

        <div className='bg-gray-50 rounded-2xl p-5 mb-10 flex gap-8 justify-center text-sm text-gray-600'>
          <div><span className='font-semibold text-black'>Ad Soyad:</span> {user.name}</div>
          <div><span className='font-semibold text-black'>E-Posta:</span> {user.email}</div>
        </div>

        <h2 className='text-xl font-bold mb-5'>Sizin İçin Seçtiklerimiz</h2>

        {suggestedProducts.length === 0 ? (
          <p className='text-gray-400 text-sm'>Ürün bulunamadı.</p>
        ) : (
          <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4'>
            {suggestedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={() => addToCart(product, null, null, 1)}
                onClick={() => navigate(`/product/${product.category}/${product.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-white px-4'>
      <div className='w-full max-w-md'>
        <div className='flex items-center justify-center gap-6 mb-10'>
          <button
            onClick={() => setIsLogin(true)}
            className={`text-2xl font-bold transition ${isLogin ? 'text-black' : 'text-gray-300'}`}
          >
            Giriş Yap
          </button>
          <div className='w-px h-7 bg-gray-300' />
          <button
            onClick={() => setIsLogin(false)}
            className={`text-2xl font-bold transition ${!isLogin ? 'text-black' : 'text-gray-300'}`}
          >
            Üye Ol
          </button>
        </div>

        {!isLogin && (
          <div className='mb-6'>
            <label className='block text-sm font-semibold mb-2'>Ad Soyad</label>
            <input
              type='text'
              placeholder='İrem Yılmaz'
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className='w-full border-b border-gray-300 pb-2 outline-none text-sm focus:border-black transition'
            />
          </div>
        )}

        <div className='mb-6'>
          <label className='block text-sm font-semibold mb-2'>E-Posta Adresi</label>
          <input
            type='text'
            value={form.email}
            onChange={e => { setForm({ ...form, email: e.target.value }); setEmailError(''); }}
            className={`w-full border-b pb-2 outline-none text-sm transition ${
              emailError ? 'border-red-500' : 'border-gray-300 focus:border-black'
            }`}
          />
          {emailError && (
            <p className='text-red-500 text-xs mt-1'>{emailError}</p>
          )}
        </div>

        <div className='mb-3 relative'>
          <label className='block text-sm font-semibold mb-2'>Şifre</label>
          <input
            type={showPassword ? 'text' : 'password'}
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            className='w-full border-b border-gray-300 pb-2 outline-none text-sm focus:border-black transition pr-8'
          />
          <button
            type='button'
            onClick={() => setShowPassword(!showPassword)}
            className='absolute right-0 bottom-2 text-gray-400 hover:text-black'
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        </div>

        {isLogin && (
          <div className='text-right mb-8'>
            <button className='text-sm text-gray-400 hover:text-black transition'>Şifremi Unuttum</button>
          </div>
        )}

        <button
          onClick={handleSubmit}
          className='w-full bg-black text-white py-4 rounded-xl font-semibold text-base hover:bg-gray-800 transition mt-4'
        >
          {isLogin ? 'Giriş Yap' : 'Üye Ol'}
        </button>
      </div>
    </div>
  );
}