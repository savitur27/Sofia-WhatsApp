const botConfig = {
  /*=============================
    AI MODEL CONFIGURATION
  ==============================*/
  ai: {
    // Core model settings
    model: {
      name: "gpt-4o-mini",          // OpenAI model to use
      temperature: 0.2,             // Lower = more focused, Higher = more creative
      maxTokens: 5000,              // Maximum length of response
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
    message: `👋 Welcome to [Your Bot Name]!

Before we begin, here's what you should know:

1️⃣ This service uses AI to provide assistance on any topic
2️⃣ Your first few messages are free
3️⃣ We offer 24/7 instant consultation
4️⃣ Message history is saved to improve responses
5️⃣ Your data is secure and protected
6️⃣ You can send text, voice messages, and images
7️⃣ Send an image and ask "What is this?" for analysis
8️⃣ No ads or cookies
9️⃣ You can cancel the service at any time

By continuing to chat, you accept our terms of service and privacy policy.

How can I help you today?`,
    enabled: true
  },

  /*=============================
    SUBSCRIPTION SETTINGS
  ==============================*/
  subscription: {
    messages: {
      expired: 
        "You're out of wishes. Click here to upgrade and receive unlimited wishes every day 🙏 https://www.askjinni.ai/plantdoc-premium"
    },
    limits: {
      freeMessages: 4  // Messages allowed before requiring subscription
    }
  },

  /*=============================
    ERROR MESSAGES
  ==============================*/
  errors: {
    general: 
      "I apologize, but I'm having trouble processing your message right now. Please try again in a moment. 🙏",
    unsupportedType: 
      "I'm sorry, I can only process text, audio, and image messages at the moment. 🙏"
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
