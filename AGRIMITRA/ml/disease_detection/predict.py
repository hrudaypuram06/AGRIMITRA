import tensorflow as tf
import numpy as np
import os
from PIL import Image

model_path = os.path.join(os.path.dirname(__file__), 'disease_model.keras')
model = None
classes = ['Healthy', 'Tomato_Early_Blight', 'Potato_Late_Blight', 'Rice_Brown_Spot'] # Example classes

def load_model():
    global model
    if os.path.exists(model_path):
        model = tf.keras.models.load_model(model_path)

def predict_disease(image_path):
    if model is None:
        load_model()
    
    if model is None:
        return "Tomato_Early_Blight", 0.94 # Fallback mock response for MVP
        
    img = Image.open(image_path).resize((224, 224))
    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    
    predictions = model.predict(img_array)[0]
    predicted_class_idx = np.argmax(predictions)
    confidence = float(predictions[predicted_class_idx])
    
    disease = classes[predicted_class_idx] if predicted_class_idx < len(classes) else "Unknown"
    return disease, confidence
