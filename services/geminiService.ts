import { SystemMetrics, OptimizationMode } from "../types";

// Local logic replacement for AI service
// No external API calls are made here.

export const analyzeSystemMetrics = async (
  metrics: SystemMetrics,
  mode: OptimizationMode
): Promise<string> => {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 500));

  if (metrics.temperature > 85) {
    return "CRITICAL ALERT: Core temperature exceeding safe limits. Thermal throttling recommended.";
  }
  if (metrics.temperature > 80) {
    return "WARNING: High thermal output detected. Fan speed limit reached.";
  }
  if (metrics.ramUsage > 90) {
    return "MEMORY ALERT: RAM usage critical (>90%). Recommend terminating background processes.";
  }
  if (metrics.cpuUsage > 90 && mode !== OptimizationMode.PERFORMANCE) {
    return "High CPU Load detected. Switch to Turbo mode for better throughput.";
  }
  
  if (mode === OptimizationMode.PERFORMANCE) {
    return "Status: Turbo Mode Active. Power consumption unregulated. Monitoring thermals.";
  }
  if (mode === OptimizationMode.COOLING) {
    return "Status: Eco Mode Active. Voltage clamped. Fan noise minimized.";
  }

  return "System Nominal. All operating parameters within standard deviation.";
};

export const askTechSupport = async (query: string): Promise<string> => {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 600));

  const q = query.toLowerCase();
  
  // Simple keyword matching for "Command Line" feel
  if (q.includes('cool') || q.includes('hot') || q.includes('temp') || q.includes('heat')) {
    return "THERMAL CONTROL: To reduce heat, enable 'Eco' mode or check the 'Smart Fan Control' toggle. High temperatures may result from background tasks.";
  }
  if (q.includes('slow') || q.includes('fast') || q.includes('speed') || q.includes('lag')) {
    return "PERFORMANCE CONTROL: 'Turbo' mode unlocks CPU power limits. For faster boot times, disable unused entries in the Startup Apps tab.";
  }
  if (q.includes('ram') || q.includes('memory')) {
    return "MEMORY CONTROL: Use the 'Flush RAM' button to clear cache. Enable 'Auto-RAM' in the Process Manager to automatically kill non-essential tasks.";
  }
  if (q.includes('help') || q.includes('start')) {
    return "COMMAND LIST: Try asking about 'cooling', 'speed', or 'memory'. Use the dashboard tabs to manage processes.";
  }
  
  return "COMMAND UNRECOGNIZED: Please specify system subsystem (Cooling, Memory, Performance).";
};
