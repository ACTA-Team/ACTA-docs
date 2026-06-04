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
    "Pruébalo en Swagger",
  ],
  content: `
# Resumen de Referencia API

API RESTful para la gestión de credenciales ACTA en la blockchain Stellar. Todos los endpoints soportan redes mainnet y testnet.

## URLs base

**Testnet:**

\`\`\`
https://api.testnet.acta.build
\`\`\`

**Mainnet:**

\`\`\`
https://api.mainnet.acta.build
\`\`\`

## Autenticación

Las rutas de **contrato** (\`/contracts/*\` — bóveda lectura/escritura, bóveda patrocinada, operaciones VC, versión del contrato, etc.) requieren una API key válida en cada solicitud. Envíala en el header:

\`\`\`
X-ACTA-Key: tu_api_key_aqui
\`\`\`

### Obtener una API Key

Puedes crear una API key pública (rol estándar, expira en 6 meses) vía:

- **POST** \`/public/api-keys\` en la URL base de la red (ej. \`https://api.testnet.acta.build/public/api-keys\` o \`https://api.mainnet.acta.build/public/api-keys\`)

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

## Pruébalo en Swagger

Usa **[Swagger UI (testnet)](https://api.testnet.acta.build/docs)** para revisar el OpenAPI, ver esquemas de petición y respuesta, y ejecutar **Try it out** en el navegador cuando el endpoint lo permita.

1. Abre **[https://api.testnet.acta.build/docs](https://api.testnet.acta.build/docs)**
2. Despliega una operación, revisa parámetros y ejemplos, y usa **Try it out** si está disponible
3. En rutas que requieran API key, configura el header **\`X-ACTA-Key\`** (o **Authorize** en Swagger, si existe) tras crear una clave (ver **Obtener una API Key** arriba)

> Testnet es ideal para experimentar. En mainnet, usa el Swagger u OpenAPI que corresponda al host de API de producción si tu despliegue lo expone.
    `,
};
