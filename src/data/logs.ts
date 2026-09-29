import { LogEntry } from '../types';
import { subMinutes, formatISO } from 'date-fns';

const now = new Date();

export const mockLogs: LogEntry[] = [
  {
    id: 'log-1',
    timestamp: formatISO(subMinutes(now, 1)),
    serviceId: 'svc-1',
    level: 'INFO',
    message: 'Request authenticated successfully',
    requestId: 'req-abc-123'
  },
  {
    id: 'log-2',
    timestamp: formatISO(subMinutes(now, 2)),
    serviceId: 'svc-5',
    level: 'ERROR',
    message: 'Connection timeout to embedding model provider',
    requestId: 'req-xyz-789'
  },
  {
    id: 'log-3',
    timestamp: formatISO(subMinutes(now, 5)),
    serviceId: 'svc-2',
    level: 'WARNING',
    message: 'High number of failed login attempts for user user@example.com',
  },
  {
    id: 'log-4',
    timestamp: formatISO(subMinutes(now, 10)),
    serviceId: 'svc-6',
    level: 'DEBUG',
    message: 'Query executed in 3ms: SELECT * FROM users WHERE id = $1',
    requestId: 'req-def-456'
  },
  {
    id: 'log-5',
    timestamp: formatISO(subMinutes(now, 15)),
    serviceId: 'svc-5',
    level: 'CRITICAL' as any,
    message: 'Out of memory (OOM) killer invoked. Process terminated.',
  },
  {
    id: 'log-6',
    timestamp: formatISO(subMinutes(now, 20)),
    serviceId: 'svc-1',
    level: 'INFO',
    message: 'Rate limit reset for client IP 192.168.1.100',
  }
];
