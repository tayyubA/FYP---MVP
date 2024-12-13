document.getElementById('translation-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const sentence = document.getElementById('sentence').value;

    // Disable the button while processing
    const button = document.querySelector('button');
    button.disabled = true;
    button.innerHTML = 'Translating...';

    // Clear previous translation result
    document.getElementById('translation-output').textContent = '';

    // Send the input sentence to the backend for translation
    fetch('/translate', {  // Match with Flask route
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sentence: sentence })
    })
    .then(response => response.json())
    .then(data => {
        if (data.translation) {
            // Display the translated sentence
            document.getElementById('translation-output').textContent = data.translation;
        } else {
            // Display the error message
            document.getElementById('translation-output').textContent = "Error: " + data.error;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('translation-output').textContent = "Error occurred while translating.";
    })
    .finally(() => {
        button.disabled = false;
        button.innerHTML = 'Translate';
    });
});
