import { useState, useEffect, type FC } from 'react';
import { Link } from 'react-router-dom';
import { itemService } from '../services/itemService';
import type { Item } from '../types';
import { Search, MapPin, Calendar, Info, Plus } from 'lucide-react';

const Dashboard: FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'LOST' | 'FOUND'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    document.title = 'Dashboard | CampusFind';
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const data = await itemService.getAllItems();
      setItems(data);
    } catch (error) {
      console.error("Failed to fetch items", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter(item => {
    const matchesFilter = filter === 'ALL' || item.status === filter;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="py-6 animate-[fade-in_0.5s_ease-out]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
            Dashboard
          </h1>
          <p className="text-slate-300 text-lg">Browse all reported lost and found items</p>
        </div>
        
        <Link 
          to="/report" 
          className="btn-primary flex items-center gap-2 py-3 px-6"
        >
          <Plus className="w-5 h-5" />
          Report Item
        </Link>
      </div>

      <div className="glass-panel p-5 rounded-2xl mb-10 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="glass-input pl-12 py-3"
            placeholder="Search items by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 bg-black/20 p-1.5 rounded-xl border border-white/5">
          {['ALL', 'LOST', 'FOUND'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-5 py-2 rounded-lg font-medium transition-all ${
                filter === f 
                  ? 'bg-white/20 text-white shadow-lg shadow-black/20' 
                  : 'text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-24 glass-panel rounded-2xl border-dashed border-2 border-white/20">
          <Info className="w-16 h-16 text-slate-400 mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold text-white mb-2">No items found</h3>
          <p className="text-slate-400">Try adjusting your filters or search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <Link 
              key={item.id} 
              to={`/items/${item.id}`}
              className="glass-card rounded-2xl overflow-hidden group block"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <span className={
                    item.status === 'LOST' ? 'badge-lost' : 
                    item.status === 'FOUND' ? 'badge-found' : 'badge-default'
                  }>
                    {item.status}
                  </span>
                  <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    {new Date(item.dateLostOrFound).toLocaleDateString()}
                  </span>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors line-clamp-1">
                  {item.name}
                </h3>
                
                <p className="text-slate-300 text-sm mb-6 line-clamp-2 min-h-[40px] leading-relaxed">
                  {item.description}
                </p>
                
                <div className="flex items-center text-slate-400 text-sm pt-4 border-t border-white/10">
                  <MapPin className="w-4 h-4 mr-2 shrink-0 text-indigo-400" />
                  <span className="line-clamp-1 font-medium">{item.location}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
