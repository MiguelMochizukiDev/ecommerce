import { useEffect, useState } from 'react';
import { Package, Plus, X } from 'lucide-react';
import api from '../services/api';

interface Product { id: number; name: string; price: number; stock: number; status: string; categoryName: string; }
interface SubOrderItem { id: number; productName: string; quantity: number; priceSnapshot: number; itemTotal: number; }
interface SubOrder { id: number; sellerStoreName: string; paymentMethod: string; status: string; subtotal: number; items: SubOrderItem[]; }
interface Category { id: number; name: string; }

const STATUS_LABELS: Record<string, string> = { AWAITING_PAYMENT: 'Aguardando', PAID: 'Pago', SHIPPED: 'Enviado', DELIVERED: 'Entregue', CANCELLED: 'Cancelado', REFUNDED: 'Reembolsado' };
const STATUS_COLORS: Record<string, string> = { AWAITING_PAYMENT: 'bg-orange-100 text-orange-700', PAID: 'bg-emerald-100 text-emerald-700', SHIPPED: 'bg-purple-100 text-purple-700', DELIVERED: 'bg-green-100 text-green-700', CANCELLED: 'bg-red-100 text-red-700', REFUNDED: 'bg-gray-100 text-gray-700' };

const SellerDashboardPage = () => {
  const [tab, setTab] = useState<'products' | 'sales'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<SubOrder[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newProd, setNewProd] = useState({ name: '', description: '', price: '', stock: '', categoryId: '' });

  useEffect(() => {
    const fetch = async () => {
      try {
        const [p, s, c] = await Promise.all([api.get('/products/my'), api.get('/orders/sales'), api.get('/categories')]);
        setProducts(p.data);
        setSales(s.data);
        setCategories(c.data);
      } catch { /* */ } finally { setLoading(false); }
    };
    fetch();
  }, []);

  const createProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/products', { name: newProd.name, description: newProd.description, price: parseFloat(newProd.price), stock: parseInt(newProd.stock), categoryId: parseInt(newProd.categoryId) });
      const res = await api.get('/products/my');
      setProducts(res.data);
      setShowForm(false);
      setNewProd({ name: '', description: '', price: '', stock: '', categoryId: '' });
    } catch (err: any) { alert(err.response?.data?.message || 'Erro ao criar produto'); }
  };

  const updateStatus = async (subOrderId: number, status: string) => {
    try {
      await api.put(`/orders/sub-orders/${subOrderId}/status`, { status });
      const res = await api.get('/orders/sales');
      setSales(res.data);
    } catch (err: any) { alert(err.response?.data?.message || 'Erro ao atualizar'); }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-gray-200 border-t-[#008aa1] rounded-full animate-spin"></div></div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Painel do Vendedor</h1>
      <div className="flex gap-2">
        <button onClick={() => setTab('products')} className={`px-5 py-2 rounded-lg text-sm font-medium ${tab === 'products' ? 'bg-[#008aa1] text-white' : 'bg-gray-100 text-gray-600'}`}>Meus Produtos</button>
        <button onClick={() => setTab('sales')} className={`px-5 py-2 rounded-lg text-sm font-medium ${tab === 'sales' ? 'bg-[#008aa1] text-white' : 'bg-gray-100 text-gray-600'}`}>Vendas Recebidas</button>
      </div>

      {tab === 'products' && (
        <div className="space-y-4">
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-[#008aa1] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#00768a]">
            {showForm ? <><X size={16}/>Cancelar</> : <><Plus size={16}/>Novo Produto</>}
          </button>
          {showForm && (
            <form onSubmit={createProduct} className="bg-white border rounded-xl p-6 grid grid-cols-2 gap-4">
              <div className="col-span-2"><input value={newProd.name} onChange={e => setNewProd({...newProd, name: e.target.value})} required placeholder="Nome do produto" className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-sm focus:outline-none focus:border-[#008aa1]" /></div>
              <div className="col-span-2"><textarea value={newProd.description} onChange={e => setNewProd({...newProd, description: e.target.value})} placeholder="Descrição" className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-sm resize-none h-20 focus:outline-none focus:border-[#008aa1]" /></div>
              <input value={newProd.price} onChange={e => setNewProd({...newProd, price: e.target.value})} required type="number" step="0.01" placeholder="Preço (R$)" className="px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-sm focus:outline-none focus:border-[#008aa1]" />
              <input value={newProd.stock} onChange={e => setNewProd({...newProd, stock: e.target.value})} required type="number" placeholder="Estoque" className="px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-sm focus:outline-none focus:border-[#008aa1]" />
              <select value={newProd.categoryId} onChange={e => setNewProd({...newProd, categoryId: e.target.value})} required className="px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-sm focus:outline-none focus:border-[#008aa1]">
                <option value="">Categoria</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <button type="submit" className="bg-[#008aa1] text-white py-3 rounded-lg font-medium hover:bg-[#00768a]">Cadastrar</button>
            </form>
          )}
          {products.length === 0 ? <p className="text-gray-500 text-sm">Nenhum produto cadastrado.</p> : (
            <div className="bg-white border rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50"><tr><th className="text-left p-4 text-gray-600">Produto</th><th className="text-left p-4 text-gray-600">Categoria</th><th className="text-right p-4 text-gray-600">Preço</th><th className="text-right p-4 text-gray-600">Estoque</th><th className="text-center p-4 text-gray-600">Status</th></tr></thead>
                <tbody>{products.map(p => (
                  <tr key={p.id} className="border-t border-gray-100"><td className="p-4 font-medium text-gray-800">{p.name}</td><td className="p-4 text-gray-600">{p.categoryName}</td><td className="p-4 text-right text-gray-800">R$ {p.price.toFixed(2)}</td><td className="p-4 text-right">{p.stock}</td><td className="p-4 text-center"><span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">{p.status}</span></td></tr>
                ))}</tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {tab === 'sales' && (
        <div className="space-y-4">
          {sales.length === 0 ? (
            <div className="text-center py-16"><Package size={48} className="mx-auto text-gray-300 mb-4" /><p className="text-gray-500">Nenhuma venda recebida ainda.</p></div>
          ) : sales.map(sub => (
            <div key={sub.id} className="bg-white border rounded-xl p-5">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-bold text-gray-800">Sub-pedido #{sub.id}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[sub.status] || 'bg-gray-100'}`}>{STATUS_LABELS[sub.status] || sub.status}</span>
              </div>
              {sub.items.map(item => <div key={item.id} className="flex justify-between text-sm mb-1"><span className="text-gray-600">{item.productName} × {item.quantity}</span><span className="font-medium">R$ {item.itemTotal.toFixed(2)}</span></div>)}
              <div className="border-t mt-3 pt-3 flex justify-between items-center">
                <span className="font-bold">R$ {sub.subtotal.toFixed(2)}</span>
                <div className="flex gap-2">
                  {sub.status === 'AWAITING_PAYMENT' && <button onClick={() => updateStatus(sub.id, 'PAID')} className="text-xs bg-emerald-500 text-white px-3 py-1 rounded-lg hover:bg-emerald-600">Marcar Pago</button>}
                  {sub.status === 'PAID' && <button onClick={() => updateStatus(sub.id, 'SHIPPED')} className="text-xs bg-purple-500 text-white px-3 py-1 rounded-lg hover:bg-purple-600">Marcar Enviado</button>}
                  {sub.status === 'SHIPPED' && <button onClick={() => updateStatus(sub.id, 'DELIVERED')} className="text-xs bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600">Marcar Entregue</button>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SellerDashboardPage;
