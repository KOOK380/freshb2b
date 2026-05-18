import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Navigation, Package, Phone } from "lucide-react";
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';

export default function DriverDashboard() {
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    const key = localStorage.getItem('GOOGLE_MAPS_KEY') || import.meta.env.VITE_GOOGLE_MAPS_PLATFORM_KEY || import.meta.env.GOOGLE_MAPS_PLATFORM_KEY || '';
    setApiKey(key);
  }, []);

  const currentDeliveries = [
    { id: 1, restaurant: "Le Petit Bistro", address: "123 Main St, New York, NY 10001", status: "next", lat: 40.7128, lng: -74.0060, items: 12 },
    { id: 2, restaurant: "Ocean Blue Seafood", address: "456 Market St, New York, NY 10002", status: "pending", lat: 40.7200, lng: -74.0100, items: 8 },
    { id: 3, restaurant: "Mama's Kitchen", address: "789 Broadway, New York, NY 10003", status: "pending", lat: 40.7300, lng: -73.9900, items: 15 },
    { id: 4, restaurant: "Green Leaf Caffe", address: "101 5th Ave, New York, NY 10004", status: "pending", lat: 40.7400, lng: -73.9800, items: 5 }
  ];

  return (
    <div className="space-y-6 flex flex-col h-full">
      <div>
        <h1 className="text-2xl font-bold text-white">Driver Portal</h1>
        <p className="text-zinc-400">Your assigned route and deliveries for today.</p>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 flex-1 lg:min-h-[500px]">
        {/* Left Col: Stop List */}
        <div className="space-y-4 lg:col-span-1 lg:overflow-y-auto lg:pr-2 order-2 lg:order-1">
          <h2 className="font-bold text-white text-lg uppercase tracking-wider text-sm mt-6 lg:mt-0">Today's Stops ({currentDeliveries.length})</h2>
          
          {currentDeliveries.map((delivery, i) => (
            <Card key={delivery.id} className={delivery.status === 'next' ? 'border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)] ring-1 ring-emerald-500/20' : ''}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 text-emerald-400 flex items-center justify-center text-xs font-bold">
                      {i + 1}
                    </span>
                    <h3 className="font-bold text-white">{delivery.restaurant}</h3>
                  </div>
                  {delivery.status === 'next' && (
                    <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded-full uppercase border border-emerald-500/20">Next Stop</span>
                  )}
                </div>
                
                <div className="flex items-start space-x-2 mt-3 text-sm text-zinc-300">
                  <MapPin className="w-4 h-4 mt-0.5 text-zinc-500" />
                  <p>{delivery.address}</p>
                </div>
                
                <div className="flex items-center space-x-4 mt-3 text-sm text-zinc-300">
                   <div className="flex items-center space-x-1">
                     <Package className="w-4 h-4 text-zinc-500" />
                     <span>{delivery.items} packages</span>
                   </div>
                </div>

                {delivery.status === 'next' && (
                  <div className="mt-4 flex space-x-2">
                    <button className="flex-1 flex items-center justify-center space-x-2 bg-zinc-800 text-white py-2 rounded-xl text-sm font-bold border border-zinc-700 hover:bg-zinc-700 transition">
                      <Navigation className="w-4 h-4" />
                      <span>Navigate</span>
                    </button>
                    <button className="p-2 border border-zinc-800 rounded-xl hover:bg-zinc-800 transition text-zinc-300">
                      <Phone className="w-5 h-5" />
                    </button>
                    <button className="px-4 border border-transparent rounded-xl hover:bg-emerald-400 transition bg-emerald-500 text-zinc-950 font-bold flex items-center justify-center text-sm">
                      Done
                    </button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Right Col: Map */}
        <div className="lg:col-span-2 rounded-3xl border border-zinc-800 overflow-hidden bg-zinc-900 relative h-[400px] lg:h-auto order-1 lg:order-2">
          {apiKey ? (
             <APIProvider apiKey={apiKey} version="weekly">
               <Map
                 defaultCenter={{lat: 40.7128, lng: -74.0060}}
                 defaultZoom={13}
                 mapId="DRIVER_ROUTE_MAP"
                 internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                 style={{width: '100%', height: '100%'}}
                 disableDefaultUI={true}
               >
                 {currentDeliveries.map((d, i) => (
                   <AdvancedMarker key={d.id} position={{lat: d.lat, lng: d.lng}}>
                     <Pin background={d.status === 'next' ? "#10b981" : "#27272a"} glyphColor="#fff" borderColor="transparent" />
                   </AdvancedMarker>
                 ))}
               </Map>
             </APIProvider>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-zinc-950">
              <MapPin className="w-12 h-12 text-zinc-800 mb-4" />
              <h3 className="text-lg font-bold text-white">Map API Key Required</h3>
              <p className="text-sm text-zinc-400 mt-2 max-w-sm">Please provide a valid Google Maps Platform API key in your AI Studio secrets to view the delivery route map.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
