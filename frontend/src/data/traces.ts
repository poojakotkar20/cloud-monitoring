import { Trace } from '../types';
import { subMinutes, formatISO } from 'date-fns';

const now = new Date();

export const mockTraces: Trace[] = [
  {
    id: 'tr-1',
    traceId: '7b9f33a8123c',
    serviceId: 'svc-1',
    duration: 1250,
    status: 'ok',
    timestamp: formatISO(subMinutes(now, 2)),
    rootSpan: {
      id: 'span-1',
      serviceId: 'svc-1', // API Gateway
      operationName: 'GET /api/users/profile',
      duration: 1250,
      status: 'ok',
      children: [
        {
          id: 'span-2',
          serviceId: 'svc-2', // Auth
          operationName: 'VerifyToken',
          duration: 50,
          status: 'ok',
        },
        {
          id: 'span-3',
          serviceId: 'svc-3', // User Service
          operationName: 'FetchUserProfile',
          duration: 1180,
          status: 'ok',
          children: [
            {
              id: 'span-4',
              serviceId: 'svc-6', // DB
              operationName: 'SELECT users',
              duration: 15,
              status: 'ok',
            }
          ]
        }
      ]
    }
  },
  {
    id: 'tr-2',
    traceId: 'a39c44b9281d',
    serviceId: 'svc-1',
    duration: 4500,
    status: 'error',
    timestamp: formatISO(subMinutes(now, 15)),
    rootSpan: {
      id: 'span-5',
      serviceId: 'svc-1',
      operationName: 'POST /api/ai/generate',
      duration: 4500,
      status: 'error',
      children: [
        {
          id: 'span-6',
          serviceId: 'svc-2',
          operationName: 'VerifyToken',
          duration: 45,
          status: 'ok',
        },
        {
          id: 'span-7',
          serviceId: 'svc-5', // AI Service
          operationName: 'GenerateResponse',
          duration: 4400,
          status: 'error',
        }
      ]
    }
  }
];
