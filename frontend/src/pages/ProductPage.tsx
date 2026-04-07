import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Star, Store, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCartCount } from '../contexts/CartCountContext';
import { useToast } from '../contexts/ToastContext';
import api from '../services/api';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  status: string;
  sellerId: number;
  sellerStoreName: string;
  categoryName: string;
}

interface Review {
  id: number;
  reviewerName: string;
  productRating: number;
  sellerRating: number;
  comment: string;
  createdAt: string;
}

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { refresh } = useCartCount();
  const { showToast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, revRes] = await Promise.all([
          api.get(`/products/${id}`),
          api.get(`/reviews/products/${id}`)
        ]);
        setProduct(prodRes.data);
        setReviews(revRes.data);
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const addToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setAdding(true);
    try {
      await api.post('/cart/items', { productId: product?.id, quantity: 1 });
      refresh(); // atualiza badge do carrinho no header
      showToast('Produto adicionado ao carrinho!', 'success');
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Erro ao adicionar ao carrinho', 'error');
    } finally {
      setAdding(false);
    }
  };

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star key={i} size={16} className={i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
    ));

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-[#008aa1] rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return <div className="text-center py-20 text-gray-500">Produto não encontrado.</div>;
  }

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.productRating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="space-y-8">
      <button onClick={() => navigate(-1)} className="flex items-center text-sm text-gray-500 hover:text-[#008aa1]">
        <ArrowLeft size={16} className="mr-1" /> Voltar
      </button>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Imagem */}
          <div className="bg-gray-50 flex items-center justify-center p-12">
            <img
              src={`https://picsum.photos/seed/${product.id}/500/500`}
              alt={product.name}
              className="rounded-xl object-cover max-h-[400px]"
            />
          </div>

          {/* Info */}
          <div className="p-10 flex flex-col">
            <span className="text-xs font-medium text-[#008aa1] bg-[#008aa1]/10 px-3 py-1 rounded-full w-max mb-4">
              {product.categoryName}
            </span>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>

            {avgRating && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">{renderStars(Math.round(Number(avgRating)))}</div>
                <span className="text-sm text-gray-500">{avgRating} ({reviews.length} avaliações)</span>
              </div>
            )}

            <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow">{product.description}</p>

            <div className="flex items-center gap-2 mb-2">
              <Store size={16} className="text-gray-400" />
              <span className="text-sm text-gray-600">
                Vendido por <strong className="text-[#008aa1]">{product.sellerStoreName}</strong>
              </span>
            </div>

            <p className="text-sm text-gray-500 mb-6">
              {product.stock > 0 ? `${product.stock} disponível(eis)` : 'Esgotado'}
            </p>

            <div className="border-t border-gray-100 pt-6">
              <p className="text-4xl font-bold text-gray-900 mb-6">R$ {product.price.toFixed(2)}</p>

              <button
                onClick={addToCart}
                disabled={adding || product.stock === 0}
                className="w-full bg-[#008aa1] hover:bg-[#00768a] text-white py-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                <ShoppingCart size={20} />
                {adding ? 'Adicionando...' : product.stock > 0 ? 'Adicionar ao Carrinho' : 'Produto Esgotado'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Avaliações ({reviews.length})</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-500 text-sm">Ainda não há avaliações para este produto.</p>
        ) : (
          <div className="space-y-6">
            {reviews.map(review => (
              <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-800">{review.reviewerName}</span>
                  <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex items-center gap-4 mb-2">
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-500">Produto:</span>
                    <div className="flex">{renderStars(review.productRating)}</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-500">Vendedor:</span>
                    <div className="flex">{renderStars(review.sellerRating)}</div>
                  </div>
                </div>
                {review.comment && <p className="text-sm text-gray-600">{review.comment}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
