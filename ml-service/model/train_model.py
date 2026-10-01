import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import joblib
import os

# Ensure directories exist
os.makedirs('../model', exist_ok=True)
os.makedirs('../data', exist_ok=True)

# 1. Create Synthetic Training Data
# Features: cpu_usage, memory_usage, error_rate, response_latency, request_rate
data = {
    'cpu_usage': [45, 92, 20, 85, 30, 95, 10, 80, 50, 99],
    'memory_usage': [50, 88, 30, 90, 40, 95, 20, 85, 55, 98],
    'error_rate': [0.1, 4.5, 0.0, 3.2, 0.2, 5.0, 0.0, 2.5, 0.5, 6.0],
    'response_latency': [50, 450, 30, 380, 40, 500, 20, 350, 60, 600],
    'request_rate': [1000, 1500, 500, 2000, 800, 2500, 300, 1800, 1200, 3000],
    'label': [
        'NO_IMMEDIATE_ACTION', 
        'RESOURCE_SCALING', 
        'NO_IMMEDIATE_ACTION', 
        'RESOURCE_SCALING', 
        'NO_IMMEDIATE_ACTION', 
        'RESOURCE_SCALING', 
        'NO_IMMEDIATE_ACTION', 
        'RESOURCE_SCALING', 
        'NO_IMMEDIATE_ACTION', 
        'RESOURCE_SCALING'
    ]
}

df = pd.DataFrame(data)
df.to_csv('../data/alert_training_data.csv', index=False)
print("Created synthetic training dataset at ../data/alert_training_data.csv")

# 2. Train Random Forest Model
X = df[['cpu_usage', 'memory_usage', 'error_rate', 'response_latency', 'request_rate']]
y = df['label']

model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X, y)

# 3. Save the model
joblib.dump(model, '../model/model.pkl')
print("Model trained and saved to ../model/model.pkl")
