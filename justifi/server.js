const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/chat', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    // For legal questions, we'll use a specific model and prompt
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    // Create a prompt with legal context and formatting instructions
    const fullPrompt = `Act as a legal AI assistant named Juris. You specialize in US federal law and legal consultation.
    
    Answer this legal question with accurate information based on US federal law. 
    Include references to relevant statutes or case law when appropriate.
    
    Format your response with these guidelines:
    - Use clear headings with ## for main sections
    - Use bullet points for lists
    - Bold important terms or case names using **bold text**
    - Keep paragraphs short and focused
    - Use line breaks between paragraphs
    - When citing laws, use a clear format like: *42 U.S. Code § 3601*
    
    Question: ${prompt}`;
    
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();
    
    res.json(text);
  } catch (error) {
    console.error('Error with Gemini API:', error);
    res.status(500).json({ error: 'An error occurred while processing your request' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});