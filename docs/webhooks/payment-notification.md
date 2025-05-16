# Notificaciónes de pago

## Descripción

Este webhook debe ser implementado por el cliente para recibir notificaciones cuando se confirme el pago de un QR.  
El sistema de Toquea enviará una solicitud `POST` al endpoint proporcionado por el cliente con los detalles del pago.


## 🔔 Evento: `paymentNotification`

- **Método:** `POST`  
- **Ruta:** Definida por el cliente  
- **Contenido:** `application/json`


## 🧾 Cuerpo de la Solicitud (`requestBody`)

```json
{
  "instructionId": "1234567890",
  "qrId": "f37b6d7d-8f57-4c1f-9c9e-df9a3e32f0a2",
  "transferDetails": {
    "amount": 100.50,
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

## 📌 Campos del `requestBody`

| Campo                          | Tipo              | Requerido | Descripción                                            |
| ------------------------------ | ----------------- | --------- | ------------------------------------------------------ |
| `instructionId`                | string            | ✅         | Identificador único de la operación.                   |
| `qrId`                         | uuid              | ✅         | Identificador único del QR.                            |
| `transferDetails.amount`       | number            | ✅         | Monto de la transacción.                               |
| `transferDetails.currency`     | string            | ✅         | Moneda de la transacción (`PEN` o `USD`).              |
| `originDetails.cci`            | string            | ❌         | Código de cuenta interbancaria del cliente originante. |
| `originDetails.name`           | string            | ✅         | Nombre del cliente originante.                         |
| `originDetails.documentType`   | string            | ✅         | Tipo de documento (`DNI`).                             |
| `originDetails.documentNumber` | string            | ✅         | Número de documento del cliente.                       |
| `date`                         | string (ISO 8601) | ✅         | Fecha y hora de confirmación del pago.                 |


## ✅ Respuesta Esperada (200 OK)

El webhook debe devolver una respuesta `200 OK` para confirmar la recepción exitosa del evento.

```json
{
  "code": 200,
  "message": "Pago recibido correctamente.",
  "status": true,
  "date": "2025-05-12T15:31:00Z"
}

```

## 📌 Campos de la Respuesta

| Campo     | Tipo    | Descripción                                      |
| --------- | ------- | ------------------------------------------------ |
| `code`    | integer | Código de estado HTTP.                           |
| `message` | string  | Descripción del resultado.                       |
| `status`  | boolean | `true` si el mensaje fue procesado exitosamente. |
| `date`    | string  | Fecha de confirmación del procesamiento.         |


## 📣 Consideraciones

- Es responsabilidad del cliente asegurar la disponibilidad del endpoint.

- Si el cliente devuelve un código diferente a `2XX`, Toquea puede reenviar la notificación.

- Se recomienda registrar los eventos recibidos para trazabilidad.