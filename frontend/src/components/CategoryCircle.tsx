import { Link } from 'react-router-dom';

interface CategoryCircleProps {
  id: number;
  name: string;
}

const CategoryCircle = ({ id, name }: CategoryCircleProps) => {
  const initial = name.charAt(0).toUpperCase();
  
  return (
    <Link to={`/category/${id}`} className="flex flex-col items-center group">
      <div className="w-24 h-24 rounded-full bg-[#f3f9fb] group-hover:bg-[#008aa1] group-hover:text-white transition-colors border border-gray-200 flex items-center justify-center mb-3">
        <span className="text-3xl font-light text-[#008aa1] group-hover:text-white">{initial}</span>
      </div>
      <span className="text-sm text-gray-700 font-medium group-hover:text-[#008aa1] transition-colors">{name}</span>
    </Link>
  );
}

export default CategoryCircle;
