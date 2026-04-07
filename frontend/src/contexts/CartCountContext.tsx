import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useAuth } from './AuthContext';
import api from '../services/api';

interface CartCountContextType {
  count: number;
  refresh: () => void;
}

const CartCountContext = createContext<CartCountContextType>({ count: 0, refresh: () => {} });

export const useCartCount = () => useContext(CartCountContext);

export const CartCountProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const [count, setCount] = useState(0);

  const refresh = async () => {
    if (!isAuthenticated) {
      setCount(0);
      return;
    }
    try {
      const res = await api.get('/cart');
      const items: { quantity: number }[] = res.data?.items ?? [];
      setCount(items.reduce((sum, i) => sum + i.quantity, 0));
    } catch {
      setCount(0);
    }
  };

  useEffect(() => {
    refresh();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  return (
    <CartCountContext.Provider value={{ count, refresh }}>
      {children}
    </CartCountContext.Provider>
  );
};
