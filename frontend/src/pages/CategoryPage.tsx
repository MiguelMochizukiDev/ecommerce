import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronRight, Tag } from 'lucide-react';
import ProductCard, { type ProductProps } from '../components/ProductCard';
import api from '../services/api';

interface Category {
  id: number;
  name: string;
}

const CategoryPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          api.get(`/categories/${id}`),
          api.get(`/products?categoryId=${id}`),
        ]);
        setCategory(catRes.data);
        setProducts(prodRes.data);
      } catch {
        setCategory(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-[#008aa1] rounded-full animate-spin" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="text-center py-20 text-gray-500">
        Categoria não encontrada.{' '}
        <button onClick={() => navigate('/')} className="text-[#008aa1] hover:underline">
          Voltar ao início
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500">
        <Link to="/" className="hover:text-[#008aa1]">Início</Link>
        <ChevronRight size={14} />
        <span className="text-gray-800 font-medium">{category.name}</span>
      </nav>

      {/* Header da categoria */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#008aa1]/10 flex items-center justify-center">
          <Tag size={18} className="text-[#008aa1]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{category.name}</h1>
          <p className="text-sm text-gray-500">{products.length} produto(s) encontrado(s)</p>
        </div>
      </div>

      {/* Grid de produtos */}
      {products.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          Nenhum produto nesta categoria ainda.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
