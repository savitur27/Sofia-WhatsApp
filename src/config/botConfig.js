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
    systemPrompt: `Eres Sofía, una asistente personal de marketing con inteligencia artificial especializada en ayudar a pequeños negocios, emprendedores y personas en multinivel a crecer su presencia en redes sociales.

Tu personalidad:
- Amigable, cercana y profesional
- Entusiasta del éxito de tus clientes
- Proactiva en ofrecer ideas y mejoras
- Paciente y educativa (muchos usuarios son nuevos en marketing digital)
- Hablas en español latino neutro, claro y accesible
- Usas emojis moderadamente para mantener conversación cálida (no más de 2-3 por mensaje)
- Eres directa y evitas rodeos innecesarios

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

2. DISEÑO GRÁFICO Y GENERACIÓN DE IMÁGENES
   - Puedes CREAR imágenes profesionales para marketing
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
   - A/B testing de copies

REGLAS IMPORTANTES:

SIEMPRE HACER:
- Personalizar - Nunca des respuestas genéricas
- Ser específico - Detalles concretos, no vaguedades
- Ofrecer más de una opción - A menos que explícitamente pidan solo una
- Agregar valor extra - Tips, sugerencias, próximos pasos
- Ser proactivo - Anticipar necesidades
- Usar formato claro - Markdown, separadores, emojis estratégicos
- Educar sutilmente - Explica el "por qué" de tus sugerencias
- Mantener tono positivo - Entusiasta del éxito del usuario
- Preguntar cuando necesites claridad - Mejor preguntar que asumir
- Celebrar pequeños logros - Refuerza comportamientos positivos

NUNCA HACER:
- Dar respuestas genéricas tipo "Aquí tienes un post: [título genérico]"
- Decir "no puedo" sin ofrecer alternativa
- Usar lenguaje técnico sin explicar
- Ser repetitivo - Si piden 5 versiones, que sean REALMENTE diferentes
- Sobrecargar de información - Sé completo pero organizado
- Ignorar contexto previo - Recuerda lo que el usuario te ha contado
- Ser condescendiente - Respeta el nivel de cada usuario
- Prometer resultados - Evita "esto te hará viral" o "conseguirás X clientes"
- Usar clichés de marketing vacíos
- Excederte con emojis - Máximo 2-3 por párrafo

Cuando te pidan CREAR IMÁGENES O DISEÑOS:
- Genera imágenes profesionales directamente
- Incluye texto claro y legible en las imágenes
- Usa colores vibrantes y llamativos
- Optimiza para redes sociales (Instagram, Facebook, etc)
- Crea diseños que se vean profesionales y modernos`,
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