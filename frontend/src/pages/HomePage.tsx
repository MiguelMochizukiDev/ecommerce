import { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import CategoryCircle from '../components/CategoryCircle';
import ProductCard, { type ProductProps } from '../components/ProductCard';
import api from '../services/api';

interface CategoryProps {
  id: number;
  name: string;
}

const HomePage = () => {
  const [categories, setCategories] = useState<CategoryProps[]>([]);
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categRes, prodRes] = await Promise.all([
          api.get('/categories'),
          api.get('/products')
        ]);
        setCategories(categRes.data);
        setProducts(prodRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Último produto anunciado (o mais recente da lista)
  const latestProduct = products.length > 0 ? products[products.length - 1] : null;

  return (
    <div className="space-y-12">
      {/* Hero Banner — Último Anúncio */}
      <div className="relative bg-[#214365] rounded-2xl overflow-hidden shadow-sm min-h-[260px]">
        {/* Background Graphic */}
        <div className="absolute right-0 top-0 h-full w-1/3 bg-[#2a5078] rounded-l-full opacity-50 transform translate-x-1/4 scale-y-150"></div>

        {loading ? (
          <div className="flex items-center justify-center h-[260px]">
            <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
          </div>
        ) : latestProduct ? (
          <div className="relative z-10 flex items-center px-16 py-12 gap-12">
            {/* Texto */}
            <div className="flex-1 text-white">
              <p className="text-sm font-light mb-2 text-gray-300">Último anúncio publicado</p>
              <h1 className="text-4xl md:text-5xl font-bold mb-3 leading-tight">{latestProduct.name}</h1>
              <p className="text-lg text-gray-200 mb-1">
                Anunciado por <span className="font-semibold text-[#4dd9ef]">{latestProduct.sellerStoreName}</span>
              </p>
              <p className="text-3xl font-bold text-white mt-4 mb-6">
                R$ {latestProduct.price.toFixed(2)}
              </p>
              <Link
                to={`/product/${latestProduct.id}`}
                className="inline-block bg-[#008aa1] hover:bg-[#00768a] text-white px-8 py-3 rounded-md transition-colors font-medium"
              >
                Ver Anúncio
              </Link>
            </div>

            {/* Imagem placeholder */}
            <div className="hidden md:flex items-center justify-center w-60 h-60 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20">
              <img
                src={`https://picsum.photos/seed/${latestProduct.id}/300/300`}
                alt={latestProduct.name}
                className="rounded-xl object-cover w-52 h-52"
              />
            </div>
          </div>
        ) : (
          <div className="relative z-10 flex flex-col justify-center px-16 py-12 text-white h-[260px]">
            <p className="text-sm font-light mb-2 text-gray-300">Bem-vindo ao</p>
            <h1 className="text-4xl md:text-5xl font-bold mb-3">BISHA Store</h1>
            <p className="text-lg text-gray-200">O marketplace dos alunos. Anuncie e encontre produtos da comunidade universitária.</p>
          </div>
        )}
      </div>

      {/* Categories */}
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-6">Categorias</h2>
        {loading ? (
          <div className="flex space-x-6 overflow-x-auto pb-4">
            {[1,2,3,4,5,6].map(i => <div key={i} className="w-24 h-24 rounded-full bg-gray-200 animate-pulse flex-shrink-0"></div>)}
          </div>
        ) : categories.length > 0 ? (
          <div className="flex space-x-6 overflow-x-auto pb-4 no-scrollbar justify-between">
            {categories.map(cat => (
              <CategoryCircle key={cat.id} id={cat.id} name={cat.name} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">Nenhuma categoria cadastrada ainda.</p>
        )}
      </section>

      {/* Anúncios Recentes */}
      <section>
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            Anúncios <span className="text-[#008aa1]">Recentes</span>
          </h2>
          <button className="text-sm font-medium text-[#008aa1] hover:underline flex items-center">
            Ver Todos <ChevronRight size={16} />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
             {[1,2,3,4,5].map(i => <div key={i} className="h-80 bg-gray-200 animate-pulse rounded-lg"></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
            {products.length === 0 && (
              <div className="col-span-5 text-center py-10 text-gray-500">
                Nenhum anúncio publicado no momento.
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
