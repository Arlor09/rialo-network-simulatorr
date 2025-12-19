
import React, { useMemo } from 'react';
import { NetworkStatus } from '../types';

interface NetworkVisualizerProps {
  status: NetworkStatus;
}

const NetworkVisualizer: React.FC<NetworkVisualizerProps> = ({ status }) => {
  const nodes = useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      x: 50 + Math.cos((i / 12) * Math.PI * 2) * 35,
      y: 50 + Math.sin((i / 12) * Math.PI * 2) * 35,
    }));
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case NetworkStatus.ATTACK: return 'stroke-rose-500';
      case NetworkStatus.STRESSED: return 'stroke-amber-500';
      case NetworkStatus.CONGESTED: return 'stroke-purple-500';
      default: return 'stroke-sky-500';
    }
  };

  const getPulseClass = () => {
    switch (status) {
      case NetworkStatus.ATTACK: return 'animate-ping';
      case NetworkStatus.STRESSED: return 'animate-pulse';
      default: return '';
    }
  };

  return (
    <div className="relative w-full aspect-square bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex items-center justify-center p-4 shadow-inner">
      <div className="absolute inset-0 grid-bg opacity-10" />
      
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_12px_rgba(14,165,233,0.3)]">
        {/* Connection Lines */}
        {nodes.map((node, i) => 
          nodes.slice(i + 1).map((target, j) => (
            <line
              key={`${i}-${j}`}
              x1={node.x}
              y1={node.y}
              x2={target.x}
              y2={target.y}
              className={`${getStatusColor()} opacity-10 stroke-[0.15]`}
            />
          ))
        )}

        {/* Outer Ring Nodes */}
        {nodes.map((node) => (
          <g key={node.id}>
            <circle
              cx={node.x}
              cy={node.y}
              r="1.2"
              className={`${getStatusColor()} fill-slate-950 stroke-[0.4] ${getPulseClass()}`}
            />
            <circle
              cx={node.x}
              cy={node.y}
              r="0.4"
              className={`${status === NetworkStatus.ATTACK ? 'fill-rose-500' : 'fill-sky-400'}`}
            />
          </g>
        ))}

        {/* Central Core */}
        <circle
          cx="50"
          cy="50"
          r="10"
          className={`fill-slate-900 stroke-[1.5] ${getStatusColor()} ${status === NetworkStatus.HEALTHY ? 'animate-pulse' : ''} shadow-lg`}
        />
        <text
          x="50"
          y="50"
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-sky-400 font-extrabold text-[2.5px] tracking-[0.2em] pointer-events-none uppercase"
        >
          RIALO CORE
        </text>
      </svg>

      {/* Status Overlay */}
      <div className="absolute top-4 left-4 flex items-center gap-2 bg-slate-900/80 px-2 py-1 rounded border border-slate-800">
        <div className={`w-2 h-2 rounded-full ${
          status === NetworkStatus.HEALTHY ? 'bg-emerald-500' : 
          status === NetworkStatus.ATTACK ? 'bg-rose-500 shadow-[0_0_8px_#f43f5e]' : 
          'bg-amber-500'
        } animate-pulse`} />
        <span className="text-[9px] font-extrabold tracking-widest text-slate-400">STATE: {status}</span>
      </div>
    </div>
  );
};

export default NetworkVisualizer;
