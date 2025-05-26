# Cliente JS

El cliente JavaScript facilita la integración del método de pago Toquea QR en tu tienda o web de comercio. Permite gestionar de manera sencilla el proceso de transacciones de pago y la interacción con el servicio Toquea.

## Instalación
Puedes instalar la librería de Toquea QR de dos maneras:

### 1. Usando un Gestor de Paquetes
Si estás utilizando un gestor de paquetes como npm, puedes instalar la librería con el siguiente comando:

```bash
npm install toquea-qr
```

### 2. Usando CDN
Si prefieres incluir la librería directamente en tu HTML, puedes hacerlo utilizando la opción CDN:

```html
<script src="http://toquea.com/js-lib/toquea-qr"></script>
```

## Uso Básico

Una vez instalada la librería, puedes integrarla fácilmente en tu proyecto. El método principal es ```Toquea.client()```, que se invoca con un objeto de configuración.

### Ejemplo de Configuración

```js
Toquea.client({
  accessToken: "your_access_token", 
  idTransaction: "transaction_id",
  successCallback: () => {
    window.location.href = '/successPage.html'; // Redirige al usuario a la página de éxito
  }
});
```

### Descripción de los Parámetros

El objeto de configuración de `Toquea.client()` recibe varios parámetros. Aquí está la descripción de cada uno:

| **Campo**           | **Tipo de Dato** | **Requerido** | **Descripción**                                                                                                                                                                                                                                                                                                                                                                   |
| ------------------- | ---------------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **accessToken**     | `string`         | ✅             | Token de acceso obtenido previamente al crear la solicitud de transacción. Es necesario para autenticar la petición y acceder a los servicios de Toquea.                                                                                                                                                                                                                          |
| **idTransaction**   | `string`         | ✅             | Identificador único de la transacción. Este ID es generado cuando se crea la solicitud de pago (por ejemplo, al crear un QR de pago).                                                                                                                                                                                                                                             |
| **successCallback** | `function`       | ❌             | Función de callback que se ejecuta cuando la transacción es exitosa. Esta función se ejecuta solo si el front-end de Toquea termina sin errores. Si no se pasa un callback, la vista de Toquea se cerrará automáticamente al finalizar la operación. En caso de duda sobre el estado final de la transacción, se recomienda usar el servicio [Get QR](#) o configurar un webhook. |

## Flujo de Trabajo

**1. Autenticación:** Para empezar, asegúrate de haber obtenido un accessToken válido al autenticarte con la API de Toquea. Este token se pasa como parámetro a Toquea.client().

**2. Creación de la Transacción:** A continuación, se genera un identificador único para la transacción, que también se pasa a Toquea.client(). Este idTransaction es crucial para asociar la transacción con la información de pago.

**3. Callback de Éxito:** Si la transacción es exitosa, el callback definido en successCallback se ejecutará, redirigiendo al usuario a la página de éxito o realizando alguna otra acción personalizada.

**4. Verificación de la Transacción:** Aunque el callback indica éxito, para una confirmación completa, se recomienda usar el servicio de Webhook o realizar una consulta al endpoint Get QR para obtener el estado final de la transacción.

## Consideraciones
- **Seguridad del accessToken:** Es importante que el accessToken se maneje de forma segura. Evita exponerlo en el front-end de manera no segura.
- **Verificación de Pago:** El callback solo es una indicación de que la transacción se completó sin errores en el front-end. Para asegurarte de que el pago fue procesado correctamente, siempre utiliza el webhook o consulta el estado de la transacción a través del servicio de consulta de QR.

## Ejemplo de Aplicación

A continuación, un ejemplo completo de cómo integrar el cliente Toquea en tu aplicación web:

```html

<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Pago Toquea QR</title>
  <script src="http://toquea.com/js-lib/toquea-qr"></script>
</head>
<body>
  <h1>Realiza tu pago con Toquea QR</h1>
  <button onclick="startPayment()">Pagar</button>

  <script>
    function startPayment() {
      Toquea.client({
        accessToken: "your_access_token",
        idTransaction: "transaction_id_12345",
        successCallback: function() {
          // Si el pago es exitoso, redirige al usuario a la página de éxito
          window.location.href = '/successPage.html';
        }
      });
    }
  </script>
</body>
</html>

```