const axios = require('axios');
require('dotenv').config();

const testChat = async (query) => {
    console.log(`\n--- Testing Chatbot ---`);
    console.log(`Question: ${query}`);
    
    try {
        const response = await axios.post('http://localhost:5000/api/chat', {
            message: query
        });
        
        console.log(`\nResponse:`);
        console.log(response.data.text);
        console.log(`------------------------\n`);
    } catch (error) {
        if (error.code === 'ECONNREFUSED') {
            console.error('Error: Could not connect to the server. Make sure your server is running on port 5000.');
        } else {
            console.error('Error during test:', error.response ? error.response.data : error.message);
        }
    }
};

// Check for GEMINI_API_KEY
if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_actual_key_here') {
    console.warn('WARNING: GEMINI_API_KEY is not set correctly in server/.env');
    console.log('The chatbot might fall back to keyword matching.');
}

// Get question from command line or use default
const question = process.argv.slice(2).join(' ') || 'ሰላም! የአገልግሎት አይነቶችን ንገረኝ?';

testChat(question);
