import dotenv from 'dotenv';
import crypto from 'crypto';
dotenv.config();

export default async function handler(req, res) {
  // CORS – Solo permite solicitudes desde el dominio oficial
  res.setHeader('Access-Control-Allow-Origin', 'https://www.lilijaime.pro');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

  const { event, value, content_name } = req.body;
  console.log('📥 Evento recibido:', event, value, content_name);

  // Solo permitimos eventos estándar de TikTok para e-commerce
  const validEvents = ['PageView', 'ViewContent', 'AddToCart', 'InitiateCheckout', 'Purchase'];
  if (!validEvents.includes(event)) {
    return res.status(400).json({ error: `Evento no permitido: ${event}` });
  }

  const pixel_code = process.env.TIKTOK_PIXEL_ID || 'D1O4TGBC77UCN6B650L0'; // Por defecto
  const accessToken = process.env.TIKTOK_ACCESS_TOKEN;

  if (!pixel_code || !accessToken) {
    return res.status(400).json({ error: 'Faltan variables de entorno' });
  }

  // Construcción del payload para TikTok
  const eventData = {
    pixel_code,
    event,
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
      return res.status(500).json({ error: 'Error desde TikTok', detalles: result });
    }
  } catch (error) {
    console.error('❌ Error interno:', error.message);
    return res.status(500).json({ error: 'Error del servidor', detalles: error.message });
  }
}
