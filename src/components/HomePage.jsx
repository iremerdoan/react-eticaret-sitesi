import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
 
// Görselleri import et
import bebek from '../picture/bebek.png';
import beyaz from '../picture/beyaz.png';
import sevgili from '../picture/sevgili.png';
import ramazan from '../picture/ramazan.png';
import teknoloji from '../picture/teknoloji.png';
import girişim from '../picture/girişim.png';
import mak from '../picture/mak.png';
import kış from '../picture/kış.png';
import pati from '../picture/pati.png';
 
// ✅ Ortak ProductCard bileşenini import et
import ProductCard from '../components/ProductCard';
 
// ✅ Gerçek ürün verisini import et
import { productData } from '../data/mockProducts';
 
const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
 
  const slides = [bebek, beyaz, ramazan, sevgili, teknoloji, pati];
 
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);
 
  const goToSlide = (index) => setCurrentSlide(index);
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
 
  const handleDiscountClick = (discount) => {
    navigate(`/category?discount=${discount}`);
  };
 
  const handleBannerClick = (categoryName) => {
    navigate(`/category?category=${encodeURIComponent(categoryName)}`);
  };
 
  // ✅ mockProducts'tan gerçek ürünleri al
  // "En Avantajlı Ürünler" → indirimli kadın ürünlerinden ilk 5
  const advantageProducts = [
    ...productData.women.filter(p => p.discount),
    ...productData['saat-aksesuar'].filter(p => p.discount),
    ...productData['ayakkabi-canta'].filter(p => p.discount),
  ].slice(0, 5);
 
  // "Haftanın Çok Satanları" → isBestseller olanlardan karışık
  const bestsellerProducts = [
    ...productData.women.filter(p => p.isBestseller),
    ...productData['ev-yasam'].filter(p => p.isBestseller),
    ...productData.elektronik.filter(p => p.isBestseller),
  ].slice(0, 5);
 
  // "Yeni Gelenler" → isNew olanlar
  const newProducts = [
    ...productData.women.filter(p => p.isNew),
    ...productData['ayakkabi-canta'].filter(p => p.isNew),
    ...productData['saat-aksesuar'].filter(p => p.isNew),
  ].slice(0, 5);
 
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
 
      {/* ── Slider ── */}
      <div className="relative w-full rounded-lg overflow-hidden shadow-lg" style={{ aspectRatio: '16/7' }}>        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute w-full h-full transition-opacity duration-500 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img src={slide} alt={`Slide ${index + 1}`} className="w-full h-full object-cover " />
          </div>
        ))}
 
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg transition-all hover:scale-110"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
 
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg transition-all hover:scale-110"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
 
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-purple-600 w-8' : 'bg-white/60 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </div>
 
      {/* ── İndirim Kutuları ── */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        gap: '16px',
        flexWrap: 'wrap',
        padding: '24px 16px'
      }}>
        {[
          { percent: '%5',  discountValue: 5,  label: 've üzeri indirim', bg: '#fff1ee', color: '#d4471c' },
          { percent: '%10', discountValue: 10, label: 've üzeri indirim', bg: '#eef7ee', color: '#2e7d32' },
          { percent: '%30', discountValue: 30, label: 've üzeri indirim', bg: '#eef2ff', color: '#1565c0' },
          { percent: '%50', discountValue: 50, label: 've üzeri indirim', bg: '#fff0f3', color: '#b71c6b' },
        ].map((item) => (
          <div
            key={item.percent}
            onClick={() => handleDiscountClick(item.discountValue)}
            style={{
              flex: 1,
              minWidth: '160px',
              backgroundColor: item.bg,
              borderRadius: '12px',
              padding: '20px 32px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.12)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)';
            }}
          >
            <div style={{ fontSize: '36px', fontWeight: '800', color: item.color, lineHeight: 1.1 }}>
              {item.percent}
            </div>
            <div style={{ fontSize: '14px', color: item.color, marginTop: '6px' }}>
              {item.label}
            </div>
          </div>
        ))}
      </div>
 
      {/* ── En Avantajlı Ürünler ── */}
      <ProductSection
        title="En Avantajlı Ürünler"
        products={advantageProducts}
        onAllClick={() => navigate('/women')}
      />
 
      {/* ── Kampanya Bannerleri 1 ── */}
      <BannerSection
        banners={[
          { src: girişim, alt: 'Girişim Kampanyası', category: 'Girişim' },
          { src: mak,     alt: 'Makine Kampanyası',  category: 'Makine'  },
          { src: kış,     alt: 'Kış Kampanyası',     category: 'Kış'     },
        ]}
        onBannerClick={handleBannerClick}
      />
 
      {/* ── Haftanın Çok Satanları ── */}
      <ProductSection
        title="Haftanın Çok Satanları"
        products={bestsellerProducts}
        onAllClick={() => navigate('/women')}
      />
 
      {/* ── Kampanya Bannerleri 2 ── */}
      <BannerSection
        banners={[
          { src: girişim, alt: 'Girişim Kampanyası', category: 'Girişim' },
          { src: mak,     alt: 'Makine Kampanyası',  category: 'Makine'  },
          { src: kış,     alt: 'Kış Kampanyası',     category: 'Kış'     },
        ]}
        onBannerClick={handleBannerClick}
      />
 
      {/* ── Yeni Gelenler ── */}
      <ProductSection
        title="Yeni Gelenler"
        products={newProducts}
        onAllClick={() => navigate('/women')}
      />
 
      {/* ── Kampanya Bannerleri 3 ── */}
      <BannerSection
        banners={[
          { src: girişim, alt: 'Girişim Kampanyası', category: 'Girişim' },
          { src: mak,     alt: 'Makine Kampanyası',  category: 'Makine'  },
          { src: kış,     alt: 'Kış Kampanyası',     category: 'Kış'     },
        ]}
        onBannerClick={handleBannerClick}
      />
 
    </div>
  );
};
 
// ── Ürün Bölümü — artık ortak ProductCard kullanıyor ──
const ProductSection = ({ title, products, onAllClick }) => (
  <div style={{ width: '100%', padding: '24px 16px 8px' }}>
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '16px'
    }}>
      <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1a1a1a', margin: 0 }}>
        {title}
      </h2>
      <span
        onClick={onAllClick}
        style={{ color: '#ff6000', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}
      >
        Tümü &gt;
      </span>
    </div>
 
    {/* ✅ 5 kolonlu grid — her kart aynı ProductCard bileşeni */}
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)',
      gap: '12px',
    }}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} isListView={false} />
      ))}
    </div>
  </div>
);
 
// ── Banner Bölümü ─────────────────────────────────────
const BannerSection = ({ banners, onBannerClick }) => (
  <div style={{ width: '100%', padding: '24px 16px' }}>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
      {banners.map((banner, i) => (
        <div
          key={i}
          onClick={() => onBannerClick(banner.category)}
          style={{
            borderRadius: '12px',
            overflow: 'hidden',
            cursor: 'pointer',
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            transition: 'transform 0.3s, box-shadow 0.3s'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.08)';
          }}
        >
          <img
            src={banner.src}
            alt={banner.alt}
            style={{ width: '100%', height: '160px', objectFit: 'cover', display: 'block' }}
          />
        </div>
      ))}
    </div>
  </div>
);
 
export default HomePage;