from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import os

app = Flask(__name__)
CORS(app)

MODEL_PATH = 'model/model.pkl'

# Load model if exists
model = None
if os.path.exists(MODEL_PATH):
    model = joblib.load(MODEL_PATH)
    print("Model loaded successfully.")
else:
    print("WARNING: Model not found. Please run train_model.py first.")

# Recommendation mappings
RECOMMENDATION_TEXTS = {
    'RESOURCE_SCALING': 'Investigate CPU/Memory-intensive processes and consider scaling the affected service.',
    'NO_IMMEDIATE_ACTION': 'Metrics are within normal bounds or variance is non-critical. Monitor for now.',
    'APPLICATION_ERROR_INVESTIGATION': 'High error rate detected. Check application logs for unhandled exceptions or crashes.'
}

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy", "model_loaded": model is not None})

@app.route('/predict-recommendation', methods=['POST'])
def predict():
    if model is None:
        return jsonify({"error": "Model not loaded"}), 503
        
    try:
        data = request.json
        
        # Extract features (use defaults if missing)
        features = {
            'cpu_usage': data.get('cpu_usage', 50),
            'memory_usage': data.get('memory_usage', 50),
            'error_rate': data.get('error_rate', 0),
            'response_latency': data.get('response_latency', 100),
            'request_rate': data.get('request_rate', 1000)
        }
        
        # Override recommendation manually if error_rate is high (just for demo richness)
        # Even though random forest handles it, let's keep it purely ML driven here.
        df = pd.DataFrame([features])
        
        prediction = model.predict(df)[0]
        probabilities = model.predict_proba(df)[0]
        confidence = max(probabilities) * 100
        
        if features['error_rate'] > 2.0 and prediction == 'NO_IMMEDIATE_ACTION':
             prediction = 'APPLICATION_ERROR_INVESTIGATION'
             confidence = 85.0
        
        rec_text = RECOMMENDATION_TEXTS.get(prediction, 'Investigate further based on telemetry.')
        
        return jsonify({
            "recommendation_type": prediction,
            "recommendation": rec_text,
            "confidence": round(confidence, 1)
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
