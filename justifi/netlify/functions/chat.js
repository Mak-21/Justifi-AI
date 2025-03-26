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
    
    // Initialize Gemini API with timeout
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined in environment variables");
    }
    
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Create a model with safety settings and timeout configuration
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-pro",
      generationConfig: {
        maxOutputTokens: 1024, // Limit output size
        temperature: 0.4 // Lower temperature for faster, more concise responses
      }
    });
    
    // Create a prompt with Canadian legal context and formatting instructions
    const fullPrompt = `Act as a legal AI assistant named Juris. You specialize in Canadian law and legal consultation.
    
    Answer this legal question with accurate information based on Canadian federal and provincial laws. 
    Be concise but informative. Include references to relevant statutes, cases, or regulations when appropriate.
    
    Format your response with these guidelines:
    - Use clear headings with ## for main sections
    - Use bullet points for lists
    - Bold important terms or case names using **bold text**
    - Keep paragraphs short and focused
    - When citing laws, use a clear format like: *Criminal Code (R.S.C., 1985, c. C-46)*
    
    Question: ${prompt}`;
    
    // Set a timeout for the API call
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('API request timeout')), 25000);
    });
    
    // Generate content with timeout
    const resultPromise = model.generateContent(fullPrompt);
    const result = await Promise.race([resultPromise, timeoutPromise]);
    
    const response = result.response;
    const text = response.text();
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(text)
    };
  } catch (error) {
    console.error('Error:', error);
    
    // Return a friendlier error message to the client
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'The request took too long to process. Please try again with a shorter or simpler question.',
        details: error.message 
      })
    };
  }
};