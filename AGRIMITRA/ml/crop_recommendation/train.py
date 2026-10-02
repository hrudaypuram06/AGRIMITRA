import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import pickle
import os

def generate_mock_data():
    # Provide a simple mock dataset since we don't have a real one
    np.random.seed(42)
    data = []
    crops = ['Rice', 'Maize', 'Groundnut', 'Tomato', 'Potato']
    for _ in range(500):
        n = np.random.randint(20, 140)
        p = np.random.randint(10, 80)
        k = np.random.randint(15, 60)
        temp = np.random.uniform(20.0, 35.0)
        humidity = np.random.uniform(40.0, 95.0)
        ph = np.random.uniform(5.5, 7.5)
        rainfall = np.random.uniform(50.0, 300.0)
        crop = np.random.choice(crops)
        data.append([n, p, k, temp, humidity, ph, rainfall, crop])
    
    df = pd.DataFrame(data, columns=['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall', 'crop'])
    df.to_csv('dataset.csv', index=False)
    return df

def train_model():
    print("Loading/generating dataset...")
    if not os.path.exists('dataset.csv'):
        df = generate_mock_data()
    else:
        df = pd.read_csv('dataset.csv')
    
    X = df.drop('crop', axis=1)
    y = df['crop']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("Training Random Forest...")
    clf = RandomForestClassifier(n_estimators=100, random_state=42)
    clf.fit(X_train, y_train)
    
    score = clf.score(X_test, y_test)
    print(f"Model accuracy: {score:.2f}")
    
    with open('crop_model.pkl', 'wb') as f:
        pickle.dump(clf, f)
    print("Model saved to crop_model.pkl")

if __name__ == "__main__":
    train_model()
