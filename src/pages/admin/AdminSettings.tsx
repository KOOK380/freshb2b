import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Save, Key } from 'lucide-react';

export default function AdminSettings() {
  const [cloudinaryName, setCloudinaryName] = useState('');
  const [cloudinaryPreset, setCloudinaryPreset] = useState('');
  const [googleMapsKey, setGoogleMapsKey] = useState('');
  const [serviceAddress, setServiceAddress] = useState('');
  const [serviceRadius, setServiceRadius] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Load from local storage
    setCloudinaryName(localStorage.getItem('CLOUDINARY_CLOUD_NAME') || import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '');
    setCloudinaryPreset(localStorage.getItem('CLOUDINARY_UPLOAD_PRESET') || import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '');
    setGoogleMapsKey(localStorage.getItem('GOOGLE_MAPS_KEY') || import.meta.env.GOOGLE_MAPS_PLATFORM_KEY || '');
    setServiceAddress(localStorage.getItem('SERVICE_ADDRESS') || 'New York, NY');
    setServiceRadius(localStorage.getItem('SERVICE_RADIUS') || '10');
  }, []);

  const handleSave = () => {
    localStorage.setItem('CLOUDINARY_CLOUD_NAME', cloudinaryName);
    localStorage.setItem('CLOUDINARY_UPLOAD_PRESET', cloudinaryPreset);
    localStorage.setItem('GOOGLE_MAPS_KEY', googleMapsKey);
    localStorage.setItem('SERVICE_ADDRESS', serviceAddress);
    localStorage.setItem('SERVICE_RADIUS', serviceRadius);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    // Ideally user might need to reload for env vars simulated like this to take effect 
    // unless other components fetch directly from localStorage.
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Settings className="w-6 h-6" /> System Settings
        </h1>
        <p className="text-sm text-zinc-400">Configure third-party API keys and integrations.</p>
      </div>

      <Card className="bg-zinc-900/80 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-lg text-white flex items-center gap-2">
            <Key className="w-5 h-5" /> API Configurations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">Cloudinary (Image Upload)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-400">Cloud Name</label>
                <input 
                  type="text" 
                  value={cloudinaryName} 
                  onChange={e => setCloudinaryName(e.target.value)}
                  placeholder="e.g. dxyz123"
                  className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-400">Upload Preset (Unsigned)</label>
                <input 
                  type="text" 
                  value={cloudinaryPreset} 
                  onChange={e => setCloudinaryPreset(e.target.value)}
                  placeholder="e.g. my_preset"
                  className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>
            <p className="text-[10px] text-zinc-500">
              Cloudinary is used for uploading product images in the Inventory section. Make sure the upload preset is set to unsigned.
            </p>
          </div>

          <div className="pt-4 border-t border-zinc-800 space-y-4">
            <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">Google Maps Platform</h3>
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-400">API Key</label>
              <input 
                type="password" 
                value={googleMapsKey} 
                onChange={e => setGoogleMapsKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-800 space-y-4">
            <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">Service Location</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-400">Warehouse/Origin Address</label>
                <input 
                  type="text" 
                  value={serviceAddress} 
                  onChange={e => setServiceAddress(e.target.value)}
                  placeholder="e.g. 100 Main St, New York, NY"
                  className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-400">Service Radius (miles/km)</label>
                <input 
                  type="number" 
                  value={serviceRadius} 
                  onChange={e => setServiceRadius(e.target.value)}
                  placeholder="e.g. 20"
                  className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-zinc-800">
            <button 
              onClick={handleSave}
              className="px-6 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-lg transition flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> {saved ? 'Saved!' : 'Save Settings'}
            </button>
          </div>
        </CardContent>
      </Card>
      
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-sm text-amber-500">
        <strong>Note:</strong> API keys entered here are stored in local storage for demonstration purposes. In a production environment, you should set these in your hosting provider's environment variables dashboard.
      </div>
    </div>
  );
}
