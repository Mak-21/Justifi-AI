const { GoogleGenerativeAI } = require("@google/generative-ai");

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
    
    // Add console logging to help debug
    console.log("Received prompt:", prompt);
    
    // Initialize Gemini API
    const apiKey = process.env.GEMINI_API_KEY;
    console.log("API Key defined:", !!apiKey); // Log if API key exists, not the key itself
    
    const genAI = new GoogleGenerativeAI(apiKey);
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
    
    console.log("Sending request to Gemini API");
    
    // Generate content
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('API call timed out')), 9000)
    );
    
    // Race the API call against the timeout
    const result = await Promise.race([
      model.generateContent(fullPrompt),
      timeoutPromise
    ]);
    
    const response = result.response;
    const text = response.text();
    
    console.log("Received response from Gemini API");
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(text)
    };
  } catch (error) {
    console.error('Error details:', error.message, error.stack);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to process request', details: error.message })
    };
  }
};