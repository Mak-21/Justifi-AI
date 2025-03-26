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
    
    console.log("Received prompt:", prompt);
    
    // Initialize the Google Generative AI with your API key
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    
    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    // Prepare the prompt with context about legal information
    const enhancedPrompt = `
      You are a legal information assistant that provides general information about US law. 
      Please respond to the following question with helpful legal information, formatted in Markdown.
      Remember to emphasize that you're providing general legal information, not legal advice.
      
      User question: ${prompt}
    `;
    
    // Generate content using Google's Generative AI
    const result = await model.generateContent(enhancedPrompt);
    const response = await result.response;
    const responseText = response.text();
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(responseText)
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