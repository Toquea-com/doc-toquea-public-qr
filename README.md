# 📘 Documentación de la API - Toquea

Este proyecto contiene la especificación OpenAPI para la API de autenticación, generación de códigos QR y notificación de pagos por webhook de **Toquea**.

La documentación está basada en el estándar [OpenAPI 3.1.0](https://spec.openapis.org/oas/v3.1.0), y puede ser utilizada para generar documentación interactiva, SDKs, o integrarse en herramientas como Swagger UI, Postman, Stoplight o Redoc.

---

## 📁 Contenido del Proyecto

- `openapi.json`: Archivo principal con la especificación OpenAPI de la API.
- `README.md`: Este archivo.
- Opcional: documentación generada en HTML/Swagger UI (ver abajo).

---

## 📌 Funcionalidades Soportadas

### 🔐 Autenticación

**`POST /auth`**  
Permite a los clientes autenticarse mediante `username`, `password` y un `apiKey`.  
Devuelve un `accessToken` válido por 1 hora.

### 🧾 Crear QR

**`POST /qr`**  
Permite crear un nuevo QR para pagos, enviando monto, moneda, y detalles personalizados del pago.

### 🔍 Consultar QR

**`GET /qr/{qrId}`**  
Permite consultar el estado de un QR de pago (`PENDING` o `CREATED`) e incluye el `hash` para construir el código QR.

### 📡 Webhook: Notificación de Pago

**`paymentNotification`**  
Toquea notificará al sistema del cliente cuando se confirme un pago. Este webhook debe ser implementado por el cliente receptor.

---

## 🧾 Estructura del Webhook

Cuando un pago se realiza exitosamente, Toquea enviará una solicitud `POST` al endpoint definido por el cliente con un cuerpo como el siguiente:

```json
{
  "instructionId": "abc123",
  "qrId": "uuid-qr",
  "transferDetails": {
    "amount": 120.00,
    "currency": "PEN"
  },
  "originDetails": {
    "cci": "00212345678912345678",
    "name": "Juan Pérez",
    "documentType": "DNI",
    "documentNumber": "12345678"
  },
  "date": "2025-05-12T15:30:00Z"
}
```
El webhook debe devolver una respuesta 200 como esta:

```json
{
  "code": 200,
  "message": "Pago recibido correctamente.",
  "status": true,
  "date": "2025-05-12T15:31:00Z"
}
```

## 🧰 Tecnologías Utilizadas

- OpenAPI 3.1.0