import { Truck, MapPin, MoreVertical, Plus, X, Save, Edit2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useDataStore, Driver } from '@/store/dataStore';
import { Card, CardContent } from '@/components/ui/card';

export default function AdminDrivers() {
  const { drivers, addDriver, updateDriver, deleteDriver } = useDataStore();
  const [isEditing, setIsEditing] = useState(false);
  const [currentDriver, setCurrentDriver] = useState<Partial<Driver> | null>(null);

  const handleAdd = () => {
    setCurrentDriver({ name: '', status: 'Offline' });
    setIsEditing(true);
  };

  const handleEdit = (driver: Driver) => {
    setCurrentDriver({ ...driver });
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!currentDriver || !currentDriver.name) return;
    
    if (currentDriver.id) {
      updateDriver(currentDriver.id, currentDriver);
    } else {
      addDriver({ 
        name: currentDriver.name || '', 
        status: currentDriver.status as any || 'Offline' 
      });
    }
    
    setIsEditing(false);
    setCurrentDriver(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this driver?')) {
      deleteDriver(id);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Driver Management</h1>
          <p className="text-sm text-zinc-400">Track and manage your delivery fleet.</p>
        </div>
        {!isEditing && (
          <button 
            onClick={handleAdd}
            className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 px-4 py-2 rounded-xl font-bold transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Driver
          </button>
        )}
      </div>

      {isEditing && currentDriver && (
        <Card className="bg-zinc-900/80 border-emerald-500/30">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-white">{currentDriver.id ? 'Edit Driver' : 'Add New Driver'}</h2>
              <button 
                onClick={() => setIsEditing(false)}
                className="text-zinc-500 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-400">Driver Name</label>
                <input 
                  type="text" 
                  value={currentDriver.name || ''} 
                  onChange={e => setCurrentDriver({...currentDriver, name: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-400">Status</label>
                <select 
                  value={currentDriver.status || 'Offline'} 
                  onChange={e => setCurrentDriver({...currentDriver, status: e.target.value as any})}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="Active">Active</option>
                  <option value="Offline">Offline</option>
                  <option value="On Break">On Break</option>
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
                <Save className="w-4 h-4" /> Save Driver
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {drivers.map(driver => (
          <div key={driver.id} className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-2xl flex flex-col gap-4 group/card relative overflow-hidden transition-all hover:border-zinc-700">
            <div className="absolute top-2 right-2 opacity-0 group-hover/card:opacity-100 transition-opacity bg-zinc-950/80 backdrop-blur-sm rounded-lg border border-zinc-800 p-1 flex items-center gap-1">
              <button 
                onClick={() => handleEdit(driver as Driver)}
                className="p-1.5 text-emerald-400 hover:bg-zinc-800 rounded-md transition"
                title="Edit"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => handleDelete(driver.id)}
                className="p-1.5 text-red-400 hover:bg-zinc-800 rounded-md transition"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-xl font-bold text-white shrink-0">
                {driver.name.charAt(0)}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{driver.name}</h3>
              <p className="text-xs text-zinc-500 font-mono mb-2">{driver.id}</p>
              
              <div className="flex items-center gap-2 mb-3">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                  driver.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                  driver.status === 'Offline' ? 'bg-zinc-800 text-zinc-400 border-zinc-700' : 
                  'bg-amber-500/10 text-amber-400 border-amber-500/20'
                }`}>
                  ● {driver.status}
                </span>
                <span className="text-xs font-bold text-zinc-400 flex items-center gap-1">
                  ⭐ {driver.rating.toFixed(1)}
                </span>
              </div>
              
              <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-sm">
                <span className="text-zinc-400">Today's Jobs</span>
                <span className="font-bold text-white">{driver.deliveries}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
