import React, { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { productData } from '../../data/mockProducts';  
import ProductCard from '../ProductCard';                
import { IoSearchOutline } from 'react-icons/io5';
 
// Tüm ürünleri tek diziye çevir
const ALL_PRODUCTS = Object.values(productData).flat();
 
const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
 
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return ALL_PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.subcategory?.toLowerCase().includes(q)
    );
  }, [query]);
 
  return (
    <div className='min-h-screen bg-gray-50'>
 
      {/* Breadcrumb */}
      <div className='bg-white border-b border-gray-100 px-4 py-2'>
        <div className='max-w-screen-xl mx-auto flex items-center gap-2 text-xs text-gray-500'>
          <Link to='/' className='hover:text-purple-600'>Anasayfa</Link>
          <span>/</span>
          <span className='text-gray-800 font-medium'>Arama Sonuçları</span>
        </div>
      </div>
 
      <div className='max-w-screen-xl mx-auto px-4 py-8'>
 
        {/* Başlık */}
        <div className='mb-6 flex items-center gap-3'>
          <IoSearchOutline className='text-2xl text-purple-600' />
          <div>
            <h1 className='text-2xl font-bold text-gray-900'>
              "{query}" <span className='font-normal text-gray-500'>için arama sonuçları</span>
            </h1>
            <p className='text-sm text-gray-500 mt-0.5'>{results.length} ürün bulundu</p>
          </div>
        </div>
 
        {/* Sonuç yok */}
        {results.length === 0 && (
          <div className='bg-white rounded-2xl border border-gray-100 p-16 text-center'>
            <p className='text-5xl mb-4'>🔍</p>
            <p className='text-lg font-semibold text-gray-700 mb-2'>
              "{query}" için sonuç bulunamadı
            </p>
            <p className='text-sm text-gray-400 mb-6'>
              Farklı anahtar kelimeler deneyebilir veya kategorilere göz atabilirsiniz.
            </p>
            <Link
              to='/'
              className='inline-block bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors'
            >
              Anasayfaya Dön
            </Link>
          </div>
        )}
 
        {/* Ürün grid'i — CategoryPage ile aynı tasarım */}
        {results.length > 0 && (
          <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
            {results.map(product => (
              <ProductCard key={product.id} product={product} isListView={false} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
 
export default SearchResults;