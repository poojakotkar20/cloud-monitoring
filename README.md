# Observability Platform - Sprint 1 Demo

This is a prototype / Sprint-1 demonstration for the Observability Platform project.

## Purpose
This platform aims to provide a unified dashboard for monitoring microservices, viewing logs, analyzing metrics, tracing requests, and receiving alerts. This prototype demonstrates the core UI/UX and architecture for the first 50% of the project.

## Implemented Features (Sprint 1)
- **Authentication**: Professional login screen (simulated).
- **Dashboard Overview**: Summary of system health, active services, error rates, and request traffic.
- **Service Directory**: List of monitored microservices with individual health status and performance metrics.
- **Service Details**: Deep-dive into a specific service showing latency charts, recent alerts, and logs.
- **Logs Explorer**: Real-time log view with filtering by level, service, and search queries.
- **Metrics Dashboard**: Visualizations for CPU, Memory, Request Rates, and Latency across different time ranges.
- **Distributed Tracing**: Visual flow of requests across multiple services with duration and status tracking.
- **Alerts Management**: Acknowledgment and resolution workflow for system anomalies.
- **AI Assistant**: Prototype interface for querying observability data (mocked responses for Sprint 1).
- **Architecture ready**: Data models and TypeScript types are separated to allow easy integration with a real backend later.

## Limitations / Simulated Features
- Currently, telemetry data (logs, traces, metrics, alerts) is **mocked** locally. 
- The AI Assistant is pre-programmed with mock responses and does not yet connect to an LLM or RAG pipeline.
- Authentication accepts the specific demo credentials below and doesn't connect to a real identity provider.

## Demo Login
- **Email:** `demo@observability.local`
- **Password:** `demo123`

## Running the Project

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Build for production
npm run build
```

## Future Work (Sprint 2 - Remaining 50%)
- Real-time telemetry ingestion via API.
- Integration with OpenTelemetry.
- Connect to a real database for historical metrics and logs.
- Real backend API for authentication and services data.
- Live Distributed Tracing implementation.
- Real AI/LLM integration with RAG over observability data.
- User Management & RBAC (Role-Based Access Control).
- Advanced Alerting Rules engine.

## Technology Stack
- **Frontend Framework:** React 18
- **Language:** TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router (v6)
- **Charts:** Recharts
- **Icons:** Lucide React
