import kagglehub
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
from sklearn.preprocessing import StandardScaler
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.naive_bayes import GaussianNB
from sklearn.linear_model import LogisticRegression
import joblib
import os

def load_data():
    """Download and load the dataset."""
    print("Downloading/Loading dataset...")
    path = kagglehub.dataset_download("atharvaingle/crop-recommendation-dataset")
    csv_path = os.path.join(path, "crop_recommendation.csv")
    df = pd.read_csv(csv_path)
    return df

def preprocess_data(df):
    """Split data and scale features."""
    features = df.drop('label', axis=1)
    labels = df['label']
    
    x_train, x_test, y_train, y_test = train_test_split(features, labels, test_size=0.2, random_state=42)
    
    scaler = StandardScaler()
    x_train_scaled = scaler.fit_transform(x_train)
    x_test_scaled = scaler.transform(x_test)
    
    return x_train_scaled, x_test_scaled, y_train, y_test, scaler

def train_evaluate_models(x_train, y_train, x_test, y_test):
    """Train multiple models and evaluate them."""
    models = {
        'Decision Tree': DecisionTreeClassifier(criterion='entropy', max_depth=5, random_state=42),
        'Random Forest': RandomForestClassifier(n_estimators=20, random_state=42),
        'Gaussian Naive Bayes': GaussianNB(),
        'Logistic Regression': LogisticRegression(random_state=42, max_iter=1000)
    }
    
    results = {}
    best_model = None
    best_acc = 0.0
    best_model_name = ""

    print("\nTraining Models:")
    for name, model in models.items():
        model.fit(x_train, y_train)
        predictions = model.predict(x_test)
        acc = accuracy_score(y_test, predictions)
        results[name] = acc
        print(f"{name}: {acc*100:.2f}%")
        
        if acc > best_acc:
            best_acc = acc
            best_model = model
            best_model_name = name
            
    return results, best_model, best_model_name

def save_artifacts(model, scaler, model_name='best_model.pkl', scaler_name='scaler.pkl'):
    """Save the trained model and scaler."""
    print(f"\nSaving best model ({model_name}) and scaler...")
    joblib.dump(model, model_name)
    joblib.dump(scaler, scaler_name)
    print("Artifacts saved successfully.")

def plot_results(results):
    """Plot model accuracy comparison."""
    plt.figure(figsize=(10, 5))
    plt.bar(results.keys(), results.values())
    plt.title('Model Accuracy Comparison')
    plt.ylabel('Accuracy')
    plt.ylim(0, 1)
    plt.grid(True, axis='y')
    plt.show()

def get_user_input():
    """Get crop details from user for prediction."""
    print("\n--- Predict Custom Crop ---")
    try:
        N = float(input("nitrogen content (N): "))
        P = float(input("phosphorous content (P): "))
        K = float(input("potassium content (K): "))
        temperature = float(input("temperature (C): "))
        humidity = float(input("humidity (%): "))
        ph = float(input("ph: "))
        rainfall = float(input("rainfall (mm): "))
        
        return np.array([[N, P, K, temperature, humidity, ph, rainfall]])
    except ValueError:
        print("Invalid input. Please enter numbers.")
        return None

def main():
    df = load_data()
    
    x_train, x_test, y_train, y_test, scaler = preprocess_data(df)
    
    results, best_model, best_model_name = train_evaluate_models(x_train, y_train, x_test, y_test)
    
    save_artifacts(best_model, scaler)
    
    while True:
        choice = input("\nDo you want to predict a crop? (y/n): ").lower()
        if choice != 'y':
            break
        
        user_data = get_user_input()
        if user_data is not None:
            # Scale input using the saved scaler
            user_data_scaled = scaler.transform(user_data)
            prediction = best_model.predict(user_data_scaled)
            print(f"Recommended Crop: {prediction[0].upper()}")

if __name__ == "__main__":
    main()
