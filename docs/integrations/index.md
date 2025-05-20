<script setup lang="ts"> 
import VueMermaidString from 'vue-mermaid-string'

const flowMerchandIntegrator = `
sequenceDiagram
    actor Usuario
    participant FrontComercio
    participant BackendComercio
    participant BackendToquea
    participant FrontToquea

    Usuario->>FrontComercio: Inicia proceso de pago
    FrontComercio->>Usuario: Muestra opciones de pago (incluye Toquea QR)
    Usuario->>FrontComercio: Elige Toquea QR

    FrontComercio->>BackendComercio: Solicitud de pago con Toquea QR
    BackendComercio->>BackendToquea: Llama al servicio de login
    BackendToquea-->>BackendComercio: Devuelve token válido

    BackendComercio->>BackendToquea: Llama a create QR (con token)
    BackendToquea-->>BackendComercio: Devuelve ID de operación

    BackendComercio->>FrontComercio: Devuelve token e ID de operación
    FrontComercio->>FrontToquea: Inicia Front Toquea (con token e ID)

    Usuario->>FrontToquea: Interactúa con Toquea QR
    Usuario->>FrontToquea: Realizar pago
    FrontToquea->>BackendToquea: Procesa pago

    BackendToquea-->>BackendComercio: Notifica pago realizado (webhook)

    BackendComercio-->>FrontComercio: Actualiza estado de pago
    FrontToquea-->>FrontComercio: Ejecuta callback
`

</script>

# Integración como pasarela de pagos

**Toquea QR** ofrece una solución diseñada para una facil integración en distintos comercios y servicios. 

Los requisitos para seguir esta guía son los siguientes:

- Tener [credenciales validas]()
- Tener configurado y registrado un webhook según las [especificaciones](/webhooks/payment-notification.html)

## Flujo de la integración

El flujo sugerido para realizar la integración es el siguiente.

<VueMermaidString :value="flowMerchandIntegrator" />


**1. Inicio del Proceso de Pago:**
  - El Usuario inicia el proceso de pago en el FrontComercio.

**2. Mostrar Opciones de Pago:**
  - El FrontComercio muestra al Usuario las opciones de pago disponibles, incluyendo la opción de Toquea QR.

**3. Selección del Método de Pago:**

  - El Usuario selecciona Toquea QR como método de pago.

**4. Solicitud de Pago con Toquea QR:**

  - El FrontComercio envía una solicitud al BackendComercio para procesar el pago mediante Toquea QR.

**5. Autenticación con Toquea:**

  - El BackendComercio realiza una llamada al BackendToquea para solicitar un servicio de login.
  - El BackendToquea responde con un token válido para autenticar la operación.

**6. Generación del QR:**
  - El BackendComercio llama al servicio de create QR en el BackendToquea, proporcionando el token válido recibido.
  - El BackendToquea responde con el ID de operación asociado a esta transacción.

**7. Envío de Token e ID de Operación al FrontComercio:**
  - El BackendComercio envía el token y el ID de operación al FrontComercio para que el Usuario pueda continuar el proceso de pago. Ver opciones para el plugin de toquea [aqui]().

**8. Inicialización del Front de Toquea:**
  - El FrontComercio envía el token y el ID de operación al FrontToquea, que se inicia con esta información.

**9. Interacción del Usuario con el Front de Toquea:**
  - El Usuario interactúa con el FrontToquea, escaneando el código QR o completando la operación.

**10. Realización del Pago:**
  - El Usuario confirma y realiza el pago a través del FrontToquea.

**11. Procesamiento del Pago:**
  - El FrontToquea envía la solicitud de procesamiento de pago al BackendToquea.

**12. Notificación de Pago Realizado:**
  - El BackendToquea notifica al BackendComercio mediante un webhook, informando que el pago se ha completado.

**13. Actualización del Estado de Pago:**
  - El BackendComercio recibe la notificación del pago y actualiza el estado de la transacción en el FrontComercio.

**14. Ejecución del Callback:**
  - Finalmente, el FrontToquea ejecuta la acción de callback que se había especificado al inicio, lo que puede implicar mostrar un mensaje de éxito o redirigir a una página de confirmación.

## Ejemplo con código


### Creación de QR

```js

const axios = require('axios');

// Función principal para crear un QR
async function createQR(monto) {
  try {
    // Paso 1: Obtener el accessToken mediante el login
    const username = "clienteabc"; // Usuario proporcionado por Toquea
    const password = "admin123";   // Contraseña proporcionada por Toquea
    const apiKey = "nH05DPc1Uj50UHmrUagO77TUa2omL3l2aINJP0zA"; // Clave API proporcionada por Toquea

    // Realizando la solicitud de login para obtener el accessToken
    const authResponse = await axios.post('https://api.dev.toquea.net/auth', {
      username: username,
      password: password
    }, {
      headers: {
        'x-api-key': apiKey
      }
    });

    // Obtenemos el token de la respuesta
    const accessToken = authResponse.data.accessToken;
    console.log('Acceso autenticado exitosamente. AccessToken:', accessToken);

    // Paso 2: Crear el QR con el monto proporcionado
    const merchantId = "533a180d-bd1f-422b-827a-9ea29d5fe774"; // Merchant ID proporcionado por Toquea

    // Datos para la creación del QR
    const qrData = {
      amount: monto,
      currency: "PEN",
      gloss: "Pago por pedido abc", // Descripción del pago
      qrCustomInfo: [
        {
          code: "agencia", // Clave personalizada
          value: "1234"     // Valor asociado
        }
      ]
    };

    // Realizando la solicitud para crear el QR
    const qrResponse = await axios.post('https://api.dev.toquea.net/qr', qrData, {
      headers: {
        'Authorization': accessToken,
        'merchantId': merchantId
      }
    });

    // Obtenemos el ID del QR
    const qrId = qrResponse.data.data.id;
    console.log('QR creado exitosamente. ID del QR:', qrId);

  } catch (error) {
    console.error('Error al realizar el proceso:', error.message);
  }
}

// Llamada a la función, pasando el monto de la operación
createQR(12.50); // Ejemplo con monto 12.50 PEN


```

Los pasos para crear el `QR` son los siguientes:

**1. Autenticación:** Realiza una solicitud `POST` al endpoint `/auth` con usuario y contraseña para obtener un `accessToken`.

**2. Crear QR:** Usando el `accessToken`, se hace otra solicitud POST al endpoint `/qr`, enviando el monto y otros parámetros para generar un QR.

**3. Resultado:** Si todo es exitoso, se obtiene el ID de la transacción, este código y el `accessToken` generado deben ser usados para llamar al cliente JS.

### Abrir cliente JS

Este proceso permite integrar el flujo de pago de Toquea en el front-end de una aplicación web. Utiliza el método Toquea.client para gestionar una transacción de pago y redirigir al usuario a una página de éxito una vez que la operación sea completada correctamente.

- **Parámetros**
  - **accessToken**:
    - **Descripción**: Token de acceso obtenido previamente, que permite autenticar la solicitud de pago.
    - **Tipo**: String
    - **Ejemplo**: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJ..."

  - **idTransaction**:
    - **Descripción**: Identificador único de la transacción a procesar. Este ID es proporcionado después de la creación de un QR o transacción inicial.
    - **Tipo**: String
    - **Ejemplo**: "e86e07b1-984c-48f6-9873-3a057c8d743e"

  - **successCallback**:
    - **Descripción**: Función que se ejecuta cuando la transacción es exitosa. En este caso, la función redirige al usuario a una página de éxito.
    - **Tipo**: Function
    - **Ejemplo**: Redirige a una página HTML de éxito.

```js
Toquea.client({
  accessToken: accessToken, 
  idTransaction: idTransaction,
  successCallback: () => {
    window.location('/successPage.html')
  }
})
```

Puedes ver más detalles de la líbrería cliente [aquí](#)