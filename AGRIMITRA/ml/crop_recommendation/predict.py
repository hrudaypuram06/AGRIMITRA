import pickle
import numpy as np
import os

model_path = os.path.join(os.path.dirname(__file__), 'crop_model.pkl')
clf = None

def load_model():
    global clf
    if os.path.exists(model_path):
        with open(model_path, 'rb') as f:
            clf = pickle.load(f)

def predict_crop(n, p, k, temp, humidity, ph, rainfall):
    if clf is None:
        load_model()
        if clf is None:
            return "Rice", 0.85 # Fallback if model not trained
    
    features = np.array([[n, p, k, temp, humidity, ph, rainfall]])
    prediction = clf.predict(features)[0]
    probabilities = clf.predict_proba(features)[0]
    confidence = np.max(probabilities)
    
    return prediction, float(confidence)
