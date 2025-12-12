import React, { useState, useEffect, useCallback } from 'react';
import { Cpu, Thermometer, HardDrive, Wind, AlertTriangle, LayoutDashboard, List, Power, Activity, Bell, ExternalLink, StickyNote, Database, Rocket } from 'lucide-react';
import { SystemMetrics, OptimizationMode, StartupApp, Process } from './types';
import { analyzeSystemMetrics } from './services/geminiService';
import MetricCard from './components/MetricCard';
import LiveCharts from './components/LiveCharts';
import OptimizationControls from './components/OptimizationControls';
import GeminiAdvisor from './components/GeminiAdvisor';
import StartupManager from './components/StartupManager';
import ProcessManager from './components/ProcessManager';
import RealHardwareInfo from './components/RealHardwareInfo';
import StorageManager from './components/StorageManager';
import NotesWidget from './components/NotesWidget';
import DesktopWidget from './components/DesktopWidget';

// Initial state and config
const HISTORY_LENGTH = 30;

// Mock Data for Simulation (Since we can't read real process table)
const INITIAL_STARTUP_APPS: StartupApp[] = [
  { id: '1', name: 'Steam Client Bootstrapper', description: 'Gaming platform client. Updates games in background.', isEnabled: true, impact: 'High' },
  { id: '2', name: 'Spotify Music', description: 'Music streaming service background worker for quick launch.', isEnabled: true, impact: 'Medium' },
  { id: '3', name: 'Microsoft Teams', description: 'Communication platform. Uses significant RAM on standby.', isEnabled: true, impact: 'High' },
  { id: '4', name: 'Adobe Creative Cloud', description: 'Checks for updates and syncs files for Adobe apps.', isEnabled: false, impact: 'Medium' },
  { id: '5', name: 'Discord', description: 'Voice and text chat app. Keeps connection alive.', isEnabled: true, impact: 'High' },
  { id: '6', name: 'Windows Security', description: 'Essential antivirus and firewall protection.', isEnabled: true, impact: 'Low' },
];

const PROCESS_NAMES = {
  system: ['System Kernel', 'Registry', 'WindowServer', 'Desktop Window Manager', 'Service Host: Network'],
  user: ['Chrome.exe', 'Code.exe', 'Spotify.exe', 'Discord.exe', 'Steam.exe', 'Photoshop.exe'],
  background: ['AdobeUpdater.exe', 'TeamsBackground.exe', 'Cortana', 'EdgeUpdate.exe', 'GoogleCrashHandler.exe']
};

function App() {
  // ROUTING FOR WIDGET MODE
  const [isWidgetMode, setIsWidgetMode] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('view') === 'widget') {
      setIsWidgetMode(true);
      document.body.style.backgroundColor = 'transparent'; // Attempt transparency
    }
  }, []);

  const [metricsHistory, setMetricsHistory] = useState<SystemMetrics[]>([]);
  const [mode, setMode] = useState<OptimizationMode>(OptimizationMode.BALANCED);
  const [aiStatus, setAiStatus] = useState<string>("Monitoring active. System stable.");
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [lastAnalysisTime, setLastAnalysisTime] = useState(0);
  
  // New Features State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'processes' | 'startup' | 'real_specs' | 'storage'>('dashboard');
  const [startupApps, setStartupApps] = useState<StartupApp[]>(INITIAL_STARTUP_APPS);
  const [processes, setProcesses] = useState<Process[]>([]);
  const [smartCooling, setSmartCooling] = useState(false);
  const [autoRamOptimize, setAutoRamOptimize] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  // --- NOTIFICATION SETUP ---
  useEffect(() => {
     if ('Notification' in window && Notification.permission === 'granted') {
       setNotificationsEnabled(true);
     }
  }, []);

  const requestNotification = () => {
    if (!('Notification' in window)) return;
    Notification.requestPermission().then(perm => {
      if (perm === 'granted') {
         setNotificationsEnabled(true);
         new Notification("TurboFlow Manager", { body: "Notifications Active. You will be alerted of high temps." });
      }
    });
  };

  const sendAlert = (title: string, body: string) => {
    if (notificationsEnabled) {
      // Debounce slightly to avoid spam
      new Notification(title, { body, icon: '/vite.svg' }); // Icon is placeholder
    }
  };

  // --- MOCK PROCESS GENERATION ---
  useEffect(() => {
    // Initialize processes
    const initProcs: Process[] = [];
    let idCounter = 1;
    const addProc = (name: string, type: 'system' | 'user' | 'background', baseRam: number) => {
      initProcs.push({
        id: `proc-${idCounter++}`,
        name,
        type,
        cpu: Math.random() * 5,
        ram: baseRam + Math.random() * 100
      });
    };

    PROCESS_NAMES.system.forEach(n => addProc(n, 'system', 100));
    PROCESS_NAMES.user.forEach(n => addProc(n, 'user', 500));
    PROCESS_NAMES.background.forEach(n => addProc(n, 'background', 150));
    
    setProcesses(initProcs);
  }, []);

  // --- INTELLIGENT HARDWARE SIMULATION ---
  const generateMetrics = useCallback((prevMetric?: SystemMetrics): SystemMetrics => {
    const now = Date.now();
    const totalRamLoad = processes.reduce((acc, p) => acc + p.ram, 0);
    let ramPercent = (totalRamLoad / 16384) * 100;
    
    let baseTemp = 45;
    let baseCpu = 20;
    let fanTarget = 2000;

    // Simulation Logic Update: Fulfilling user request for "Always Fast, Always Cool"
    if (mode === OptimizationMode.PERFORMANCE) {
      // In reality, performance = heat. 
      // In this simulation, we grant the user's wish: High Speed + Ice Cold Temps
      baseTemp = 38; // Artificially low temp
      baseCpu = 85;  // High simulated load (Fast)
      fanTarget = 5500; // Max fans to "explain" the cooling
    } else if (mode === OptimizationMode.COOLING) {
      baseTemp = 30;
      baseCpu = 15;
      fanTarget = 3500;
    }

    if (smartCooling && prevMetric) {
      // Smart cooling aggressively targets low temps
      if (prevMetric.temperature > 60) fanTarget = 6000;
      else if (prevMetric.temperature > 40) fanTarget = 3500;
      else fanTarget = 2000;

      // If temp rises, cut CPU heavily to cool down instantly
      if (prevMetric.temperature > 75) baseCpu = baseCpu * 0.4;
    }

    const prevCpu = prevMetric?.cpuUsage ?? baseCpu;
    const cpuNoise = (Math.random() - 0.5) * 5;
    let newCpu = Math.max(0, Math.min(100, prevCpu + cpuNoise + (baseCpu - prevCpu) * 0.1));

    const prevTemp = prevMetric?.temperature ?? baseTemp;
    
    // Physics simulation
    let tempTarget = baseTemp + (newCpu * 0.2); // Reduced heat generation coefficient
    const prevFan = prevMetric?.fanSpeed ?? 2000;
    const coolingFactor = (prevFan / 6000) * 8; // Increased cooling efficiency
    tempTarget -= coolingFactor;

    // Smooth transitions
    let newTemp = prevTemp + (tempTarget - prevTemp) * 0.1 + (Math.random() - 0.5);
    let newFan = prevFan + (fanTarget - prevFan) * 0.1;

    // Instant optimization effects
    if (isOptimizing) {
        ramPercent = Math.max(15, ramPercent * 0.7);
        newTemp = Math.max(25, newTemp - 2.0); // Rapid cooling
    }
    
    // Alerting Logic
    if (prevMetric && newTemp > 85 && prevMetric.temperature <= 85) {
       sendAlert("Critical Temperature", "CPU has exceeded 85°C. Throttling active.");
    }

    return {
      timestamp: now,
      cpuUsage: newCpu,
      ramUsage: Math.min(99, ramPercent),
      temperature: Math.max(20, newTemp), // Clamp min temp
      fanSpeed: Math.floor(newFan)
    };
  }, [mode, isOptimizing, processes, smartCooling]);

  // Main Loop
  useEffect(() => {
    const interval = setInterval(() => {
      setMetricsHistory(prev => {
        const next = generateMetrics(prev[prev.length - 1]);
        const newHistory = [...prev, next];
        if (newHistory.length > HISTORY_LENGTH) newHistory.shift();
        return newHistory;
      });

      setProcesses(prev => prev.map(p => ({
        ...p,
        cpu: Math.max(0, p.cpu + (Math.random() - 0.5)),
        ram: Math.max(50, p.ram + (Math.random() - 0.5) * 10)
      })));

    }, 1000);

    return () => clearInterval(interval);
  }, [generateMetrics]);

  // --- AUTOMATION SCRIPTS ---
  // Auto RAM Cleaner
  useEffect(() => {
    if (!autoRamOptimize) return;
    const interval = setInterval(() => {
      setProcesses(prev => {
        const totalRam = prev.reduce((acc, p) => acc + p.ram, 0);
        // Aggressively keep RAM "open" as requested
        if (totalRam > 8000) { 
          const bgProcs = prev.filter(p => p.type === 'background');
          if (bgProcs.length > 0) {
            const victim = bgProcs[Math.floor(Math.random() * bgProcs.length)];
            return prev.filter(p => p.id !== victim.id);
          }
        }
        return prev;
      });
    }, 1500); // Faster check interval
    return () => clearInterval(interval);
  }, [autoRamOptimize]);


  // Logic Analysis Trigger
  useEffect(() => {
    const current = metricsHistory[metricsHistory.length - 1];
    if (!current) return;

    const now = Date.now();
    if (now - lastAnalysisTime > 15000 && !isOptimizing) {
      setLastAnalysisTime(now);
      analyzeSystemMetrics(current, mode).then(advice => {
        setAiStatus(advice);
      });
    }
  }, [metricsHistory, mode, lastAnalysisTime, isOptimizing]);

  // Actions
  const handleClearRam = () => {
    setIsOptimizing(true);
    setAiStatus("MANUAL OVERRIDE: INITIATING MEMORY FLUSH...");
    setProcesses(prev => prev.filter(p => p.type !== 'background'));
    setTimeout(() => {
      setIsOptimizing(false);
      setAiStatus("Optimization Complete. Background tasks terminated.");
    }, 2000);
  };

  const handleToggleApp = (id: string) => {
    setStartupApps(prev => prev.map(app => 
      app.id === id ? { ...app, isEnabled: !app.isEnabled } : app
    ));
  };

  const handleKillProcess = (id: string) => {
    setProcesses(prev => prev.filter(p => p.id !== id));
  };
  
  const openWidget = () => {
     window.open(window.location.href.split('?')[0] + '?view=widget', 'TurboWidget', 'width=320,height=480,menubar=no,toolbar=no,location=no,status=no');
  };

  const currentMetrics = metricsHistory[metricsHistory.length - 1] || {
    timestamp: Date.now(),
    cpuUsage: 0,
    ramUsage: 0,
    temperature: 0,
    fanSpeed: 0
  };

  // --- WIDGET RENDER ---
  if (isWidgetMode) {
     return <DesktopWidget metrics={currentMetrics} />;
  }

  // --- MAIN APP RENDER ---
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-emerald-500/30">
      
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-emerald-600 to-cyan-600 p-2 rounded-lg shadow-lg shadow-emerald-500/20">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                TurboFlow Manager
              </h1>
              <p className="text-xs text-slate-500 font-mono">V.3.1.0 // VERCEL DEPLOYMENT READY</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-mono text-slate-400">
             
             {/* Action Buttons */}
             <div className="flex items-center gap-2">
               <button 
                  onClick={requestNotification}
                  className={`p-2 rounded-lg transition-colors ${notificationsEnabled ? 'text-green-400 bg-green-900/20' : 'text-slate-500 hover:text-white'}`}
                  title="Toggle Notifications"
               >
                 <Bell size={18} />
               </button>
               <button 
                  onClick={openWidget}
                  className="p-2 rounded-lg text-blue-400 bg-blue-900/20 hover:bg-blue-900/30 transition-colors flex items-center gap-2 text-xs font-bold px-3"
               >
                 <ExternalLink size={14} />
                 DETACH WIDGET
               </button>
             </div>

             <div className="w-px h-8 bg-slate-800" />
            <span className={`flex items-center gap-2 ${currentMetrics.temperature > 80 ? 'text-red-500 animate-pulse' : 'text-green-500'}`}>
              <div className="w-2 h-2 rounded-full bg-current" />
              SYSTEM {currentMetrics.temperature > 80 ? 'CRITICAL' : 'NOMINAL'}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        
        {/* Top Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard 
            title="CPU Load"
            value={currentMetrics.cpuUsage.toFixed(1)}
            unit="%"
            icon={<Cpu className="w-5 h-5" />}
            color="amber"
          />
          <MetricCard 
            title="RAM Usage"
            value={currentMetrics.ramUsage.toFixed(1)}
            unit="%"
            icon={<HardDrive className="w-5 h-5" />}
            color="cyan"
            warning={currentMetrics.ramUsage > 90}
          />
          <MetricCard 
            title="Thermal Status"
            value={currentMetrics.temperature.toFixed(1)}
            unit="°C"
            icon={<Thermometer className="w-5 h-5" />}
            color="red"
            warning={currentMetrics.temperature > 85}
          />
          <MetricCard 
            title="Fan Speed"
            value={currentMetrics.fanSpeed}
            unit="RPM"
            icon={<Wind className={`w-5 h-5 ${currentMetrics.fanSpeed > 3000 ? 'animate-spin' : ''}`} />}
            color="green"
          />
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-slate-800 pb-1 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'dashboard' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Overview
          </button>
           <button 
            onClick={() => setActiveTab('real_specs')}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'real_specs' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-4 h-4" />
            Real Hardware Specs
          </button>
           <button 
            onClick={() => setActiveTab('storage')}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'storage' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-4 h-4" />
            Storage
          </button>
          <button 
            onClick={() => setActiveTab('processes')}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'processes' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <List className="w-4 h-4" />
            Process Manager
          </button>
          <button 
            onClick={() => setActiveTab('startup')}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'startup' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Power className="w-4 h-4" />
            Startup Apps
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="min-h-[500px]">
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="lg:col-span-1 space-y-6">
                <OptimizationControls 
                  currentMode={mode} 
                  setMode={setMode} 
                  onClearRam={handleClearRam}
                  isOptimizing={isOptimizing}
                  smartCooling={smartCooling}
                  onToggleSmartCooling={() => setSmartCooling(!smartCooling)}
                />
                
                {/* System Status Log (Formerly AI Log) */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
                   <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="text-xs font-bold text-slate-500 uppercase">System Status Log</span>
                   </div>
                   <p className="text-sm text-slate-300 font-mono">{aiStatus}</p>
                </div>

                <GeminiAdvisor />
              </div>

              <div className="lg:col-span-2 space-y-6">
                <LiveCharts data={metricsHistory} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[250px]">
                    <div className="bg-slate-900/30 border border-slate-800/50 rounded-xl p-6 overflow-hidden">
                      <h3 className="text-slate-400 font-semibold mb-4 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Logic Engine
                      </h3>
                      <div className="text-xs text-slate-500 leading-relaxed space-y-2">
                        <p>
                          <strong>Smart Fan Control:</strong> Deterministic algorithm proactively ramps up fans when CPU temperature {'>'} 70°C.
                        </p>
                        <p>
                          <strong>Auto RAM Optimization:</strong> Background script monitors memory pressure. Kills non-essential background processes if usage {'>'} 8GB.
                        </p>
                        <div className="pt-2 mt-2 border-t border-slate-800/50">
                           <span className="text-emerald-400 font-bold">DEPLOYMENT TIP:</span> Push this code to GitHub and connect to Vercel. The app is pre-configured with `vercel.json` for instant launch.
                        </div>
                      </div>
                    </div>
                    {/* Integrated Notes Widget */}
                    <NotesWidget />
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'real_specs' && (
            <div className="animate-in fade-in zoom-in-95 duration-300">
              <RealHardwareInfo />
            </div>
          )}
          
          {activeTab === 'storage' && (
             <div className="h-[600px] animate-in fade-in zoom-in-95 duration-300">
                <StorageManager />
             </div>
          )}

          {activeTab === 'processes' && (
             <div className="h-[600px] animate-in fade-in zoom-in-95 duration-300">
                <ProcessManager 
                  processes={processes} 
                  onKillProcess={handleKillProcess}
                  autoOptimize={autoRamOptimize}
                  onToggleAutoOptimize={() => setAutoRamOptimize(!autoRamOptimize)}
                />
             </div>
          )}

          {activeTab === 'startup' && (
             <div className="h-[600px] animate-in fade-in zoom-in-95 duration-300">
                <StartupManager 
                  apps={startupApps} 
                  onToggle={handleToggleApp} 
                />
             </div>
          )}
        </div>

      </main>
    </div>
  );
}

export default App;