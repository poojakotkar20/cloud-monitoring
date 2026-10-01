# Observability Platform (Sprint-1 Prototype)

## Project Overview
This project is a 50% milestone prototype of a comprehensive Observability Platform. It is designed to provide developers and DevOps engineers with a "single pane of glass" to monitor the health, performance, and reliability of their microservices architecture.

## Architecture

```text
docker-compose
    |
    ├── frontend (React + Vite + Tailwind CSS)
    ├── backend (Node.js/Express)
    ├── api-service (Sample Service 1)
    ├── auth-service (Sample Service 2)
    ├── worker-service (Sample Service 3)
    ├── prometheus (Metrics Collection)
    ├── loki (Log Collection)
    ├── alertmanager (Alerting)
    └── ml-service (Python + Scikit-Learn)
```

## Technologies
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS (v4), Recharts
- **Backend API**: Node.js, Express
- **Sample Services**: Node.js
- **Machine Learning**: Python, Flask, Scikit-learn (Random Forest)
- **Monitoring Infrastructure**: Prometheus, Loki, Alertmanager
- **Deployment**: Docker, Docker Compose

## How to Start the Project

Make sure you have **Docker Desktop** installed and running.

1. Open your terminal in this directory.
2. Build and start the infrastructure:
   ```bash
   docker compose up --build -d
   ```
3. Access the platform:
   - **Frontend UI**: `http://localhost:5173`
   - **Prometheus**: `http://localhost:9090`
   - **Loki**: `http://localhost:3100`

## How to Stop the Project

```bash
docker compose down
```

## Demo Incident Procedure
To demonstrate the full pipeline (from real metrics to ML recommendation):

1. Open the **Alerts** page in the frontend (`http://localhost:5173/alerts`).
2. Click the red **"Toggle Demo Incident"** button.
3. This signals the `api-service` to intentionally generate errors and simulate high CPU load.
4. Prometheus will detect the metric changes.
5. The Alertmanager will fire a critical alert to the Backend.
6. The Backend queries the **ML Service** to analyze the telemetry data.
7. The ML Service (Random Forest model) returns a recommendation.
8. The new alert, complete with the ML recommendation, automatically appears on the Alerts page!

## ML Recommendation Explanation
*The ML model currently uses a prototype/synthetic training dataset and is intended for Sprint-1 demonstration. Real historical incident data will be used in future iterations.*
The Random Forest Classifier analyzes incoming alert metrics (CPU, Memory, Error Rate, Latency, Request Rate) to categorize the incident and recommend actionable steps to the engineer.
