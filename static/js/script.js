document.getElementById('translate-btn').addEventListener('click', function () {
    processRequest('/translate', { sentence: document.getElementById('sentence').value });
});

document.getElementById('fetch-hamnosys-btn').addEventListener('click', function () {
    processRequest('/hamnosys', { word: document.getElementById('sentence').value });
});

function processRequest(url, body) {
    // Disable the buttons while processing
    const translateButton = document.getElementById('translate-btn');
    const hamnosysButton = document.getElementById('fetch-hamnosys-btn');
    translateButton.disabled = true;
    hamnosysButton.disabled = true;
    translateButton.innerHTML = 'Translating...';
    hamnosysButton.innerHTML = 'Fetching...';

    // Clear previous result
    document.getElementById('result-output').textContent = '';

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    })
    .then(response => response.json())
    .then(data => {
        if (data.translation) {
            document.getElementById('result-output').textContent = 'PSL Translation: ' + data.translation;
        } else if (data.hamnosys) {
            document.getElementById('result-output').textContent = 'Hamnosys Representation: ' + data.hamnosys;
        } else {
            document.getElementById('result-output').textContent = "Error: " + data.error;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('result-output').textContent = "Error occurred while processing.";
    })
    .finally(() => {
        translateButton.disabled = false;
        hamnosysButton.disabled = false;
        translateButton.innerHTML = 'Translate to PSL';
        hamnosysButton.innerHTML = 'Fetch HamNoSys';
    });
}