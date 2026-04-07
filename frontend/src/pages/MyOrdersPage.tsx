import { useEffect, useState } from 'react';
import { Package, ChevronDown, ChevronUp, Star } from 'lucide-react';
import api from '../services/api';

interface SubOrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  priceSnapshot: number;
  itemTotal: number;
}

interface SubOrder {
  id: number;
  sellerId: number;
  sellerStoreName: string;
  paymentMethod: string;
  status: string;
  subtotal: number;
  items: SubOrderItem[];
}

interface Order {
  id: number;
  status: string;
  deliveryAddress: string;
  total: number;
  createdAt: string;
  subOrders: SubOrder[];
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  AWAITING_PAYMENT: 'bg-orange-100 text-orange-700',
  PAID: 'bg-emerald-100 text-emerald-700',
  SHIPPED: 'bg-purple-100 text-purple-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
  REFUNDED: 'bg-gray-100 text-gray-700',
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pendente',
  CONFIRMED: 'Confirmado',
  AWAITING_PAYMENT: 'Aguardando Pagamento',
  PAID: 'Pago',
  SHIPPED: 'Enviado',
  DELIVERED: 'Entregue',
  CANCELLED: 'Cancelado',
  REFUNDED: 'Reembolsado',
};

const MyOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [reviewForm, setReviewForm] = useState<{ subOrderId: number; productRating: number; sellerRating: number; comment: string } | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders');
        setOrders(res.data);
      } catch {
        // handle error
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const submitReview = async () => {
    if (!reviewForm) return;
    try {
      await api.post(`/reviews/sub-orders/${reviewForm.subOrderId}`, {
        productRating: reviewForm.productRating,
        sellerRating: reviewForm.sellerRating,
        comment: reviewForm.comment
      });
      setReviewForm(null);
      alert('Avaliação enviada com sucesso!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao enviar avaliação');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-[#008aa1] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Meus Pedidos</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <Package size={64} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">Você ainda não fez nenhum pedido.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <button onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                className="w-full p-5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-6 text-sm">
                  <span className="font-bold text-gray-800">Pedido #{order.id}</span>
                  <span className="text-gray-500">{new Date(order.createdAt).toLocaleDateString('pt-BR')}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-700'}`}>
                    {STATUS_LABELS[order.status] || order.status}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-gray-900">R$ {order.total.toFixed(2)}</span>
                  {expanded === order.id ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                </div>
              </button>

              {expanded === order.id && (
                <div className="border-t border-gray-100 p-5 space-y-6">
                  <p className="text-sm text-gray-600">📍 {order.deliveryAddress}</p>

                  {order.subOrders.map(sub => (
                    <div key={sub.id} className="bg-gray-50 rounded-xl p-5">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-800">🏪 {sub.sellerStoreName}</h3>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-500">{sub.paymentMethod}</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[sub.status] || 'bg-gray-100'}`}>
                            {STATUS_LABELS[sub.status] || sub.status}
                          </span>
                        </div>
                      </div>

                      {sub.items.map(item => (
                        <div key={item.id} className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">{item.productName} × {item.quantity}</span>
                          <span className="text-gray-800 font-medium">R$ {item.itemTotal.toFixed(2)}</span>
                        </div>
                      ))}

                      <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between font-bold text-gray-900">
                        <span>Subtotal</span>
                        <span>R$ {sub.subtotal.toFixed(2)}</span>
                      </div>

                      {sub.status === 'DELIVERED' && (
                        <div className="mt-4">
                          {reviewForm?.subOrderId === sub.id ? (
                            <div className="bg-white rounded-lg p-4 space-y-3 border border-gray-200">
                              <div className="flex gap-6">
                                <div>
                                  <label className="text-xs text-gray-500 block mb-1">Produto</label>
                                  <div className="flex gap-1">
                                    {[1,2,3,4,5].map(s => (
                                      <Star key={s} size={20}
                                        className={`cursor-pointer ${s <= reviewForm.productRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                                        onClick={() => setReviewForm({ ...reviewForm, productRating: s })} />
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <label className="text-xs text-gray-500 block mb-1">Vendedor</label>
                                  <div className="flex gap-1">
                                    {[1,2,3,4,5].map(s => (
                                      <Star key={s} size={20}
                                        className={`cursor-pointer ${s <= reviewForm.sellerRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                                        onClick={() => setReviewForm({ ...reviewForm, sellerRating: s })} />
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <textarea value={reviewForm.comment}
                                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                                placeholder="Deixe um comentário (opcional)"
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none h-20 focus:outline-none focus:border-[#008aa1]" />
                              <div className="flex gap-2">
                                <button onClick={submitReview} className="bg-[#008aa1] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#00768a]">Enviar Avaliação</button>
                                <button onClick={() => setReviewForm(null)} className="text-gray-500 text-sm hover:text-gray-700">Cancelar</button>
                              </div>
                            </div>
                          ) : (
                            <button onClick={() => setReviewForm({ subOrderId: sub.id, productRating: 5, sellerRating: 5, comment: '' })}
                              className="text-sm text-[#008aa1] hover:underline font-medium flex items-center gap-1">
                              <Star size={14} /> Avaliar este pedido
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;
