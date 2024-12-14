import torch
from torch.utils.data import Dataset, DataLoader
from transformers import T5Tokenizer, T5ForConditionalGeneration
from transformers import AdamW
import pandas as pd
from tqdm import tqdm

# Load the Excel file
file_path = 'E:/FYP - MVP/Model/data.xlsx'  # Replace with your file path
sheet_name = 0  # Replace with your sheet name or index if needed

# Read the Excel file
df = pd.read_excel(file_path, sheet_name=sheet_name)

# Assuming the first column contains English sentences and the second contains PSL sentences
column1 = 'English'  # Replace with your actual column name
column2 = 'PSL'      # Replace with your actual column name

# Convert to a list of dictionaries in the required format
data_list = [{'en': en, 'psl': psl} for en, psl in zip(df[column1], df[column2])]

# Initialize the model and tokenizer
model_name = "t5-small"  # You can use t5-base or t5-large for larger models
model = T5ForConditionalGeneration.from_pretrained(model_name)
tokenizer = T5Tokenizer.from_pretrained(model_name)

# Set parameters
max_input_length = 128
max_target_length = 128
source_lang = "en"
target_lang = "psl"


# Preprocess function
def preprocess_function(examples):
    inputs = [ex[source_lang] for ex in examples]
    targets = [ex[target_lang] for ex in examples]
    model_inputs = tokenizer(inputs, max_length=max_input_length, truncation=True, padding="max_length", return_tensors="pt")

    # Setup the tokenizer for targets
    with tokenizer.as_target_tokenizer():
        labels = tokenizer(targets, max_length=max_target_length, truncation=True, padding="max_length", return_tensors="pt")

    model_inputs["labels"] = labels["input_ids"]
    return model_inputs


# Custom Dataset class for PyTorch
class TranslationDataset(Dataset):
    def __init__(self, data, tokenizer, max_input_length=128, max_target_length=128):
        self.data = data
        self.tokenizer = tokenizer
        self.max_input_length = max_input_length
        self.max_target_length = max_target_length

    def __len__(self):
        return len(self.data)

    def __getitem__(self, idx):
        example = self.data[idx]
        return preprocess_function([example])


# Create the Dataset and DataLoader
train_dataset = TranslationDataset(data_list, tokenizer)
train_dataloader = DataLoader(train_dataset, batch_size=16, shuffle=True)

# Set up optimizer and model
optimizer = AdamW(model.parameters(), lr=5e-5)

# Training loop
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

num_epochs = 1

for epoch in range(num_epochs):
    model.train()
    progress_bar = tqdm(train_dataloader, desc=f"Epoch {epoch+1}")
    total_loss = 0

    for batch in progress_bar:
        # Move tensors to the correct device (GPU or CPU)
        input_ids = batch['input_ids'].squeeze(1).to(device)  # Remove unnecessary batch dimension
        attention_mask = batch['attention_mask'].squeeze(1).to(device)  # Remove unnecessary batch dimension
        labels = batch['labels'].squeeze(1).to(device)  # Remove unnecessary batch dimension

        optimizer.zero_grad()

        # Forward pass
        outputs = model(input_ids=input_ids, attention_mask=attention_mask, labels=labels)
        loss = outputs.loss

        # Backward pass
        loss.backward()
        optimizer.step()

        total_loss += loss.item()
        progress_bar.set_postfix(loss=total_loss / (progress_bar.n + 1))

    print(f"Epoch {epoch+1} - Loss: {total_loss / len(train_dataloader)}")

# Save the model
model.save_pretrained("t5_model_pytorch")
