import sys
import os
import tensorflow as tf
from tensorflow.keras.applications import EfficientNetB3
from tensorflow.keras.applications.efficientnet import preprocess_input, decode_predictions
import numpy as np
from PIL import Image

# Suppress TensorFlow logs
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"

# Load EfficientNetB3 Model (higher accuracy than MobileNetV2)
model = EfficientNetB3(weights="imagenet")

def classify_image(image_path):
    try:
        if not os.path.exists(image_path):
            print("Error: File not found.")
            sys.exit(1)

        # Load & preprocess image
        image = Image.open(image_path).convert("RGB").resize((300, 300))  # Adjusted size for EfficientNet
        image_array = np.array(image, dtype=np.float32)
        image_array = np.expand_dims(image_array, axis=0)  # Add batch dimension
        image_array = preprocess_input(image_array)  # Normalize

        # Predict
        predictions = model.predict(image_array)
        decoded_predictions = decode_predictions(predictions, top=3)[0]  # Get top 3 predictions

        return [(label, confidence * 100) for (_, label, confidence) in decoded_predictions]

    except Exception as e:
        print(f"Error: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python classify.py <image_path>")
        sys.exit(1)

    image_path = sys.argv[1]
    results = classify_image(image_path)

    print("\n--- Classification Result ---")
    for i, (label, confidence) in enumerate(results, 1):
        print(f"{i}. {label} - {confidence:.2f}%")
