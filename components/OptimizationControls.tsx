import React from 'react';
import { Zap, Snowflake, Activity, Trash2, Fan } from 'lucide-react';
import { OptimizationMode } from '../types';

interface OptimizationControlsProps {
  currentMode: OptimizationMode;
  setMode: (mode: OptimizationMode) => void;
  onClearRam: () => void;
  isOptimizing: boolean;
  smartCooling: boolean;
  onToggleSmartCooling: () => void;
}

const OptimizationControls: React.FC<OptimizationControlsProps> = ({ 
  currentMode, 
  setMode, 
  onClearRam,
  isOptimizing,
  smartCooling,
  onToggleSmartCooling
}) => {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 backdrop-blur-sm">
      <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
        <Activity className="w-5 h-5 text-indigo-400" />
        System Control
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <button
          onClick={() => setMode(OptimizationMode.BALANCED)}
          className={`p-3 rounded-lg border flex flex-col items-center justify-center gap-2 transition-all ${
            currentMode === OptimizationMode.BALANCED 
              ? 'bg-blue-600/20 border-blue-500 text-blue-400' 
              : 'bg-slate-800/50 border-transparent text-slate-400 hover:bg-slate-800'
          }`}
        >
          <Activity className="w-6 h-6" />
          <span className="text-sm font-medium">Balanced</span>
        </button>

        <button
          onClick={() => setMode(OptimizationMode.PERFORMANCE)}
          className={`p-3 rounded-lg border flex flex-col items-center justify-center gap-2 transition-all ${
            currentMode === OptimizationMode.PERFORMANCE 
              ? 'bg-amber-600/20 border-amber-500 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]' 
              : 'bg-slate-800/50 border-transparent text-slate-400 hover:bg-slate-800'
          }`}
        >
          <Zap className="w-6 h-6" />
          <span className="text-sm font-medium">Turbo</span>
        </button>

        <button
          onClick={() => setMode(OptimizationMode.COOLING)}
          className={`p-3 rounded-lg border flex flex-col items-center justify-center gap-2 transition-all ${
            currentMode === OptimizationMode.COOLING 
              ? 'bg-cyan-600/20 border-cyan-500 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]' 
              : 'bg-slate-800/50 border-transparent text-slate-400 hover:bg-slate-800'
          }`}
        >
          <Snowflake className="w-6 h-6" />
          <span className="text-sm font-medium">Eco</span>
        </button>
      </div>

      <div className="mb-4">
        <button
            onClick={onToggleSmartCooling}
            className={`w-full p-3 rounded-lg border flex items-center justify-center gap-2 transition-all ${
              smartCooling 
                ? 'bg-purple-600/20 border-purple-500 text-purple-400' 
                : 'bg-slate-800/50 border-transparent text-slate-400 hover:bg-slate-800'
            }`}
          >
            <Fan className={`w-5 h-5 ${smartCooling ? 'animate-spin' : ''}`} />
            <span className="text-sm font-medium">Smart Fan Control {smartCooling ? '(Active)' : '(Off)'}</span>
        </button>
      </div>

      <button
        onClick={onClearRam}
        disabled={isOptimizing}
        className="w-full relative overflow-hidden group bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white p-4 rounded-lg font-bold tracking-wide transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        <div className="flex items-center justify-center gap-2 relative z-10">
          {isOptimizing ? (
            <span className="animate-pulse">Cleaning RAM...</span>
          ) : (
            <>
              <Trash2 className="w-5 h-5" />
              FLUSH RAM
            </>
          )}
        </div>
      </button>
    </div>
  );
};

export default OptimizationControls;
