import { Alert } from '../types';
import { subMinutes, formatISO } from 'date-fns';

const now = new Date();

export const mockAlerts: Alert[] = [
  {
    id: 'alt-0',
    name: 'API Gateway - High CPU Usage',
    severity: 'Critical',
    serviceId: 'svc-1',
    time: formatISO(subMinutes(now, 1)),
    status: 'Active',
    message: 'CPU Usage: 94% | Memory Usage: 68% | Error Rate: 4.2% | Response Latency: 420 ms',
    mlRecommendation: {
      text: 'Investigate CPU-intensive processes in the API Gateway and consider scaling the service if high utilization persists.',
      type: 'RESOURCE_SCALING',
      confidence: 91
    }
  },
  {
    id: 'alt-1',
    name: 'High Error Rate',
    severity: 'Critical',
    serviceId: 'svc-5', // AI Service
    time: formatISO(subMinutes(now, 5)),
    status: 'Active',
    message: 'Error rate exceeded 5% threshold in the last 5 minutes. Current rate: 8.4%'
  },
  {
    id: 'alt-2',
    name: 'Elevated Latency',
    severity: 'Warning',
    serviceId: 'svc-2', // Auth
    time: formatISO(subMinutes(now, 30)),
    status: 'Acknowledged',
    message: 'p95 latency is > 100ms. Current: 120ms'
  },
  {
    id: 'alt-3',
    name: 'CPU Utilization High',
    severity: 'Warning',
    serviceId: 'svc-6', // Database
    time: formatISO(subMinutes(now, 120)),
    status: 'Resolved',
    message: 'CPU usage above 80% for 10 minutes.'
  }
];
