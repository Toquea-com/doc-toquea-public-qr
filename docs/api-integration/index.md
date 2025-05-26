<script setup lang="ts"> 
import VueMermaidString from 'vue-mermaid-string'

const flowMerchandIntegrator = `
sequenceDiagram
    actor Usuario
    participant Comercio
    participant ToqueaQr as Toquea QR
    
    Usuario->>Comercio: Inicia proceso de pago
    Comercio->>ToqueaQr: Solicita la creación del QR
    ToqueaQr->>Comercio: Devuelve el id de solicitud de creación de Qr

    Comercio->>ToqueaQr: Consulta si ya se creeo el QR

    Note over Comercio,ToqueaQr: la creación del QR puede tardar unos segundos

    ToqueaQr->>Comercio: Obtiene el hash para formar el QR
    Comercio->>Usuario: Muestra el QR al usuario

    Usuario-->>ToqueaQr: Al pagar ToqueaQr obtiene la transacción

    ToqueaQr-->>Comercio: Toquea notifica el cambio de estado al comercio

    Comercio->Usuario: El comercio puede notificar al usuario el estado final de la transacción
`

</script>

# Integración por APIs

**Toquea QR** es un servicio diseñado para facilitar la recaudación de pagos desde múltiples plataformas. Esta guía describe cómo realizar la integración utilizando únicamente nuestras APIs, ideal para desarrollos donde se requiere un control total sobre la interfaz gráfica.

**Requisitos previos:**

- Contar con [credenciales válidas]() para acceder a la API.
- Tener configurado un webhook según las [especificaciones](/webhooks/payment-notification.html).

## Flujo de la integración

A continuación se presenta el flujo de interacción entre el usuario, el comercio y Toquea QR:

<VueMermaidString :value="flowMerchandIntegrator" />


### Paso a paso del proceso
#### 1. Inicio del pago
El cliente informa que desea pagar, y el comercio inicia el proceso desde su sistema de punto de venta.

#### 2. Generación del QR
El sistema del comercio solicita a Toquea QR la creación de un código QR personalizado para esa transacción. Esto garantiza que el pago será único y seguro. La descripción del servicio de creación de solicitud esta [aquí](/operations/post-qr.html)

#### 3. Recepción de la solicitud
Toquea QR responde con un identificador de la solicitud, lo que permite al comercio hacer seguimiento del proceso.

#### 4. Verificación del QR
Como el QR puede tardar unos segundos en generarse, el comercio consulta a Toquea QR hasta que esté listo. Puedes encontrar la descripción completa del servicio de consulta [aquí](/webhooks/payment-notification.html)

#### 5. QR listo para mostrar
Una vez generado, Toquea QR entrega al comercio un "hash", con el que se forma y muestra el código QR en pantalla.

#### 6. El usuario paga
El cliente escanea el código desde su dispositivo móvil y realiza el pago en la plataforma de Toquea QR.

#### 7. Confirmación automática
Apenas se confirma el pago, Toquea QR notifica automáticamente al comercio que la transacción fue realizada. La notificación la realizaremos a través de un webhook, puedes ver como implementarlo [aquí](/webhooks/payment-notification.html)

#### 8. Comunicación al cliente
El comercio puede mostrar en pantalla o comunicar al cliente que el pago fue exitoso (o si hubo algún inconveniente).

## Ejemplo con código

El siguiente es un ejemplo sencillo para integrarlo en lenguaje `javascript` usando la popular plataforma de `npm`. Puedes tomarla de ejemplo para tus desarrollos.

El ejemplo esta construido con las siguientes dependencias:

- express: Como framework para crear el api
- axios: Librería para facilitar llamadas a servicios
- dotenv: Para facilitar el manejo de variables de entorno

```js
require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

const {
  API_KEY,
  USERNAME,
  PASSWORD,
  MERCHANT_ID,
  TOQUEA_API
} = process.env;

let accessToken = '';

// Autenticación
async function authenticate() {
  try {
    const response = await axios.post(`${TOQUEA_API}/auth`, {
      username: USERNAME,
      password: PASSWORD
    }, {
      headers: {
        'x-api-key': API_KEY
      }
    });
    accessToken = response.data.accessToken;
    console.log('✅ Autenticación exitosa');
  } catch (error) {
    console.error('❌ Error de autenticación:', error.response?.data || error.message);
  }
}

// Crear QR
app.post('/crear-qr', async (req, res) => {
  try {
    if (!accessToken) await authenticate();

    const { amount, currency, gloss } = req.body;

    const response = await axios.post(`${TOQUEA_API}/qr`, {
      amount,
      currency,
      gloss
    }, {
      headers: {
        Authorization: accessToken,
        merchantId: MERCHANT_ID
      }
    });

    const qrId = response.data.data.id;
    res.json({ qrId });
  } catch (error) {
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

// Consultar estado del QR
app.get('/qr/:qrId', async (req, res) => {
  try {
    if (!accessToken) await authenticate();

    const { qrId } = req.params;

    const response = await axios.get(`${TOQUEA_API}/qr/${qrId}`, {
      headers: {
        Authorization: accessToken,
        merchantId: MERCHANT_ID
      }
    });

    res.json(response.data.data);
  } catch (error) {
    res.status(500).json({ error: error.response?.data || error.message });
  }
});


// Webhook de notificación de pago
app.post('/webhook/pago', (req, res) => {
  const notificacion = req.body;

  console.log('📩 Notificación recibida desde Toquea:');
  console.log(JSON.stringify(notificacion, null, 2));

  // Aquí podrías actualizar una base de datos, notificar al cliente, etc.
  // Por ahora simplemente respondemos OK a Toquea
  res.status(200).json({
    code: 200,
    message: 'Notificación recibida correctamente',
    status: true,
    date: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
```