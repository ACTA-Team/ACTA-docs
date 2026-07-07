import type { DocPage } from "@/@types/docs";

export const credentials: DocPage = {
  slug: "api-credentials",
  title: "Operaciones de Credenciales",
  section: "Referencia API",
  tocItems: [
    "Emitir Credencial",
    "Emisión por Lote",
    "Revocar Credencial",
    "Requisito de DID del emisor",
    "Comisiones",
    "Cuerpo de solicitud",
    "Flujo Prepare/Submit",
  ],
  content: `
# Operaciones de Credenciales

Endpoints para emitir y revocar credenciales verificables. Todos soportan flujo prepare/submit y **todos requieren una API key** (\`X-ACTA-Key\`). **Emitir Credencial** (\`POST /contracts/vc/issue\`) y **Emisión por Lote** (\`POST /contracts/vc/batch-issue\`) requieren además que \`owner\` coincida con la wallet vinculada a tu API key (las keys con rol admin están exentas).

## Emitir Credencial

### POST /contracts/vc/issue

Emite una VC: almacena el payload en la bóveda del owner y escribe el estado de emisión = valid. **Requiere API key.**

**Headers:**

\`\`\`
X-ACTA-Key: tu_api_key_aqui
\`\`\`

**Cuerpo de solicitud (Prepare):**

\`\`\`json
{
  "owner": "G...",
  "vcId": "credential-123",
  "vcData": "{\\"@context\\":[\\"https://www.w3.org/ns/credentials/v2\\",\\"https://www.w3.org/ns/credentials/examples/v2\\"],\\"type\\":[\\"VerifiableCredential\\"],\\"credentialSubject\\":{\\"id\\":\\"did:stellar:...\\",\\"name\\":\\"John Doe\\"}}",
  "issuer": "G...",
  "issuerDid": "did:stellar:...",
  "userSalt": "00...00",
  "sourcePublicKey": "G..."
}
\`\`\`

El **holder** de la credencial se identifica con \`credentialSubject.id\` (un DID) dentro de \`vcData\`. No existe un campo \`holder\` aparte.

**Cuerpo de solicitud (Submit):**

\`\`\`json
{
  "signedXdr": "AAAA..."
}
\`\`\`

**Respuesta (Prepare):**

\`\`\`json
{
  "xdr": "AAAA...",
  "network": "Test SDF Network ; September 2015"
}
\`\`\`

**Respuesta (Submit):**

\`\`\`json
{
  "tx_id": "abc123..."
}
\`\`\`

**Ejemplo:**

\`\`\`bash
# Prepare
curl -X POST https://api.testnet.acta.build/contracts/vc/issue \\
  -H "X-ACTA-Key: tu_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "owner": "G...",
    "vcId": "credential-123",
    "vcData": "{\\"@context\\":[\\"https://www.w3.org/ns/credentials/v2\\",\\"https://www.w3.org/ns/credentials/examples/v2\\"],\\"type\\":[\\"VerifiableCredential\\"]}",
    "issuer": "G...",
    "issuerDid": "did:stellar:...",
    "sourcePublicKey": "G..."
  }'

# Submit (tras firmar)
curl -X POST https://api.testnet.acta.build/contracts/vc/issue \\
  -H "X-ACTA-Key: tu_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "signedXdr": "AAAA..."
  }'
\`\`\`

## Emisión por Lote

### POST /contracts/vc/batch-issue

Emite varias VC en la bóveda del mismo owner en una sola transacción. Cada entrada lleva solo \`vcId\` y \`vcData\`; el holder de cada credencial es \`credentialSubject.id\` dentro de su propio \`vcData\` (**no** hay campo \`holder\`). **Requiere API key.**

**Límites:** de 1 a 5 credenciales por lote (\`MAX_BATCH_SIZE\` = 5); \`vcId\` hasta 64 caracteres; \`vcData\` hasta 10,000 caracteres. Excederlos devuelve \`400 batch_too_large\`, \`400 vcs[i].vcId_too_long\` o \`400 vcs[i].vcData_too_long\`.

**Cuerpo de solicitud (Prepare):**

\`\`\`json
{
  "owner": "G...",
  "issuer": "G...",
  "issuerDid": "did:stellar:...",
  "userSalt": "00...00",
  "sourcePublicKey": "G...",
  "vcs": [
    {
      "vcId": "credential-1",
      "vcData": "{\\"@context\\":[\\"https://www.w3.org/ns/credentials/v2\\"],\\"type\\":[\\"VerifiableCredential\\"],\\"credentialSubject\\":{\\"id\\":\\"did:stellar:...\\"}}"
    },
    {
      "vcId": "credential-2",
      "vcData": "{\\"@context\\":[\\"https://www.w3.org/ns/credentials/v2\\"],\\"type\\":[\\"VerifiableCredential\\"],\\"credentialSubject\\":{\\"id\\":\\"did:stellar:...\\"}}"
    }
  ]
}
\`\`\`

**Cuerpo de solicitud (Submit):**

\`\`\`json
{
  "signedXdr": "AAAA..."
}
\`\`\`

**Respuestas:** Prepare devuelve \`{ xdr, network }\`; Submit devuelve \`{ tx_id }\`.

## Revocar Credencial

### POST /contracts/vc/revoke

Revoca una VC por ID en la bóveda de un owner concreto. Requiere una API key. La transacción debe firmarla el **propietario de la bóveda** (el contrato exige \`owner.require_auth()\`).

**Cuerpo de solicitud (Prepare):**

\`\`\`json
{
  "owner": "G...",
  "vcId": "credential-123",
  "date": "2024-01-15T00:00:00.000Z",
  "userSalt": "00...00",
  "sourcePublicKey": "G..."
}
\`\`\`

**Cuerpo de solicitud (Submit):**

\`\`\`json
{
  "signedXdr": "AAAA..."
}
\`\`\`

**Respuesta (Prepare):**

\`\`\`json
{
  "xdr": "AAAA...",
  "network": "Test SDF Network ; September 2015"
}
\`\`\`

**Respuesta (Submit):**

\`\`\`json
{
  "tx_id": "abc123..."
}
\`\`\`

## Requisito de DID del emisor

El \`issuerDid\` debe ser un **\`did:stellar\`** registrado y resoluble. Las direcciones de wallet "a secas" y los valores \`did:pkh\` **ya no se aceptan**. La API exige una vinculación controlador-DID: el controlador on-chain del DID debe ser igual al \`issuer\` que firma. Si difieren, la solicitud falla con:

\`\`\`json
{
  "error": "issuerDid_controller_mismatch",
  "message": "El controlador del DID del emisor no coincide con el emisor que firma"
}
\`\`\`

## Comisiones

La emisión cobra una **comisión on-chain** calculada por la bóveda mediante \`quote_fee\` del factory y **pagada por el emisor** (mainnet: 1 USDC por credencial; testnet: 5 XLM). La API **no** acepta un override de comisión: hay una única comisión estándar más una comisión personalizada opcional por emisor, ambas resueltas on-chain.

## Cuerpo de solicitud

### Emitir Credencial

- **owner** (requerido): Dirección del propietario de la bóveda (G...)
- **vcId** (requerido): Identificador de credencial (máx 64 caracteres)
- **vcData** (requerido): Payload de datos de la credencial (string JSON, máx 10,000 caracteres). Debe incluir \`@context\` con al menos \`"https://www.w3.org/ns/credentials/v2"\` y \`credentialSubject.id\` (el DID del holder). La API cifra \`vcData\` (AES-256-GCM) antes de almacenarlo on-chain
- **issuer** (requerido): Dirección del emisor (G...)
- **issuerDid** (requerido): \`did:stellar\` registrado y resoluble cuyo controlador on-chain es igual a \`issuer\`
- **userSalt** (opcional): salt de 32 bytes que selecciona la bóveda del owner; por defecto 32 bytes en cero
- **sourcePublicKey** (requerido): Fuente de transacción que firmará (debe ser el emisor)

### Emisión por Lote

- **owner** (requerido): Dirección del propietario de la bóveda (G...)
- **issuer** (requerido): Dirección del emisor (G...)
- **issuerDid** (requerido): \`did:stellar\` registrado y resoluble cuyo controlador on-chain es igual a \`issuer\`
- **vcs** (requerido): Array de \`{ vcId, vcData }\`. Cada \`vcData\` lleva su propio DID de holder en \`credentialSubject.id\`
- **userSalt** (opcional): salt de 32 bytes que selecciona la bóveda del owner
- **sourcePublicKey** (requerido): Fuente de transacción que firmará (debe ser el emisor)

### Revocar Credencial

- **owner** (requerido): Dirección del propietario (G...) cuya bóveda contiene la credencial
- **vcId** (requerido): Identificador de credencial
- **date** (opcional): Timestamp ISO-8601 (por defecto: ahora)
- **userSalt** (opcional): salt de 32 bytes que selecciona la bóveda del owner
- **sourcePublicKey** (requerido): Fuente de transacción que firmará (debe ser el owner de la VC o admin del contrato)

## Flujo Prepare/Submit

1. **Prepare**: Envía solicitud con parámetros de operación (sin \`signedXdr\`)
2. **Firmar**: Firma el \`xdr\` devuelto con tu wallet Stellar usando el \`network\` passphrase
3. **Submit**: Envía solicitud con \`signedXdr\` para ejecutar

**Nota:** \`issue\` almacena la credencial en la bóveda y la marca como válida en una sola transacción.
    `,
};
