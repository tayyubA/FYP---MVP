import torch
from flask import Flask, request, jsonify, render_template
from transformers import T5Tokenizer, T5ForConditionalGeneration

# Initialize Flask app
app = Flask(__name__)

# Define model and tokenizer paths
MODEL_DIR = "t5_model_pytorch"  # Path to the saved model and tokenizer

# Load the tokenizer and model
print("Loading model and tokenizer...")
tokenizer = T5Tokenizer.from_pretrained(MODEL_DIR)
model = T5ForConditionalGeneration.from_pretrained(MODEL_DIR)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)
print("Model and tokenizer loaded successfully!")

# Define a function to translate input text
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
            num_beams=4,  # Adjust beam size for better translations if needed
            early_stopping=True
        )

        # Decode the generated tokens to text
        translated_sentence = tokenizer.decode(outputs[0], skip_special_tokens=True)
        return translated_sentence

    except Exception as e:
        print(f"Error during translation: {str(e)}")
        return "Translation failed!"

@app.route('/')
def index():
    return render_template('index.html')  # Replace with your HTML file for the interface

# Endpoint to handle translation requests
@app.route('/translate', methods=['POST'])
def translate():
    try:
        # Parse JSON request
        data = request.json
        input_sentence = data.get('sentence')

        if not input_sentence:
            return jsonify({"error": "No sentence provided"}), 400

        # Translate the sentence
        translated_sentence = translate_sentence(input_sentence)

        # Return the result
        return jsonify({'translation': translated_sentence})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001) 
