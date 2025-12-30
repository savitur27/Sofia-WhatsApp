const GeminiService = require('../services/geminiService');
const logger = require('../utils/logger');
const botConfig = require('../config/botConfig');

const gemini = new GeminiService();

// Almacenar historial de conversaciones por usuario
const conversationHistory = new Map();

async function generateResponse(message, userId) {
  try {
    logger.info('Starting Gemini request with message:', JSON.stringify(message));

    if (!process.env.GOOGLE_AI_API_KEY) {
      throw new Error('Google AI API key is not configured');
    }

    // Obtener o crear historial del usuario
    if (!conversationHistory.has(userId)) {
      conversationHistory.set(userId, []);
    }

    const history = conversationHistory.get(userId);

    // Agregar mensaje del usuario al historial
    history.push({
      role: 'user',
      content: message
    });

    // Limitar historial a los últimos 20 mensajes
    if (history.length > 20) {
      history.splice(0, history.length - 20);
    }

    // Obtener respuesta de Gemini
    const response = await gemini.chat(history, botConfig.ai.systemPrompt);

    // Agregar respuesta al historial
    history.push({
      role: 'assistant',
      content: response
    });

    logger.info('Successfully received Gemini response');
    return response;

  } catch (error) {
    logger.error('Error in Gemini request:', error);
    logger.error('Error details:', error.response?.data || error.message);
    throw error;
  }
}

// Función para generar imágenes
async function generateImage(prompt) {
  try {
    logger.info('Generating image with prompt:', prompt);

    const imageData = await gemini.generateImage(prompt);

    logger.info('Successfully generated image');
    return {
      base64: imageData.data,
      mimeType: imageData.mimeType
    };

  } catch (error) {
    logger.error('Error generating image:', error);
    throw error;
  }
}

// Función para analizar imágenes
async function analyzeImage(imageBase64, prompt = "Describe esta imagen en detalle") {
  try {
    logger.info('Analyzing image');

    const analysis = await gemini.analyzeImage(imageBase64, prompt);

    logger.info('Successfully analyzed image');
    return analysis;

  } catch (error) {
    logger.error('Error analyzing image:', error);
    throw error;
  }
}

// Función para transcribir audio
async function transcribeAudio(audioBase64, mimeType = "audio/ogg") {
  try {
    logger.info('Transcribing audio');

    const transcription = await gemini.transcribeAudio(audioBase64, mimeType);

    logger.info('Successfully transcribed audio');
    return transcription;

  } catch (error) {
    logger.error('Error transcribing audio:', error);
    throw error;
  }
}

// Función para limpiar historial (útil para testing)
function clearHistory(userId) {
  conversationHistory.delete(userId);
  logger.info(`Cleared conversation history for user: ${userId}`);
}

// Detectar si el usuario quiere generar una imagen
function isImageGenerationRequest(message) {
  const keywords = [
    'genera', 'crea', 'diseña', 'haz', 'crear',
    'imagen', 'foto', 'diseño', 'post',
    'flyer', 'banner', 'anuncio', 'publicación',
    'carrusel', 'story', 'historia', 'gráfico'
  ];

  const lowerMessage = message.toLowerCase();
  
  return keywords.some(keyword => lowerMessage.includes(keyword)) &&
         (lowerMessage.includes('imagen') || 
          lowerMessage.includes('diseño') || 
          lowerMessage.includes('post') ||
          lowerMessage.includes('flyer') ||
          lowerMessage.includes('banner') ||
          lowerMessage.includes('gráfico'));
}

module.exports = {
  generateResponse,
  generateImage,
  analyzeImage,
  transcribeAudio,
  clearHistory,
  isImageGenerationRequest
};