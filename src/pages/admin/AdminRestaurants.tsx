import { Store, MoreVertical, Plus, X, Save, Trash2, Edit2 } from 'lucide-react';
import { useState } from 'react';
import { useDataStore, Restaurant } from '@/store/dataStore';
import { Card, CardContent } from '@/components/ui/card';

export default function AdminRestaurants() {
  const { restaurants, addRestaurant, updateRestaurant, deleteRestaurant } = useDataStore();
  const [isEditing, setIsEditing] = useState(false);
  const [currentRestaurant, setCurrentRestaurant] = useState<Partial<Restaurant> | null>(null);

  const handleAdd = () => {
    setCurrentRestaurant({ name: '', contact: '', status: 'Pending' });
    setIsEditing(true);
  };

  const handleEdit = (restaurant: Restaurant) => {
    setCurrentRestaurant({ ...restaurant });
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!currentRestaurant || !currentRestaurant.name) return;
    
    if (currentRestaurant.id) {
      updateRestaurant(currentRestaurant.id, currentRestaurant);
    } else {
      addRestaurant({ 
        name: currentRestaurant.name || '', 
        contact: currentRestaurant.contact || '', 
        status: currentRestaurant.status as any || 'Pending' 
      });
    }
    
    setIsEditing(false);
    setCurrentRestaurant(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this restaurant?')) {
      deleteRestaurant(id);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Restaurant Partners</h1>
          <p className="text-sm text-zinc-400">Manage your B2B wholesale client accounts.</p>
        </div>
        {!isEditing && (
          <button onClick={handleAdd} className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 px-4 py-2 rounded-xl font-bold transition flex items-center gap-2">
            <Plus className="w-4 h-4" /> Invite Partner
          </button>
        )}
      </div>

      {isEditing && currentRestaurant && (
        <Card className="bg-zinc-900/80 border-emerald-500/30">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-white">{currentRestaurant.id ? 'Edit Restaurant' : 'Invite New Partner'}</h2>
              <button 
                onClick={() => setIsEditing(false)}
                className="text-zinc-500 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-400">Restaurant Name</label>
                <input 
                  type="text" 
                  value={currentRestaurant.name || ''} 
                  onChange={e => setCurrentRestaurant({...currentRestaurant, name: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-400">Contact Person</label>
                <input 
                  type="text" 
                  value={currentRestaurant.contact || ''} 
                  onChange={e => setCurrentRestaurant({...currentRestaurant, contact: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-400">Status</label>
                <select 
                  value={currentRestaurant.status || 'Pending'} 
                  onChange={e => setCurrentRestaurant({...currentRestaurant, status: e.target.value as any})}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button 
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm font-medium transition"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-lg text-sm font-bold transition flex items-center gap-2"
              >
                <Save className="w-4 h-4" /> Save Partner
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden text-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-zinc-950/50 text-zinc-400">
              <tr>
                <th className="px-6 py-3 font-semibold uppercase tracking-wider text-[10px]">Restaurant Name</th>
                <th className="px-6 py-3 font-semibold uppercase tracking-wider text-[10px]">Contact Person</th>
                <th className="px-6 py-3 font-semibold uppercase tracking-wider text-[10px]">Total Orders</th>
                <th className="px-6 py-3 font-semibold uppercase tracking-wider text-[10px]">Status</th>
                <th className="px-6 py-3 font-semibold uppercase tracking-wider text-[10px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 text-zinc-300">
              {restaurants.map(rest => (
                <tr key={rest.id} className="hover:bg-zinc-800/20 transition">
                  <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-emerald-500">
                      <Store className="w-4 h-4" />
                    </div>
                    {rest.name}
                  </td>
                  <td className="px-6 py-4">{rest.contact}</td>
                  <td className="px-6 py-4 font-mono text-zinc-400">{rest.orders}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${
                      rest.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                      'bg-amber-500/10 text-amber-500 border-amber-500/20'
                    }`}>
                      {rest.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 space-x-3">
                    <button 
                      onClick={() => handleEdit(rest)}
                      className="text-emerald-400 hover:text-emerald-300 font-medium text-xs transition"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(rest.id)}
                      className="text-red-400 hover:text-red-300 font-medium text-xs transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
