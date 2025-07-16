# TikTok Event API – Vercel

Este proyecto implementa una función serverless en Vercel para enviar eventos directamente a la API de TikTok desde el backend.

## 📦 Estructura
- `/api/tiktok-event.js`: Función que recibe eventos y los reenvía a TikTok API.

## 🚀 Despliegue
1. Sube este proyecto a GitHub o GitLab.
2. Conéctalo en Vercel.
3. Agrega la variable de entorno `TIKTOK_ACCESS_TOKEN` en Vercel.
4. ¡Listo! Puedes enviar eventos POST a `/api/tiktok-event`.

## 🧪 Ejemplo de POST desde tu sitio

```js
fetch("https://tudominio.vercel.app/api/tiktok-event", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    pixel_code: "TU_PIXEL_ID",
    event: "ClickAmazon",
    timestamp: Date.now(),
    context: { page: { url: window.location.href } },
    properties: { button_text: "Ir a Amazon" }
  })
});
```
