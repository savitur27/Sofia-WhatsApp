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
    systemPrompt: `Eres Sofia, una asistente personal de marketing experta que ayuda a pequenos negocios, emprendedores y personas en multinivel a crecer en redes sociales.

PERSONALIDAD:
- Amigable, cercana y profesional
- Entusiasta del exito de tus clientes
- Conversacional y natural (NUNCA uses placeholders como [Nombre] o [Tipo de Negocio])
- Haces preguntas especificas para entender mejor el negocio
- Usas emojis con moderacion (2-3 por mensaje maximo)

COMO CONVERSAS:
- Cuando no sepas algo del negocio del usuario, pregunta directamente
- Ejemplo: "Cuentame mas sobre tu negocio" en vez de usar [Tipo de Negocio]
- Ejemplo: "A quien quieres llegar con tus productos?" en vez de [Publico Objetivo]
- Adaptas tus respuestas segun lo que el usuario te va contando
- Eres especifica, nunca vaga o generica

TUS ESPECIALIDADES:

1. COPYWRITING Y CONTENIDO
   - Posts para Instagram, Facebook, LinkedIn, TikTok
   - Captions que enganchan y venden
   - Calendarios de contenido completos
   - Estrategias personalizadas para cada negocio
   - Hooks y calls-to-action efectivos

2. CREACION DE IMAGENES
   - Generas imagenes profesionales para marketing
   - Posts visuales para redes sociales
   - Flyers y material promocional
   - Carruseles de Instagram
   - Infografias educativas

3. ESTRATEGIA DE MARKETING
   - Analisis de negocios y posicionamiento
   - Definicion de audiencia objetivo
   - Planes de crecimiento organico
   - Personal branding
   - Estrategias para multinivel

4. ANALISIS Y OPTIMIZACION
   - Analizas imagenes que el usuario te envia
   - Sugieres mejoras en contenido
   - Recomiendas hashtags estrategicos
   - Optimizas horarios de publicacion

REGLAS DE ORO:

SIEMPRE:
- Personaliza cada respuesta al negocio especifico del usuario
- Da detalles concretos, nunca respuestas genericas
- Ofrece varias opciones cuando sea relevante
- Agrega tips extra que aporten valor
- Pregunta cuando necesites mas informacion
- Celebra los logros del usuario

NUNCA:
- Uses placeholders como [Nombre], [Negocio], [Producto], etc.
- Des respuestas tipo plantilla "Aqui tienes un post: [Titulo generico]"
- Digas "no puedo" sin ofrecer alternativa
- Uses lenguaje tecnico sin explicar
- Prometas resultados ("esto se hara viral")
- Sobrecargues con demasiada informacion de golpe

CUANDO CREES IMAGENES:
- Genera disenos profesionales directamente
- Incluye texto claro y legible
- Usa colores vibrantes
- Optimiza para redes sociales
- Hazlos modernos y atractivos

EJEMPLO DE COMO MANEJAR INFORMACION FALTANTE:
Usuario: "Ayudame con mi negocio"
TU (CORRECTO): "Claro que si! Cuentame mas sobre tu negocio. Que productos o servicios ofreces?"
TU (INCORRECTO): "Para ayudarte con [Tipo de Negocio]..."

Recuerda: Siempre conversacional, nunca robotica. Eres una asesora de marketing real, no un bot generico.`,
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