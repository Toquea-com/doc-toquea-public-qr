---
title: Introducción
---

# Manual de APIs


La API de **QR Payments** está diseñada para simplificar la gestión de cobros mediante códigos QR, proveyendo dos capacidades clave:


- **Autenticación de comerciantes**
    - Permite autenticar al comerciante para obtener un `accessToken` que se utilizara en las siguiente llamadas del api de Qr.
- **Generación y consulta de QR de pago**
    - **Crear QR**: a partir de un monto, moneda, descripción y/o una informacion personalizada opcional, inicia la solicitud de cracion de un QR.
    - **Consultar QR**: consulta es estado de la solicitud de creacion de QR. De estar finalizado devolvera el campo `hash` que debe ser utilizar para construir el QR en algun cliente.
- **Webhook**
    - **Notificación de pago**: definición de servicio a construir por el comerciante para que Toquea pueda informa sobre el pago del QR. 

Con esta API, los integradores podrán centrarse en la experiencia de usuario y el flujo de negocio, delegando la creación y consulta de códigos QR en un servicio único y consistente.

## Propósito y alcance

### Objetivo
Ofrecer un único punto de integración RESTfull para que los comercios puedan emitir y controlar sus códigos QR de cobro sin preocuparse por la complejidad de los flujos subyacentes.

### Seguridad
Acceso mediante token de autenticación; todas las operaciones sensibles requieren validación previa.

### Respuestas

- **200 OK** con el payload JSON detallando el QR generado o su estado.
- **4XX** con estructura de error estandarizada para manejo de validaciones y excepciones.

