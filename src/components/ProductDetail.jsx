import React, { useState, useRef } from 'react';
import { useShop } from "./navbar/ShopContext";
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getCategoryProducts } from '../data/mockProducts';
import {
  IoHeartOutline, IoHeart, IoStarSharp,
  IoChevronDown, IoChevronUp, IoClose, IoChevronBack,
  IoChevronForward, IoShareSocialOutline, IoCheckmarkCircle,
  IoTimeOutline, IoCarOutline, IoShieldCheckmarkOutline,
  IoReturnUpBackOutline, IoSearchOutline, IoAddOutline, IoRemoveOutline,
} from 'react-icons/io5';
import { BsCart3, BsCreditCard2Front, BsLightningChargeFill } from 'react-icons/bs';
import { MdLocalShipping } from 'react-icons/md';
 
// ─── Yıldız Bileşeni ────────────────────────────────
const Stars = ({ rating, size = 'sm', showCount = false, count = 0 }) => {
  const sz = size === 'lg' ? 'text-lg' : size === 'md' ? 'text-base' : 'text-sm';
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(s => (
        <IoStarSharp
          key={s}
          className={`${sz} ${s <= Math.round(rating) ? 'text-amber-400' : 'text-gray-200'}`}
        />
      ))}
      <span className={`${size === 'lg' ? 'text-base' : 'text-xs'} font-semibold text-gray-700 ml-1`}>{rating}</span>
      {showCount && <span className="text-xs text-gray-400 ml-0.5">({count} değerlendirme)</span>}
    </div>
  );
};
 
// ─── Görsel Büyüteç (Lens) ───────────────────────────
const ImageLens = ({ src, alt }) => {
  const containerRef = useRef(null);
  const [lens, setLens] = useState({ show: false, x: 0, y: 0 });
  const ZOOM = 2.5;
  const LENS_SIZE = 120;
 
  const handleMove = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setLens({ show: true, x, y });
  };
 
  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden cursor-crosshair rounded-xl"
      onMouseMove={handleMove}
      onMouseLeave={() => setLens({ ...lens, show: false })}
    >
      <img src={src} alt={alt} className="w-full h-full object-cover object-top" />
 
      {lens.show && (
        <>
          <div
            className="absolute border-2 border-purple-400 rounded-full pointer-events-none z-10 bg-white/10 backdrop-blur-[1px]"
            style={{
              width: LENS_SIZE,
              height: LENS_SIZE,
              left: lens.x - LENS_SIZE / 2,
              top: lens.y - LENS_SIZE / 2,
            }}
          />
          <div
            className="absolute top-2 right-2 border-2 border-purple-200 rounded-xl overflow-hidden shadow-2xl z-20 pointer-events-none"
            style={{ width: 220, height: 220 }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                backgroundImage: `url(${src})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: `${ZOOM * 100}%`,
                backgroundPosition: `${(lens.x / containerRef.current?.offsetWidth) * 100}% ${(lens.y / containerRef.current?.offsetHeight) * 100}%`,
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};
 
// ─── Benzer Ürün Kartı ───────────────────────────────
const MiniProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart, toggleFavorite, isFavorite } = useShop();
  const fav = isFavorite(product?.id);
 
  return (
    <div
      className="bg-white rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-200 overflow-hidden cursor-pointer group flex-shrink-0"
      style={{ width: 180 }}
      onClick={() => navigate(`/product/${product.category}/${product.id}`)}
    >
      <div className="relative overflow-hidden" style={{ height: 210 }}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
        />
        {product.discount && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            %{product.discount}
          </span>
        )}
        <button
          onClick={e => { e.stopPropagation(); toggleFavorite(product); }}
          className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow hover:scale-110 transition-transform"
        >
          {fav ? <IoHeart className="text-red-500 text-sm" /> : <IoHeartOutline className="text-gray-400 text-sm" />}
        </button>
      </div>
      <div className="p-2.5">
        <p className="text-xs text-purple-600 font-semibold">{product.brand}</p>
        <p className="text-xs text-gray-700 font-medium truncate mt-0.5">{product.name}</p>
        <Stars rating={product.rating} />
        <div className="mt-1 flex items-center gap-1.5">
          {product.originalPrice && (
            <span className="text-xs text-gray-400 line-through">{product.originalPrice.toLocaleString('tr-TR')} TL</span>
          )}
          <span className="text-sm font-bold text-gray-900">{product.price.toLocaleString('tr-TR')} TL</span>
        </div>
      </div>
    </div>
  );
};
 
// ─── Yorum Kartı ────────────────────────────────────
const ReviewCard = ({ review }) => (
  <div className="border-b border-gray-100 pb-5 mb-5 last:border-0">
    <div className="flex items-start justify-between mb-2">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-sm">
            {review.user[0]}
          </div>
          <span className="font-semibold text-gray-800 text-sm">{review.user}</span>
          {review.verified && (
            <span className="flex items-center gap-0.5 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
              <IoCheckmarkCircle /> Doğrulanmış Alıcı
            </span>
          )}
        </div>
        <Stars rating={review.rating} />
      </div>
      <span className="text-xs text-gray-400">{review.date}</span>
    </div>
    {review.title && <p className="font-semibold text-gray-800 text-sm mb-1">{review.title}</p>}
    <p className="text-sm text-gray-600 leading-relaxed">{review.text}</p>
    {review.size && (
      <p className="text-xs text-gray-400 mt-2">Satın alınan beden: <span className="font-medium text-gray-600">{review.size}</span></p>
    )}
  </div>
);
 
// ─── S&S Accordion ──────────────────────────────────
const QAItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100">
      <button
        className="w-full text-left py-4 flex items-center justify-between gap-3"
        onClick={() => setOpen(!open)}
      >
        <span className="text-sm font-medium text-gray-800">{q}</span>
        {open ? <IoChevronUp className="text-purple-600 flex-shrink-0" /> : <IoChevronDown className="text-gray-400 flex-shrink-0" />}
      </button>
      {open && <p className="text-sm text-gray-600 pb-4 leading-relaxed">{a}</p>}
    </div>
  );
};
 
// ─── Mock veri ──────────────────────────────────────
const MOCK_REVIEWS = [
  { user: 'Ayşe K.', rating: 5, title: 'Harika kalite!', text: 'Ürün fotoğraftaki gibi geldi, kumaş kalitesi çok iyi. Bedenim için M aldım, tam oturdu. Kesinlikle tavsiye ederim.', size: 'M', verified: true, date: '28 Mar 2025' },
  { user: 'Fatma Y.', rating: 4, title: 'Güzel ürün', text: 'Rengi beklediğimden biraz farklı ama kumaşı çok kaliteli. Kargo da hızlı geldi. Tekrar alırım.', size: 'S', verified: true, date: '15 Mar 2025' },
  { user: 'Zeynep A.', rating: 5, title: 'Tam istediğim gibi', text: 'Beden tam, renk tam, kalite tam. Mükemmel bir ürün. Birkaç tane daha renk alacağım.', size: 'L', verified: false, date: '02 Mar 2025' },
  { user: 'Merve T.', rating: 3, title: 'İdare eder', text: 'Ürün fena değil ama fiyatına göre biraz pahalı. Kumaş ince, ama terleme yapmıyor. Orta beğendim.', size: 'M', verified: true, date: '18 Şub 2025' },
  { user: 'Kübra E.', rating: 2, title: 'Güzel ürün', text: 'Ürün fotoğrafta göründüğü gibi tam bedeninizi alın. Kargo gerçekten hızlı geldi. Kardeşime de alacağım.', size:'S', verified: true, date:'12 Oc 2026' },
];
 
const MOCK_QA = [
  { q: 'Bu ürün yıkama makinesinde yıkanabilir mi?', a: 'Evet, 30°C hassas yıkama programında yıkayabilirsiniz. Yüksek sıcaklıklarda yıkamaktan kaçının.' },
  { q: 'Beden tablosuna göre S mi yoksa M mi almalıyım?', a: 'Eğer ölçüleriniz S ve M arasındaysa, rahat bir kesim için M beden almanızı öneririz.' },
  { q: 'Ürün iade süreci nasıl işliyor?', a: 'Teslim tarihinden itibaren 30 gün içinde iade edebilirsiniz. Ürün etiketleri sökülmemiş ve kullanılmamış olmalıdır.' },
  { q: 'Farklı renk seçeneği gelecek mi?', a: 'Yeni renk seçenekleri önümüzdeki sezonda eklenecektir. Ürünü favorilere ekleyerek bildirim alabilirsiniz.' },
];
 
const INSTALLMENTS = [
  { bank: 'Garanti', count: 3 },
  { bank: 'Yapı Kredi', count: 6 },
  { bank: 'Akbank', count: 9 },
  { bank: 'İş Bankası', count: 12 },
];
 
// ─── Ana Bileşen ─────────────────────────────────────
const ProductDetail = () => {
  const { category, productId } = useParams();
  const navigate = useNavigate();
 
  const allProducts = getCategoryProducts(category);
  const product = allProducts.find(p => p.id === productId);
 
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const { addToCart, toggleFavorite, isFavorite } = useShop();
  const fav = isFavorite(product?.id);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('reviews');
  const [activeThumb, setActiveThumb] = useState(0);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
 
  // ─── Refs ───────────────────────────────────────────
  const similarRef = useRef(null);
  const reviewSectionRef = useRef(null);
 
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-2xl">😔</p>
        <p className="text-gray-500">Ürün bulunamadı.</p>
        <button onClick={() => navigate(-1)} className="text-purple-600 hover:underline flex items-center gap-1">
          <IoChevronBack /> Geri Dön
        </button>
      </div>
    );
  }
 
  const colorKeys = product.colorImages ? Object.keys(product.colorImages) : [];
  const activeColorKey = selectedColor || colorKeys[0] || null;
 
  // ─── Galeri görselleri ──────────────────────────────
  const galleryImages = colorKeys.length > 0
    ? [...new Set(Object.values(product.colorImages))]
    : [product.image];
 
  // Ana görsel: seçili rengin görseli (thumbnail değil)
  const displayImage = (activeColorKey && product.colorImages[activeColorKey]) || product.image;
 
  // Benzer ürünler
  const similar = allProducts
    .filter(p => p.id !== product.id && p.subcategory === product.subcategory)
    .slice(0, 8);
 
  const discountedPrice = Math.round(product.price * 0.95);
 
  // ─── Dinamik ürün özellikleri (renk değişince güncellenir) ──
  const specs = [
    { label: 'Materyal', value: '%85 Akrilik, %15 Yün' },
    { label: 'Kalıp', value: 'Oversize / Geniş Kesim' },
    { label: 'Kumaş Tipi', value: 'Örme / Triko' },
    { label: 'Desen', value: 'Düz' },
    { label: 'Renk', value: activeColorKey || 'Belirtilmemiş' },
    { label: 'Yaka Tipi', value: 'Bisiklet Yaka' },
    { label: 'Kol Boyu', value: 'Uzun Kol' },
    { label: 'Kol Tipi', value: 'Raglan Kol' },
  ];
 
  const handleAddToCart = () => {
    addToCart(product, activeColorKey, selectedSize, qty);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };
 
  const handleBuyNow = () => {
    addToCart(product, activeColorKey, selectedSize, qty);
    navigate('/cart');
  };
 
  const scrollSimilar = (dir) => {
    if (similarRef.current) {
      similarRef.current.scrollBy({ left: dir * 200, behavior: 'smooth' });
    }
  };
 
  const scrollToReviews = () => {
    setActiveTab('reviews');
    setShowAllReviews(true);
    setTimeout(() => {
      reviewSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };
 
  const ratingDist = [
    { star: 5, pct: 62 },
    { star: 4, pct: 21 },
    { star: 3, pct: 10 },
    { star: 2, pct: 4 },
    { star: 1, pct: 3 },
  ];
 
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100 px-4 py-2.5">
        <div className="max-w-screen-xl mx-auto flex items-center gap-2 text-xs text-gray-400">
          <Link to="/" className="hover:text-purple-600 transition-colors">Anasayfa</Link>
          <IoChevronForward className="text-gray-300 text-xs" />
          <Link to={`/${category}`} className="hover:text-purple-600 transition-colors capitalize">{category}</Link>
          <IoChevronForward className="text-gray-300 text-xs" />
          <span className="text-gray-700 font-medium truncate max-w-xs">{product.name}</span>
        </div>
      </div>
 
      <div className="max-w-screen-xl mx-auto px-4 py-6">
        {/* ─── Üst Alan: Görsel + Detay ─────────────────── */}
        <div className="flex flex-col lg:flex-row gap-8">
 
          {/* SOL: Görsel Galerisi */}
          <div className="lg:w-[520px] flex-shrink-0">
            <div className="flex gap-3">
              {/* Thumbnail listesi */}
              <div className="flex flex-col gap-2 flex-shrink-0">
                {galleryImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveThumb(i)}
                    className={`w-16 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      activeThumb === i ? 'border-purple-500 shadow-md' : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover object-top" />
                  </button>
                ))}
              </div>
 
              {/* Ana görsel — her zaman seçili rengin görseli */}
              <div className="flex-1 relative" style={{ height: 520 }}>
                <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
                  <span className="flex items-center gap-1.5 bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                    <BsLightningChargeFill /> Hızlı Teslimat
                  </span>
                  {product.discount && (
                    <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow">
                      %{product.discount} İndirim
                    </span>
                  )}
                  {product.isBestseller && (
                    <span className="bg-amber-400 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow">
                      Çok Satan
                    </span>
                  )}
                </div>
 
                <ImageLens src={displayImage} alt={product.name} />
 
                <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/40 backdrop-blur-sm text-white text-xs px-2.5 py-1.5 rounded-full pointer-events-none">
                  <IoSearchOutline /> Yakınlaştır
                </div>
 
                <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
                  <button
                    onClick={() => toggleFavorite(product)}
                    className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    {fav
                      ? <IoHeart className="text-red-500 text-lg" />
                      : <IoHeartOutline className="text-gray-500 text-lg" />}
                  </button>
                  <button className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform">
                    <IoShareSocialOutline className="text-gray-500 text-lg" />
                  </button>
                </div>
              </div>
            </div>
          </div>
 
          {/* SAĞ: Ürün Bilgileri */}
          <div className="flex-1 min-w-0">
            <p className="text-purple-600 font-bold text-sm mb-1">{product.brand}</p>
            <h1 className="text-2xl font-bold text-gray-900 leading-snug mb-3">{product.name}</h1>
 
            {/* Değerlendirme */}
            <div className="flex items-center gap-3 mb-4">
              <Stars rating={product.rating} size="md" showCount count={product.reviewCount} />
              <span className="text-xs text-gray-400">|</span>
              {/* ── FIX 1: Yorumları Gör — scroll + tüm yorumları aç ── */}
              <button
                className="text-xs text-purple-600 hover:underline"
                onClick={scrollToReviews}
              >
                Yorumları Gör
              </button>
            </div>
 
            {/* Sepette İndirim Uyarısı */}
            <div className="bg-purple-50 border border-purple-200 rounded-xl px-4 py-3 mb-4 flex items-center gap-3">
              <BsCart3 className="text-purple-600 text-lg flex-shrink-0" />
              <div>
                <p className="text-xs text-purple-700 font-semibold">Sepette %5 İndirim</p>
                <p className="text-xs text-gray-500 mt-0.5">Sepete ekleyince otomatik uygulanır</p>
              </div>
            </div>
 
            {/* Fiyat */}
            <div className="mb-5">
              {product.originalPrice && (
                <span className="text-sm text-gray-400 line-through mr-2">
                  {product.originalPrice.toLocaleString('tr-TR')} TL
                </span>
              )}
              <span className="text-3xl font-extrabold text-gray-900">
                {product.price.toLocaleString('tr-TR')} TL
              </span>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-sm text-gray-400 line-through">{product.price.toLocaleString('tr-TR')} TL</span>
                <span className="text-lg font-bold text-purple-700">
                  {discountedPrice.toLocaleString('tr-TR')} TL
                </span>
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-semibold">Sepette</span>
              </div>
            </div>
 
            {/* Renk Seçimi */}
            {colorKeys.length > 1 && (
              <div className="mb-5">
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  Renk: <span className="font-normal text-gray-500">{activeColorKey}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {colorKeys.map(c => (
                    <button
                      key={c}
                      onClick={() => { setSelectedColor(c); setActiveThumb(0); }}
                      className={`text-xs px-3 py-2 rounded-full border-2 font-medium transition-all ${
                        activeColorKey === c
                          ? 'border-purple-600 bg-purple-600 text-white shadow-md'
                          : 'border-gray-200 text-gray-600 hover:border-purple-400 bg-white'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}
 
            {/* Beden Seçimi */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-gray-700">
                    Beden: <span className="font-normal text-gray-500">{selectedSize || 'Seçiniz'}</span>
                  </p>
                  <button
                    onClick={() => setShowSizeGuide(!showSizeGuide)}
                    className="text-xs text-purple-600 hover:underline"
                  >
                    📏 Beden Rehberi
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(s => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`min-w-[46px] h-11 px-3 rounded-lg border-2 text-sm font-semibold transition-all ${
                        selectedSize === s
                          ? 'border-purple-600 bg-purple-600 text-white shadow-md'
                          : 'border-gray-200 text-gray-700 hover:border-purple-400 bg-white'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
 
                {showSizeGuide && (
                  <div className="mt-3 p-4 bg-gray-50 rounded-xl border border-gray-200 text-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-700">Beden Rehberi (cm)</span>
                      <button onClick={() => setShowSizeGuide(false)}><IoClose /></button>
                    </div>
                    <table className="w-full text-center">
                      <thead>
                        <tr className="text-gray-500">
                          <th className="py-1 pr-3 text-left">Beden</th>
                          <th className="py-1">Göğüs</th>
                          <th className="py-1">Bel</th>
                          <th className="py-1">Kalça</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[['XS','80-84','60-64','86-90'],['S','84-88','64-68','90-94'],['M','88-92','68-72','94-98'],['L','92-96','72-76','98-102'],['XL','96-100','76-80','102-106']].map(([sz,...m]) => (
                          <tr key={sz} className={`border-t border-gray-200 ${selectedSize===sz?'bg-purple-50 font-bold':''}`}>
                            <td className="py-1 pr-3 text-left font-semibold text-gray-700">{sz}</td>
                            {m.map((v,i) => <td key={i} className="py-1 text-gray-600">{v}</td>)}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
 
            {/* Miktar + Sepet Butonları */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="px-3 py-3 hover:bg-gray-100 transition-colors text-gray-600"
                >
                  <IoRemoveOutline />
                </button>
                <span className="px-4 font-bold text-gray-800 text-sm">{qty}</span>
                <button
                  onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                  className="px-3 py-3 hover:bg-gray-100 transition-colors text-gray-600"
                >
                  <IoAddOutline />
                </button>
              </div>
 
              <button
                onClick={handleAddToCart}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 ${
                  addedToCart
                    ? 'bg-green-500 text-white'
                    : 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-200 hover:shadow-purple-300'
                }`}
              >
                {addedToCart
                  ? <><IoCheckmarkCircle className="text-lg" /> Sepete Eklendi!</>
                  : <><BsCart3 className="text-lg" /> Sepete Ekle</>}
              </button>
 
              <button
                onClick={() => toggleFavorite(product)}
                className="p-3.5 rounded-xl border-2 border-gray-200 hover:border-red-300 hover:bg-red-50 transition-colors"
              >
                {fav
                  ? <IoHeart className="text-red-500 text-xl" />
                  : <IoHeartOutline className="text-gray-400 text-xl" />}
              </button>
            </div>
 
            {/* ── FIX 2: Şimdi Al — sepete ekle + sepete git ── */}
            <button
              onClick={handleBuyNow}
              className="w-full py-3.5 rounded-xl font-bold text-sm border-2 border-purple-600 text-purple-600 hover:bg-purple-50 transition-colors mb-5 flex items-center justify-center gap-2"
            >
              <BsLightningChargeFill /> Şimdi Al
            </button>
 
            {/* Kargo Bilgileri */}
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 space-y-3 mb-4">
              <div className="flex items-start gap-3">
                <IoTimeOutline className="text-purple-600 text-lg mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    8 saat içinde sipariş verirsen en geç <span className="text-purple-700">Pazartesi kargoda!</span>
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MdLocalShipping className="text-purple-600 text-lg mt-0.5 flex-shrink-0" />
                <div>
                  {/* ── FIX 3: "Adresini seç..." — sepete git ── */}
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Tahmini Teslim: </span>
                    <button
                      onClick={() => navigate('/cart')}
                      className="text-purple-600 hover:underline text-sm"
                    >
                      Adresini seç, ne zaman teslim edileceğini öğren!
                    </button>
                  </p>
                </div>
              </div>
              {product.freeShipping && (
                <div className="flex items-center gap-3">
                  <IoCarOutline className="text-green-600 text-lg flex-shrink-0" />
                  <p className="text-sm font-semibold text-green-700">✓ Ücretsiz Kargo</p>
                </div>
              )}
              <div className="flex items-center gap-3">
                <IoReturnUpBackOutline className="text-blue-600 text-lg flex-shrink-0" />
                <p className="text-sm text-gray-700">30 gün ücretsiz iade</p>
              </div>
              <div className="flex items-center gap-3">
                <IoShieldCheckmarkOutline className="text-gray-600 text-lg flex-shrink-0" />
                <p className="text-sm text-gray-700">Güvenli alışveriş garantisi</p>
              </div>
            </div>
 
            {/* Ödeme Seçenekleri */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-gray-50 transition-colors"
                onClick={() => setShowPayment(!showPayment)}
              >
                <div className="flex items-center gap-2">
                  <BsCreditCard2Front className="text-purple-600 text-lg" />
                  <span className="text-sm font-semibold text-gray-800">Ödeme Seçenekleri</span>
                </div>
                {showPayment ? <IoChevronUp className="text-gray-400" /> : <IoChevronDown className="text-gray-400" />}
              </button>
              {showPayment && (
                <div className="px-4 pb-4 bg-white border-t border-gray-100">
                  <p className="text-xs text-gray-500 mt-3 mb-3">Taksit fırsatlarından yararlanın</p>
                  <div className="space-y-2">
                    {INSTALLMENTS.map(inst => (
                      <div key={inst.bank} className="flex items-center justify-between text-sm py-2 border-b border-gray-100 last:border-0">
                        <span className="font-medium text-gray-700">{inst.bank}</span>
                        <span className="text-gray-600">{inst.count} taksit</span>
                        <span className="font-bold text-gray-800">
                          {Math.round(discountedPrice / inst.count).toLocaleString('tr-TR')} TL/ay
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-3">* Taksit tutarları yaklaşık değerdir.</p>
                </div>
              )}
            </div>
          </div>
        </div>
 
        {/* ─── Ürün Özellikleri ─────────────────────────── */}
        {/* ── FIX 4: specs dinamik — renk değişince güncellenir ── */}
        <div className="mt-10 bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-5">Ürün Özellikleri</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-0">
            {specs.map((spec, i) => (
              <div
                key={spec.label}
                className={`py-3 px-4 ${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'} border-b border-gray-100`}
              >
                <p className="text-xs text-gray-400 font-medium mb-0.5">{spec.label}</p>
                <p className="text-sm font-semibold text-gray-800">{spec.value}</p>
              </div>
            ))}
          </div>
        </div>
 
        {/* ─── Benzer Ürünler ─────────────────────────── */}
        {similar.length > 0 && (
          <div className="mt-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Benzer Ürünler</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => scrollSimilar(-1)}
                  className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:border-purple-400 hover:text-purple-600 transition-colors"
                >
                  <IoChevronBack />
                </button>
                <button
                  onClick={() => scrollSimilar(1)}
                  className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:border-purple-400 hover:text-purple-600 transition-colors"
                >
                  <IoChevronForward />
                </button>
              </div>
            </div>
            <div
              ref={similarRef}
              className="flex gap-4 overflow-x-auto pb-2"
              style={{ scrollbarWidth: 'none' }}
            >
              {similar.map(p => <MiniProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
 
        {/* ─── Önerilen Ürünler ────────────────────────── */}
        <div className="mt-10">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Sana Özel Öneriler</h2>
          <div
            className="flex gap-4 overflow-x-auto pb-2"
            style={{ scrollbarWidth: 'none' }}
          >
            {allProducts.filter(p => p.id !== product.id).slice(0, 8).map(p => (
              <MiniProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
 
        {/* ─── Değerlendirme & Yorumlar / Soru-Cevap ───── */}
        {/* ── FIX 1: reviewSectionRef buraya bağlandı ── */}
        <div ref={reviewSectionRef} className="mt-10 bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="flex border-b border-gray-100">
            {[
              { key: 'reviews', label: `Değerlendirmeler (${product.reviewCount})` },
              { key: 'qa', label: 'Soru & Cevap' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-4 text-sm font-semibold transition-colors ${
                  activeTab === tab.key
                    ? 'text-purple-700 border-b-2 border-purple-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
 
          <div className="p-6">
            {activeTab === 'reviews' && (
              <div>
                {/* Özet */}
                <div className="flex flex-col sm:flex-row gap-8 mb-8 pb-8 border-b border-gray-100">
                  <div className="text-center flex-shrink-0">
                    <p className="text-5xl font-extrabold text-gray-900">{product.rating}</p>
                    <Stars rating={product.rating} size="lg" />
                    <p className="text-xs text-gray-400 mt-1">{product.reviewCount} değerlendirme</p>
                  </div>
                  <div className="flex-1 space-y-2">
                    {ratingDist.map(r => (
                      <div key={r.star} className="flex items-center gap-3">
                        <span className="text-xs text-gray-500 w-8 text-right">{r.star} ★</span>
                        <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                          <div className="h-full bg-amber-400 rounded-full" style={{ width: `${r.pct}%` }} />
                        </div>
                        <span className="text-xs text-gray-400 w-8">{r.pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>
 
                {/* ── FIX 5: Yorum listesi — showAllReviews ile kontrol ── */}
                <div>
                  {(showAllReviews ? MOCK_REVIEWS : MOCK_REVIEWS.slice(0, 2)).map((r, i) => (
                    <ReviewCard key={i} review={r} />
                  ))}
                </div>
 
                <button
                  onClick={() => setShowAllReviews(!showAllReviews)}
                  className="w-full mt-4 py-3 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:border-purple-400 hover:text-purple-600 transition-colors"
                >
                  {showAllReviews
                    ? 'Daha Az Göster'
                    : `Tüm Yorumları Gör (${product.reviewCount})`}
                </button>
              </div>
            )}
 
            {activeTab === 'qa' && (
              <div>
                <p className="text-sm text-gray-500 mb-5">
                  Ürün hakkında merak ettiklerinizi sorun, müşteri temsilcilerimiz ve diğer alıcılar yanıtlasın.
                </p>
                <div className="mb-6">
                  {MOCK_QA.map((item, i) => <QAItem key={i} q={item.q} a={item.a} />)}
                </div>
                <div className="bg-purple-50 rounded-xl p-4">
                  <p className="text-sm font-semibold text-gray-800 mb-3">Soru Sor</p>
                  <textarea
                    placeholder="Ürün hakkında sorunuzu yazın..."
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:border-purple-400"
                    rows={3}
                  />
                  <button className="mt-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors">
                    Gönder
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default ProductDetail;