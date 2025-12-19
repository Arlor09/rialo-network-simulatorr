
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Activity, 
  ShieldAlert, 
  Zap, 
  Layers, 
  Settings, 
  Terminal, 
  Cpu, 
  Globe,
  RefreshCw,
  Search,
  Bell,
  Code,
  Play,
  Cpu as NodeIcon
} from 'lucide-react';
import { 
  NetworkStatus, 
  NetworkLayer, 
  NetworkMetrics, 
  AutomationRule,
  NetworkLog,
  NetworkScenario
} from './types';
import MetricCard from './components/MetricCard';
import NetworkVisualizer from './components/NetworkVisualizer';
import { analyzeNetworkState } from './services/analysisService';
import { 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';

// BASELINE Condition (NORMAL/STABLE)
const INITIAL_METRICS: NetworkMetrics = {
  tps: 2022,
  latency: 1.67,
  blockHeight: 4508212,
  nodeCount: 256,
  gasPrice: 1.2
};

const INITIAL_RULES: AutomationRule[] = [
  { id: '1', trigger: 'TPS_ABOVE', threshold: 2800, action: 'SWITCH_LAYER', enabled: true },
  { id: '2', trigger: 'LATENCY_ABOVE', threshold: 5, action: 'ALERT', enabled: true },
];

const RialoLogo = () => (
  <svg viewBox="0 0 400 400" className="w-8 h-8 fill-white" xmlns="http://www.w3.org/2000/svg">
    <path d="M140 80h140c20 0 40 10 40 30s-20 30-40 30H140c-20 0-30 10-30 30s10 30 30 30h30c20 0 40 20 40 40s-20 40-40 40h-80c-20 0-40-20-40-40s20-40 40-40h10c20 0 30-10 30-30s-10-30-30-30h-30c-20 0-40-20-40-40s20-40 40-40Z" />
    <path d="M240 200c20 0 40 20 40 40s-20 80-40 80-40-20-40-40 20-40 40-40Z" />
  </svg>
);

const App: React.FC = () => {
  const [metrics, setMetrics] = useState<NetworkMetrics>(INITIAL_METRICS);
  const [status, setStatus] = useState<NetworkStatus>(NetworkStatus.HEALTHY);
  const [activeLayer, setActiveLayer] = useState<NetworkLayer>(NetworkLayer.L1);
  const [scenario, setScenario] = useState<NetworkScenario>(NetworkScenario.DEFAULT);
  const [rules, setRules] = useState<AutomationRule[]>(INITIAL_RULES);
  const [logs, setLogs] = useState<NetworkLog[]>([]);
  const [diagnostic, setDiagnostic] = useState<string>("Analyzing mempool variance and shard health...");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [chartData, setChartData] = useState<{t: string, tps: number}[]>([]);

  const addLog = useCallback((message: string, type: NetworkLog['type'] = 'info') => {
    setLogs(prev => [{
      timestamp: new Date().toLocaleTimeString(),
      message,
      type
    }, ...prev.slice(0, 49)]);
  }, []);

  // Simulation loop for metrics based on Scenario Table
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => {
        let targetTps = 2000;
        let targetLatency = 1.6;
        let targetGas = 1.2;

        // Apply Logic Based on User Table
        if (status === NetworkStatus.ATTACK) {
          // CRITICAL Scenario
          targetTps = 1400 + (Math.random() * 200);
          targetLatency = 12 + (Math.random() * 3);
          targetGas = 4.5 + (Math.random() * 0.5);
        } else if (status === NetworkStatus.STRESSED || status === NetworkStatus.CONGESTED || scenario === NetworkScenario.IOT_BURST || scenario === NetworkScenario.FINANCIAL) {
          // STRESS / DATA SURGE Scenario
          targetTps = 3200 + (Math.random() * 400);
          targetLatency = 5 + (Math.random() * 1);
          targetGas = 3.0 + (Math.random() * 0.6);
        } else {
          // NORMAL Scenario
          targetTps = 1800 + (Math.random() * 400);
          targetLatency = 1.4 + (Math.random() * 0.4);
          targetGas = 1.0 + (Math.random() * 0.5);
        }

        const newTps = Math.round(targetTps);
        
        // Auto-triggering rules
        rules.forEach(rule => {
          if (rule.enabled && rule.trigger === 'TPS_ABOVE' && newTps > rule.threshold) {
             if (rule.action === 'SWITCH_LAYER' && activeLayer === NetworkLayer.L1) {
               addLog(`Auto-Scaling Protocol: TPS ${newTps} > ${rule.threshold}. Offloading to L2.`, 'info');
               setActiveLayer(NetworkLayer.L2);
             }
          }
        });

        return {
          ...prev,
          tps: newTps,
          blockHeight: prev.blockHeight + 1,
          latency: Number(targetLatency.toFixed(2)),
          gasPrice: Number(targetGas.toFixed(2))
        };
      });

      setChartData(prev => [...prev.slice(-24), { t: new Date().toLocaleTimeString(), tps: Math.round(metrics.tps) }]);
    }, 1000);

    return () => clearInterval(interval);
  }, [status, activeLayer, rules, scenario, metrics.tps]);

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    const result = await analyzeNetworkState(metrics, status, activeLayer);
    setDiagnostic(result);
    setIsAnalyzing(false);
    addLog("Infrastructure diagnostic completed", "success");
  };

  const toggleStatus = (newStatus: NetworkStatus) => {
    setStatus(newStatus);
    const msg = newStatus === NetworkStatus.ATTACK ? "Anomalous traffic pattern: DDoS isolation protocol engaged" :
                newStatus === NetworkStatus.STRESSED ? "Network load increased: Adaptive scheduling active" :
                newStatus === NetworkStatus.CONGESTED ? "Data burst detected: Throughput nearing saturation" :
                "Network conditions stabilized: Returning to baseline";
    addLog(msg, newStatus === NetworkStatus.ATTACK ? 'error' : 'warning');
  };

  const switchLayer = () => {
    const nextLayer = activeLayer === NetworkLayer.L1 ? NetworkLayer.L2 : NetworkLayer.L1;
    setActiveLayer(nextLayer);
    addLog(`Execution layer re-routed: ${nextLayer}`, 'info');
  };

  const activeAutomation = rules.find(r => r.enabled && metrics.tps > r.threshold);

  return (
    <div className="min-h-screen flex flex-col font-mono selection:bg-sky-500 selection:text-white">
      {/* Navbar */}
      <nav className="h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="rialo-gradient p-1 rounded-lg rialo-glow">
            <RialoLogo />
          </div>
          <div>
            <h1 className="text-lg font-extrabold tracking-tighter text-white">RIALO <span className="text-sky-500">1337</span></h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Infra Control Panel</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Scenario:</span>
            <select 
              value={scenario}
              onChange={(e) => setScenario(e.target.value as NetworkScenario)}
              className="bg-transparent text-xs font-bold text-sky-400 outline-none cursor-pointer"
            >
              {Object.values(NetworkScenario).map(s => (
                <option key={s} value={s} className="bg-slate-900">{s}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full">
            <div className={`w-2 h-2 rounded-full ${status === NetworkStatus.HEALTHY ? 'bg-emerald-500' : 'bg-rose-500'} animate-pulse`} />
            <span className="text-xs font-bold text-slate-300">{activeLayer}</span>
          </div>
        </div>
      </nav>

      {/* Main Grid */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 max-w-[1600px] mx-auto w-full">
        
        {/* Left Column */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard 
              label="Throughput" 
              value={metrics.tps.toLocaleString()} 
              unit="TPS" 
              trend={metrics.tps > 2000 ? 'up' : 'neutral'}
              icon={<Activity className="w-5 h-5" />}
            />
            <MetricCard 
              label="Latency" 
              value={metrics.latency} 
              unit="ms" 
              trend={metrics.latency < 1.8 ? 'up' : 'down'}
              icon={<Zap className="w-5 h-5" />}
            />
            <MetricCard 
              label="Validators" 
              value={metrics.nodeCount} 
              icon={<NodeIcon className="w-5 h-5" />}
            />
            <MetricCard 
              label="Gas Price" 
              value={metrics.gasPrice} 
              unit="RLO" 
              icon={<RefreshCw className="w-5 h-5" />}
            />
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col gap-4 min-h-[350px]">
            <div className="flex justify-between items-center">
              <h3 className="text-[10px] font-bold text-slate-400 tracking-widest uppercase flex items-center gap-2">
                <Activity className="w-4 h-4 text-sky-500" />
                Kernel Execution Monitor
              </h3>
              <span className="bg-sky-500/10 text-sky-400 text-[9px] px-2 py-1 rounded border border-sky-500/20 font-bold uppercase tracking-tighter">Real-time Telemetry</span>
            </div>
            <div className="flex-1 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorTps" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '4px', fontSize: '10px', fontFamily: 'JetBrains Mono' }}
                    itemStyle={{ color: '#38bdf8' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="tps" 
                    stroke="#0ea5e9" 
                    strokeWidth={1.5}
                    fillOpacity={1} 
                    fill="url(#colorTps)" 
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-sky-500/20 rounded-2xl p-6 relative overflow-hidden group">
            <h3 className="text-[10px] font-bold text-sky-400 tracking-widest uppercase mb-4 flex items-center gap-2">
              <Cpu className="w-4 h-4" /> Rialo Infra Diagnostic
            </h3>
            <div className="min-h-[60px] text-slate-200 text-xs leading-relaxed mb-4 italic">
              {isAnalyzing ? (
                <div className="flex items-center gap-2 text-sky-500 animate-pulse font-bold not-italic">
                   <RefreshCw className="w-4 h-4 animate-spin" />
                   READING MEMPOOL BUFFERS...
                </div>
              ) : `"> ${diagnostic}"`}
            </div>
            <button 
              onClick={runAnalysis}
              disabled={isAnalyzing}
              className="bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white text-[9px] font-extrabold py-2 px-6 rounded border border-sky-400/50 transition-all flex items-center gap-2 tracking-widest"
            >
              RUN DIAGNOSTIC
            </button>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          
          <NetworkVisualizer status={status} />

          {/* Panel Kecil: Automation & API Trigger */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
             <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-bold text-slate-400 tracking-widest uppercase flex items-center gap-2">
                  <Play className="w-3 h-3 text-sky-500" /> Automation Logic
                </h3>
                <span className={`text-[9px] font-bold px-1.5 rounded ${activeAutomation ? 'bg-sky-500/20 text-sky-400' : 'bg-slate-800 text-slate-500'}`}>
                  {activeAutomation ? 'ACTIVE' : 'IDLE'}
                </span>
             </div>

             <div className="space-y-3">
                <div>
                   <label className="text-[9px] text-slate-500 font-bold uppercase mb-1 block">API Endpoint</label>
                   <div className="bg-slate-900 p-2 rounded border border-slate-800 flex items-center justify-between group">
                      <code className="text-[10px] text-sky-400 truncate">POST /v1/infra/scale/l2</code>
                      <button className="text-slate-600 group-hover:text-sky-500 transition-colors"><Code size={12}/></button>
                   </div>
                </div>

                <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800 relative">
                   <div className="flex items-center gap-2 mb-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${activeAutomation ? 'bg-sky-500 animate-ping' : 'bg-slate-700'}`} />
                      <span className="text-[10px] font-bold text-slate-300">Rule 0x1: Adaptive Scaling</span>
                   </div>
                   <div className="text-[9px] text-slate-500 font-bold">
                      IF TPS &gt; 2800 THEN SWITCH_LAYER(L2)
                   </div>
                </div>

                <div className="bg-slate-900 rounded-lg p-3 border border-slate-800 overflow-hidden">
                   <div className="flex items-center gap-2 mb-2 text-slate-500">
                      <Code size={10} />
                      <span className="text-[9px] font-bold uppercase tracking-tighter">config.yaml</span>
                   </div>
                   <pre className="text-[9px] text-slate-400 leading-tight">
{`rialo_node:
  auto_scaling: true
  tps_threshold: 2800
  latency_limit: 5ms
  mode: "infra-grade"`}
                   </pre>
                </div>
             </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5">
            <h3 className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-4 flex items-center gap-2">
              <Settings className="w-3 h-3" /> Event Injector
            </h3>
            
            <div className="space-y-4">
              <div>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => toggleStatus(NetworkStatus.HEALTHY)} className={`text-[9px] font-bold py-2 rounded border transition-all ${status === NetworkStatus.HEALTHY ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'border-slate-800 text-slate-400 hover:border-slate-600'}`}>BASELINE</button>
                  <button onClick={() => toggleStatus(NetworkStatus.STRESSED)} className={`text-[9px] font-bold py-2 rounded border transition-all ${status === NetworkStatus.STRESSED ? 'bg-amber-500/10 border-amber-500 text-amber-400' : 'border-slate-800 text-slate-400 hover:border-slate-600'}`}>TRAFFIC SPIKE</button>
                  <button onClick={() => toggleStatus(NetworkStatus.ATTACK)} className={`text-[9px] font-bold py-2 rounded border transition-all ${status === NetworkStatus.ATTACK ? 'bg-rose-500/10 border-rose-500 text-rose-400' : 'border-slate-800 text-slate-400 hover:border-slate-600'}`}>DDOS ATTACK</button>
                  <button onClick={() => toggleStatus(NetworkStatus.CONGESTED)} className={`text-[9px] font-bold py-2 rounded border transition-all ${status === NetworkStatus.CONGESTED ? 'bg-purple-500/10 border-purple-500 text-purple-400' : 'border-slate-800 text-slate-400 hover:border-slate-600'}`}>DATA SURGE</button>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800">
                <button 
                  onClick={switchLayer}
                  className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-[9px] font-extrabold py-2.5 px-3 rounded flex items-center justify-between hover:border-sky-500 transition-colors uppercase tracking-widest"
                >
                  <span className="flex items-center gap-2"><Layers className="w-3 h-3 text-sky-500" /> Routing: {activeLayer}</span>
                  <RefreshCw className="w-3 h-3 text-slate-500" />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl flex flex-col flex-1 max-h-[180px] overflow-hidden shadow-inner">
            <div className="p-3 border-b border-slate-800 bg-slate-900/50">
              <h3 className="text-[10px] font-bold text-slate-400 tracking-widest uppercase flex items-center gap-2">
                <Terminal className="w-3 h-3 text-sky-500" /> Kernel Logs
              </h3>
            </div>
            <div className="p-3 overflow-y-auto font-mono text-[9px] space-y-1">
              {logs.length === 0 && <div className="text-slate-600 italic">Listening for broadcast...</div>}
              {logs.map((log, idx) => (
                <div key={idx} className="flex gap-2">
                  <span className="text-slate-600 shrink-0">[{log.timestamp}]</span>
                  <span className={`${log.type === 'error' ? 'text-rose-400' : log.type === 'warning' ? 'text-amber-400' : log.type === 'success' ? 'text-emerald-400' : 'text-slate-400'} uppercase font-bold tracking-tighter`}>
                    {log.message}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="py-3 px-6 border-t border-slate-800 bg-slate-950 flex flex-col md:flex-row justify-between items-center gap-2">
        <div className="flex items-center gap-4 text-[9px] font-bold text-slate-500">
          <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> INFRA-SHADOW-1</span>
          <span className="flex items-center gap-1"><Cpu className="w-3 h-3" /> RIALO-KERNEL v1.3.37</span>
          <span className="flex items-center gap-1 text-sky-500"><ShieldAlert className="w-3 h-3" /> SECURITY: NOMINAL</span>
        </div>
        <div className="text-[9px] text-slate-600 font-bold tracking-widest">
          RIALO.IO — HIGH-PERFORMANCE WEB3 INFRASTRUCTURE
        </div>
      </footer>
    </div>
  );
};

export default App;
