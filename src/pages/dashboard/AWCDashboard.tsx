import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAppStore } from '@/store/useAppStore';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockAWCs } from '@/data/mockData';
import { t } from '@/data/localization';
import { 
  Users, RefreshCcw, TrendingUp,
  AlertTriangle, CheckCircle, Wifi, WifiOff, Calendar
} from 'lucide-react';

export function AWCDashboard() {
  const { language } = useAppStore();
  const [selectedView, setSelectedView] = useState<'all' | 'online' | 'offline'>('all');
  
  // Filter AWCs
  const filteredAWCs = mockAWCs.filter(awc => {
    if (selectedView === 'online' && awc.deviceStatus !== 'Online') return false;
    if (selectedView === 'offline' && awc.deviceStatus !== 'Offline') return false;
    return true;
  });
  
  // Get sync status badge
  const getSyncStatusBadge = (status: string, lastSync: string | null, pending: number) => {
    switch (status) {
      case 'synced':
        return (
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-none shadow-none">
              <CheckCircle size={14} className="mr-1" /> Synced
            </Badge>
            {lastSync && (
              <span className="text-xs text-slate-500">
                {new Date(lastSync).toLocaleTimeString()}
              </span>
            )}
          </div>
        );
      case 'pending':
        return (
          <div className="flex items-center gap-2">
            <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-none shadow-none">
              <AlertTriangle size={14} className="mr-1" /> {pending} pending
            </Badge>
            <Button size="sm" variant="outline" className="h-6 px-2">
              <RefreshCcw size={12} />
            </Button>
          </div>
        );
      case 'syncing':
        return (
          <div className="flex items-center gap-2">
            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-none shadow-none animate-pulse">
              <RefreshCcw size={14} className="mr-1 animate-spin" /> Syncing...
            </Badge>
          </div>
        );
      default:
        return (
          <Badge className="bg-slate-100 text-slate-800 hover:bg-slate-100 border-none shadow-none">
            Never
          </Badge>
        );
    }
  };
  
  // Get device status badge
  const getDeviceStatusBadge = (status: string) => {
    if (status === 'Online') {
      return (
        <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-none shadow-none">
          <Wifi size={14} className="mr-1" /> Online
        </Badge>
      );
    }
    return (
      <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-none shadow-none">
        <WifiOff size={14} className="mr-1" /> Offline
      </Badge>
    );
  };
  
  // Get attendance percentage
  const getAttendancePercent = (present: number, total: number) => {
    return Math.round((present / total) * 100);
  };
  
  // Get attendance color
  const getAttendanceColor = (percent: number) => {
    if (percent >= 80) return 'text-emerald-600';
    if (percent >= 60) return 'text-amber-600';
    return 'text-red-600';
  };
  
  // Calculate overall stats
  const totalChildren = mockAWCs.reduce((sum, awc) => sum + awc.presentToday, 0);
  const totalRegistered = mockAWCs.reduce((sum, awc) => sum + awc.totalChildren, 0);
  const overallAttendance = Math.round((totalChildren / totalRegistered) * 100);
  const onlineCount = mockAWCs.filter(a => a.deviceStatus === 'Online').length;
  const pendingSyncCount = mockAWCs.reduce((sum, awc) => sum + awc.pendingSyncCount, 0);
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-800">
          {t('dashboard.awc', language)}
        </h2>
        <p className="text-slate-500">
          {language === 'en' ? 'Real-time facility monitoring, attendance tracking, and sync status' : 
           language === 'hi' ? 'रियल-टाइम सुविधा निगरानी, उपस्थिति ट्रैकिंग और सिंक स्थिति' : 
           'ରିୟଲ-ଟାଇମ୍ ସୁବିଧା ପର୍ଯ୍ୟବେକ୍ଷଣ, ଉପସ୍ଥିତି ଟ୍ରାକିଂ ଏବଂ ସିଙ୍କ ସ୍ଥିତି'}
        </p>
      </div>
      
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">{language === 'en' ? 'Today\'s Attendance' : language === 'hi' ? 'आज की उपस्थिति' : 'ଆଜିର ଉପସ୍ଥିତି'}</p>
                <p className="text-2xl font-bold">{totalChildren}/{totalRegistered}</p>
                <p className={`text-sm ${getAttendanceColor(overallAttendance)}`}>{overallAttendance}%</p>
              </div>
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Users className="text-emerald-600" size={20} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">{language === 'en' ? 'Online Centers' : language === 'hi' ? 'ऑनलाइन केंद्र' : 'ଅନଲାଇନ୍ କେନ୍ଦ୍ର'}</p>
                <p className="text-2xl font-bold">{onlineCount}/{mockAWCs.length}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Wifi className="text-blue-600" size={20} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">{language === 'en' ? 'Pending Sync' : language === 'hi' ? 'लंबित सिंक' : 'ଲମ୍ବିତ ସିଙ୍କ'}</p>
                <p className="text-2xl font-bold text-amber-600">{pendingSyncCount}</p>
              </div>
              <div className="p-2 bg-amber-100 rounded-lg">
                <RefreshCcw className="text-amber-600" size={20} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">{language === 'en' ? 'Critical Cases' : language === 'hi' ? 'महत्वपूर्ण मामले' : 'ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ ମାମଲା'}</p>
                <p className="text-2xl font-bold text-red-600">
                  {mockAWCs.reduce((sum, awc) => sum + awc.criticalCases, 0)}
                </p>
              </div>
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="text-red-600" size={20} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Filters */}
      <Tabs value={selectedView} onValueChange={(v) => setSelectedView(v as 'all' | 'online' | 'offline')}>
        <TabsList>
          <TabsTrigger value="all">
            {language === 'en' ? 'All Centers' : language === 'hi' ? 'सभी केंद्र' : 'ସମସ୍ତ କେନ୍ଦ୍ର'} ({mockAWCs.length})
          </TabsTrigger>
          <TabsTrigger value="online">
            <Wifi size={14} className="mr-1" />
            {language === 'en' ? 'Online' : language === 'hi' ? 'ऑनलाइन' : 'ଅନଲାଇନ୍'} ({onlineCount})
          </TabsTrigger>
          <TabsTrigger value="offline">
            <WifiOff size={14} className="mr-1" />
            {language === 'en' ? 'Offline' : language === 'hi' ? 'ऑफ़लाइन' : 'ଅଫଲାଇନ୍'} ({mockAWCs.length - onlineCount})
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      {/* AWC Table */}
      <Card className="border-indigo-100 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">
            {language === 'en' ? 'Facility Status' : language === 'hi' ? 'सुविधा स्थिति' : 'ସୁବିଧା ସ୍ଥିତି'}
          </CardTitle>
          <CardDescription>
            {language === 'en' ? 'Real-time monitoring of all AWCs' : 
             language === 'hi' ? 'सभी AWCs की वास्तविक समय निगरानी' : 
             'ସମସ୍ତ AWC ର ବାସ୍ତବ ସମୟ ପର୍ଯ୍ୟବେକ୍ଷଣ'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{language === 'en' ? 'AWC Name' : language === 'hi' ? 'AWC नाम' : 'AWC ନାମ'}</TableHead>
                <TableHead>{language === 'en' ? 'Worker' : language === 'hi' ? 'कार्यकर्ता' : 'କର୍ମୀ'}</TableHead>
                <TableHead>{language === 'en' ? 'Attendance' : language === 'hi' ? 'उपस्थिति' : 'ଉପସ୍ଥିତି'}</TableHead>
                <TableHead>{language === 'en' ? 'Device Status' : language === 'hi' ? 'डिवाइस स्थिति' : 'ଡିଭାଇସ୍ ସ୍ଥିତି'}</TableHead>
                <TableHead>{language === 'en' ? 'Sync Status' : language === 'hi' ? 'सिंक स्थिति' : 'ସିଙ୍କ ସ୍ଥିତି'}</TableHead>
                <TableHead>{language === 'en' ? 'Infrastructure' : language === 'hi' ? 'बुनियादी ढांचa' : 'ଅବକାଠାମୋ'}</TableHead>
                <TableHead>{language === 'en' ? 'Actions' : language === 'hi' ? 'कार्य' : 'କାର୍ଯ୍ୟ'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAWCs.map((awc) => {
                const attendancePercent = getAttendancePercent(awc.presentToday, awc.totalChildren);
                
                return (
                  <TableRow key={awc.id}>
                    <TableCell className="font-medium text-slate-800">
                      <div>
                        <p>{awc.name}</p>
                        {awc.criticalCases > 0 && (
                          <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                            <AlertTriangle size={12} />
                            {awc.criticalCases} {language === 'en' ? 'critical' : language === 'hi' ? 'महत्वपूर्ण' : 'ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ'}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{awc.workerName}</p>
                        <p className="text-xs text-slate-500">{awc.workerPhone}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex flex-col">
                          <span className="font-medium">
                            <span className={getAttendanceColor(attendancePercent)}>{attendancePercent}%</span>
                          </span>
                          <span className="text-xs text-slate-500">
                            {awc.presentToday}/{awc.totalChildren}
                          </span>
                        </div>
                        <div className="w-16 bg-slate-200 rounded-full h-1.5">
                          <div 
                            className={`h-1.5 rounded-full ${
                              attendancePercent >= 80 ? 'bg-emerald-500' : 
                              attendancePercent >= 60 ? 'bg-amber-500' : 
                              'bg-red-500'
                            }`}
                            style={{ width: `${attendancePercent}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getDeviceStatusBadge(awc.deviceStatus)}
                    </TableCell>
                    <TableCell>
                      {getSyncStatusBadge(awc.syncStatus, awc.lastSyncTime, awc.pendingSyncCount)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-12 bg-slate-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              awc.infrastructureScore >= 80 ? 'bg-emerald-500' : 
                              awc.infrastructureScore >= 50 ? 'bg-amber-500' : 
                              'bg-red-500'
                            }`}
                            style={{ width: `${awc.infrastructureScore}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium">{awc.infrastructureScore}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" className="h-8 px-2">
                          <TrendingUp size={14} />
                        </Button>
                        <Button size="sm" variant="outline" className="h-8 px-2">
                          <Calendar size={14} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Learning Analytics Section */}
      <Card>
        <CardHeader>
          <CardTitle>
            {language === 'en' ? 'Learning Analytics by AWC' : 
             language === 'hi' ? 'AWC द्वारा सीखने का विश्लेषण' : 
             'AWC ଅନୁସାରେ ଶିଖିବା ବିଶ୍ଳେଷଣ'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>AWC</TableHead>
                <TableHead>{language === 'en' ? 'Language' : language === 'hi' ? 'भाषा' : 'ଭାଷା'}</TableHead>
                <TableHead>{language === 'en' ? 'Numeracy' : language === 'hi' ? 'गणना' : 'ଗଣନା'}</TableHead>
                <TableHead>{language === 'en' ? 'Cognitive' : language === 'hi' ? 'संज्ञानात्मक' : 'ସଂଜ୍ଞାନାତ୍ମକ'}</TableHead>
                <TableHead>{language === 'en' ? 'Socio-Emotional' : language === 'hi' ? 'सामाजिक-भावनात्मक' : 'ସାମାଜିକ-ଭାବନାତ୍ମକ'}</TableHead>
                <TableHead>{language === 'en' ? 'Correlation' : language === 'hi' ? 'सहसंबंध' : 'ସହସମ୍ବନ୍ଧ'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockAWCs.map((awc) => (
                <TableRow key={awc.id}>
                  <TableCell className="font-medium">{awc.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium w-8">{awc.avgLearningScores.language}</span>
                      <div className="w-16 bg-slate-200 rounded-full h-1.5">
                        <div className="h-1.5 rounded-full bg-indigo-500" style={{ width: `${awc.avgLearningScores.language}%` }} />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium w-8">{awc.avgLearningScores.numeracy}</span>
                      <div className="w-16 bg-slate-200 rounded-full h-1.5">
                        <div className="h-1.5 rounded-full bg-purple-500" style={{ width: `${awc.avgLearningScores.numeracy}%` }} />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium w-8">{awc.avgLearningScores.cognitive}</span>
                      <div className="w-16 bg-slate-200 rounded-full h-1.5">
                        <div className="h-1.5 rounded-full bg-blue-500" style={{ width: `${awc.avgLearningScores.cognitive}%` }} />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium w-8">{awc.avgLearningScores.socio_emotional}</span>
                      <div className="w-16 bg-slate-200 rounded-full h-1.5">
                        <div className="h-1.5 rounded-full bg-emerald-500" style={{ width: `${awc.avgLearningScores.socio_emotional}%` }} />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={awc.nutritionLearningCorrelation > 0.7 ? 'default' : 'outline'} className={
                      awc.nutritionLearningCorrelation > 0.7 ? 'bg-emerald-100 text-emerald-800' :
                      awc.nutritionLearningCorrelation > 0.4 ? 'bg-amber-100 text-amber-800' :
                      'bg-red-100 text-red-800'
                    }>
                      {awc.nutritionLearningCorrelation.toFixed(2)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
