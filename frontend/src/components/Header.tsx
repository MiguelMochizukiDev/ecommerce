import { MapPin, Truck, Tag, Search, User, ShoppingCart, ChevronDown, LogOut, Store, Package } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCartCount } from '../contexts/CartCountContext';
import { useState, useRef, useEffect } from 'react';

const Header = () => {
  const { isAuthenticated, isSeller, user, logout } = useAuth();
  const { count } = useCartCount();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    navigate(`/?search=${encodeURIComponent(q)}`);
  };

  return (
    <header className="w-full bg-white border-b border-gray-200">
      {/* Top bar */}
      <div className="bg-[#f3f9fb] text-xs py-1.5 px-4 md:px-10 flex justify-between items-center text-gray-600">
        <div>Bem-vindo ao BISHA Store!</div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center hover:text-[#008aa1] cursor-pointer">
            <MapPin size={14} className="mr-1 text-red-500" />Entrega para todo Brasil
          </div>
          <Link to="/orders" className="flex items-center hover:text-[#008aa1]">
            <Truck size={14} className="mr-1 text-orange-500" />Rastrear pedido
          </Link>
          <div className="flex items-center hover:text-[#008aa1] cursor-pointer">
            <Tag size={14} className="mr-1 text-yellow-500" />Ofertas
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="py-4 px-4 md:px-10 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-[#008aa1] mr-8 whitespace-nowrap">BISHA Store</Link>

        {/* Campo de busca */}
        <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-8">
          <div className="flex w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Buscar produtos, marcas e mais..."
              className="w-full bg-gray-50 border border-gray-200 rounded-l-md px-4 py-2 focus:outline-none focus:border-[#008aa1] text-sm"
            />
            <button
              type="submit"
              className="bg-[#008aa1] hover:bg-[#00768a] text-white px-5 rounded-r-md flex items-center justify-center transition-colors"
            >
              <Search size={18} />
            </button>
          </div>
        </form>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center text-gray-700 hover:text-[#008aa1] font-medium text-sm gap-2"
              >
                <User size={18} />
                <span className="max-w-[120px] truncate">{user?.name?.split(' ')[0]}</span>
                <ChevronDown size={14} />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg py-2 w-52 z-50">
                  <Link to="/orders" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <Package size={16} />Meus Pedidos
                  </Link>
                  {isSeller ? (
                    <Link to="/seller/dashboard" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <Store size={16} />Minha Loja
                    </Link>
                  ) : (
                    <Link to="/seller/activate" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <Store size={16} />Quero Vender
                    </Link>
                  )}
                  <div className="border-t border-gray-100 my-1" />
                  <button
                    onClick={() => { logout(); setDropdownOpen(false); }}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 w-full"
                  >
                    <LogOut size={16} />Sair
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="flex items-center text-gray-700 hover:text-[#008aa1] font-medium text-sm">
              <User size={18} className="mr-2" />Entrar
            </Link>
          )}

          <div className="h-6 w-px bg-gray-300" />

          {/* Carrinho com badge */}
          <Link to="/cart" className="flex items-center text-gray-700 hover:text-[#008aa1] font-medium text-sm relative">
            <div className="relative">
              <ShoppingCart size={18} className="mr-2" />
              {count > 0 && (
                <span className="absolute -top-2 -right-1 bg-[#E53935] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full leading-none">
                  {count > 9 ? '9+' : count}
                </span>
              )}
            </div>
            Carrinho
          </Link>
        </div>
      </div>

      {/* Category Menu */}
      <div className="py-3 px-4 md:px-10 flex items-center space-x-3 overflow-x-auto no-scrollbar border-t border-gray-100">
        {['Eletrônicos', 'Livros', 'Roupas', 'Veículos', 'Material Escolar', 'Esportes'].map((cat, idx) => (
          <button key={idx} className="flex items-center space-x-1 px-4 py-1.5 rounded-full border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 whitespace-nowrap">
            <span>{cat}</span>
            <ChevronDown size={14} className="text-gray-400" />
          </button>
        ))}
      </div>
    </header>
  );
};

export default Header;
