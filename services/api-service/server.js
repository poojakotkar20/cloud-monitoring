import express from 'express';
import promClient from 'prom-client';
import axios from 'axios';

const app = express();
const SERVICE_NAME = process.env.SERVICE_NAME || 'api-service';
const PORT = process.env.PORT || 4000;
const BACKEND_URL = process.env.BACKEND_URL || 'http://backend:3000';

// Prometheus metrics setup
const collectDefaultMetrics = promClient.collectDefaultMetrics;
const Registry = promClient.Registry;
const register = new Registry();
collectDefaultMetrics({ register, prefix: `${SERVICE_NAME.replace(/-/g, '_')}_` });

const httpRequestDurationMicroseconds = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
});
register.registerMetric(httpRequestDurationMicroseconds);

const LOKI_URL = process.env.LOKI_URL || 'http://loki:3100';

async function sendToLoki(level, message) {
  const logStr = JSON.stringify({ level, message, service: SERVICE_NAME });
  console.log(logStr);
  
  try {
    await axios.post(`${LOKI_URL}/loki/api/v1/push`, {
      streams: [{
        stream: { job: SERVICE_NAME, level: level },
        values: [[(Date.now() * 1000000).toString(), logStr]]
      }]
    });
  } catch(e) {}
}

// Simulate activity
setInterval(async () => {
  try {
    let incident = false;
    try {
       const st = await axios.get(`${BACKEND_URL}/api/demo/status`);
       incident = st.data.incidentActive;
    } catch(e) {}
    
    if (incident) {
       sendToLoki('error', 'High CPU detected. Request failed.');
       const end = httpRequestDurationMicroseconds.startTimer();
       setTimeout(() => end({ method: 'GET', route: '/api/data', code: 500 }), 2000);
    } else {
       sendToLoki('info', 'Handled request successfully');
       const end = httpRequestDurationMicroseconds.startTimer();
       end({ method: 'GET', route: '/api/data', code: 200 });
    }
  } catch (err) {}
}, 5000);

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

app.get('/health', (req, res) => {
  res.send('OK');
});

app.listen(PORT, () => {
  console.log(JSON.stringify({ level: 'info', message: `${SERVICE_NAME} started on port ${PORT}` }));
});
