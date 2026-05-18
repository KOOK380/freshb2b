import { Map, MapPin, Navigation } from 'lucide-react';

export default function DriverMap() {
  return (
    <div className="h-full flex flex-col space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Route Map</h1>
        <p className="text-sm text-zinc-400 mt-1">Live navigation to your next drop-off.</p>
      </div>

      <div className="flex-1 rounded-3xl border border-zinc-800 overflow-hidden bg-zinc-900 relative flex items-center justify-center">
        {/* Placeholder for actual map */}
        <div className="text-center space-y-4 p-6">
          <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mx-auto text-emerald-500 mb-6 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
            <Map className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-bold text-white">Navigation Mode</h2>
          <p className="text-zinc-400 max-w-sm mx-auto">Map view requires Google Maps API key configuration. Please set VITE_PUBLIC_GOOGLE_MAPS_API_KEY in your environment.</p>
          <button className="bg-emerald-500 text-zinc-950 px-6 py-3 rounded-xl font-bold mx-auto flex items-center gap-2 mt-4 hover:bg-emerald-400 transition">
            <Navigation className="w-5 h-5" /> Start Route Anyway
          </button>
        </div>
      </div>
    </div>
  );
}
