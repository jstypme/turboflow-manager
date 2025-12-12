export interface SystemMetrics {
  timestamp: number;
  cpuUsage: number; // Percentage 0-100
  ramUsage: number; // Percentage 0-100
  temperature: number; // Celsius
  fanSpeed: number; // RPM
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export enum OptimizationMode {
  BALANCED = 'Balanced',
  PERFORMANCE = 'Turbo Boost',
  COOLING = 'Ice Cold',
  SMART = 'Smart AI', 
}

export interface OptimizationResult {
  message: string;
  actionTaken: string;
}

export interface StartupApp {
  id: string;
  name: string;
  description: string;
  isEnabled: boolean;
  impact: 'High' | 'Medium' | 'Low';
}

export interface Process {
  id: string;
  name: string;
  cpu: number; // %
  ram: number; // MB
  type: 'system' | 'user' | 'background';
}

export interface RealHardwareStats {
  cores: number;
  memory?: number; // GB (Approx)
  platform: string;
  platformVersion?: string; // Detailed OS version
  userAgent: string;
  batteryLevel: number | null;
  isCharging: boolean | null;
  screenRes: string;
  pixelRatio: number;
  online: boolean;
  language: string;
  gpuRenderer: string;
  browserVendor: string;
  // New Extended Stats
  networkType?: string;
  downlink?: number; // Mb/s
  rtt?: number; // ms
  storageUsed?: number; // bytes
  storageQuota?: number; // bytes
  geoRegion?: string;
}

export interface AdminNote {
  id: string;
  text: string;
  timestamp: number;
  type: 'info' | 'alert' | 'todo';
}
