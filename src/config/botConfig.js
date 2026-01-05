const botConfig = {
  /*=============================
    AI MODEL CONFIGURATION
  ==============================*/
  ai: {
    model: 'gemini-2.0-flash-exp',
    imageModel: 'gemini-2.0-flash-exp',
    provider: 'google',
    temperature: 0.7,
    maxTokens: 2000,
    systemPrompt: `Eres Sofia, asistente de marketing para pequenos negocios y emprendedores.

REGLAS CRITICAS:
- NUNCA uses placeholders como [Nombre], [Negocio], [Producto]
- SIEMPRE pregunta directamente cuando no sepas algo
- Ejemplo correcto: "Cuentame sobre tu negocio"
- Ejemplo INCORRECTO: "Para [Tipo de Negocio]..."

PERSONALIDAD:
- Amigable y profesional
- Conversacional, nunca robotica
- Haces preguntas especificas
- Das respuestas personalizadas

ESPECIALIDADES:
- Copywriting para redes sociales
- Creacion de imagenes profesionales
- Estrategias de marketing
- Calendarios de contenido
- Analisis y optimizacion

COMO TRABAJAS:
- Personalizas cada respuesta
- Ofreces opciones concretas
- Nunca usas lenguaje generico
- Preguntas cuando necesitas mas info
- Das tips extra que aporten valor

Eres una asesora real, no un bot generico.`,
    audioTranscriptionModel: "whisper-1"
  },

  // Message prompts and templates
  prompts: {
    // Image analysis prompts
    image: {
      withCaption: (caption) => `Por favor analiza esta imagen y su descripción: "${caption}" en el contexto de marketing.`,
      withoutCaption: "Por favor analiza esta imagen en el contexto de marketing.",
      defaultContext: "asistente de marketing"
    },

    // Audio-related messages
    audio: {
      transcriptionError: "Lo siento, no he entendido el mensaje de voz. ¿Puedes enviarlo nuevamente por favor?"
    }
  },

  contextMessageLimit: 10,

  /*=============================
    WELCOME/PRIVACY MESSAGE
  ==============================*/
  welcome: {
    message: `¡Hola! Soy tu nueva asistente de Marketing, Sofía.

Antes de comenzar esto es lo que debes saber:

1. Este es un servicio de IA especializado
2. Tus primeros 5 mensajes son gratuitos
3. Estoy disponible 24/7
4. Guardo tu historial de mensajes para mejorar las respuestas
5. Tu información está segura y protegida
6. Puedes enviar texto, imágenes y mensajes de voz
7. Puedo CREAR diseños e imágenes para tu negocio
8. No tengo anuncios ni cookies
9. Puedes cancelar tu servicio cuando quieras

Cuando comiences a usar el chat aceptas los términos y condiciones.

¿Cómo puedo ayudarte hoy?`,
    enabled: true
  },

  /*=============================
    SUBSCRIPTION SETTINGS
  ==============================*/
  subscription: {
    messages: {
      expired: "Has llegado a tu límite de mensajes gratuitos. Da click aquí y contrátame para tener mensajes ilimitados: https://negociosdigitales-onl.systeme.io/contratarasofia"
    },
    limits: {
      freeMessages: 5
    }
  },

  /*=============================
    ERROR MESSAGES
  ==============================*/
  errors: {
    general: "Lo lamento pero he tenido problemas procesando tu mensaje. Por favor inténtalo en un momento.",
    unsupportedType: "Lo siento. De momento solo puedo procesar texto, imágenes y audio."
  },

  /*=============================
    ACCESS CONTROL
  ==============================*/
  access: {
    blockedCountries: {
      codes: ["91", "92", "880"],
      message: "Hi there, we are sorry but this service is not available in your country."
    }
  },

  /*=============================
    WHATSAPP SETTINGS
  ==============================*/
  whatsapp: {
    supportedTypes: ["text", "audio", "image"],
    messageExpiry: 5 * 60 * 1000,
    rateLimit: {
      window: 1000,
      threshold: 50
    },
    endpoints: {
      mediaUrl: "https://graph.facebook.com/v20.0"
    },
    retryAttempts: 3,
    retryDelay: 1000
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
    cleanupDelay: 1000
  },

  /*=============================
    STRIPE WEBHOOKS
  ==============================*/
  stripe: {
    webhooks: {
      removeBillingAddress: {
        enabled: process.env.STRIPE_REMOVE_BILLING_ADDRESS === 'true',
        events: ['customer.created', 'payment_method.attached'],
        secret: process.env.STRIPE_WEBHOOK_SECRET || ''
      }
    }
  }
};

module.exports = botConfig;