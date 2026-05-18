import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Settings, Save, Bell, Shield, Wallet, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function RestSettings() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setLoading(true);
    setSaved(false);
    setTimeout(() => {
      setLoading(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 1000);
  };

  const TABS = [
    { id: 'profile', label: 'Profile', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'billing', label: 'Billing', icon: Wallet },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Restaurant Settings</h1>
        <p className="text-sm text-zinc-400 mt-1">Manage your business profile and preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${
                  isActive 
                    ? 'bg-zinc-800 text-white' 
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                }`}
              >
                <Icon className="w-4 h-4" /> {tab.label}
              </button>
            );
          })}
        </div>
        
        <div className="md:col-span-3 space-y-6">
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6"
            >
              {activeTab === 'profile' && (
                <>
                  <h2 className="text-lg font-bold text-white mb-6">Business Information</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-1.5">Business Name</label>
                      <input type="text" defaultValue="FreshLink Demo Restaurant" className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-1.5">Contact Email</label>
                      <input type="email" defaultValue={user?.email || ''} readOnly className="w-full bg-zinc-950/50 border border-zinc-800 text-zinc-500 cursor-not-allowed rounded-xl px-4 py-2.5" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-1.5">Delivery Address</label>
                      <textarea rows={3} defaultValue="123 Culinary Drive&#10;Food City, FC 90210" className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none" />
                    </div>
                    
                    <div className="pt-4 flex justify-end">
                      <button 
                        onClick={handleSave}
                        disabled={loading}
                        className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold px-6 py-2.5 rounded-xl transition flex items-center gap-2 disabled:opacity-50 min-w-[140px] justify-center"
                      >
                        {loading ? 'Saving...' : saved ? <><CheckCircle className="w-4 h-4" /> Saved</> : <><Save className="w-4 h-4" /> Save Changes</>}
                      </button>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'notifications' && (
                <>
                  <h2 className="text-lg font-bold text-white mb-6">Notification Preferences</h2>
                  <div className="space-y-4">
                    {['Order Updates', 'Delivery Tracking', 'Promotional Offers', 'System Alerts'].map((item, i) => (
                      <div key={i} className="flex items-center justify-between py-3 border-b border-zinc-800/50 last:border-0">
                        <div>
                          <p className="font-medium text-white">{item}</p>
                          <p className="text-xs text-zinc-500 mt-0.5">Receive notifications via email or SMS.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" value="" className="sr-only peer" defaultChecked={i < 2} />
                          <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {activeTab === 'billing' && (
                <>
                  <h2 className="text-lg font-bold text-white mb-6">Payment Methods</h2>
                  <div className="space-y-4 max-w-sm">
                    <div className="bg-zinc-950 border border-emerald-500/30 p-4 rounded-xl relative overflow-hidden">
                      <div className="absolute right-0 top-0 w-16 h-16 bg-emerald-500/10 rounded-bl-full flex items-center justify-center -mr-4 -mt-4"></div>
                      <div className="flex items-center gap-3 mb-4">
                        <Wallet className="w-5 h-5 text-emerald-500" />
                        <span className="font-bold text-white">Credit Card</span>
                        <span className="ml-auto text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-bold uppercase tracking-wider">Default</span>
                      </div>
                      <p className="text-sm text-zinc-400 font-mono tracking-widest pl-8">**** **** **** 4242</p>
                      <p className="text-xs text-zinc-500 mt-1 pl-8">Expires 12/26</p>
                    </div>
                    <button className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 rounded-xl transition border border-dashed border-zinc-600">
                      + Add New Card
                    </button>
                  </div>
                </>
              )}

              {activeTab === 'security' && (
                <>
                  <h2 className="text-lg font-bold text-white mb-6">Security Settings</h2>
                  <div className="space-y-6">
                     <div>
                       <h3 className="text-sm font-medium text-white mb-3">Change Password</h3>
                       <div className="space-y-3">
                         <input type="password" placeholder="Current Password" className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                         <input type="password" placeholder="New Password" className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                         <input type="password" placeholder="Confirm New Password" className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                       </div>
                       <div className="pt-4 flex justify-end">
                          <button className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold px-6 py-2.5 rounded-xl transition">
                            Update Password
                          </button>
                       </div>
                     </div>
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
