import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = [
  { id: 1, name: "Fresh Produce", icon: "🍎", count: 120, color: "bg-red-500/10 text-red-500 border-red-500/20" },
  { id: 2, name: "Meat & Poultry", icon: "🥩", count: 45, color: "bg-rose-500/10 text-rose-500 border-rose-500/20" },
  { id: 3, name: "Dairy & Eggs", icon: "🥛", count: 32, color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  { id: 4, name: "Bakery", icon: "🥖", count: 28, color: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
  { id: 5, name: "Pantry", icon: "🥫", count: 156, color: "bg-orange-500/10 text-orange-500 border-orange-500/20" },
  { id: 6, name: "Beverages", icon: "🧃", count: 88, color: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
  { id: 7, name: "Frozen Foods", icon: "🧊", count: 64, color: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20" },
  { id: 8, name: "Snacks", icon: "🥨", count: 112, color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" },
];

export default function CustomerCategories() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Shop by Category</h1>
        <p className="text-sm text-zinc-400 mt-1">Browse our entire catalog of fresh groceries.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {CATEGORIES.map(category => (
          <div 
            key={category.id} 
            onClick={() => navigate(`/customer?search=${encodeURIComponent(category.name)}`)}
            className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:bg-zinc-800/50 transition cursor-pointer group"
          >
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4 border ${category.color} shadow-lg transition-transform group-hover:scale-110 group-active:scale-95`}>
              {category.icon}
            </div>
            <h3 className="font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">{category.name}</h3>
            <p className="text-xs text-zinc-500 font-medium mb-4">{category.count} items</p>
            
            <div className="flex items-center text-xs font-bold text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0">
               View All <ArrowRight className="w-3 h-3 ml-1" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
