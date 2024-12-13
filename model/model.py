import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
import pickle

# Load the Excel file
data = pd.read_excel('E:\FYP - MVP\Model\data.xlsx')

# Extract English and PSL columns
english_sentences = data['English'].values  # Input sentences
psl_sentences = data['PSL'].values  # PSL translations

# Tokenize the English sentences
english_tokenizer = Tokenizer()
english_tokenizer.fit_on_texts(english_sentences)
english_sequences = english_tokenizer.texts_to_sequences(english_sentences)
english_vocab_size = len(english_tokenizer.word_index) + 1  # Add 1 for padding

# Tokenize the PSL sentences
psl_tokenizer = Tokenizer()
psl_tokenizer.fit_on_texts(psl_sentences)
psl_sequences = psl_tokenizer.texts_to_sequences(psl_sentences)
psl_vocab_size = len(psl_tokenizer.word_index) + 1  # Add 1 for padding

# Pad the sequences to ensure uniform input size
max_seq_length = max(max(len(seq) for seq in english_sequences),
                     max(len(seq) for seq in psl_sequences))

english_padded = pad_sequences(english_sequences, maxlen=max_seq_length, padding='post')
psl_padded = pad_sequences(psl_sequences, maxlen=max_seq_length, padding='post')

# Split data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(
    english_padded, psl_padded, test_size=0.2, random_state=42
)


print("preprocessing_successful")

from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Embedding, Bidirectional, GRU, Dense, TimeDistributed

# Define the BiGRU model
model = Sequential([
    Embedding(input_dim=english_vocab_size, output_dim=100, input_length=max_seq_length),
    Bidirectional(GRU(128, return_sequences=True)),
    TimeDistributed(Dense(psl_vocab_size, activation='softmax'))
])

model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])
model.summary()

print("model building successful")

# Reshape y_train and y_test for the TimeDistributed layer
y_train = np.expand_dims(y_train, -1)
y_test = np.expand_dims(y_test, -1)

# Train the model
history = model.fit(
    X_train, y_train,
    epochs=10,
    batch_size=32,
    validation_data=(X_test, y_test)
)


print("model training successful")

loss, accuracy = model.evaluate(X_test, y_test)
print(f"Test Loss: {loss:.4f}")
print(f"Test Accuracy: {accuracy:.4f}")

print("model evaluation successful")


model.save_weights('model_weights.weights.h5')


# Save English tokenizer
with open('english_tokenizer.pkl', 'wb') as file:
    pickle.dump(english_tokenizer, file)

# Save PSL tokenizer
with open('psl_tokenizer.pkl', 'wb') as file:
    pickle.dump(psl_tokenizer, file)

print("Tokenizers saved successfully!")
