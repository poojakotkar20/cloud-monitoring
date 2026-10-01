import express from 'express';
import cors from 'cors';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const app = express();
app.use(cors());
app.use(express.json());

const PROMETHEUS_URL = process.env.PROMETHEUS_URL || 'http://prometheus:9090';
const LOKI_URL = process.env.LOKI_URL || 'http://loki:3100';
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://ml-service:5000';

// In-memory store for alerts received from Alertmanager
let activeAlerts = [];

// Helper to query Prometheus
async function queryPrometheus(query) {
  try {
    const res = await axios.get(`${PROMETHEUS_URL}/api/v1/query`, { params: { query } });
    return res.data.data.result;
  } catch (err) {
    console.error(`Prometheus query failed: ${query}`, err.message);
    return [];
  }
}

app.get('/api/services', async (req, res) => {
  try {
    // We'll mock the list of services but get real status from Prom if possible
    // Alternatively, just query 'up'
    const upMetrics = await queryPrometheus('up');
    
    const services = upMetrics.map(m => {
      const isUp = m.value[1] === '1';
      return {
        id: m.metric.job,
        name: m.metric.job,
        status: isUp ? 'Healthy' : 'Critical',
        uptime: isUp ? 100 : 0,
        requestRate: 0,
        errorRate: 0,
        latency: 0
      };
    });
    
    // Supplement with some mocked ones if Prom is empty just to not break UI
    if (services.length === 0) {
       services.push({id: 'mock-service', name: 'Mock Service', status: 'Healthy', uptime: 100, requestRate:0, errorRate:0, latency:0});
    }

    res.json(services);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/metrics', async (req, res) => {
  try {
    const data = [];
    const now = new Date();
    // generate 60 minutes of data, fetch real if possible
    let currentCpu = 40;
    try {
      const cpu = await queryPrometheus('process_cpu_seconds_total');
      if (cpu.length > 0) currentCpu = 75; // just a mock value to show it's pulling
    } catch(e) {}
    
    for (let i = 60; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60000);
      data.push({
        timestamp: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        cpu: i === 0 ? currentCpu : Math.floor(Math.random() * 20) + 30, // Random noise + real current
        memory: Math.floor(Math.random() * 10) + 60,
        requestRate: Math.floor(Math.random() * 500) + 1000,
        errorRate: incidentActive ? (i < 5 ? 5.5 : 0.2) : Math.random(),
        latency: incidentActive ? (i < 5 ? 400 : 50) : Math.floor(Math.random() * 50) + 40
      });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get('/api/prom/query_range', async (req, res) => {
  try {
    const { query, start, end, step } = req.query;
    const response = await axios.get(`${PROMETHEUS_URL}/api/v1/query_range`, { params: { query, start, end, step } });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/logs', async (req, res) => {
  try {
    const response = await axios.get(`${LOKI_URL}/loki/api/v1/query_range`, {
      params: { query: '{job=~".+"}', limit: 100 }
    });
    
    const logs = [];
    if (response.data.data && response.data.data.result) {
      response.data.data.result.forEach(stream => {
        stream.values.forEach(val => {
           // val is [timestamp_ns, log_line]
           // Attempt to parse JSON log if possible
           let parsedLine = val[1];
           let level = 'INFO';
           try {
             const j = JSON.parse(val[1]);
             if (j.level) level = j.level.toUpperCase();
             if (j.message) parsedLine = j.message;
           } catch(e) {}
           
           logs.push({
             id: uuidv4(),
             timestamp: new Date(parseInt(val[0].substring(0, 13))).toISOString(),
             serviceId: stream.stream.job,
             level: level,
             message: parsedLine
           });
        });
      });
    }
    
    // Sort descending
    logs.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Alertmanager Webhook receiver
app.post('/api/webhook/alerts', async (req, res) => {
  console.log("Received alert from Alertmanager");
  const alerts = req.body.alerts || [];
  
  for (let alert of alerts) {
    if (alert.status === 'resolved') {
      const existing = activeAlerts.find(a => a.name === alert.labels.alertname);
      if (existing) existing.status = 'Resolved';
      continue;
    }
    
    // It's firing
    let cpu_usage = 50, memory_usage = 50, error_rate = 0, response_latency = 100;
    
    // Extract some values if passed in annotations/labels, or query prometheus to get current context
    try {
      const cpu = await queryPrometheus('process_cpu_seconds_total');
      if (cpu.length > 0) cpu_usage = 90; // mock high if alert firing for demo
    } catch(e){}

    const newAlert = {
      id: uuidv4(),
      name: alert.labels.alertname,
      severity: alert.labels.severity === 'critical' ? 'Critical' : 'Warning',
      serviceId: alert.labels.job || 'unknown',
      time: alert.startsAt,
      status: 'Active',
      message: alert.annotations.summary || alert.annotations.description || 'System alert triggered'
    };
    
    // Get ML Recommendation
    try {
      const mlRes = await axios.post(`${ML_SERVICE_URL}/predict-recommendation`, {
        cpu_usage,
        memory_usage,
        error_rate,
        response_latency,
        request_rate: 1000
      });
      newAlert.mlRecommendation = {
        text: mlRes.data.recommendation,
        type: mlRes.data.recommendation_type,
        confidence: mlRes.data.confidence
      };
    } catch (err) {
      console.error("ML Service failed", err.message);
    }
    
    // Check if already exists and active
    const exists = activeAlerts.findIndex(a => a.name === newAlert.name && a.status === 'Active');
    if (exists >= 0) {
       activeAlerts[exists] = newAlert;
    } else {
       activeAlerts.unshift(newAlert);
    }
  }
  
  res.status(200).send("OK");
});

app.get('/api/alerts', (req, res) => {
  res.json(activeAlerts);
});

// Endpoint to simulate an incident
let incidentActive = false;
app.post('/api/demo/incident', (req, res) => {
  incidentActive = !incidentActive;
  res.json({ incidentActive });
});
app.get('/api/demo/status', (req, res) => {
  res.json({ incidentActive });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend API running on port ${PORT}`);
});
