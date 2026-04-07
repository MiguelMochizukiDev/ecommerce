import { Link } from 'react-router-dom';

export interface ProductProps {
  id: number;
  name: string;
  price: number;
  categoryId: number;
  sellerId: number;
  sellerStoreName: string;
  status: string;
  stock: number;
}

const ProductCard = ({ product }: { product: ProductProps }) => {
  const mockImage = `https://picsum.photos/seed/${product.id}/300/300`;

  return (
    <Link
      to={`/product/${product.id}`}
      className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group relative flex flex-col"
    >
      {/* Estoque baixo */}
      {product.stock > 0 && product.stock <= 5 && (
        <div className="absolute top-0 left-0 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-br-lg z-10">
          Últimas unidades
        </div>
      )}

      {/* Sem estoque */}
      {product.stock === 0 && (
        <div className="absolute top-0 left-0 bg-gray-500 text-white text-xs font-bold px-2 py-1 rounded-br-lg z-10">
          Esgotado
        </div>
      )}

      {/* Imagem */}
      <div className="p-4 flex items-center justify-center bg-white aspect-square">
        <img
          src={mockImage}
          alt={product.name}
          className="object-contain max-h-full group-hover:scale-105 transition-transform"
        />
      </div>

      {/* Conteúdo */}
      <div className="p-4 flex flex-col flex-grow border-t border-gray-100 bg-gray-50">
        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-2 min-h-[40px]">
          {product.name}
        </h3>

        <div className="flex items-center mt-auto">
          <span className="text-lg font-bold text-gray-900">R$ {product.price.toFixed(2)}</span>
        </div>

        <div className="text-xs text-gray-500 mt-2">Vendido por: {product.sellerStoreName}</div>
      </div>
    </Link>
  );
};

export default ProductCard;
