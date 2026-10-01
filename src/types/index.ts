export type ServiceStatus = 'Healthy' | 'Warning' | 'Critical';

export interface Service {
  id: string;
  name: string;
  status: ServiceStatus;
  uptime: number; // percentage
  requestRate: number; // req/min
  errorRate: number; // percentage
  latency: number; // ms
}

export type LogLevel = 'INFO' | 'WARNING' | 'ERROR' | 'DEBUG';

export interface LogEntry {
  id: string;
  timestamp: string;
  serviceId: string;
  level: LogLevel;
  message: string;
  requestId?: string;
}

export interface MetricDataPoint {
  timestamp: string;
  cpu: number;
  memory: number;
  requestRate: number;
  errorRate: number;
  latency: number;
}

export interface TraceSpan {
  id: string;
  serviceId: string;
  operationName: string;
  duration: number; // ms
  status: 'ok' | 'error';
  children?: TraceSpan[];
}

export interface Trace {
  id: string;
  traceId: string;
  serviceId: string; // root service
  duration: number; // ms
  status: 'ok' | 'error';
  timestamp: string;
  rootSpan: TraceSpan;
}

export type AlertSeverity = 'Critical' | 'Warning' | 'Info';
export type AlertStatus = 'Active' | 'Acknowledged' | 'Resolved';

export interface Alert {
  id: string;
  name: string;
  severity: AlertSeverity;
  serviceId: string;
  time: string;
  status: AlertStatus;
  message: string;
  mlRecommendation?: {
    text: string;
    type: string;
    confidence: number;
  };
}

export interface AiMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
