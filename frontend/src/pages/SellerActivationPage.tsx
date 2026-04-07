import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store } from 'lucide-react';
import api from '../services/api';

const PAYMENT_METHODS = ['PIX', 'DINHEIRO', 'DEBITO', 'CREDITO'];
const LABELS: Record<string, string> = { DINHEIRO: 'Dinheiro', DEBITO: 'Débito', CREDITO: 'Crédito', PIX: 'PIX' };

const SellerActivationPage = () => {
  const [form, setForm] = useState({ storeName: '', description: '', pixKey: '' });
  const [methods, setMethods] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const toggleMethod = (m: string) => {
    setMethods(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (methods.length === 0) { setError('Selecione pelo menos um método de pagamento.'); return; }
    if (methods.includes('PIX') && !form.pixKey.trim()) { setError('Chave PIX obrigatória.'); return; }
    setLoading(true);
    try {
      await api.post('/seller/activate', { storeName: form.storeName, description: form.description, paymentMethods: methods, pixKey: form.pixKey || null });
      navigate('/seller/dashboard');
      window.location.reload();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao ativar.');
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-[#008aa1]/10 rounded-full flex items-center justify-center mb-4">
            <Store className="text-[#008aa1]" size={28} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Abrir sua Loja</h1>
          <p className="text-sm text-gray-500 mt-1">Comece a vender na BISHA Store</p>
        </div>
        {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-6 border border-red-200">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Loja</label>
            <input value={form.storeName} onChange={e => setForm({...form, storeName: e.target.value})} required placeholder="Ex: Brechó do João" className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-[#008aa1] text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Conte sobre o que você vende..." className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-[#008aa1] text-sm resize-none h-20" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Métodos de Pagamento</label>
            <div className="grid grid-cols-2 gap-3">
              {PAYMENT_METHODS.map(m => (
                <label key={m} className={`flex items-center gap-2 px-4 py-3 border rounded-lg cursor-pointer text-sm ${methods.includes(m) ? 'border-[#008aa1] bg-[#008aa1]/5 text-[#008aa1] font-medium' : 'border-gray-200 text-gray-600'}`}>
                  <input type="checkbox" checked={methods.includes(m)} onChange={() => toggleMethod(m)} className="sr-only" />
                  {LABELS[m]}
                </label>
              ))}
            </div>
          </div>
          {methods.includes('PIX') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Chave PIX</label>
              <input value={form.pixKey} onChange={e => setForm({...form, pixKey: e.target.value})} placeholder="email, CPF ou telefone" className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-[#008aa1] text-sm" />
            </div>
          )}
          <button type="submit" disabled={loading} className="w-full bg-[#008aa1] hover:bg-[#00768a] text-white py-3 rounded-lg font-medium disabled:opacity-50">
            {loading ? 'Ativando...' : 'Ativar Loja'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SellerActivationPage;
