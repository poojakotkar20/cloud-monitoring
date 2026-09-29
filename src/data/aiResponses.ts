import { AiMessage } from '../types';

export const mockAiResponses: Record<string, string> = {
  "Why is the API latency high?": "The API latency is currently elevated primarily due to the AI Service, which is experiencing a p95 latency of 1500ms. I can see in the traces that requests to `/api/ai/generate` are timing out. This is also triggering the 'Elevated Latency' alert.",
  "Show me recent critical errors": "Here are the recent critical errors:\n- 15 mins ago: AI Service (svc-5) reported 'Out of memory (OOM) killer invoked. Process terminated.'\n- 5 mins ago: 'Error rate exceeded 5% threshold' alert triggered for AI Service.",
  "Which service has the highest error rate?": "The AI Service currently has the highest error rate at 8.4%. The Authentication Service is also elevated at 2.5%, but AI Service is the most critical right now.",
  "Summarize today's incidents": "Today there have been 3 main incidents:\n1. CPU Utilization High on Database Cluster (Resolved 2 hours ago).\n2. Elevated Latency on Authentication Service (Acknowledged 30 mins ago).\n3. High Error Rate and OOM crashes on AI Service (Currently Active and Critical).",
  "default": "I'm analyzing the telemetry data... Based on current metrics, the overall system health is degraded due to the AI Service. Is there a specific service or metric you'd like me to investigate?"
};

export const initialAiMessages: AiMessage[] = [
  {
    id: 'msg-1',
    role: 'assistant',
    content: 'Hello! I am your Observability AI Assistant. I have access to your services, metrics, logs, traces, and alerts. How can I help you troubleshoot today?',
    timestamp: new Date().toISOString()
  }
];
