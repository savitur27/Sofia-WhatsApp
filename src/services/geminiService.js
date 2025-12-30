const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
    
    // Modelo para chat de texto
    this.chatModel = this.genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-exp"
    });
    
    // Modelo para generar imágenes
    this.imageModel = this.genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-exp"
    });
  }

  // Chat de texto normal
  async chat(messages, systemPrompt) {
    try {
      const chat = this.chatModel.startChat({
        history: this.convertToGeminiFormat(messages),
        systemInstruction: systemPrompt
      });

      const lastMessage = messages[messages.length - 1].content;
      const result = await chat.sendMessage(lastMessage);
      
      return result.response.text();
    } catch (error) {
      console.error('Error en Gemini chat:', error);
      throw error;
    }
  }

  // Generar imágenes para marketing
  async generateImage(prompt) {
    try {
      const enhancedPrompt = `Crea una imagen profesional de marketing para redes sociales.
      
Requisitos:
- Debe incluir texto legible y claro
- Colores vibrantes y llamativos
- Diseño profesional
- Optimizada para Instagram/Facebook
- Resolución alta

Solicitud del usuario: ${prompt}`;

      const result = await this.imageModel.generateContent(enhancedPrompt);
      
      const response = await result.response;
      const imageData = response.candidates[0].content.parts[0].inlineData;
      
      return imageData;
    } catch (error) {
      console.error('Error generando imagen:', error);
      throw error;
    }
  }

  // Analizar imágenes que envía el usuario
  async analyzeImage(imageBase64, prompt) {
    try {
      const result = await this.chatModel.generateContent([
        {
          inlineData: {
            data: imageBase64,
            mimeType: "image/jpeg"
          }
        },
        { text: prompt }
      ]);

      return result.response.text();
    } catch (error) {
      console.error('Error analizando imagen:', error);
      throw error;
    }
  }

  // Transcribir audio de voz
  async transcribeAudio(audioBase64, mimeType = "audio/ogg") {
    try {
      const result = await this.chatModel.generateContent([
        {
          inlineData: {
            data: audioBase64,
            mimeType: mimeType
          }
        },
        { text: "Transcribe este audio a texto en español. Solo devuelve la transcripción, sin comentarios adicionales." }
      ]);

      return result.response.text();
    } catch (error) {
      console.error('Error transcribiendo audio:', error);
      throw error;
    }
  }

  // Convertir formato de mensajes de OpenAI a Gemini
  convertToGeminiFormat(messages) {
    return messages
      .filter(msg => msg.role !== 'system') // Gemini maneja system diferente
      .map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));
  }
}

module.exports = GeminiService;