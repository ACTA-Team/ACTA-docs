import type { DocPage } from "@/@types/docs";

export const overview: DocPage = {
  slug: "api-overview",
  title: "Resumen",
  section: "Referencia API",
  tocItems: [
    "URLs base",
    "Arquitectura: factory + bóvedas mono-inquilino",
    "Autenticación",
    "Formato de solicitud",
    "Formato de respuesta",
    "Configuración de red",
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

## Arquitectura: factory + bóvedas mono-inquilino

Desde v0.4.0 las bóvedas son **mono-inquilino**: cada propietario tiene su **propio** contrato \`vc-vault\`, desplegado de forma determinista por un **\`vc-vault-factory\`**. Hay un factory por red.

- La API/SDK **derivan** la dirección de la bóveda de un propietario a partir de \`(factory, owner, userSalt)\` - nunca pasas un \`contractId\` de bóveda en operaciones normales.
- El **\`userSalt\`** por defecto son 32 bytes en cero, dando exactamente **una bóveda canónica por propietario**. Usa un \`userSalt\` distinto (o un \`vaultContract\` explícito) solo si un propietario maneja varias bóvedas.
- Las **tarifas** se cobran **on-chain** por la bóveda mediante el \`quote_fee\` del factory al momento de emitir (por defecto **1 USDC por credencial, pagada por el emisor**). La API ya no acepta sobrescritura de tarifa, y los antiguos niveles de tarifa por rol (admin / early / standard) desaparecieron - el factory tiene una sola tarifa estándar más una tarifa personalizada opcional por emisor.
- La **emisión es abierta por defecto** (denegar-por-excepción): los propietarios no autorizan emisores; los **bloquean** (\`deny-issuer\`) y **desbloquean** (\`allow-issuer\`).
- El emisor debe controlar un **\`did:stellar\` registrado y resoluble**. \`did:pkh\` y direcciones de wallet planas ya no se aceptan como DID del emisor, y la API exige un vínculo controlador↔DID (el controlador on-chain del DID debe ser igual al emisor que firma; las discrepancias devuelven \`issuerDid_controller_mismatch\`).

**Parámetros opcionales** aceptados por las rutas de bóveda/credenciales:

- **\`userSalt\`** (opcional): salt de 32 bytes (hex) que selecciona cuál de las bóvedas del propietario se usa. Por defecto todo en cero.
- **\`vaultContract\`** (opcional, rutas de lectura): id de bóveda \`C...\` explícito, omitiendo la derivación.

## Autenticación

Las rutas de **contrato** (\`/contracts/*\` - bóveda lectura/escritura, bóveda patrocinada, operaciones VC, versión del contrato, etc.) requieren una API key válida en cada solicitud. Envíala en el header:

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

## Configuración de red

\`GET /config\` (requiere \`X-ACTA-Key\`) devuelve la configuración de red y contratos del host actual:

\`\`\`json
{
  "rpcUrl": "https://soroban-testnet.stellar.org:443",
  "networkPassphrase": "Test SDF Network ; September 2015",
  "networkType": "testnet",
  "factoryContractId": "C...",
  "vaultWasmHash": "2bd0323a...",
  "didStellarRegistryId": "C...",
  "actaContractId": "C..."
}
\`\`\`

- **\`factoryContractId\`**: el \`vc-vault-factory\` de esta red (usado para derivar direcciones de bóveda).
- **\`networkType\`**: \`"testnet"\` o \`"mainnet"\`.
- **\`vaultWasmHash\`**: el hash Wasm de la plantilla de bóveda que despliega el factory.
- **\`didStellarRegistryId\`**: el contrato \`did-stellar-registry\` usado para resolver los DID de los emisores.
- **\`actaContractId\`**: alias retrocompatible de \`factoryContractId\`.

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
