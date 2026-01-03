import os
import joblib
import numpy as np
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load artifacts
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'ml_model', 'best_model.pkl')
SCALER_PATH = os.path.join(os.path.dirname(__file__), 'ml_model', 'scaler.pkl')

print(f"Loading model from {MODEL_PATH}...")
try:
    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)
    print("Model and scaler loaded successfully.")
except Exception as e:
    print(f"Error loading artifacts: {e}")
    model = None
    scaler = None

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "service": "Crop Recommendation Backend"})

@app.route('/predict', methods=['POST'])
def predict():
    if not model or not scaler:
        return jsonify({"error": "Model not loaded"}), 500

    try:
        data = request.get_json()
        required_fields = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
        
        if not all(field in data for field in required_fields):
            return jsonify({"error": f"Missing fields. Required: {required_fields}"}), 400
            
        input_df = pd.DataFrame([{
            "N": float(data["N"]),
            "P": float(data["P"]),
            "K": float(data["K"]),
            "temperature": float(data["temperature"]),
            "humidity": float(data["humidity"]),
            "ph": float(data["ph"]),
            "rainfall": float(data["rainfall"])
        }])
        
        # Scale and predict
        input_scaled = scaler.transform(input_df)
        prediction = model.predict(input_scaled)
        
        return jsonify({
            "success": True,
            "crop": prediction[0],
            "input_received": data
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000, host='0.0.0.0')
