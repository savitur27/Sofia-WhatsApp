const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
    
    this.chatModel = this.genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-exp"
    });
    
    this.imageModel = this.genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-exp"
    });
  }

  async chat(messages, systemPrompt) {
    try {
      // Construir el prompt completo con el contexto
      let fullPrompt = systemPrompt + "\n\n";
      
      // Agregar el historial de conversación
      for (const msg of messages) {
        if (msg.role === 'user') {
          fullPrompt += `Usuario: ${msg.content}\n`;
        } else if (msg.role === 'assistant') {
          fullPrompt += `Sofia: ${msg.content}\n`;
        }
      }
      
      fullPrompt += "\nResponde como Sofia:";
      
      // Generar respuesta
      const result = await this.chatModel.generateContent(fullPrompt);
      return result.response.text();
      
    } catch (error) {
      console.error('Error en Gemini chat:', error);
      throw error;
    }
  }

  async generateImage(prompt) {
    try {
      const enhancedPrompt = `Crea una imagen profesional de marketing para redes sociales.
      
Requisitos:
- Debe incluir texto legible y claro
- Colores vibrantes y llamativos
- Diseno profesional
- Optimizada para Instagram/Facebook
- Resolucion alta

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

  async transcribeAudio(audioBase64, mimeType = "audio/ogg") {
    try {
      const result = await this.chatModel.generateContent([
        {
          inlineData: {
            data: audioBase64,
            mimeType: mimeType
          }
        },
        { text: "Transcribe este audio a texto en espanol. Solo devuelve la transcripcion, sin comentarios adicionales." }
      ]);

      return result.response.text();
    } catch (error) {
      console.error('Error transcribiendo audio:', error);
      throw error;
    }
  }
}

module.exports = GeminiService;