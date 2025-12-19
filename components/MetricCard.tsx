
import React from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, unit, trend, icon }) => {
  return (
    <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl flex flex-col justify-between hover:border-sky-500/50 transition-colors group">
      <div className="flex justify-between items-start mb-4">
        <span className="text-slate-400 text-xs font-bold tracking-widest uppercase">{label}</span>
        <div className="text-sky-400 group-hover:scale-110 transition-transform">{icon}</div>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-extrabold text-white">{value}</span>
        {unit && <span className="text-slate-500 text-sm">{unit}</span>}
      </div>
      {trend && (
        <div className={`text-[10px] mt-2 font-bold ${
          trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-rose-400' : 'text-slate-400'
        }`}>
          {trend === 'up' ? '↑ STABLE' : trend === 'down' ? '↓ DECREASING' : '↔ NOMINAL'}
        </div>
      )}
    </div>
  );
};

export default MetricCard;
