import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCategoryProducts } from '../data/mockProducts';
import {
  IoGridOutline, IoListOutline, IoChevronDown, IoChevronUp,
  IoClose, IoFilter,
} from 'react-icons/io5';
 
// ✅ Ortak ProductCard bileşenini import et
import ProductCard from '../components/ProductCard';
 
const CATEGORY_LABELS = {
  women:            'Kadın',
  men:              'Erkek',
  kids:             'Anne & Çocuk',
  'ev-yasam':       'Ev & Yaşam',
  supermarket:      'Süpermarket',
  kozmetik:         'Kozmetik',
  'ayakkabi-canta': 'Ayakkabı & Çanta',
  elektronik:       'Elektronik',
  'spor-outdoor':   'Spor & Outdoor',
  'saat-aksesuar':  'Saat & Aksesuar',
  flash:            'Flaş Ürünler',
};
 
const SORT_OPTIONS = [
  { value: 'recommended',   label: 'Önerilen' },
  { value: 'newest',        label: 'Yeni Gelenler' },
  { value: 'price-asc',     label: 'Fiyat (Düşükten Yükseğe)' },
  { value: 'price-desc',    label: 'Fiyat (Yüksekten Düşüğe)' },
  { value: 'most-reviewed', label: 'En Çok Değerlendirilen' },
  { value: 'top-rated',     label: 'En Yüksek Puan' },
];
 
const PER_PAGE = 24;
 
// ── Filtre accordion ─────────────────────────────────
const FilterSection = ({ title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className='border-b border-gray-100 py-4'>
      <button
        onClick={() => setOpen(!open)}
        className='flex items-center justify-between w-full text-left'
      >
        <span className='font-semibold text-gray-800 text-sm'>{title}</span>
        {open ? <IoChevronUp className='text-gray-400' /> : <IoChevronDown className='text-gray-400' />}
      </button>
      {open && <div className='mt-3'>{children}</div>}
    </div>
  );
};
 
// ── Aktif filtre etiketi ─────────────────────────────
const Tag = ({ label, onRemove }) => (
  <span className='flex items-center gap-1 bg-purple-50 text-purple-700 text-xs px-3 py-1 rounded-full border border-purple-200'>
    {label} <IoClose className='cursor-pointer' onClick={onRemove} />
  </span>
);
 
// ── Ana Sayfa ────────────────────────────────────────
const CategoryPage = () => {
  const { category, subcategory } = useParams();
  const allProducts = useMemo(() => {
    const all = getCategoryProducts(category);
    if (!subcategory) return all;
    return all.filter(p =>
      p.subcategory.toLowerCase().replace(/ /g, '-') === subcategory
    );
  }, [category, subcategory]);
 
  const [isListView,       setIsListView]       = useState(false);
  const [sortBy,           setSortBy]           = useState('recommended');
  const [currentPage,      setCurrentPage]      = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    minPrice: '', maxPrice: '',
    colors: [], sizes: [], brands: [],
    freeShipping: false, inStock: false, discount: false,
  });
 
  const availableColors = useMemo(() => [...new Set(allProducts.flatMap(p => p.colors))].sort(), [allProducts]);
  const availableSizes  = useMemo(() => [...new Set(allProducts.flatMap(p => p.sizes))],          [allProducts]);
  const availableBrands = useMemo(() => [...new Set(allProducts.map(p => p.brand))].sort(),       [allProducts]);
 
  const filtered = useMemo(() => {
    let r = [...allProducts];
    if (filters.minPrice)      r = r.filter(p => p.price >= Number(filters.minPrice));
    if (filters.maxPrice)      r = r.filter(p => p.price <= Number(filters.maxPrice));
    if (filters.colors.length) r = r.filter(p => filters.colors.some(c => p.colors.includes(c)));
    if (filters.sizes.length)  r = r.filter(p => filters.sizes.some(s => p.sizes.includes(s)));
    if (filters.brands.length) r = r.filter(p => filters.brands.includes(p.brand));
    if (filters.freeShipping)  r = r.filter(p => p.freeShipping);
    if (filters.inStock)       r = r.filter(p => p.stock > 0);
    if (filters.discount)      r = r.filter(p => p.discount);
    switch (sortBy) {
      case 'price-asc':     r.sort((a, b) => a.price - b.price);            break;
      case 'price-desc':    r.sort((a, b) => b.price - a.price);            break;
      case 'newest':        r.sort((a, b) => (b.isNew?1:0)-(a.isNew?1:0)); break;
      case 'most-reviewed': r.sort((a, b) => b.reviewCount-a.reviewCount);  break;
      case 'top-rated':     r.sort((a, b) => b.rating-a.rating);            break;
      default: break;
    }
    return r;
  }, [allProducts, filters, sortBy]);
 
  const totalPages   = Math.ceil(filtered.length / PER_PAGE);
  const pageProducts = filtered.slice((currentPage-1)*PER_PAGE, currentPage*PER_PAGE);
 
  const toggle = (key, val) => {
    setFilters(p => ({
      ...p,
      [key]: p[key].includes(val) ? p[key].filter(v => v !== val) : [...p[key], val],
    }));
    setCurrentPage(1);
  };
  const clearAll = () => {
    setFilters({ minPrice:'', maxPrice:'', colors:[], sizes:[], brands:[], freeShipping:false, inStock:false, discount:false });
    setCurrentPage(1);
  };
 
  const activeCount =
    filters.colors.length + filters.sizes.length + filters.brands.length +
    (filters.freeShipping?1:0) + (filters.inStock?1:0) + (filters.discount?1:0) +
    (filters.minPrice||filters.maxPrice?1:0);
 
  const label = CATEGORY_LABELS[category] || category;
 
  const FilterPanel = () => (
    <div>
      <div className='flex items-center justify-between mb-2'>
        <h2 className='font-bold text-gray-800 text-base'>Filtrele</h2>
        {activeCount > 0 && (
          <button onClick={clearAll} className='text-xs text-purple-600 hover:underline flex items-center gap-1'>
            <IoClose /> Temizle ({activeCount})
          </button>
        )}
      </div>
 
      <FilterSection title='Fiyat Aralığı'>
        <div className='flex gap-2 items-center'>
          <input type='number' placeholder='Min TL' value={filters.minPrice}
            onChange={e => { setFilters(p=>({...p, minPrice:e.target.value})); setCurrentPage(1); }}
            className='w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-400' />
          <span className='text-gray-400'>—</span>
          <input type='number' placeholder='Max TL' value={filters.maxPrice}
            onChange={e => { setFilters(p=>({...p, maxPrice:e.target.value})); setCurrentPage(1); }}
            className='w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-400' />
        </div>
      </FilterSection>
 
      <FilterSection title='Marka'>
        <div className='space-y-2 max-h-48 overflow-y-auto pr-1'>
          {availableBrands.map(b => (
            <label key={b} className='flex items-center gap-2 cursor-pointer group'>
              <input type='checkbox' checked={filters.brands.includes(b)} onChange={() => toggle('brands', b)}
                className='accent-purple-600 w-4 h-4' />
              <span className='text-sm text-gray-700 group-hover:text-purple-600 transition-colors'>{b}</span>
            </label>
          ))}
        </div>
      </FilterSection>
 
      {availableColors.length > 0 && (
        <FilterSection title='Renk'>
          <div className='flex flex-wrap gap-2'>
            {availableColors.map(c => (
              <button key={c} onClick={() => toggle('colors', c)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                  filters.colors.includes(c)
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'border-gray-200 text-gray-600 hover:border-purple-400'
                }`}>
                {c}
              </button>
            ))}
          </div>
        </FilterSection>
      )}
 
      {availableSizes.length > 0 && (
        <FilterSection title='Beden'>
          <div className='flex flex-wrap gap-2'>
            {availableSizes.map(s => (
              <button key={s} onClick={() => toggle('sizes', s)}
                className={`text-xs w-10 h-10 rounded-lg border font-medium transition-all ${
                  filters.sizes.includes(s)
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'border-gray-200 text-gray-600 hover:border-purple-400'
                }`}>
                {s}
              </button>
            ))}
          </div>
        </FilterSection>
      )}
 
      <FilterSection title='Diğer'>
        <div className='space-y-2'>
          {[
            { key:'freeShipping', label:'Ücretsiz Kargo' },
            { key:'inStock',      label:'Stokta Var' },
            { key:'discount',     label:'İndirimli Ürünler' },
          ].map(({ key, label }) => (
            <label key={key} className='flex items-center gap-2 cursor-pointer group'>
              <input type='checkbox' checked={filters[key]}
                onChange={() => { setFilters(p=>({...p,[key]:!p[key]})); setCurrentPage(1); }}
                className='accent-purple-600 w-4 h-4' />
              <span className='text-sm text-gray-700 group-hover:text-purple-600 transition-colors'>{label}</span>
            </label>
          ))}
        </div>
      </FilterSection>
    </div>
  );
 
  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Breadcrumb */}
      <div className='bg-white border-b border-gray-100 px-4 py-2'>
        <div className='max-w-screen-xl mx-auto flex items-center gap-2 text-xs text-gray-500'>
          <Link to='/' className='hover:text-purple-600'>Anasayfa</Link>
          <span>/</span>
          <Link to={`/${category}`} className={subcategory ? 'hover:text-purple-600' : 'text-gray-800 font-medium'}>
            {label}
          </Link>
          {subcategory && (
            <>
              <span>/</span>
              <span className='text-gray-800 font-medium capitalize'>
                {subcategory.replace(/-/g, ' ')}
              </span>
            </>
          )}
        </div>
      </div>
 
      <div className='max-w-screen-xl mx-auto px-4 py-6'>
        <div className='flex items-center justify-between mb-6'>
          <div>
            <h1 className='text-2xl font-bold text-gray-900'>{label}</h1>
            <p className='text-sm text-gray-500 mt-0.5'>{filtered.length} ürün</p>
          </div>
          <button
            onClick={() => setMobileFilterOpen(true)}
            className='lg:hidden flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:border-purple-400'
          >
            <IoFilter /> Filtrele {activeCount > 0 && `(${activeCount})`}
          </button>
        </div>
 
        <div className='flex gap-6'>
          {/* Sol filtre — masaüstü */}
          <aside className='hidden lg:block w-60 flex-shrink-0'>
            <div
              className='bg-white rounded-xl border border-gray-100 p-4 sticky top-4 overflow-y-auto'
              style={{ maxHeight: 'calc(100vh - 2rem)' }}
            >
              <FilterPanel />
            </div>
          </aside>
 
          {/* Sağ içerik */}
          <div className='flex-1 min-w-0'>
            {/* Toolbar */}
            <div className='bg-white rounded-xl border border-gray-100 px-4 py-3 flex items-center justify-between mb-4'>
              <div className='flex items-center gap-2'>
                <span className='text-sm text-gray-500 hidden sm:block'>Sırala:</span>
                <select
                  value={sortBy}
                  onChange={e => { setSortBy(e.target.value); setCurrentPage(1); }}
                  className='text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-purple-400 cursor-pointer'
                >
                  {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div className='flex items-center gap-1'>
                <button
                  onClick={() => setIsListView(false)}
                  className={`p-2 rounded-lg transition-colors ${!isListView ? 'bg-purple-100 text-purple-700' : 'text-gray-400 hover:bg-gray-100'}`}
                >
                  <IoGridOutline className='text-xl' />
                </button>
                <button
                  onClick={() => setIsListView(true)}
                  className={`p-2 rounded-lg transition-colors ${isListView ? 'bg-purple-100 text-purple-700' : 'text-gray-400 hover:bg-gray-100'}`}
                >
                  <IoListOutline className='text-xl' />
                </button>
              </div>
            </div>
 
            {/* Aktif filtre etiketleri */}
            {activeCount > 0 && (
              <div className='flex flex-wrap gap-2 mb-4'>
                {filters.colors.map(c => <Tag key={c} label={c} onRemove={() => toggle('colors', c)} />)}
                {filters.sizes.map(s  => <Tag key={s} label={s} onRemove={() => toggle('sizes', s)} />)}
                {filters.brands.map(b => <Tag key={b} label={b} onRemove={() => toggle('brands', b)} />)}
                {filters.freeShipping && <Tag label='Ücretsiz Kargo' onRemove={() => setFilters(p=>({...p,freeShipping:false}))} />}
                {filters.inStock      && <Tag label='Stokta Var'     onRemove={() => setFilters(p=>({...p,inStock:false}))} />}
                {filters.discount     && <Tag label='İndirimli'      onRemove={() => setFilters(p=>({...p,discount:false}))} />}
              </div>
            )}
 
            {/* Ürünler */}
            {pageProducts.length === 0 ? (
              <div className='bg-white rounded-xl border border-gray-100 p-16 text-center'>
                <p className='text-4xl mb-4'>🔍</p>
                <p className='text-gray-500 font-medium'>Filtrelere uygun ürün bulunamadı.</p>
                <button onClick={clearAll} className='mt-4 text-purple-600 hover:underline text-sm'>
                  Filtreleri Temizle
                </button>
              </div>
            ) : (
              <div className={isListView ? 'flex flex-col gap-4' : 'grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4'}>
                {/* ✅ Artık ortak ProductCard kullanılıyor */}
                {pageProducts.map(p => <ProductCard key={p.id} product={p} isListView={isListView} />)}
              </div>
            )}
 
            {/* Sayfalama */}
            {totalPages > 1 && (
              <div className='flex justify-center items-center gap-2 mt-8 flex-wrap'>
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p-1))}
                  disabled={currentPage === 1}
                  className='px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:border-purple-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors'
                >
                  ← Önceki
                </button>
                {Array.from({ length: totalPages }, (_,i) => i+1)
                  .filter(p => p===1 || p===totalPages || Math.abs(p-currentPage)<=1)
                  .reduce((acc,p,i,arr) => {
                    if (i>0 && p-arr[i-1]>1) acc.push('...');
                    acc.push(p); return acc;
                  }, [])
                  .map((p, i) => (
                    <button
                      key={i}
                      onClick={() => typeof p === 'number' && setCurrentPage(p)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                        p === currentPage ? 'bg-purple-600 text-white' :
                        p === '...'       ? 'text-gray-400 cursor-default' :
                        'border border-gray-200 text-gray-600 hover:border-purple-400'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))}
                  disabled={currentPage === totalPages}
                  className='px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:border-purple-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors'
                >
                  Sonraki →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
 
      {/* Mobil filtre drawer */}
      {mobileFilterOpen && (
        <div className='fixed inset-0 z-50 lg:hidden'>
          <div className='absolute inset-0 bg-black/50' onClick={() => setMobileFilterOpen(false)} />
          <div className='absolute right-0 top-0 bottom-0 w-80 bg-white overflow-y-auto p-5'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='font-bold text-lg'>Filtreler</h2>
              <button onClick={() => setMobileFilterOpen(false)}>
                <IoClose className='text-2xl text-gray-500' />
              </button>
            </div>
            <FilterPanel />
            <button
              onClick={() => setMobileFilterOpen(false)}
              className='w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl transition-colors'
            >
              {filtered.length} Ürünü Gör
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
 
export default CategoryPage;