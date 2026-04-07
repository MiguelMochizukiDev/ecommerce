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
  // Mock image for now since backend doesn't have images
  const mockImage = `https://picsum.photos/seed/${product.id}/300/300`;
  
  // Fake original price to show discount as in the BISHA Store UI
  const originalPrice = product.price * 1.36; // 36% discount math
  const savings = originalPrice - product.price;
  
  return (
    <Link to={`/product/${product.id}`} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group relative flex flex-col">
      {/* Discount Badge */}
      <div className="absolute top-0 right-0 bg-[#E53935] text-white text-xs font-bold px-2 py-1 rounded-bl-lg z-10">
        36% OFF
      </div>
      
      {/* Image container */}
      <div className="p-4 flex items-center justify-center bg-white aspect-square">
        <img src={mockImage} alt={product.name} className="object-contain max-h-full group-hover:scale-105 transition-transform" />
      </div>
      
      {/* Content */}
      <div className="p-4 flex flex-col flex-grow border-t border-gray-100 bg-gray-50">
        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-2 min-h-[40px]">{product.name}</h3>
        
        <div className="flex items-center space-x-2 mt-auto">
          <span className="text-lg font-bold text-gray-900">R$ {product.price.toFixed(2)}</span>
          <span className="text-xs text-gray-400 line-through">R$ {originalPrice.toFixed(2)}</span>
        </div>
        
        <div className="text-xs text-green-600 font-medium mt-1">
          Save - R$ {savings.toFixed(2)}
        </div>
        
        <div className="text-xs text-gray-500 mt-2">
          Vendido por: {product.sellerStoreName}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
