import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from transformers import TFAutoModelForSeq2SeqLM, AutoTokenizer
import tensorflow as tf

# Load the Excel file
data = pd.read_excel('E:/FYP - MVP/Model/data.xlsx')

# Ensure there are no missing values in English and PSL columns
data = data.dropna(subset=['English', 'PSL'])

# Extract English and PSL columns
english_sentences = data['English'].values  # Input sentences
psl_sentences = data['PSL'].values  # PSL translations

# Initialize a transformer model and tokenizer
model_name = 'Helsinki-NLP/opus-mt-en-ro'  # Replace this with your preferred transformer model
model = TFAutoModelForSeq2SeqLM.from_pretrained(model_name)
tokenizer = AutoTokenizer.from_pretrained(model_name)

# Tokenize the English and PSL sentences using Hugging Face's AutoTokenizer
max_seq_length = max(max(len(sentence.split()) for sentence in english_sentences),
                     max(len(sentence.split()) for sentence in psl_sentences))

# Tokenize both input (English) and output (PSL) sequences with padding and truncation
input_encodings = tokenizer(english_sentences.tolist(), padding=True, truncation=True, max_length=max_seq_length, return_tensors="tf")
output_encodings = tokenizer(psl_sentences.tolist(), padding=True, truncation=True, max_length=max_seq_length, return_tensors="tf")

# Ensure the number of samples in both input and output are the same
assert len(input_encodings['input_ids']) == len(output_encodings['input_ids']), \
    f"Input and Output tokenized samples are not matching: {len(input_encodings['input_ids'])} != {len(output_encodings['input_ids'])}"

# Convert to TensorFlow tensors
input_ids = tf.convert_to_tensor(input_encodings['input_ids'])
attention_mask = tf.convert_to_tensor(input_encodings['attention_mask'])
output_ids = tf.convert_to_tensor(output_encodings['input_ids'])

# Check shapes before the split to ensure consistency
assert input_ids.shape[0] == output_ids.shape[0], \
    f"Input and Output tokenized samples are not matching after conversion to tensors: {input_ids.shape[0]} != {output_ids.shape[0]}"

# Split data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(
    input_ids.numpy(), output_ids.numpy(), test_size=0.2, random_state=42
)

# Convert back to tensors after splitting
X_train = tf.convert_to_tensor(X_train)
X_test = tf.convert_to_tensor(X_test)
y_train = tf.convert_to_tensor(y_train)
y_test = tf.convert_to_tensor(y_test)

# Ensure the number of samples in the training sets are the same
assert X_train.shape[0] == y_train.shape[0], \
    f"Training data mismatch: X_train has {X_train.shape[0]} samples but y_train has {y_train.shape[0]} samples"

# Ensure attention_mask is split correctly and aligned with input data
attention_mask_train, attention_mask_test = train_test_split(
    attention_mask.numpy(), test_size=0.2, random_state=42
)

# Convert attention mask back to tensor after splitting
attention_mask_train = tf.convert_to_tensor(attention_mask_train)
attention_mask_test = tf.convert_to_tensor(attention_mask_test)

# Create decoder_input_ids by shifting the output sequence (y_train and y_test) by one token
# For decoder, shift output tokens by one position
decoder_input_ids_train = y_train[:, :-1]  # Remove last token of y_train to create decoder input
decoder_input_ids_test = y_test[:, :-1]  # Remove last token of y_test to create decoder input

# Ensure target sequences have the correct shape for loss calculation
# Now the target for loss is y_train, which includes the entire target sequence.
decoder_target_ids_train = y_train[:, 1:]  # Target sequence for the model (shifted one position to the left)
decoder_target_ids_test = y_test[:, 1:]  # Target sequence for the model (shifted one position to the left)

# Define the model
model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])

# Training loop to handle padding and input-output format issues
history = model.fit(
    {'input_ids': X_train, 'attention_mask': attention_mask_train, 'decoder_input_ids': decoder_input_ids_train},  # Input: input_ids, attention_mask, and decoder_input_ids
    decoder_target_ids_train,  # Labels as token sequences
    epochs=10,
    batch_size=32,
    validation_data=(
        {'input_ids': X_test, 'attention_mask': attention_mask_test, 'decoder_input_ids': decoder_input_ids_test},  # Validation input
        decoder_target_ids_test  # Validation labels as token sequences
    )
)

# Model evaluation
loss, accuracy = model.evaluate(
    {'input_ids': X_test, 'attention_mask': attention_mask_test, 'decoder_input_ids': decoder_input_ids_test},
    decoder_target_ids_test  # Labels as token sequences
)
print(f"Test Loss: {loss:.4f}")
print(f"Test Accuracy: {accuracy:.4f}")

# Save the model
model.save_weights('qmodel_weights.weights.h5')

# Save the tokenizer
tokenizer.save_pretrained('./tokenizer')

print("Model and tokenizer saved successfully!")
