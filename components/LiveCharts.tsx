import React, { useMemo } from 'react';
import { AreaChart, Area, ResponsiveContainer, Tooltip, YAxis } from 'recharts';
import { SystemMetrics } from '../types';
import { Cpu, HardDrive, Thermometer, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface LiveChartsProps {
  data: SystemMetrics[];
}

interface StatCardProps {
  title: string;
  dataKey: keyof SystemMetrics;
  data: SystemMetrics[];
  color: string;
  unit: string;
  icon: React.ElementType;
  maxLimit: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, dataKey, data, color, unit, icon: Icon, maxLimit }) => {
  const stats = useMemo(() => {
    if (data.length === 0) return { current: 0, min: 0, max: 0, avg: 0, trend: 'stable' };
    
    const values = data.map(d => d[dataKey] as number);
    const current = values[values.length - 1];
    const prev = values[values.length - 2] || current;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    
    let trend: 'up' | 'down' | 'stable' = 'stable';
    if (current > prev + 0.5) trend = 'up';
    else if (current < prev - 0.5) trend = 'down';

    return { current, min, max, avg, trend };
  }, [data, dataKey]);

  const getStatusColor = (val: number) => {
    if (val > maxLimit * 0.9) return 'text-red-500';
    if (val > maxLimit * 0.7) return 'text-amber-400';
    return 'text-emerald-400';
  };

  const getStatusText = (val: number) => {
    if (val > maxLimit * 0.9) return 'CRITICAL';
    if (val > maxLimit * 0.7) return 'HEAVY';
    if (val > maxLimit * 0.3) return 'ACTIVE';
    return 'IDLE';
  };

  const statusColor = getStatusColor(stats.current);
  const statusText = getStatusText(stats.current);

  const chartColor = color === 'amber' ? '#f59e0b' : color === 'cyan' ? '#06b6d4' : '#ef4444';

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 backdrop-blur-sm flex flex-col relative overflow-hidden group hover:border-slate-600 transition-colors">
      {/* Background Gradient Effect */}
      <div className={`absolute -right-10 -top-10 w-32 h-32 bg-${color}-500/5 rounded-full blur-3xl group-hover:bg-${color}-500/10 transition-colors`} />

      <div className="flex justify-between items-start mb-2 relative z-10">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-slate-800 border border-slate-700 text-${color}-400`}>
            <Icon size={18} />
          </div>
          <div>
            <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider">{title}</h4>
            <div className={`text-xs font-mono font-bold mt-0.5 flex items-center gap-1 ${statusColor}`}>
              <div className={`w-1.5 h-1.5 rounded-full bg-current ${statusText === 'CRITICAL' ? 'animate-ping' : ''}`} />
              {statusText}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white font-mono tracking-tight">
            {stats.current.toFixed(1)}
            <span className="text-sm text-slate-500 ml-0.5">{unit}</span>
          </div>
        </div>
      </div>

      {/* Chart Area */}
      <div className="h-24 w-full my-4 relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`grad${title}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={chartColor} stopOpacity={0.4}/>
                <stop offset="100%" stopColor={chartColor} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Tooltip 
               contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', fontSize: '12px' }}
               itemStyle={{ color: '#e2e8f0' }}
               labelStyle={{ display: 'none' }}
               formatter={(value: number) => [value.toFixed(1) + unit, title]}
            />
            <YAxis domain={[0, maxLimit]} hide />
            <Area 
              type="monotone" 
              dataKey={dataKey} 
              stroke={chartColor} 
              strokeWidth={2} 
              fill={`url(#grad${title})`} 
              animationDuration={500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Stats */}
      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800/50 relative z-10">
        <div>
          <div className="text-[10px] text-slate-500 uppercase flex items-center gap-1">
             Avg
          </div>
          <div className="text-xs font-mono text-slate-300">{stats.avg.toFixed(1)}{unit}</div>
        </div>
        <div>
          <div className="text-[10px] text-slate-500 uppercase flex items-center gap-1">
             Peak
          </div>
          <div className="text-xs font-mono text-slate-300">{stats.max.toFixed(1)}{unit}</div>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-[10px] text-slate-500 uppercase">Trend</div>
          <div className={`text-xs font-mono flex items-center gap-1 ${
            stats.trend === 'up' ? 'text-red-400' : stats.trend === 'down' ? 'text-emerald-400' : 'text-slate-400'
          }`}>
            {stats.trend === 'up' && <TrendingUp size={12} />}
            {stats.trend === 'down' && <TrendingDown size={12} />}
            {stats.trend === 'stable' && <Minus size={12} />}
            {stats.trend.toUpperCase()}
          </div>
        </div>
      </div>
    </div>
  );
};

const LiveCharts: React.FC<LiveChartsProps> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard 
        title="CPU Load" 
        dataKey="cpuUsage" 
        data={data} 
        color="amber" 
        unit="%" 
        icon={Cpu}
        maxLimit={100}
      />
      <StatCard 
        title="RAM Usage" 
        dataKey="ramUsage" 
        data={data} 
        color="cyan" 
        unit="%" 
        icon={HardDrive}
        maxLimit={100}
      />
      <StatCard 
        title="Thermals" 
        dataKey="temperature" 
        data={data} 
        color="red" 
        unit="°C" 
        icon={Thermometer}
        maxLimit={100}
      />
    </div>
  );
};

export default LiveCharts;
