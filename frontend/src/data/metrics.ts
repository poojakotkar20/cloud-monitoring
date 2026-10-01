import { MetricDataPoint } from '../types';
import { subMinutes, formatISO } from 'date-fns';

const generateMetrics = (count: number): MetricDataPoint[] => {
  const data: MetricDataPoint[] = [];
  const now = new Date();
  
  for (let i = count; i >= 0; i--) {
    const time = subMinutes(now, i);
    data.push({
      timestamp: formatISO(time),
      cpu: 40 + Math.random() * 30 + (i % 10 === 0 ? 20 : 0),
      memory: 60 + Math.random() * 10,
      requestRate: 4000 + Math.random() * 1000 - (i % 20 === 0 ? 1000 : 0),
      errorRate: 0.1 + Math.random() * 0.5 + (i % 15 === 0 ? 2 : 0),
      latency: 40 + Math.random() * 20 + (i % 5 === 0 ? 30 : 0),
    });
  }
  
  return data;
};

export const mockTimeSeriesData = generateMetrics(60); // Last 60 minutes
