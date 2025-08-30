document.addEventListener('DOMContentLoaded', () => {
    const qnaBtn = document.getElementById('btn-qna');
    const summarizeBtn = document.getElementById('btn-summarize');
    const creativeBtn = document.getElementById('btn-creative');
    const inputPrompt = document.getElementById('input-prompt');
    const userInput = document.getElementById('user-input');
    const submitBtn = document.getElementById('submit-btn');
    const resultsDiv = document.getElementById('results');
    const feedbackYesBtn = document.getElementById('btn-feedback-yes');
    const feedbackNoBtn = document.getElementById('btn-feedback-no');

    let currentFunction = 'qna';

    // Event listeners for function buttons
    qnaBtn.addEventListener('click', () => switchFunction('qna'));
    summarizeBtn.addEventListener('click', () => switchFunction('summarize'));
    creativeBtn.addEventListener('click', () => switchFunction('creative'));

    function switchFunction(func) {
        document.querySelectorAll('.function-buttons button').forEach(btn => btn.classList.remove('active'));
        document.getElementById(`btn-${func}`).classList.add('active');
        currentFunction = func;
        const prompts = {
            qna: 'Enter your question:',
            summarize: 'Paste text to summarize:',
            creative: 'Enter a topic for creative writing:',
        };
        inputPrompt.textContent = prompts[func];
        userInput.value = '';
    }

    // Handle submit button click
    submitBtn.addEventListener('click', async () => {
        const query = userInput.value;
        if (query.trim() === '') {
            alert('Please enter some text.');
            return;
        }
        
        resultsDiv.innerHTML = '<p>Generating responses...</p>';

        try {
            const response = await fetch('http://127.0.0.1:5000/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ function: currentFunction, query: query })
            });
            const data = await response.json();

            if (data.error) {
                resultsDiv.innerHTML = `<p class="error-message">Error: ${data.error}</p>`;
            } else {
                displayResults(data.results);
            }
        } catch (error) {
            resultsDiv.innerHTML = `<p class="error-message">Failed to connect to the server. Make sure the back-end is running.</p>`;
        }
    });

    function displayResults(results) {
        resultsDiv.innerHTML = '';
        if (Object.keys(results).length === 0) {
            resultsDiv.innerHTML = '<p>No results found.</p>';
            return;
        }

        for (const [key, value] of Object.entries(results)) {
            const block = document.createElement('div');
            block.className = 'result-block';
            block.innerHTML = `<h4>${key}:</h4><p>${value}</p>`;
            resultsDiv.appendChild(block);
        }
    }

    // Feedback loop logic
    feedbackYesBtn.addEventListener('click', () => alert('Thank you for your feedback! Glad it was helpful.'));
    feedbackNoBtn.addEventListener('click', () => alert('Noted. Your feedback will help us improve.'));
});