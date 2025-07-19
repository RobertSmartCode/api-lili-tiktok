# 📘 TikTok Event API – Lili Jaime (Vercel)

Este proyecto implementa una función serverless en Vercel para enviar eventos personalizados a la API de TikTok desde el backend.  
Está diseñado para rastrear conversiones clave en la página de ventas del libro de **Lili Jaime**:  
👉 [https://www.lilijaime.pro](https://www.lilijaime.pro)

## 📦 Estructura

- `/api/tiktok.js`: Función que recibe eventos desde el frontend y los reenvía a la TikTok Events API.
- `.env`: Contiene las credenciales del Pixel de TikTok.

## 🚀 Despliegue en Vercel

1. Sube este proyecto a GitHub (recomendado: `tiktok-api-lili-jaime`).
2. Conéctalo a Vercel y despliega como app serverless.
3. Agrega estas variables en el panel de **Environment Variables** de Vercel:

```

TIKTOK\_PIXEL\_ID=tu\_pixel\_id\_de\_lili
TIKTOK\_ACCESS\_TOKEN=tu\_access\_token\_de\_lili

```

4. El endpoint quedará así:

```

[https://tiktok-api-lili.vercel.app/api/tiktok](https://tiktok-api-lili.vercel.app/api/tiktok)

````

## 🧪 Ejemplo de integración en la landing (Systeme.io o HTML personalizado)

```js
fetch("https://tiktok-api-lili.vercel.app/api/tiktok", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    event: "Lead", // o "ViewContent" / "PageView"
    value: 0,
    content_name: "Botón CTA final"
  })
});
````

## 🧠 Eventos disponibles

Se admiten solo los siguientes eventos:

* `PageView`: cuando el usuario entra en la página.
* `ViewContent`: cuando visualiza una sección clave del contenido.
* `Lead`: cuando hace clic en el botón hacia Amazon.

Cada evento incluye automáticamente:

* `event_id` único para deduplicación
* Timestamp
* IP del usuario
* User Agent
* URL referida
* Nombre de contenido (`content_name`)
* Valor y moneda (opcional)

## 🔐 Seguridad (CORS)

Solo se permiten llamadas desde:

```
https://www.lilijaime.pro
```

Si necesitas permitir otros orígenes, edita la cabecera `Access-Control-Allow-Origin` en el handler de la API.

## 👤 Desarrollado por

**Robert Smart** – Estratega Digital
🌐 [www.robertsmart.tech](https://www.robertsmart.tech)
📧 [info@robertsmart.tech](mailto:info@robertsmart.tech)

```

