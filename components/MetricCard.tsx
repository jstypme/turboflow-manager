import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit: string;
  icon: React.ReactNode;
  color: string;
  trend?: 'up' | 'down' | 'stable';
  warning?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, unit, icon, color, warning }) => {
  return (
    <div className={`relative overflow-hidden rounded-xl bg-slate-900/50 border ${warning ? 'border-red-500 animate-pulse' : 'border-slate-800'} p-6 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-${color}-500/20`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-slate-400 font-medium text-sm uppercase tracking-wider">{title}</h3>
        <div className={`p-2 rounded-lg bg-slate-800/50 text-${color}-400`}>
          {icon}
        </div>
      </div>
      <div className="flex items-end gap-2">
        <span className={`text-3xl font-bold ${warning ? 'text-red-500' : 'text-white'}`}>
          {value}
        </span>
        <span className="text-slate-500 mb-1 font-mono">{unit}</span>
      </div>
      
      {/* Decorative progress bar background */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-800">
        <div 
          className={`h-full bg-${color}-500 transition-all duration-1000 ease-out`}
          style={{ width: `${typeof value === 'number' ? Math.min(value, 100) : 50}%` }}
        />
      </div>
    </div>
  );
};

export default MetricCard;
