import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai

# Configure your API key
genai.configure(api_key="AIzaSyDmQnlrmw78BkM9dF4CYttsBUnbIjHbFTE")

# Create Flask app and enable CORS
app = Flask(__name__)
CORS(app)

# Initialize the generative model
model = genai.GenerativeModel('gemini-pro')

def get_ai_response(prompt):
    """Sends a prompt to the Gemini API and returns the response text."""
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return str(e)

@app.route('/api/generate', methods=['POST'])
def generate_content():
    """Handles the API request from the front-end."""
    data = request.json
    function = data.get('function')
    query = data.get('query')

    if not function or not query:
        return jsonify({"error": "Missing function or query"}), 400

    results = {}

    if function == 'qna':
        # Prompt Design 1: Simple
        results['Simple Prompt'] = get_ai_response(f"Answer the question directly: {query}")
        # Prompt Design 2: Specific
        results['Specific Prompt'] = get_ai_response(f"Provide a detailed answer to the question: {query}. Include key facts and figures.")
        # Prompt Design 3: Complex
        results['Complex Prompt'] = get_ai_response(f"As an expert on the topic, provide a comprehensive analysis of '{query}' and suggest related subtopics.")
    
    elif function == 'summarize':
        # Prompt Design 1: General
        results['General Summary'] = get_ai_response(f"Summarize the following text:\n\n{query}")
        # Prompt Design 2: Bullet-point
        results['Bullet-point Summary'] = get_ai_response(f"Create a concise, bullet-point summary of the main arguments in this text:\n\n{query}")
        # Prompt Design 3: Specific Tone
        results['Casual Summary'] = get_ai_response(f"Summarize this text in a casual and friendly tone, as if explaining it to a friend:\n\n{query}")

    elif function == 'creative':
        # Prompt Design 1: Simple
        results['Short Poem'] = get_ai_response(f"Write a very short poem about {query}.")
        # Prompt Design 2: Specific Length/Tone
        results['Short Story'] = get_ai_response(f"Write a 100-word short story about {query} with a mysterious and adventurous tone.")
        # Prompt Design 3: Dialogue
        results['Dialogue'] = get_ai_response(f"Write a dialogue between two characters discussing the topic of {query}. One character is pessimistic, the other is optimistic.")
    
    return jsonify({"results": results})

if __name__ == '__main__':
    app.run(debug=True)