import torch
from flask import Flask, request, jsonify, render_template
from transformers import T5Tokenizer, T5ForConditionalGeneration
from pymongo import MongoClient
import pandas as pd

app = Flask(__name__)

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")  # Adjust URI if needed
db = client["sign_language_db"]  # Your database name
collection = db["hamnosys"]  # Your collection name

file_path = "hamnosys.xlsx"  # Replace with the actual path to your .xlsx file
df = pd.read_excel(file_path)

# Ensure the file has columns named 'word' and 'hamnosys'
if 'Words' not in df.columns or 'Hamnosys' not in df.columns:
    print("The Excel file must have 'Words' and 'Hamnosys' columns.")
else:
    # Convert rows to dictionaries and insert into MongoDB
    records = df.to_dict(orient="records")
    result = collection.insert_many(records)
    print(f"Inserted {len(result.inserted_ids)} documents into MongoDB.")


# Define model and tokenizer paths
MODEL_DIR = "t5_model_pytorch"  # Path to the saved model and tokenizer

# Load the tokenizer and model
print("Loading model and tokenizer...")
tokenizer = T5Tokenizer.from_pretrained(MODEL_DIR)
model = T5ForConditionalGeneration.from_pretrained(MODEL_DIR)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)
print("Model and tokenizer loaded successfully!")

# Define a function to translate input text to PSL
def translate_sentence(input_sentence):
    try:
        # Tokenize and encode input
        inputs = tokenizer(
            input_sentence,
            max_length=128,
            truncation=True,
            padding="max_length",
            return_tensors="pt"
        ).to(device)

        # Generate translation
        outputs = model.generate(
            input_ids=inputs["input_ids"],
            attention_mask=inputs["attention_mask"],
            max_length=128,
            num_beams=4,
            early_stopping=True
        )

        # Decode the generated tokens to text
        translated_sentence = tokenizer.decode(outputs[0], skip_special_tokens=True)
        return translated_sentence

    except Exception as e:
        print(f"Error during translation: {str(e)}")
        return "Translation failed!"

# Route for translating English sentences to PSL
@app.route('/translate', methods=['POST'])
def translate():
    try:
        # Parse JSON request
        data = request.json
        input_sentence = data.get('sentence')

        if not input_sentence:
            return jsonify({"error": "No sentence provided"}), 400

        # Translate the sentence using the model
        translated_sentence = translate_sentence(input_sentence)

        # Return the result
        return jsonify({'translation': translated_sentence})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
    
    
    

# Function to fetch HamNoSys from MongoDB
def fetch_hamnosys(word):
    try:
        # Search for the word in the MongoDB collection
        db_entry = collection.find_one({"Words": word.lower()})
        if db_entry:
            return db_entry["Hamnosys"]
        else:
            return None
    except Exception as e:
        print(f"Error fetching HamNoSys: {str(e)}")
        return None
    
    
    
    
    

# Route for fetching HamNoSys representation
@app.route('/hamnosys', methods=['POST'])
def hamnosys():
    try:
        # Parse JSON request
        data = request.json
        word = data.get('word')

        if not word:
            return jsonify({"error": "No word provided"}), 400

        # Fetch HamNoSys representation from MongoDB
        hamnosys_representation = fetch_hamnosys(word)

        if hamnosys_representation:
            return jsonify({"hamnosys": hamnosys_representation})
        else:
            return jsonify({"error": "Word not found in database"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
    
    
    
    

@app.route('/')
def index():
    return render_template('index.html')  # Replace with your HTML file for the interface

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
