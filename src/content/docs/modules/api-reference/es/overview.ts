import type { DocPage } from "@/@types/docs";

export const overview: DocPage = {
  slug: "api-overview",
  title: "Resumen",
  section: "Referencia API",
  tocItems: [
    "URLs base",
    "Autenticación",
    "Formato de solicitud",
    "Formato de respuesta",
    "Flujo Prepare/Submit",
    "Manejo de errores",
    "Límites de tasa",
    "Pruébalo en Postman",
  ],
  content: `
# Resumen de Referencia API

API RESTful para la gestión de credenciales ACTA en la blockchain Stellar. Todos los endpoints soportan redes mainnet y testnet.

## URLs base

**Testnet:**

\`\`\`
https://acta.build/api/testnet
\`\`\`

**Mainnet:**

\`\`\`
https://acta.build/api/mainnet
\`\`\`

## Autenticación

Las rutas de **contrato** (\`/contracts/*\` — bóveda lectura/escritura, bóveda patrocinada, operaciones VC, versión del contrato, etc.) requieren una API key válida en cada solicitud. Envíala en el header:

\`\`\`
X-ACTA-Key: tu_api_key_aqui
\`\`\`

### Obtener una API Key

Puedes crear una API key pública (rol estándar, expira en 6 meses) vía:

- **POST** \`/public/api-keys\` en la URL base de la red (ej. \`https://acta.build/api/testnet/public/api-keys\` o \`https://acta.build/api/mainnet/public/api-keys\`)

No requiere autenticación, pero tiene límite de 5 solicitudes por minuto por IP.

## Formato de solicitud

Todas las solicitudes usan formato JSON. El header Content-Type debe ser \`application/json\`.

### Operaciones de escritura (Prepare/Submit)

Las operaciones de escritura soportan dos modos:

1. **Prepare**: Envía solicitud sin \`signedXdr\` → devuelve XDR sin firmar
2. **Submit**: Envía solicitud con \`signedXdr\` → ejecuta la transacción

Ejemplo de solicitud prepare:

\`\`\`json
{
  "owner": "G...",
  "vcId": "credential-123",
  "vcData": "...",
  "issuer": "G...",
  "sourcePublicKey": "G..."
}
\`\`\`

Ejemplo de solicitud submit:

\`\`\`json
{
  "signedXdr": "AAAA..."
}
\`\`\`

## Formato de respuesta

### Respuesta exitosa

El modo prepare devuelve XDR sin firmar + network passphrase:

\`\`\`json
{
  "xdr": "AAAA...",
  "network": "Test SDF Network ; September 2015"
}
\`\`\`

El modo submit devuelve el ID de la transacción:

\`\`\`json
{
  "tx_id": "abc123..."
}
\`\`\`

### Respuesta de error

\`\`\`json
{
  "error": "error_code",
  "message": "Mensaje de error legible"
}
\`\`\`

## Flujo Prepare/Submit

1. **Prepare**: Llama al endpoint con parámetros de operación (sin \`signedXdr\`)
2. **Firmar**: Firma el \`xdr\` devuelto con tu wallet Stellar usando el \`network\` passphrase
3. **Submit**: Llama al mismo endpoint con \`signedXdr\` para ejecutar

## Manejo de errores

Todos los errores devuelven JSON con:
- \`error\`: Identificador del código de error
- \`message\`: Descripción del error legible

Códigos HTTP comunes:
- \`200\`: Éxito
- \`400\`: Solicitud incorrecta (parámetros inválidos)
- \`401\`: No autorizado (API key faltante o inválida)
- \`403\`: Prohibido (permisos insuficientes)
- \`404\`: No encontrado
- \`429\`: Límite de tasa excedido
- \`500\`: Error interno del servidor

## Límites de tasa

- Creación de API key pública: 5 solicitudes por minuto por IP
- Endpoints autenticados: Pueden aplicar límites según el nivel de la API key
- Headers de límite de tasa incluidos en respuestas:
  - \`X-RateLimit-Limit\`: Máximo de solicitudes permitidas
  - \`X-RateLimit-Remaining\`: Solicitudes restantes en la ventana
  - \`X-RateLimit-Reset\`: Timestamp Unix cuando se reinicia el límite

## Pruébalo en Postman

¿Quieres probar la API de ACTA de inmediato? Tenemos una colección pública en Postman con todos los endpoints preconfigurados y listos para usar.

1. Abre la [Colección ACTA en Postman](https://www.postman.com/acta-xyz-1193247/workspace/acta-team/collection/52380013-1a09da17-4bee-4267-b469-610c46969235?action=share&creator=52380013&active-environment=52380013-785bdf1a-3108-4c33-808c-76e31ee3b67f)
2. **Forkea la colección** en tu propio workspace de Postman
3. Selecciona el environment (**testnet** o **mainnet**)
4. ¡Empieza a hacer requests!

> Al forkear obtienes una copia personal que puedes personalizar, y puedes seguir recibiendo actualizaciones cuando agreguemos nuevos endpoints.
    `,
};
