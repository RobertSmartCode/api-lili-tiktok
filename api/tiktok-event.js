import dotenv from 'dotenv';
import crypto from 'crypto';
dotenv.config();

// ✅ Handler para Next.js / Vercel
export default async function handler(req, res) {
  // CORS – Solo permite solicitudes desde www.lilijaime.pro
  res.setHeader('Access-Control-Allow-Origin', 'https://www.lilijaime.pro');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Preflight
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

  // 🔽 Extraer datos del body
  const { event, value, content_name } = req.body;
  console.log('📥 Evento recibido:', event, value, content_name);

  // Validación de evento permitido
  const validEvents = ['PageView', 'ViewContent', 'Lead'];
  if (!validEvents.includes(event)) {
    return res.status(400).json({ error: 'Tipo de evento no válido' });
  }

  // Variables de entorno
  const pixel_code = process.env.TIKTOK_PIXEL_ID || 'D1O4TGBC77UCN6B650L0'; // Pixel de Lili
  const accessToken = process.env.TIKTOK_ACCESS_TOKEN;

  if (!pixel_code || !accessToken) {
    return res.status(400).json({ error: 'Faltan variables de entorno necesarias' });
  }

  // Usamos el evento tal cual (no se transforma)
  const eventoFinal = event;

  // Armado del payload
  const eventData = {
    pixel_code,
    event: eventoFinal,
    timestamp: Date.now().toString(),
    event_id: crypto.randomUUID(),
    properties: {
      ...(value !== undefined && { value }),
      ...(value !== undefined && { currency: 'USD' }),
      content_name: content_name || 'Sin nombre'
    },
    context: {
      user: {
        ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1',
        user_agent: req.headers['user-agent'] || ''
      },
      page: {
        url: req.headers.referer || 'https://www.lilijaime.pro/'
      },
      event_source: {
        event_source_type: 'web',
        event_source_id: 'lilijaime.pro'
      }
    }
  };

  console.log(`🚀 Enviando evento '${event}' a TikTok...`, eventData);

  try {
    const response = await fetch('https://business-api.tiktok.com/open_api/v1.3/pixel/track/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Token': accessToken
      },
      body: JSON.stringify(eventData)
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ TikTok respondió OK:', result);
      return res.status(200).json({ success: true, result });
    } else {
      console.error('❌ TikTok respondió con error:', result);
      return res.status(500).json({ error: 'Error al enviar evento a TikTok', detalles: result });
    }
  } catch (error) {
    console.error('❌ Error en backend:', error.message);
    return res.status(500).json({ error: 'Error interno del servidor', detalles: error.message });
  }
}
