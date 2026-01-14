const whatsapp = require('../services/whatsappService');
const { generateResponse, generateImage, isImageGenerationRequest } = require('../ai/model');
const databaseService = require('../services/databaseService');
const paymentService = require('../services/paymentService');
const logger = require('../utils/logger');
const { isBlockedCountry } = require('../utils/countryBlocker');
const { transcribeAudio } = require('../services/transcriptionService');
const { downloadImageFromWhatsApp } = require('../services/imageService');
const { handleMessage: queueHandler } = require('../services/queueService');
const botConfig = require('../config/botConfig');
const { sendPrivacyMessageIfNewUser } = require('../utils/privacyUtils');

async function handleMessage(req) {
  let from = null;
  try {
    logger.info('Processing incoming message:', JSON.stringify(req.body));
    
    // Extract the message data
    const data = req.body;
    if (!data.entry?.[0]?.changes?.[0]?.value?.messages?.[0]) {
      logger.info('No message in webhook payload');
      return;
    }

    const message = data.entry[0].changes[0].value.messages[0];
    from = message.from;
    
    logger.info(`Received message from ${from} of type ${message.type}`);
    
    // Check for blocked country
    if (isBlockedCountry(from)) {
      logger.info(`Blocked message from country: ${from}`);
      await whatsapp.sendText(from, botConfig.access.blockedCountries.message);
      return;
    }

    // Check if this is a new user and send privacy message if needed
    const dependencies = {
      databaseService,
      whatsappService: whatsapp,
    };
    
    try {
      // Check if the user is new and send privacy message if needed
      const privacyResult = await sendPrivacyMessageIfNewUser(from, dependencies);
      
      if (privacyResult && privacyResult.status === 'success') {
        logger.info(`Privacy welcome message sent to new user: ${from}`);
        // No need to process the actual message as we've just sent the welcome message
        return privacyResult;
      }
    } catch (error) {
      logger.error(`Error checking for privacy message: ${error.message}`);
      // Continue processing the message even if privacy check fails
    }

    let messageContent = '';
    let messageType = message.type;
    let messageForAI = '';

    if (messageType === 'text') {
      messageContent = message.text.body;
      messageForAI = [{ type: "text", text: messageContent }];
      logger.info(`Prepared text message: ${messageContent}`);
    } else if (messageType === 'audio') {
      const mediaId = message.audio.id;
      logger.info(`Transcribing audio with media ID: ${mediaId}`);
      messageContent = await transcribeAudio(mediaId);
      messageForAI = [{ type: "text", text: messageContent }];
      logger.info(`Transcribed audio message: ${messageContent}`);
    } else if (messageType === 'image') {
  try {
    const imageDataUrl = await downloadImageFromWhatsApp(message.image.id);
    const caption = message.image.caption || '';
    
    // Extraer el base64 puro (sin el prefijo data:image/jpeg;base64,)
    const base64Data = imageDataUrl.split(',')[1];
    
    logger.info(`Processing image with caption: ${caption}`);
    
    // Si tiene caption, analizar la imagen con el contexto del caption
    if (caption) {
      messageContent = `Imagen con descripcion: ${caption}`;
      
      // Usar analyzeImage de Gemini
      const analysis = await require('../ai/model').analyzeImage(
        base64Data,
        `Analiza esta imagen en el contexto de marketing. El usuario dice: "${caption}". Da sugerencias de como usar esta imagen en redes sociales.`
      );
      
      await whatsapp.sendText(from, analysis);
      await databaseService.saveMessage(from, messageContent, 'user');
      await databaseService.saveMessage(from, analysis, 'assistant');
      
      return { status: 'success', type: 'image_analyzed' };
      
    } else {
      // Sin caption, solo analizar la imagen
      messageContent = "Imagen enviada por el usuario";
      
      const analysis = await require('../ai/model').analyzeImage(
        base64Data,
        `Analiza esta imagen desde una perspectiva de marketing. Que tipo de producto o servicio se muestra? Como se podria usar en redes sociales? Da sugerencias especificas.`
      );
      
      await whatsapp.sendText(from, analysis);
      await databaseService.saveMessage(from, messageContent, 'user');
      await databaseService.saveMessage(from, analysis, 'assistant');
      
      return { status: 'success', type: 'image_analyzed' };
    }
    
  } catch (imageError) {
    logger.error(`Error processing image: ${imageError.message}`);
    await whatsapp.sendText(from, "Lo siento, tuve un problema procesando la imagen. Puedes intentar enviarla de nuevo?");
    return { status: 'error', error: imageError.message };
  }
    } else {
      logger.info(`Unsupported message type: ${messageType}`);
      await whatsapp.sendText(from, botConfig.errors.unsupportedType);
      return;
    }

    // Detectar si el usuario quiere generar una imagen
    if (messageType === 'text' && isImageGenerationRequest(messageContent)) {
      logger.info(`Image generation request detected from ${from}`);
      
      try {
        // Verificar suscripción primero
        const user = await databaseService.findOrCreateUser(from);
        const subscriptionStatus = await paymentService.checkStripeSubscription(from);
        
        if (!subscriptionStatus.isActive && user.message_count >= botConfig.subscription.limits.freeMessages) {
          logger.info(`User ${from} has no active subscription and exceeded free messages`);
          await whatsapp.sendText(from, botConfig.subscription.messages.expired);
          return;
        }
        
        // Incrementar contador de mensajes
        await databaseService.incrementMessageCount(from);
        
        // Enviar mensaje de "estoy trabajando en ello"
        await whatsapp.sendText(from, "Perfecto, estoy creando tu diseño. Dame un momento... ✨");
        
        // Generar la imagen
        logger.info(`Generating image with prompt: ${messageContent}`);
        const imageResult = await generateImage(messageContent);
        
        // Enviar la imagen por WhatsApp
        const imageBuffer = Buffer.from(imageResult.base64, 'base64');
        await whatsapp.sendImage(from, imageBuffer, 'image/png', 'Aquí está tu diseño 🎨');
        
        // Guardar en el historial
        await databaseService.saveMessage(from, messageContent, 'user');
        await databaseService.saveMessage(from, '[Imagen generada]', 'assistant');
        
        logger.info(`Image successfully generated and sent to ${from}`);
        return { status: 'success', type: 'image_generated' };
        
      } catch (imageError) {
        logger.error(`Error generating image: ${imageError.message}`);
        await whatsapp.sendText(from, "Lo siento, tuve un problema generando la imagen. ¿Puedes intentar con una descripción diferente?");
        return { status: 'error', error: imageError.message };
      }
    }

    // Pass all handlers to the queue service
    const handlers = {
      checkSubscription: paymentService.checkStripeSubscription,
      findOrCreateUser: databaseService.findOrCreateUser,
      updateSubscription: databaseService.updateSubscription,
      incrementMessageCount: databaseService.incrementMessageCount,
      getConversationContext: databaseService.getConversationContext,
      generateAIResponse: generateResponse,
      sendWhatsAppMessage: whatsapp.sendText,
      saveMessage: databaseService.saveMessage
    };

    logger.info(`Processing message from ${from} with type ${messageType}`);

    // Let the queue service handle the message
    const result = await queueHandler({
      message: {
        messageContent,
        messageForAI
      },
      from,
      messageType,
      handlers
    });

    logger.info(`Message processed with status: ${result.status}`);
    return result;

  } catch (error) {
    logger.error(`Error processing message: ${error.message}`);
    logger.error(error.stack);
    
    // If we have the user's phone number, try to send an error message
    if (from) {
      try {
        // First ensure user exists in database even if error occurred
        try {
          await databaseService.findOrCreateUser(from);
          logger.info(`Ensured user ${from} exists in database despite error`);
        } catch (dbError) {
          logger.error(`Failed to ensure user exists: ${dbError.message}`);
        }
        
        logger.info(`Sending error message to user ${from}`);
        await whatsapp.sendText(from, botConfig.errors.general);
      } catch (sendError) {
        logger.error(`Failed to send error message: ${sendError.message}`);
        logger.error(sendError.stack);
      }
    }
  }
}

module.exports = { handleMessage };