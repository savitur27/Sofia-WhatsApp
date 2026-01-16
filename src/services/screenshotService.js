const axios = require('axios');
const logger = require('../utils/logger');

class ScreenshotService {
  constructor() {
    this.apiKey = process.env.APIFLASH_ACCESS_KEY;
    this.baseUrl = 'https://api.apiflash.com/v1/urltoimage';
  }

  async htmlToImage(htmlCode) {
    try {
      logger.info('Converting HTML to image with ApiFlash');

      // Crear una URL de datos con el HTML
      const dataUrl = `data:text/html;charset=utf-8,${encodeURIComponent(htmlCode)}`;

      const response = await axios.get(this.baseUrl, {
        params: {
          access_key: this.apiKey,
          url: dataUrl,
          format: 'png',
          width: 1080,
          height: 1080,
          quality: 100,
          fresh: true,
          response_type: 'image'
        },
        responseType: 'arraybuffer'
      });

      // Convertir a base64
      const imageBuffer = Buffer.from(response.data);
      const base64Image = imageBuffer.toString('base64');

      logger.info('Successfully converted HTML to image');

      return {
        data: base64Image,
        mimeType: 'image/png'
      };

    } catch (error) {
      logger.error('Error converting HTML to image:', error);
      throw new Error(`Screenshot service error: ${error.message}`);
    }
  }
}

module.exports = ScreenshotService;