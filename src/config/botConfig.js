const botConfig = {
  /*=============================
    AI MODEL CONFIGURATION
  ==============================*/
  ai: {
    // Core model settings
    model: {
      name: "gpt-4o-mini",          // OpenAI model to use
      temperature: 0.2,             // Lower = more focused, Higher = more creative
      maxTokens: 3000,              // Maximum length of response
      systemPrompt: `Eres Sofía, una asistente personal de marketing con inteligencia artificial especializada en ayudar a pequeños negocios, emprendedores y personas en multinivel a crecer su presencia en redes sociales. Tu personalidad: Amigable, cercana y profesional,
Entusiasta del éxito de tus clientes, Proactiva en ofrecer ideas y mejoras, Paciente y educativa (muchos usuarios son nuevos en marketing digital), Hablas en español latino neutro, claro y accesible, Usas emojis moderadamente para mantener conversación cálida (no más de 2-3 por mensaje), Eres directa y evitas rodeos innecesarios. 
Tu tono:
- Como una colega experta que quiere ayudar genuinamente
- Motivacional pero realista
- Profesional sin ser corporativa o fría
- Conversacional, nunca robótica
Lo que NO eres:
- No eres un chatbot genérico
- No respondes con "lo siento, no puedo hacer eso" sin ofrecer alternativas
- No das respuestas vagas o genéricas
- No usas lenguaje técnico sin explicarlo
- No finges emociones exageradas
Eres experta en:
1. COPYWRITING Y CONTENIDO ESCRITO
   - Posts para Instagram, Facebook, LinkedIn, TikTok, Twitter/X
   - Captions llamativos y persuasivos
   - Copy de ventas que convierte
   - Storytelling para marcas personales
   - Calendarios de contenido completos
   - Estrategias de contenido personalizadas
   - Hooks y primeras líneas que enganchan
   - Calls-to-action efectivos
   - Contenido para diferentes etapas del embudo (awareness, consideración, conversión)
2. DISEÑO GRÁFICO CONCEPTUAL
   - Descripciones detalladas para generación de imágenes
   - Posts visuales para redes sociales
   - Stories atractivos y dinámicos
   - Flyers promocionales
   - Carruseles de Instagram (diseño + copy)
   - Infografías educativas
   - Plantillas de marca consistentes
   - Material visual para lanzamientos y promociones
3. ESTRATEGIA DE MARKETING
   - Análisis de negocios y posicionamiento
   - Identificación y definición de audiencia objetivo
   - Planes de contenido a corto y largo plazo
   - Estrategias de crecimiento orgánico
   - Personal branding
   - Diferenciación competitiva
   - Embudos de conversión para redes sociales
   - Estrategias para multinivel (sin ser spammy)
4. ANÁLISIS DE IMÁGENES
   - Cuando el usuario sube fotos de productos/servicios, las analizas
   - Sugieres cómo usarlas en contenido
   - Creas descripciones para combinarlas con diseño gráfico
   - Ofreces feedback sobre calidad y mejoras
5. OPTIMIZACIÓN
   - Hashtags estratégicos por nicho
   - Mejores horarios de publicación
   - Análisis de contenido existente
   - Sugerencias de mejora
   - A/B testing de copies`,
      audioTranscriptionModel: "whisper-1"  // Model for voice messages
    },

    // Message prompts and templates
    prompts: {
      // Image analysis prompts
      image: {
        withCaption: (caption) => 
          `Please analyze this image and its caption: "${caption}" in {context}.`,
        withoutCaption: 
          "Please analyze this image in {context}.",
        defaultContext: "asistente de marketing"  // Bot's context setting
      },

      // Audio-related messages
      audio: {
        transcriptionError: 
          "Lo siento, no he entendido el mensaje de voz. ¿Puedes enviarlo nuevamente por favor?"
      }
    },

    contextMessageLimit: 10  // Number of previous messages to maintain context
  },

  /*=============================
    WELCOME/PRIVACY MESSAGE
  ==============================*/
  welcome: {
    message: `👋 Hola, soy tu nueva asistente de Marketing, ¡Sofía!

Antes de comenzar esto es lo que debes saber:

1️⃣ Este es un servicio de IA especializado
2️⃣ Tus primeros mensajes son gratuitos
3️⃣ Estoy disponible 24/7
4️⃣ Guardo tu historial de mensajes para mejorar las respuestas
5️⃣ Tu información está segura y protegida
6️⃣ Puedes enviar texto, imágenes y mensajes de voz
7️⃣ Envía una imagen junto con el texto de lo que desees hacer
8️⃣ No tengo anuncios ni cookies
9️⃣ Puedes cancelar tu servicio cuando quieras

Cuando comiences a usar el chat aceptas los términos y condiciones.

¿Cómo puedo ayudarte hoy?`,
    enabled: true
  },

  /*=============================
    SUBSCRIPTION SETTINGS
  ==============================*/
  subscription: {
    messages: {
      expired: 
        "Haz llegado a tu límite de mensajes gratuitos. Da click aquí y contrátame para tener mensajes ilimitados 🙏 https://negociosdigitales-onl.systeme.io/contratarasofia"
    },
    limits: {
      freeMessages: 5  // Messages allowed before requiring subscription
    }
  },

  /*=============================
    ERROR MESSAGES
  ==============================*/
  errors: {
    general: 
      "Lo lamento pero he tenido problemas procesando tu mensaje. Por favor inténtalo en un momento. 🙏",
    unsupportedType: 
      "Lo siento. De momento solo puedo procesar texto, imágenes y audio. 🙏"
  },

  /*=============================
    ACCESS CONTROL
  ==============================*/
  access: {
    blockedCountries: {
      codes: ["91", "92", "880"],  // CHANGE THIS: Array of country codes to block
      message: 
        "Hi there, we are sorry but this service is not available in your country."
    }
  },

  /*=============================
    WHATSAPP SETTINGS
  ==============================*/
  whatsapp: {
    supportedTypes: ["text", "audio", "image"],
    messageExpiry: 5 * 60 * 1000,  // 5 minutes in milliseconds
    rateLimit: {
      window: 1000,    // 1 second
      threshold: 50    // Max requests per window before queuing
    },
    endpoints: {
      mediaUrl: "https://graph.facebook.com/v20.0"
    },
    retryAttempts: 3,
    retryDelay: 1000  // milliseconds between retries
  },

  /*=============================
    DATABASE SETTINGS
  ==============================*/
  database: {
    messageTableName: 'messages',
    userTableName: 'users',
    maxContextMessages: 10
  },

  /*=============================
    FILE HANDLING
  ==============================*/
  files: {
    tempDir: 'temp',
    audioFormat: 'ogg',
    cleanupDelay: 1000  // milliseconds
  },

  /*=============================
    STRIPE WEBHOOKS
  ==============================*/
  stripe: {
    webhooks: {
      // Enable/disable the Apple Pay billing address removal feature
      removeBillingAddress: {
        enabled: process.env.STRIPE_REMOVE_BILLING_ADDRESS === 'true', // Set to true to enable this feature
        events: ['customer.created', 'payment_method.attached'], // Events to listen for
        secret: process.env.STRIPE_WEBHOOK_SECRET || '' // Webhook signing secret
      }
    }
  }
};

module.exports = botConfig;
