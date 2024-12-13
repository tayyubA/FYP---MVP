import pickle
import numpy as np
from flask import Flask, request, jsonify, render_template
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Embedding, Bidirectional, GRU, Dense, TimeDistributed
from tensorflow.keras.preprocessing.sequence import pad_sequences

app = Flask(__name__)

# Load the pre-trained model weights

# Load English tokenizer
with open('english_tokenizer.pkl', 'rb') as file:
    english_tokenizer = pickle.load(file)

# Load PSL tokenizer
with open('psl_tokenizer.pkl', 'rb') as file:
    psl_tokenizer = pickle.load(file)

print("Tokenizers loaded successfully!")

max_seq_length = 50  # Set this to the same value used in training

english_vocab_size = len(english_tokenizer.word_index) + 1
psl_vocab_size = len(psl_tokenizer.word_index) + 1

model = Sequential([
    Embedding(input_dim=english_vocab_size, output_dim=100, input_length=max_seq_length),
    Bidirectional(GRU(128, return_sequences=True)),
    TimeDistributed(Dense(psl_vocab_size, activation='softmax'))
])

model.load_weights('model_weights.weights.h5')

# Define a function to translate the input sentence
def translate_sentence(input_sentence):
    # Tokenize and pad the input English sentence
    sequence = english_tokenizer.texts_to_sequences([input_sentence])
    padded_input = pad_sequences(sequence, maxlen=max_seq_length, padding='post')

    # Predict the translation (PSL)
    prediction = model.predict(padded_input)

    # Convert the prediction (PSL) sequence back to words
    translated_sentence = []
    for word_index in np.argmax(prediction, axis=-1)[0]:
        word = psl_tokenizer.index_word.get(word_index, '')
        if word != '':
            translated_sentence.append(word)

    return ' '.join(translated_sentence)

@app.route('/')
def index():
    return render_template('index.html')

# Create an endpoint for the translation
@app.route('/translate', methods=['POST'])
def predict():
    try:
        # Get the sentence from the incoming JSON request
        data = request.json
        input_sentence = data.get('sentence')

        if not input_sentence:
            return jsonify({"error": "No sentence provided"}), 400

        # Translate the sentence
        translated_sentence = translate_sentence(input_sentence)

        # Return the translation as a JSON response
        return jsonify({'translation': translated_sentence})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
