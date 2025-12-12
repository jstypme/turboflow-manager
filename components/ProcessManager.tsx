import React from 'react';
import { Layers, XCircle, Cpu, ShieldCheck } from 'lucide-react';
import { Process } from '../types';

interface ProcessManagerProps {
  processes: Process[];
  onKillProcess: (id: string) => void;
  autoOptimize: boolean;
  onToggleAutoOptimize: () => void;
}

const ProcessManager: React.FC<ProcessManagerProps> = ({ 
  processes, 
  onKillProcess, 
  autoOptimize, 
  onToggleAutoOptimize 
}) => {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 backdrop-blur-sm h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <Layers className="w-5 h-5 text-blue-400" />
          Active Processes
        </h3>
        <button
          onClick={onToggleAutoOptimize}
          className={`text-xs px-3 py-1.5 rounded-full border transition-all flex items-center gap-2 ${
            autoOptimize 
              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' 
              : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
          }`}
        >
          <ShieldCheck className="w-3 h-3" />
          Auto-RAM: {autoOptimize ? 'ON' : 'OFF'}
        </button>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="grid grid-cols-12 gap-2 text-xs text-slate-500 uppercase font-bold tracking-wider mb-2 px-2">
          <div className="col-span-5">Name</div>
          <div className="col-span-2 text-right">CPU</div>
          <div className="col-span-3 text-right">Mem</div>
          <div className="col-span-2 text-right">Action</div>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1">
          {processes.map((proc) => (
            <div 
              key={proc.id}
              className="grid grid-cols-12 gap-2 items-center p-2 rounded hover:bg-slate-800/50 text-sm transition-colors group"
            >
              <div className="col-span-5 flex items-center gap-2 overflow-hidden">
                <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  proc.type === 'system' ? 'bg-slate-500' :
                  proc.type === 'background' ? 'bg-amber-500' : 'bg-blue-500'
                }`} />
                <span className={`truncate ${proc.type === 'system' ? 'text-slate-400' : 'text-slate-200'}`}>
                  {proc.name}
                </span>
              </div>
              
              <div className="col-span-2 text-right font-mono text-slate-400">
                {proc.cpu.toFixed(1)}%
              </div>
              
              <div className="col-span-3 text-right font-mono text-slate-300">
                {proc.ram.toLocaleString()} MB
              </div>
              
              <div className="col-span-2 flex justify-end">
                {proc.type !== 'system' && (
                  <button
                    onClick={() => onKillProcess(proc.id)}
                    className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-all p-1"
                    title="End Task"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-slate-800/50 flex justify-between text-xs text-slate-500">
        <span>Processes: {processes.length}</span>
        <span>Total RAM: {(processes.reduce((acc, p) => acc + p.ram, 0) / 1024).toFixed(2)} GB</span>
      </div>
    </div>
  );
};

export default ProcessManager;
