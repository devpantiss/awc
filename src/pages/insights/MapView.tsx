import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function MapView() {
  // A dummy interactive/colored mapping interface to display block-wise risks
  const zones = [
    { name: 'Alpha Block', risk: 'High', color: 'bg-red-100 border-red-300 text-red-800' },
    { name: 'Beta Block', risk: 'Low', color: 'bg-emerald-100 border-emerald-300 text-emerald-800' },
    { name: 'Gamma Block', risk: 'Medium', color: 'bg-amber-100 border-amber-300 text-amber-800' },
    { name: 'Delta Block', risk: 'Low', color: 'bg-emerald-100 border-emerald-300 text-emerald-800' },
    { name: 'Sigma Block', risk: 'High', color: 'bg-red-100 border-red-300 text-red-800' },
  ];

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-8rem)]">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-800">Geospatial Risk Map</h2>
        <p className="text-slate-500">Live indicators of Anganwadi centers performance across regions.</p>
      </div>

      <Card className="flex-1 border-indigo-100 overflow-hidden shadow-sm flex flex-col">
        <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center">
              <MapPin className="mr-2 h-5 w-5 text-indigo-600" />
              District Heatmap
            </CardTitle>
            <div className="flex gap-2 text-sm">
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Healthy (2)</Badge>
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Warning (1)</Badge>
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Critical (2)</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-6 bg-slate-50/50">
          <div className="w-full h-full rounded-xl border border-slate-200 overflow-hidden relative">
            {/* Dummy Map Area */}
            <div className="absolute inset-0 grid grid-cols-2 lg:grid-cols-3 gap-2 p-2">
              {zones.map((zone) => (
                <div 
                  key={zone.name} 
                  className={`border-2 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-[1.02] shadow-sm ${zone.color}`}
                >
                  <MapPin className="h-8 w-8 mb-2 opacity-80" />
                  <span className="font-bold text-lg">{zone.name}</span>
                  <span className="text-sm font-medium opacity-80">{zone.risk} Risk Zone</span>
                </div>
              ))}
              
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 flex items-center justify-center text-slate-400 bg-white">
                <div className="text-center">
                  <Info className="h-6 w-6 mx-auto mb-2" />
                  <span>Unmapped Area</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
