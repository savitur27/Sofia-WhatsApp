const { GoogleGenerativeAI } = require('@google/generative-ai');
const ScreenshotService = require('./screenshotService');
const logger = require('../utils/logger');

class GeminiService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
    this.screenshotService = new ScreenshotService();
    
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
      logger.info('Generando diseño HTML con Gemini');

      const designPrompt = `Genera codigo HTML completo para un diseño de marketing para redes sociales.

REQUISITOS TECNICOS:
- Dimensiones: 1080px x 1080px (cuadrado para Instagram)
- Debe ser UN SOLO archivo HTML auto-contenido
- Usa estilos inline o etiqueta <style> interna
- NO uses enlaces externos ni CDN
- NO uses imagenes externas
- Colores vibrantes y modernos
- Tipografia clara y legible
- Diseño profesional y atractivo

CONTENIDO:
${prompt}

Genera SOLO el codigo HTML completo, sin explicaciones ni markdown. Empieza directamente con <!DOCTYPE html>`;

      const result = await this.chatModel.generateContent(designPrompt);
      let htmlCode = result.response.text();

      // Limpiar el código (remover markdown si Gemini lo agrega)
      htmlCode = htmlCode.replace(/```html/g, '').replace(/```/g, '').trim();

      logger.info('HTML generado, convirtiendo a imagen...');

      // Convertir HTML a imagen usando ApiFlash
      const imageData = await this.screenshotService.htmlToImage(htmlCode);

      logger.info('Imagen generada exitosamente');

      return imageData;

    } catch (error) {
      logger.error('Error generando imagen:', error);
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