import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, CreditCard } from 'lucide-react';
import api from '../services/api';

interface CartItem {
  id: number;
  productId: number;
  productName: string;
  sellerStoreName: string;
  quantity: number;
  currentPrice: number;
  subtotal: number;
}

interface CartData {
  items: CartItem[];
  total: number;
}

interface SellerGroup {
  sellerId: number;
  sellerStoreName: string;
  items: CartItem[];
  subtotal: number;
}

const PAYMENT_METHODS = [
  { value: 'PIX', label: 'PIX' },
  { value: 'DINHEIRO', label: 'Dinheiro' },
  { value: 'DEBITO', label: 'Cartão de Débito' },
  { value: 'CREDITO', label: 'Cartão de Crédito' },
];

const CheckoutPage = () => {
  const [cart, setCart] = useState<CartData | null>(null);
  const [sellerGroups, setSellerGroups] = useState<SellerGroup[]>([]);
  const [address, setAddress] = useState('');
  const [payments, setPayments] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await api.get('/cart');
        const data = res.data as CartData;
        setCart(data);

        // Group by seller (using product endpoint to get sellerId)
        const groups: Record<string, SellerGroup> = {};
        for (const item of data.items) {
          try {
            const prodRes = await api.get(`/products/${item.productId}`);
            const sellerId = prodRes.data.sellerId;
            const key = String(sellerId);
            if (!groups[key]) {
              groups[key] = { sellerId, sellerStoreName: item.sellerStoreName, items: [], subtotal: 0 };
            }
            groups[key].items.push(item);
            groups[key].subtotal += item.subtotal;
          } catch {
            // fallback
          }
        }
        setSellerGroups(Object.values(groups));
      } catch {
        setCart(null);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const handlePaymentChange = (sellerId: number, method: string) => {
    setPayments(prev => ({ ...prev, [sellerId]: method }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!address.trim()) {
      setError('Informe o endereço de entrega.');
      return;
    }

    const missingPayment = sellerGroups.find(g => !payments[g.sellerId]);
    if (missingPayment) {
      setError(`Selecione o método de pagamento para ${missingPayment.sellerStoreName}.`);
      return;
    }

    setSubmitting(true);
    try {
      const paymentSelections = sellerGroups.map(g => ({
        sellerId: g.sellerId,
        paymentMethod: payments[g.sellerId]
      }));

      await api.post('/orders', { deliveryAddress: address, paymentSelections });
      navigate('/orders');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar pedido.');
    } finally {
      setSubmitting(false);
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
    navigate('/cart');
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">Finalizar Compra</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Endereço */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <MapPin size={20} className="text-[#008aa1]" /> Endereço de Entrega
          </h2>
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Rua, número, bairro, cidade - UF"
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-[#008aa1] focus:ring-1 focus:ring-[#008aa1] text-sm"
          />
        </div>

        {/* Itens agrupados por vendedor */}
        {sellerGroups.map(group => (
          <div key={group.sellerId} className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="font-bold text-gray-800 mb-4">🏪 {group.sellerStoreName}</h2>
            <div className="space-y-3 mb-6">
              {group.items.map(item => (
                <div key={item.id} className="flex justify-between items-center text-sm text-gray-600">
                  <span>{item.productName} × {item.quantity}</span>
                  <span className="font-medium text-gray-800">R$ {item.subtotal.toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-900">
                <span>Subtotal</span>
                <span>R$ {group.subtotal.toFixed(2)}</span>
              </div>
            </div>

            <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <CreditCard size={16} className="text-[#008aa1]" /> Método de Pagamento
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {PAYMENT_METHODS.map(pm => (
                <label key={pm.value}
                  className={`flex items-center gap-2 px-4 py-3 border rounded-lg cursor-pointer text-sm transition-colors ${
                    payments[group.sellerId] === pm.value
                      ? 'border-[#008aa1] bg-[#008aa1]/5 text-[#008aa1] font-medium'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}>
                  <input type="radio" name={`payment-${group.sellerId}`}
                    value={pm.value}
                    checked={payments[group.sellerId] === pm.value}
                    onChange={() => handlePaymentChange(group.sellerId, pm.value)}
                    className="sr-only" />
                  {pm.label}
                </label>
              ))}
            </div>
          </div>
        ))}

        {/* Total */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex justify-between items-center text-xl font-bold text-gray-900">
            <span>Total</span>
            <span>R$ {cart.total.toFixed(2)}</span>
          </div>
        </div>

        <button type="submit" disabled={submitting}
          className="w-full bg-[#008aa1] hover:bg-[#00768a] text-white py-4 rounded-xl font-medium text-lg transition-colors disabled:opacity-50">
          {submitting ? 'Processando...' : 'Confirmar Pedido'}
        </button>
      </form>
    </div>
  );
};

export default CheckoutPage;
