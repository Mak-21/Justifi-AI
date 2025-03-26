const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

exports.handler = async function(event, context) {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };
  
  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    // Parse request body
    const { prompt } = JSON.parse(event.body);
    
    console.log("Received prompt:", prompt);
    
    // Initialize Gemini API
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined in environment variables");
    }
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    // Create a prompt with Canadian legal context and formatting instructions
    const fullPrompt = `Act as a legal AI assistant named Juris. You specialize in Canadian law and legal consultation.
    
    Answer this legal question with accurate information based on Canadian federal and provincial laws. 
    Include references to relevant statutes, cases, or regulations when appropriate.
    
    Format your response with these guidelines:
    - Use clear headings with ## for main sections
    - Use bullet points for lists
    - Bold important terms or case names using **bold text**
    - Keep paragraphs short and focused
    - Use line breaks between paragraphs
    - When citing laws, use a clear format like: *Criminal Code (R.S.C., 1985, c. C-46)*
    
    Question: ${prompt}`;
    
    // Generate content
    const result = await model.generateContent(fullPrompt);
    const response = result.response;
    const text = response.text();
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(text)
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to process request', details: error.message })
    };
  }
};