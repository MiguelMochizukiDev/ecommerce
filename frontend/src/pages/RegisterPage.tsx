import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', cpf: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/login');
    } catch {
      setError('Erro ao criar conta. Verifique os dados e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-10 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-[#008aa1]/10 rounded-full flex items-center justify-center mb-4">
            <UserPlus className="text-[#008aa1]" size={28} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Criar Conta</h1>
          <p className="text-sm text-gray-500 mt-1">Junte-se à comunidade BISHA Store</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-6 border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome completo</label>
            <input name="name" value={form.name} onChange={handleChange} required placeholder="Seu nome"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-[#008aa1] focus:ring-1 focus:ring-[#008aa1] text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="seu@email.com"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-[#008aa1] focus:ring-1 focus:ring-[#008aa1] text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
              <input name="cpf" value={form.cpf} onChange={handleChange} required placeholder="00000000000"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-[#008aa1] focus:ring-1 focus:ring-[#008aa1] text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="11999999999"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-[#008aa1] focus:ring-1 focus:ring-[#008aa1] text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} required placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-[#008aa1] focus:ring-1 focus:ring-[#008aa1] text-sm" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-[#008aa1] hover:bg-[#00768a] text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50">
            {loading ? 'Criando...' : 'Criar Conta'}
          </button>
        </form>

        <p className="text-sm text-gray-500 text-center mt-6">
          Já tem conta?{' '}
          <Link to="/login" className="text-[#008aa1] font-medium hover:underline">Entrar</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
