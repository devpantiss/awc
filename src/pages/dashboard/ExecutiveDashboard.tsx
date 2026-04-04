import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppStore } from '@/store/useAppStore';
import { mockAWCs, mockBlocks, mockChildren } from '@/data/mockData';
import { Activity, Users, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const trendData = [
  { name: 'Mon', present: 85 },
  { name: 'Tue', present: 88 },
  { name: 'Wed', present: 84 },
  { name: 'Thu', present: 90 },
  { name: 'Fri', present: 92 },
  { name: 'Sat', present: 89 },
];

export function ExecutiveDashboard() {
  const { language } = useAppStore();
  
  const totalAWCs = mockAWCs.length;
  const onlineAWCs = mockAWCs.filter(a => a.deviceStatus === 'Online').length;
  const criticalCases = mockAWCs.reduce((acc, a) => acc + a.criticalCases, 0);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">
            {language === 'en' ? 'District Executive Overview' : 'जिला कार्यकारी अवलोकन'}
          </h2>
          <p className="text-slate-500">
            {language === 'en' ? 'Real-time monitoring across all blocks' : 'सभी ब्लॉकों में रीयल-टाइम निगरानी'}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-indigo-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Active AWCs</CardTitle>
            <Activity className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">{totalAWCs}</div>
            <p className="text-xs text-slate-500 mt-1">Across {mockBlocks.length} blocks</p>
          </CardContent>
        </Card>
        
        <Card className="border-indigo-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Device Sync Range</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">{Math.round((onlineAWCs / totalAWCs) * 100)}%</div>
            <p className="text-xs text-emerald-600 mt-1 font-medium">{onlineAWCs} online right now</p>
          </CardContent>
        </Card>
        
        <Card className="border-indigo-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Children</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">{mockChildren.length * 150}</div>
            <p className="text-xs text-slate-500 mt-1">+123 this month</p>
          </CardContent>
        </Card>
        
        <Card className="border-red-100 shadow-sm bg-red-50/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-800">Critical Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">{criticalCases}</div>
            <p className="text-xs text-red-600 mt-1 font-medium">SAM cases needing attention</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-7 lg:grid-cols-7">
        <Card className="md:col-span-4 border-indigo-100 shadow-sm">
          <CardHeader>
            <CardTitle>District Attendance Trend</CardTitle>
          </CardHeader>
          <CardContent className="pl-0">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Area type="monotone" dataKey="present" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorPresent)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-3 border-indigo-100 shadow-sm">
          <CardHeader>
            <CardTitle>Block Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Block Name</TableHead>
                  <TableHead>System Online</TableHead>
                  <TableHead className="text-right">Risk</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockBlocks.map((block, index) => {
                  const risks = ['Low', 'Medium', 'High'];
                  const colors = ['bg-emerald-100 text-emerald-800', 'bg-yellow-100 text-yellow-800', 'bg-red-100 text-red-800'];
                  return (
                    <TableRow key={block.id}>
                      <TableCell className="font-medium text-slate-700">{block.name}</TableCell>
                      <TableCell>
                        <div className="w-full bg-slate-100 rounded-full h-2.5">
                          <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${85 - index * 10}%` }}></div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline" className={`border-0 ${colors[index % 3]}`}>
                          {risks[index % 3]}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
