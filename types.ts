
export enum NetworkStatus {
  HEALTHY = 'HEALTHY',
  STRESSED = 'STRESSED',
  ATTACK = 'ATTACK',
  CONGESTED = 'CONGESTED'
}

export enum NetworkLayer {
  L1 = 'LAYER 1 (Consensus)',
  L2 = 'LAYER 2 (Scaling)'
}

export enum NetworkScenario {
  DEFAULT = 'Default Operation',
  SMART_CITY = 'Smart City Traffic',
  IOT_BURST = 'IoT Sensor Burst',
  FINANCIAL = 'Financial Data Surge',
  ANALYTICS_LOAD = 'Analytics Load'
}

export interface NetworkMetrics {
  tps: number;
  latency: number;
  blockHeight: number;
  nodeCount: number;
  gasPrice: number;
}

export interface AutomationRule {
  id: string;
  trigger: 'TPS_ABOVE' | 'LATENCY_ABOVE' | 'HEALTH_BELOW';
  threshold: number;
  action: 'SWITCH_LAYER' | 'ALERT' | 'SCALE_NODES';
  enabled: boolean;
}

export interface NetworkLog {
  timestamp: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
}
