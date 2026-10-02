import tensorflow as tf
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D
from tensorflow.keras.models import Model
import os

def create_model(num_classes):
    base_model = MobileNetV2(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
    
    # Freeze base model
    for layer in base_model.layers:
        layer.trainable = False
        
    x = base_model.output
    x = GlobalAveragePooling2D()(x)
    x = Dense(128, activation='relu')(x)
    predictions = Dense(num_classes, activation='softmax')(x)
    
    model = Model(inputs=base_model.input, outputs=predictions)
    model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
    return model

def train_model():
    print("Setting up MobileNetV2 for Transfer Learning...")
    # In a real scenario, this would use ImageDataGenerator and real images.
    # We will just compile and save the untrained model to demonstrate the architecture.
    
    num_classes = 10 # Example: 10 different disease classes
    model = create_model(num_classes)
    
    # Mock training step (skipped for MVP - just saving architecture)
    print("Mock: Training on PlantVillage dataset (skipped for demo)")
    
    model.save('disease_model.keras')
    print("Model saved to disease_model.keras")

if __name__ == "__main__":
    train_model()
