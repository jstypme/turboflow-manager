import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { HardDrive, Trash2, RefreshCw, FileText, Film, Music, Database, Shield, Zap, CheckCircle } from 'lucide-react';

interface StorageItem {
  name: string;
  value: number; // GB
  color: string;
  icon: React.ElementType;
  cleanable: boolean;
}

const INITIAL_DATA: StorageItem[] = [
  { name: 'System (Windows)', value: 45.5, color: '#64748b', icon: Shield, cleanable: false },
  { name: 'Apps & Games', value: 128.4, color: '#3b82f6', icon: Database, cleanable: false },
  { name: 'Documents', value: 24.2, color: '#eab308', icon: FileText, cleanable: false },
  { name: 'Media (Video/Audio)', value: 65.8, color: '#8b5cf6', icon: Film, cleanable: false },
  { name: 'System Cache', value: 8.4, color: '#f43f5e', icon: Zap, cleanable: true },
  { name: 'Temp Files', value: 5.2, color: '#f97316', icon: Trash2, cleanable: true },
  { name: 'Recycle Bin', value: 3.1, color: '#10b981', icon: RefreshCw, cleanable: true },
];

const StorageManager: React.FC = () => {
  const [data, setData] = useState<StorageItem[]>(INITIAL_DATA);
  const [scanning, setScanning] = useState(false);
  const [cleaning, setCleaning] = useState(false);
  const [lastCleaned, setLastCleaned] = useState<number | null>(null);

  const totalStorage = 512; // GB SSD
  const usedStorage = data.reduce((acc, item) => acc + item.value, 0);
  const freeStorage = totalStorage - usedStorage;
  const junkSize = data.filter(d => d.cleanable).reduce((acc, item) => acc + item.value, 0);

  const handleScan = () => {
    setScanning(true);
    // Simulate scan delay
    setTimeout(() => {
        // Randomly increase junk files to simulate "finding" more
        setData(prev => prev.map(item => {
            if (item.cleanable) {
                return { ...item, value: item.value + (Math.random() * 2) };
            }
            return item;
        }));
        setScanning(false);
    }, 2000);
  };

  const handleClean = () => {
    setCleaning(true);
    setTimeout(() => {
        const cleanedAmount = junkSize;
        setData(prev => prev.map(item => {
            if (item.cleanable) {
                return { ...item, value: 0 };
            }
            return item;
        }));
        setCleaning(false);
        setLastCleaned(cleanedAmount);
    }, 2500);
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 backdrop-blur-sm h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <HardDrive className="w-5 h-5 text-indigo-400" />
          Storage Matrix & Booster
        </h3>
        <div className="text-right">
             <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Total Capacity</div>
             <div className="text-white font-mono">{totalStorage} GB SSD NVMe</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
        {/* Left: Visualization */}
        <div className="lg:col-span-1 flex flex-col items-center justify-center relative bg-slate-950/30 rounded-xl border border-slate-800/50 p-4">
           <div className="h-64 w-full relative">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie
                   data={data}
                   cx="50%"
                   cy="50%"
                   innerRadius={60}
                   outerRadius={80}
                   paddingAngle={5}
                   dataKey="value"
                   stroke="none"
                 >
                   {data.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={entry.color} />
                   ))}
                 </Pie>
                 <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(val: number) => `${val.toFixed(1)} GB`}
                 />
               </PieChart>
             </ResponsiveContainer>
             
             {/* Center Text */}
             <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-bold text-white">{usedStorage.toFixed(0)}<span className="text-sm text-slate-500">GB</span></span>
                <span className="text-xs text-slate-400">USED</span>
             </div>
           </div>
           
           <div className="w-full mt-4 space-y-2">
              <div className="flex justify-between text-xs text-slate-400">
                  <span>Free Space</span>
                  <span className="text-emerald-400">{freeStorage.toFixed(1)} GB</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: `${(freeStorage / totalStorage) * 100}%` }} />
              </div>
           </div>
        </div>

        {/* Right: Breakdown List & Actions */}
        <div className="lg:col-span-2 flex flex-col">
            <div className="grid grid-cols-2 gap-4 mb-6">
                <button 
                    onClick={handleScan}
                    disabled={scanning || cleaning}
                    className="p-4 rounded-xl border border-slate-700 bg-slate-800/50 hover:bg-slate-800 transition-all flex flex-col items-center gap-2 group disabled:opacity-50"
                >
                    <RefreshCw className={`w-6 h-6 text-blue-400 ${scanning ? 'animate-spin' : 'group-hover:rotate-180 transition-transform'}`} />
                    <span className="text-sm font-medium text-slate-200">{scanning ? 'Analyzing Drive...' : 'Rescan Storage'}</span>
                </button>
                
                <button 
                    onClick={handleClean}
                    disabled={junkSize < 0.1 || cleaning || scanning}
                    className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all relative overflow-hidden group ${
                        junkSize > 1 ? 'border-amber-500/50 bg-amber-500/10 hover:bg-amber-500/20' : 'border-slate-700 bg-slate-800/50 opacity-50'
                    }`}
                >
                    {cleaning ? (
                        <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center">
                            <div className="w-full h-1 bg-emerald-500/50 absolute bottom-0 animate-pulse" />
                        </div>
                    ) : null}
                    <div className="relative z-10 flex flex-col items-center gap-2">
                        {cleaning ? <CheckCircle className="w-6 h-6 text-emerald-400 animate-bounce" /> : <Zap className="w-6 h-6 text-amber-400 group-hover:scale-110 transition-transform" />}
                        <span className="text-sm font-medium text-slate-200">
                            {cleaning ? 'Cleaning...' : `Boost: Free ${junkSize.toFixed(1)} GB`}
                        </span>
                    </div>
                </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-950/30 rounded-xl border border-slate-800/50 p-2">
                <table className="w-full text-left border-collapse">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-900/50 sticky top-0">
                        <tr>
                            <th className="p-3 rounded-tl-lg">Type</th>
                            <th className="p-3">Category</th>
                            <th className="p-3 text-right rounded-tr-lg">Size</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {data.map((item) => (
                            <tr key={item.name} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                                <td className="p-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-opacity-10`} style={{ backgroundColor: item.color + '20' }}>
                                        <item.icon size={16} style={{ color: item.color }} />
                                    </div>
                                </td>
                                <td className="p-3">
                                    <div className="font-medium text-slate-200">{item.name}</div>
                                    <div className="text-xs text-slate-500">{item.cleanable ? 'Safe to clean' : 'System Critical'}</div>
                                </td>
                                <td className="p-3 text-right font-mono text-slate-300">
                                    {item.value.toFixed(1)} GB
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {lastCleaned !== null && (
                <div className="mt-4 p-3 bg-emerald-900/20 border border-emerald-500/30 rounded-lg flex items-center gap-3 animate-in slide-in-from-bottom-2">
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                    <div>
                        <p className="text-sm text-emerald-100">Cleanup Successful</p>
                        <p className="text-xs text-emerald-400/70">Recovered {lastCleaned.toFixed(2)} GB of disk space.</p>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default StorageManager;
