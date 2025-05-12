---
title: Introducción
---

# Manual de APIs


La API de **QR Payments** está diseñada para simplificar la gestión de cobros mediante códigos QR, proveyendo dos capacidades clave:


- **Registro de comerciantes**
    - Permite crear y configurar el perfil de un comercio o punto de venta dentro de nuestra plataforma, definiendo datos esenciales (identificador, nombre, moneda, información de banco, etc.).
- **Generación y consulta de QR de pago**
    - **Crear QR**: a partir de un monto, moneda y descripción, genera un código QR listo para ser escaneado por el cliente.
    - **Consultar QR**: recupera el estado y la información asociada a un código QR previamente emitido.

Con esta API, los integradores podrán centrarse en la experiencia de usuario y el flujo de negocio, delegando la creación, expiración y consulta de códigos QR en un servicio único y consistente.

## Propósito y alcance

### Objetivo
Ofrecer un único punto de integración RESTfull para que los comercios puedan emitir y controlar sus códigos QR de cobro sin preocuparse por la complejidad de los flujos subyacentes.

### Seguridad
Acceso mediante token de autenticación; todas las operaciones sensibles requieren validación previa.

### Respuestas

- **200 OK** con el payload JSON detallando el QR generado o su estado.
- **4XX** con estructura de error estandarizada para manejo de validaciones y excepciones.

