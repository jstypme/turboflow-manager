import React from 'react';
import { Activity, Thermometer, Cpu, HardDrive } from 'lucide-react';
import { SystemMetrics } from '../types';

interface DesktopWidgetProps {
  metrics: SystemMetrics;
}

const DesktopWidget: React.FC<DesktopWidgetProps> = ({ metrics }) => {
  return (
    <div className="h-screen w-screen bg-slate-950 flex flex-col p-4 select-none">
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-white font-bold text-sm tracking-widest">TURBOFLOW</span>
        </div>
        <span className="text-[10px] text-slate-500 font-mono">LIVE_WIDGET</span>
      </div>

      <div className="space-y-4">
        <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-400">
            <Cpu size={16} />
            <span className="text-xs font-bold">CPU</span>
          </div>
          <span className="text-xl font-mono text-white">{metrics.cpuUsage.toFixed(1)}%</span>
        </div>

        <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-cyan-400">
            <HardDrive size={16} />
            <span className="text-xs font-bold">RAM</span>
          </div>
          <span className="text-xl font-mono text-white">{metrics.ramUsage.toFixed(1)}%</span>
        </div>

        <div className={`bg-slate-900/50 rounded-lg p-3 border flex items-center justify-between ${metrics.temperature > 80 ? 'border-red-900 bg-red-900/10' : 'border-slate-800'}`}>
          <div className={`flex items-center gap-2 ${metrics.temperature > 80 ? 'text-red-500' : 'text-emerald-400'}`}>
            <Thermometer size={16} />
            <span className="text-xs font-bold">TEMP</span>
          </div>
          <span className={`text-xl font-mono ${metrics.temperature > 80 ? 'text-red-500' : 'text-white'}`}>
            {metrics.temperature.toFixed(1)}°C
          </span>
        </div>
      </div>
      
      <div className="mt-auto pt-4 text-center">
         <p className="text-[10px] text-slate-600">Keep this window open for monitoring.</p>
      </div>
    </div>
  );
};

export default DesktopWidget;
