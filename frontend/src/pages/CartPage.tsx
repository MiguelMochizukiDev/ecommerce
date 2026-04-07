import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, AlertTriangle } from 'lucide-react';
import api from '../services/api';

interface CartItem {
  id: number;
  productId: number;
  productName: string;
  sellerStoreName: string;
  quantity: number;
  priceSnapshot: number;
  currentPrice: number;
  hasDivergence: boolean;
  subtotal: number;
}

interface CartData {
  id: number;
  items: CartItem[];
  total: number;
  hasAnyDivergence: boolean;
}

const CartPage = () => {
  const [cart, setCart] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const res = await api.get('/cart');
      setCart(res.data);
    } catch {
      setCart(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCart(); }, []);

  const updateQty = async (itemId: number, quantity: number) => {
    try {
      const res = await api.put(`/cart/items/${itemId}`, { quantity });
      setCart(res.data);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao atualizar quantidade');
    }
  };

  const removeItem = async (itemId: number) => {
    try {
      const res = await api.delete(`/cart/items/${itemId}`);
      setCart(res.data);
    } catch {
      alert('Erro ao remover item');
    }
  };

  const clearCart = async () => {
    try {
      await api.delete('/cart');
      setCart(null);
    } catch {
      alert('Erro ao limpar carrinho');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-[#008aa1] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="text-center py-20">
        <ShoppingBag size={64} className="mx-auto text-gray-300 mb-6" />
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Carrinho vazio</h2>
        <p className="text-gray-500 mb-6">Você ainda não adicionou nenhum item.</p>
        <Link to="/" className="bg-[#008aa1] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#00768a] transition-colors">
          Ver anúncios
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Meu Carrinho</h1>

      {cart.hasAnyDivergence && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle className="text-amber-500" size={20} />
          <p className="text-sm text-amber-700">Alguns preços mudaram desde que você adicionou os itens. Revise antes de finalizar.</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map(item => (
            <div key={item.id} className="bg-white border border-gray-200 rounded-xl p-5 flex gap-5">
              <img
                src={`https://picsum.photos/seed/${item.productId}/120/120`}
                alt={item.productName}
                className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
              />
              <div className="flex-1">
                <Link to={`/product/${item.productId}`} className="font-semibold text-gray-800 hover:text-[#008aa1]">
                  {item.productName}
                </Link>
                <p className="text-xs text-gray-500 mt-1">Vendido por: {item.sellerStoreName}</p>

                {item.hasDivergence && (
                  <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                    <AlertTriangle size={12} /> Preço alterado: era R$ {item.priceSnapshot.toFixed(2)}, agora R$ {item.currentPrice.toFixed(2)}
                  </p>
                )}

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQty(item.id, Math.max(1, item.quantity - 1))}
                      className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50">
                      <Minus size={14} />
                    </button>
                    <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                    <button onClick={() => updateQty(item.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50">
                      <Plus size={14} />
                    </button>
                    <button onClick={() => removeItem(item.id)}
                      className="ml-4 text-red-400 hover:text-red-600 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <p className="font-bold text-gray-900">R$ {item.subtotal.toFixed(2)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 h-max sticky top-8">
          <h3 className="font-bold text-gray-800 mb-4">Resumo do Pedido</h3>
          <div className="space-y-2 text-sm text-gray-600 mb-4">
            <div className="flex justify-between">
              <span>{cart.items.length} item(s)</span>
              <span>R$ {cart.total.toFixed(2)}</span>
            </div>
          </div>
          <div className="border-t border-gray-100 pt-4 mb-6">
            <div className="flex justify-between font-bold text-lg text-gray-900">
              <span>Total</span>
              <span>R$ {cart.total.toFixed(2)}</span>
            </div>
          </div>
          <button onClick={() => navigate('/checkout')}
            className="w-full bg-[#008aa1] hover:bg-[#00768a] text-white py-3 rounded-xl font-medium transition-colors">
            Finalizar Compra
          </button>
          <button onClick={clearCart}
            className="w-full text-red-500 hover:text-red-700 text-sm mt-3 py-2 transition-colors">
            Limpar carrinho
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
