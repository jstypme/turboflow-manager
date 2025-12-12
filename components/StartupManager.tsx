import React from 'react';
import { Power, Info } from 'lucide-react';
import { StartupApp } from '../types';

interface StartupManagerProps {
  apps: StartupApp[];
  onToggle: (id: string) => void;
}

const StartupManager: React.FC<StartupManagerProps> = ({ apps, onToggle }) => {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 backdrop-blur-sm h-full overflow-hidden flex flex-col">
      <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
        <Power className="w-5 h-5 text-emerald-400" />
        Startup Applications
      </h3>
      <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
        {apps.map((app) => (
          <div 
            key={app.id}
            className={`p-4 rounded-lg border transition-all ${
              app.isEnabled 
                ? 'bg-slate-800/50 border-slate-700' 
                : 'bg-slate-900/50 border-slate-800 opacity-75'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="text-slate-200 font-medium">{app.name}</h4>
                <div className={`text-xs mt-1 inline-flex px-2 py-0.5 rounded ${
                  app.impact === 'High' ? 'bg-red-500/10 text-red-400' :
                  app.impact === 'Medium' ? 'bg-amber-500/10 text-amber-400' :
                  'bg-green-500/10 text-green-400'
                }`}>
                  {app.impact} Impact
                </div>
              </div>
              <button
                onClick={() => onToggle(app.id)}
                className={`w-12 h-6 rounded-full p-1 transition-colors ${
                  app.isEnabled ? 'bg-emerald-500' : 'bg-slate-600'
                }`}
              >
                <div 
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    app.isEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`} 
                />
              </button>
            </div>
            
            <p className="text-xs text-slate-400 flex items-start gap-1.5 leading-relaxed">
              <Info className="w-3 h-3 mt-0.5 shrink-0" />
              {app.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StartupManager;
