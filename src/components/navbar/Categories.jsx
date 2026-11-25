import React, { useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { HiMenu } from 'react-icons/hi';
import { IoChevronDown, IoChevronForward } from 'react-icons/io5';

const megaMenuData = {
  'Kadın': {
    path: '/women',
    icon: '👗',
    subcategories: {
      'Giyim': ['Elbise', 'Tişört', 'Gömlek', 'Kot Pantolon', 'Kot Ceket','Pantolon','Mont','Bluz','Ceket','Etek','Kazak','Tesettür','Büyük Beden' ,'Sweatshir','Blazer', 'Trençkot'],
      'Ayakkabı': ['Topuklu Ayakkabı', 'Sneaker', 'Günlük Ayakkabı', 'Babet', 'Sandalet', 'Bot','Çizme'],
      'Aksesuar & Çanta': ['Çanta', 'Saat', 'Takı', 'Cüzdan', 'Atkı', 'Şapka','Kemer','Şal','Bere&Eldiven&Atkı'],
      'Kozmetik': ['Parfüm', 'Göz Makyajı', 'Cilt Bakım', 'Saç Bakımı', 'Makyaj','Ağız Bakım','Epilasyon Ürünleri','Manikür&Pedikür'],
      'Ev & İç Giyim': ['Pijama Takımı', 'Gecelik', 'Sütyen', 'İç Çamaşırı', 'Korse','Çorap'],
      'Spor & Outdoor': ['Sweatshirt', 'Spor Tişört', 'Spor Sütyeni', 'Eşofman', 'Yoga Kıyafeti','Mat','Sporcu Besinleri'],
    }
  },
  'Erkek': {
    path: '/men',
    icon: '👔',
    subcategories: {
      'Giyim': ['Tişört','Şort' ,'Gömlek', 'Pantolon', 'Jean', 'Takım Elbise', 'Mont','Kaban','Yelek','Kazak' ,'Sweatshirt','Büyük Beden'],
      'Ayakkabı': ['Sneaker', 'Klasik Ayakkabı', 'Bot', 'Loafer', 'Spor Ayakkabı'],
      'Aksesuar': ['Kemer', 'Cüzdan', 'Saat', 'Kravat', 'Şapka', 'Çanta','Atkı&Bere&Eldiven'],
      'Spor': ['Spor Tişört', 'Eşofman', 'Spor Şortu', 'Koşu Kıyafeti'],
      'İç Giyim': ['Boxer', 'Atlet', 'Çorap', 'Pijama'],
      'Spor & Outdoor': ['Sweatshirt','Forma','Eşofman','Spor Giyim','Outdoor Ayakkabı','Sporcu Besinleri','Sporcu Aksesuarları'],
      'Kişisel Bakım': ['Parfüm','Deodorant','Tıraş Bıçağı','Ağız bakım','Tıraş Sonrası Ürünleri'],
    }

  },
  'Anne & Çocuk': {
    path: '/kids',
    icon: '🧒',
    subcategories: {
      'Bebek Giyim': ['Zıbın', 'Tulum', 'Pijama', 'Şapka & Eldiven', 'Uyku Tulumu','Bebek Takımları','Yenidoğan kıyafetleri','Bebek Patiği', 'Hastane Çıkışı'],
      'Çocuk Giyim': ['Tişört', 'Pantolon', 'Elbise', 'Mont', 'Pijama Takımı','Kazak','Bot','Şapka','Sweatshirt','İç Giyim'],
      'Oyuncak': ['Bebek Oyuncakları', 'Eğitici Oyuncaklar', 'Puzzle', 'LEGO', 'Peluş','Kumandalı Oyuncaklar','Okul Öncesi'],
      'Anne': ['Hamile Giyim', 'Emzirme', 'Bebek Arabası', 'Ana Kucağı','Sweatshirt'],
      'Bebek Bakım': ['Bebek Bezi', 'Buhar Makinası', 'Bebek Şampuanı', 'Bebek deterjanı','Bebek Çantası','Islak Mendil','Vücut Kremleri'],
    }
  },
  'Ev & Yaşam': {
    path: '/ev-yasam',
    icon: '🏠',
    subcategories: {
      'Mobilya': ['Koltuk', 'Yatak', 'Masa', 'Sandalye', 'Dolap', 'Raf'],
      'Dekorasyon': ['Tablo', 'Halı', 'Yastık', 'Perde', 'Çiçek & Vazo'],
      'Mutfak': ['Tencere', 'Tava', 'Bıçak', 'Kap Kacak', 'Mutfak Aletleri'],
      'Banyo': ['Havlu', 'Banyo Seti', 'Aynalar', 'Banyo Aksesuarları'],
      'Tekstil': ['Nevresim', 'Çarşaf', 'Battaniye', 'Yorgan', 'Yastık'],
    }
  },
  'Süpermarket': {
    path: '/supermarket',
    icon: '🛒',
    subcategories: {
      'Gıda': ['Tahıl & Bakliyat', 'Makarna & Pirinç', 'Konserve', 'Çay & Kahve', 'Atıştırmalık'],
      'İçecek': ['Su', 'Meyve Suyu', 'Gazlı İçecek', 'Enerji İçeceği'],
      'Temizlik': ['Deterjan', 'Yumuşatıcı', 'Bulaşık', 'Yüzey Temizleyici'],
      'Kişisel Bakım': ['Şampuan', 'Duş Jeli', 'Diş Macunu', 'Deodorant'],
      'Evcil Hayvan': ['Kedi Maması', 'Köpek Maması', 'Kedi Kumu', 'Oyuncak'],
    }
  },
  'Kozmetik': {
    path: '/kozmetik',
    icon: '💄',
    subcategories: {
      'Makyaj': ['Ruj', 'Rimel', 'Fondöten', 'Allık', 'Far'],
      'Cilt Bakım': ['Nemlendirici', 'Serum', 'Güneş Kremi', 'Tonik', 'Maske'],
      'Saç Bakım': ['Şampuan', 'Saç Kremi', 'Saç Maskesi', 'Saç Yağı'],
      'Parfüm': ['Kadın Parfümü', 'Erkek Parfümü', 'Unisex', 'Deodorant'],
      'Araçlar': ['Fön Makinesi', 'Düzleştirici', 'Makyaj Fırçaları'],
    }
  },
  'Ayakkabı & Çanta': {
    path: '/ayakkabi-canta',
    icon: '👜',
    subcategories: {
      'Kadın Ayakkabı': ['Topuklu', 'Sneaker', 'Babet', 'Bot', 'Sandalet'],
      'Erkek Ayakkabı': ['Sneaker', 'Klasik', 'Bot', 'Loafer'],
      'Çanta': ['Omuz Çantası', 'Sırt Çantası', 'El Çantası', 'Valiz', 'Portföy'],
      'Aksesuarlar': ['Kemer', 'Cüzdan', 'Anahtarlık', 'Çanta Aksesuarları'],
    }
  },
  'Elektronik': {
    path: '/elektronik',
    icon: '💻',
    subcategories: {
      'Bilgisayar': ['Laptop', 'Masaüstü', 'Tablet', 'Monitör', 'Klavye & Mouse'],
      'Telefon': ['Akıllı Telefon', 'Kılıf', 'Ekran Koruyucu', 'Şarj Aleti'],
      'TV & Ses': ['Televizyon', 'Soundbar', 'Kulaklık', 'Hoparlör'],
      'Oyun': ['PlayStation', 'Xbox', 'Nintendo', 'Oyun Kolları', 'Gaming Headset'],
      'Akıllı Ev': ['Akıllı Saat', 'Robot Süpürge', 'Akıllı Ampul', 'Güvenlik Kamera'],
      'Fotoğraf': ['Fotoğraf Makinesi', 'Lens', 'Drone', 'Aksesuar'],
    }
  },
  'Spor & Outdoor': {
    path: '/spor-outdoor',
    icon: '⚽',
    subcategories: {
      'Spor Giyim': ['Tişört', 'Eşofman', 'Tayt', 'Şort', 'Spor Ayakkabı'],
      'Fitness': ['Dumbbell', 'Yoga Matı', 'Protein Tozu', 'Spor Ekipmanı'],
      'Outdoor': ['Çadır', 'Uyku Tulumu', 'Trekking Botu', 'Sırt Çantası'],
      'Takım Sporları': ['Futbol', 'Basketbol', 'Voleybol', 'Tenis'],
      'Su Sporları': ['Mayo', 'Sörf', 'Dalış Ekipmanı', 'Yüzme Gözlüğü'],
    }
  },
  'Saat & Aksesuar': {
    path: '/saat-aksesuar',
    icon: '⌚',
    subcategories: {
      'Saat': ['Akıllı Saat', 'Klasik Saat', 'Spor Saat', 'Kadın Saati', 'Erkek Saati'],
      'Takı': ['Kolye', 'Bileklik', 'Yüzük', 'Küpe', 'Broş'],
      'Güneş Gözlüğü': ['Kadın', 'Erkek', 'Sporcu', 'Çocuk'],
      'Diğer': ['Kemer', 'Şapka', 'Atkı', 'Eldiven'],
    }
  },
  'Flaş Ürünler': {
    path: '/flash',
    icon: '⚡',
    subcategories: {
      'Bugünün Fırsatları': ['%50 İndirim', '%70 İndirim', 'Son Stok', 'Yeni Gelenler'],
      'Kategoriye Göre': ['Elektronik Fırsatları', 'Moda Fırsatları', 'Ev Fırsatları', 'Kozmetik Fırsatları'],
    }
  },
};

// Her navbar linkine hover yapınca açılan mini dropdown
const NavCategoryItem = ({ cat, isDragging }) => {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef(null);
  const data = megaMenuData[cat];

  const handleEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };

  const handleLeave = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  };

  const subcatEntries = Object.entries(data.subcategories);

  return (
    <div
      className='relative flex-shrink-0'
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <Link
        to={data.path}
        draggable={false}
        onClick={(e) => { if (isDragging.current) e.preventDefault(); }}
        className={`flex items-center gap-1 font-medium text-sm transition-colors whitespace-nowrap pb-1
          ${open ? 'text-purple-700 border-b-2 border-purple-700' : 'text-gray-700 hover:text-purple-700'}`}
      >
        {cat}
        <IoChevronDown className={`text-xs transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </Link>

      {open && (
        <div
          className='absolute left-0 top-full mt-2 bg-white shadow-2xl border border-gray-100 rounded-xl z-50 overflow-hidden'
          style={{ minWidth: '580px', maxHeight: '420px' }}
        >
          {/* Başlık */}
          <div className='px-5 py-3 bg-purple-50 border-b border-purple-100 flex items-center justify-between'>
            <span className='text-purple-700 font-bold text-sm flex items-center gap-2'>
              <span>{data.icon}</span> {cat}
            </span>
            <Link
              to={data.path}
              className='text-xs text-purple-500 hover:text-purple-700 hover:underline'
            >
              Tümünü Gör →
            </Link>
          </div>

          {/* Alt kategoriler grid */}
          <div
            className='p-5 overflow-y-auto'
            style={{ maxHeight: '360px' }}
          >
            <div className='grid grid-cols-3 gap-5'>
              {subcatEntries.map(([subCat, items]) => (
                <div key={subCat}>
                  <h4 className='text-purple-700 font-semibold text-xs mb-2 border-b border-purple-100 pb-1 uppercase tracking-wide'>
                    {subCat}
                  </h4>
                  <ul className='space-y-1'>
                    {items.map((item) => (
                      <li key={item}>
                        <Link
                          to={`${data.path}/${item.toLowerCase().replace(/ /g, '-')}`}
                          className='text-gray-600 text-xs hover:text-purple-700 hover:underline transition-colors block py-0.5'
                        >
                          {item}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Navbar'da gösterilecek kategoriler — taşmayanlar
const VISIBLE_NAV_CATEGORIES = ['Kadın', 'Erkek', 'Anne & Çocuk', 'Ev & Yaşam', 'Süpermarket', 'Kozmetik', 'Ayakkabı & Çanta', 'Elektronik', 'Spor & Outdoor', 'Saat & Aksesuar', 'Flaş Ürünler'];

const Categories = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Kadın');
  const closeTimer = useRef(null);
  const navScrollRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const handleMouseDown = useCallback((e) => {
    isDragging.current = true;
    startX.current = e.pageX - navScrollRef.current.offsetLeft;
    scrollLeft.current = navScrollRef.current.scrollLeft;
    navScrollRef.current.style.cursor = 'grabbing';
  }, []);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
    if (navScrollRef.current) navScrollRef.current.style.cursor = 'grab';
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - navScrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    navScrollRef.current.scrollLeft = scrollLeft.current - walk;
  }, []);

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    navScrollRef.current.scrollLeft += e.deltaY;
  }, []);

  const categoryList = Object.keys(megaMenuData);

  const handleMenuEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setIsOpen(true);
  };

  const handleMenuLeave = () => {
    // Küçük gecikme: sol listeden sağ panele geçerken kapanmasın
    closeTimer.current = setTimeout(() => {
      setIsOpen(false);
    }, 120);
  };

  return (
    <div className='bg-white border-b border-gray-200 py-3'>
      <div className='flex items-center px-4'>

        {/* Kategoriler Dropdown Button — sabit, scroll dışında */}
        <div
          className='relative flex-shrink-0 mr-4'
          onMouseEnter={handleMenuEnter}
          onMouseLeave={handleMenuLeave}
        >
          <button className='flex items-center gap-2 text-purple-700 font-semibold hover:text-purple-900 transition-colors whitespace-nowrap'>
            <HiMenu className='text-xl' />
            Kategoriler
            <IoChevronDown className={`text-lg transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Mega Menu */}
          {isOpen && (
            <div
              className='absolute left-0 top-full mt-1 bg-white shadow-2xl border border-gray-200 z-50 flex rounded-lg overflow-hidden'
              style={{ width: '860px', maxHeight: '500px' }}
              onMouseEnter={handleMenuEnter}
              onMouseLeave={handleMenuLeave}
            >
              {/* Sol Ana Kategoriler — scroll aktif */}
              <div className='w-52 bg-gray-50 border-r border-gray-200 overflow-y-auto flex-shrink-0'>
                {categoryList.map((cat) => (
                  <div
                    key={cat}
                    onMouseEnter={() => setActiveCategory(cat)}
                    className={`flex items-center justify-between px-4 py-3 cursor-pointer border-b border-gray-100 transition-colors text-sm font-medium
                      ${activeCategory === cat
                        ? 'bg-purple-50 text-purple-700 border-l-4 border-l-purple-700'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-purple-700'
                      }`}
                  >
                    <span className='flex items-center gap-2'>
                      <span>{megaMenuData[cat].icon}</span>
                      {cat}
                    </span>
                    <IoChevronForward className='text-gray-400 text-xs flex-shrink-0' />
                  </div>
                ))}
              </div>

              {/* Sağ: Alt Kategoriler — scroll aktif */}
              {activeCategory && megaMenuData[activeCategory] && (
                <div className='flex-1 p-5 overflow-y-auto'>
                  <div className='mb-3'>
                    <Link
                      to={megaMenuData[activeCategory].path}
                      className='text-purple-700 font-bold text-base hover:underline'
                    >
                      Tüm {activeCategory} →
                    </Link>
                  </div>
                  <div className='grid grid-cols-3 gap-5'>
                    {Object.entries(megaMenuData[activeCategory].subcategories).map(([subCat, items]) => (
                      <div key={subCat}>
                        <h4 className='text-purple-700 font-semibold text-sm mb-2 border-b border-purple-100 pb-1'>
                          {subCat}
                        </h4>
                        <ul className='space-y-1'>
                          {items.map((item) => (
                            <li key={item}>
                              <Link
                                to={`${megaMenuData[activeCategory].path}/${item.toLowerCase().replace(/ /g, '-')}`}
                                className='text-gray-600 text-xs hover:text-purple-700 hover:underline transition-colors'
                              >
                                {item}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navbar kategoriler — sürükle/kaydır */}
        <div
          ref={navScrollRef}
          className='flex items-center gap-6 overflow-x-auto select-none'
          style={{
            cursor: 'grab',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onMouseMove={handleMouseMove}
          onWheel={handleWheel}
        >
          <style>{`.nav-cat-scrollbar::-webkit-scrollbar { display: none; }`}</style>
          {VISIBLE_NAV_CATEGORIES.map((cat) => (
            <NavCategoryItem
              key={cat}
              cat={cat}
              isDragging={isDragging}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;