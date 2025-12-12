import React, { useEffect, useState } from 'react';
import { Monitor, Battery, Cpu, Wifi, Globe, Smartphone, Lock, Layers, Zap, HardDrive, Signal, MapPin } from 'lucide-react';
import { RealHardwareStats } from '../types';

const RealHardwareInfo: React.FC = () => {
  const [specs, setSpecs] = useState<RealHardwareStats | null>(null);

  useEffect(() => {
    const fetchInfo = async () => {
      const nav = navigator as any;
      
      // 1. Battery Info
      let batteryLevel = null;
      let isCharging = null;
      if (nav.getBattery) {
        try {
          const battery = await nav.getBattery();
          batteryLevel = battery.level * 100;
          isCharging = battery.charging;
          battery.addEventListener('levelchange', () => 
            setSpecs(prev => prev ? {...prev, batteryLevel: battery.level * 100} : null));
          battery.addEventListener('chargingchange', () => 
            setSpecs(prev => prev ? {...prev, isCharging: battery.charging} : null));
        } catch (e) {
          console.warn("Battery API error", e);
        }
      }

      // 2. GPU Detection via WebGL
      let gpuRenderer = "Unknown Integrated Graphics";
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (gl) {
          const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info');
          if (debugInfo) {
            gpuRenderer = (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
          }
        }
      } catch (e) {
        console.warn("WebGL blocked", e);
      }

      // 3. Network Information API (Experimental)
      let netType = "Unknown";
      let downlink = 0;
      let rtt = 0;
      if (nav.connection) {
        netType = nav.connection.effectiveType || nav.connection.type;
        downlink = nav.connection.downlink;
        rtt = nav.connection.rtt;
      }

      // 4. Storage Manager API
      let storageUsed = 0;
      let storageQuota = 0;
      if (nav.storage && nav.storage.estimate) {
        try {
          const estimate = await nav.storage.estimate();
          storageUsed = estimate.usage || 0;
          storageQuota = estimate.quota || 0;
        } catch (e) { console.warn("Storage API failed"); }
      }

      // 5. Advanced OS Details (Client Hints)
      let platform = nav.userAgentData?.platform || navigator.platform;
      let platformVersion = "";
      
      if (nav.userAgentData && nav.userAgentData.getHighEntropyValues) {
        try {
          const highEntropy = await nav.userAgentData.getHighEntropyValues([
            "platformVersion", "architecture", "model", "uaFullVersion"
          ]);
          
          if (highEntropy.platform === "Windows") {
            const major = parseInt(highEntropy.platformVersion.split('.')[0]);
            if (major >= 13) platform = "Windows 11";
            else if (major > 0) platform = "Windows 10";
            platformVersion = `Build: ${highEntropy.platformVersion}`;
          } else {
             platformVersion = highEntropy.platformVersion || "";
          }
        } catch(e) { console.warn("High Entropy Values denied"); }
      }

      // 6. Geolocation (Region only)
      let geoRegion = "Determining...";
      if (navigator.geolocation) {
         navigator.geolocation.getCurrentPosition(
            (pos) => {
               geoRegion = `${pos.coords.latitude.toFixed(2)}, ${pos.coords.longitude.toFixed(2)}`;
               setSpecs(prev => prev ? {...prev, geoRegion} : null);
            },
            () => { geoRegion = "Permission Denied"; setSpecs(prev => prev ? {...prev, geoRegion} : null); }
         );
      }

      setSpecs({
        cores: navigator.hardwareConcurrency || 0,
        memory: nav.deviceMemory, 
        platform: platform,
        platformVersion: platformVersion,
        userAgent: navigator.userAgent,
        batteryLevel,
        isCharging,
        screenRes: `${window.screen.width}x${window.screen.height} (${window.screen.colorDepth}-bit)`,
        pixelRatio: window.devicePixelRatio || 1,
        online: navigator.onLine,
        language: navigator.language,
        gpuRenderer,
        browserVendor: navigator.vendor || "Unknown Vendor",
        networkType: netType,
        downlink,
        rtt,
        storageUsed,
        storageQuota,
        geoRegion
      });
    };

    fetchInfo();
  }, []);

  if (!specs) return (
    <div className="p-8 border border-slate-800 rounded-xl bg-slate-900/50 flex flex-col items-center justify-center gap-4 animate-pulse">
        <Cpu className="w-8 h-8 text-slate-600" />
        <span className="text-slate-500 font-mono text-sm">Running Deep Hardware Scan...</span>
    </div>
  );

  const formatBytes = (bytes: number) => {
      if (bytes === 0) return '0 B';
      const k = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-6 backdrop-blur-sm relative overflow-hidden shadow-xl">
      <div className="absolute top-0 right-0 bg-blue-600/20 text-blue-400 text-xs px-3 py-1 rounded-bl-lg font-mono border-l border-b border-blue-500/20 flex items-center gap-2">
        <Monitor className="w-3 h-3" />
        DEEP SCAN RESULTS
      </div>
      
      <h3 className="text-white font-semibold mb-6 flex items-center gap-2 text-lg">
        <Layers className="w-5 h-5 text-blue-400" />
        System Hardware Profile
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* CPU & Memory */}
        <div className="space-y-4 p-4 rounded-lg bg-slate-950/50 border border-slate-800/50">
          <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4" /> Processing
          </h4>
          <div>
            <div className="text-slate-500 text-xs">Logical Cores</div>
            <div className="text-white font-mono text-xl">{specs.cores} Threads</div>
          </div>
          <div>
            <div className="text-slate-500 text-xs">Physical Memory</div>
            <div className="text-white font-mono text-xl">
              {specs.memory ? `~${specs.memory} GB` : 'Hidden'} 
              <span className="text-xs text-slate-500 ml-1">(RAM Cap)</span>
            </div>
          </div>
        </div>

        {/* Graphics & Display */}
        <div className="space-y-4 p-4 rounded-lg bg-slate-950/50 border border-slate-800/50">
           <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
            <Monitor className="w-4 h-4" /> Graphics
          </h4>
          <div>
            <div className="text-slate-500 text-xs">GPU Renderer</div>
            <div className="text-emerald-400 font-mono text-xs leading-tight mt-1">{specs.gpuRenderer}</div>
          </div>
          <div className="flex gap-4">
             <div>
                <div className="text-slate-500 text-xs">Resolution</div>
                <div className="text-white font-mono">{specs.screenRes}</div>
             </div>
             <div>
                <div className="text-slate-500 text-xs">Scale</div>
                <div className="text-white font-mono">{specs.pixelRatio}x</div>
             </div>
          </div>
        </div>

        {/* OS & Power */}
        <div className="space-y-4 p-4 rounded-lg bg-slate-950/50 border border-slate-800/50">
           <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
            <Zap className="w-4 h-4" /> Platform
          </h4>
          <div>
            <div className="text-slate-500 text-xs">Operating System</div>
            <div className="text-white font-mono text-lg">{specs.platform}</div>
            <div className="text-xs text-slate-500 font-mono">{specs.platformVersion}</div>
          </div>
           <div>
            <div className="text-slate-500 text-xs">Battery Status</div>
            <div className={`font-mono text-lg ${specs.isCharging ? 'text-green-400' : 'text-amber-400'}`}>
                {specs.batteryLevel !== null ? `${specs.batteryLevel.toFixed(0)}%` : 'AC Power'} 
                {specs.isCharging && <span className="text-sm ml-1">⚡</span>}
            </div>
          </div>
        </div>

        {/* Connection */}
        <div className="space-y-4 p-4 rounded-lg bg-slate-950/50 border border-slate-800/50">
           <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
            <Signal className="w-4 h-4" /> Connection
          </h4>
          <div>
            <div className="text-slate-500 text-xs">Network Type</div>
            <div className="text-white font-mono uppercase">{specs.networkType}</div>
          </div>
          <div className="flex gap-4">
            <div>
               <div className="text-slate-500 text-xs">Speed</div>
               <div className="text-green-400 font-mono">{specs.downlink} Mbps</div>
            </div>
            <div>
               <div className="text-slate-500 text-xs">Ping</div>
               <div className="text-white font-mono">{specs.rtt} ms</div>
            </div>
          </div>
        </div>

        {/* Storage */}
        <div className="space-y-4 p-4 rounded-lg bg-slate-950/50 border border-slate-800/50">
           <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
            <HardDrive className="w-4 h-4" /> Storage
          </h4>
          <div>
            <div className="text-slate-500 text-xs">Origin Quota</div>
            <div className="text-white font-mono text-sm">{formatBytes(specs.storageUsed || 0)} / {formatBytes(specs.storageQuota || 0)}</div>
            <div className="w-full h-1 bg-slate-800 mt-2 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: `${((specs.storageUsed || 0) / (specs.storageQuota || 1)) * 100}%` }} />
            </div>
          </div>
        </div>

        {/* Location & Browser */}
        <div className="space-y-4 p-4 rounded-lg bg-slate-950/50 border border-slate-800/50">
            <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
            <Globe className="w-4 h-4" /> Context
          </h4>
             <div>
                <div className="text-slate-500 text-xs flex items-center gap-1"><MapPin className="w-3 h-3"/> Location Node</div>
                <div className="text-white font-mono text-xs">{specs.geoRegion || "Unknown"}</div>
             </div>
             <div>
                <div className="text-slate-500 text-xs flex items-center gap-1 mt-2"><Smartphone className="w-3 h-3"/> Browser Engine</div>
                <div className="text-white font-mono text-xs truncate" title={specs.userAgent}>{specs.browserVendor}</div>
             </div>
        </div>

      </div>

      <div className="mt-6 pt-4 border-t border-slate-800">
        <div className="mt-3 bg-blue-900/10 border border-blue-500/20 rounded p-3 flex items-start gap-2">
            <Lock className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
            <p className="text-xs text-blue-200/70 leading-relaxed">
                <strong>Detection Note:</strong> Advanced APIs (NetworkInformation, StorageManager, Geolocation) accessed. Values represent the browser's constrained view of the OS.
            </p>
        </div>
      </div>
    </div>
  );
};

export default RealHardwareInfo;
