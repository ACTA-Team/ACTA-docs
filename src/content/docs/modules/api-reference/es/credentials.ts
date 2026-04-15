import type { DocPage } from "@/@types/docs";

export const credentials: DocPage = {
  slug: "api-credentials",
  title: "Operaciones de Credenciales",
  section: "Referencia API",
  tocItems: [
    "Emitir Credencial",
    "Emitir Credencial Vinculada",
    "Revocar Credencial",
    "Cuerpo de solicitud",
    "Flujo Prepare/Submit",
  ],
  content: `
# Operaciones de Credenciales

Endpoints para emitir y revocar credenciales verificables. Todos soportan flujo prepare/submit. **Emitir Credencial** (\`POST /contracts/vc/issue\`) y **Emitir Credencial Vinculada** (\`POST /contracts/vc/issue-linked\`) requieren API key; **Revocar Credencial** no requiere autenticación.

## Emitir Credencial

### POST /contracts/vc/issue

Emite una VC: almacena el payload en la bóveda del propietario y escribe el estado de emisión = válido. **Requiere API key.**

**Headers:**

\`\`\`
X-ACTA-Key: tu_api_key_aqui
\`\`\`

**Cuerpo de solicitud (Prepare):**

\`\`\`json
{
  "owner": "G...",
  "vcId": "credential-123",
  "vcData": "{\\"@context\\":[\\"https://www.w3.org/ns/credentials/v2\\",\\"https://www.w3.org/ns/credentials/examples/v2\\"],\\"type\\":[\\"VerifiableCredential\\"],\\"credentialSubject\\":{\\"id\\":\\"did:pkh:stellar:testnet:G...\\",\\"name\\":\\"John Doe\\"}}",
  "issuer": "G...",
  "holder": "did:pkh:stellar:testnet:G...",
  "issuerDid": "did:pkh:stellar:testnet:G...",
  "sourcePublicKey": "G...",
  "contractId": "C..."
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

**Ejemplo:**

\`\`\`bash
# Prepare
curl -X POST https://acta.build/api/testnet/contracts/vc/issue \\
  -H "X-ACTA-Key: tu_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "owner": "G...",
    "vcId": "credential-123",
    "vcData": "{\\"@context\\":[\\"https://www.w3.org/ns/credentials/v2\\",\\"https://www.w3.org/ns/credentials/examples/v2\\"],\\"type\\":[\\"VerifiableCredential\\"]}",
    "issuer": "G...",
    "holder": "did:pkh:stellar:testnet:G...",
    "sourcePublicKey": "G..."
  }'

# Submit (después de firmar)
curl -X POST https://acta.build/api/testnet/contracts/vc/issue \\
  -H "X-ACTA-Key: tu_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "signedXdr": "AAAA..."
  }'
\`\`\`

## Emitir Credencial Vinculada

### POST /contracts/vc/issue-linked

Emite una VC vinculada a una VC padre: almacena el payload en la bóveda del propietario con una referencia a la credencial padre. La VC padre debe existir y estar válida. **Requiere API key.**

**Headers:**

\`\`\`
X-ACTA-Key: tu_api_key_aqui
\`\`\`

**Cuerpo de solicitud (Prepare):**

\`\`\`json
{
  "owner": "G...",
  "vcId": "linked-credential-456",
  "vcData": "{\\"@context\\":[\\"https://www.w3.org/ns/credentials/v2\\",\\"https://www.w3.org/ns/credentials/examples/v2\\"],\\"type\\":[\\"VerifiableCredential\\"],\\"credentialSubject\\":{\\"id\\":\\"did:pkh:stellar:testnet:G...\\",\\"name\\":\\"John Doe\\"}}",
  "issuer": "G...",
  "holder": "did:pkh:stellar:testnet:G...",
  "issuerDid": "did:pkh:stellar:testnet:G...",
  "sourcePublicKey": "G...",
  "contractId": "C...",
  "parentOwner": "G...",
  "parentVcId": "credential-123"
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

**Ejemplo:**

\`\`\`bash
# Prepare
curl -X POST https://acta.build/api/testnet/contracts/vc/issue-linked \\
  -H "X-ACTA-Key: tu_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "owner": "G...",
    "vcId": "linked-credential-456",
    "vcData": "{\\"@context\\":[\\"https://www.w3.org/ns/credentials/v2\\",\\"https://www.w3.org/ns/credentials/examples/v2\\"],\\"type\\":[\\"VerifiableCredential\\"]}",
    "issuer": "G...",
    "holder": "did:pkh:stellar:testnet:G...",
    "sourcePublicKey": "G...",
    "parentOwner": "G...",
    "parentVcId": "credential-123"
  }'

# Submit (después de firmar)
curl -X POST https://acta.build/api/testnet/contracts/vc/issue-linked \\
  -H "X-ACTA-Key: tu_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "signedXdr": "AAAA..."
  }'
\`\`\`

## Revocar Credencial

### POST /contracts/vc/revoke

Revoca una VC por ID. No requiere autenticación.

**Cuerpo de solicitud (Prepare):**

\`\`\`json
{
  "vcId": "credential-123",
  "date": "2024-01-15T00:00:00.000Z",
  "sourcePublicKey": "G...",
  "contractId": "C..."
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

## Cuerpo de solicitud

### Emitir Credencial

- **owner** (requerido): Dirección del propietario de la bóveda (G...)
- **vcId** (requerido): Identificador de credencial
- **vcData** (requerido): Payload de datos de credencial (JSON string). Debe incluir \`@context\` con al menos \`"https://www.w3.org/ns/credentials/v2"\`
- **issuer** (requerido): Dirección del emisor (G...)
- **holder** (requerido): DID del titular de la credencial en formato \`did:pkh:stellar:{network}:{address}\`
- **issuerDid** (opcional): DID del emisor en formato \`did:pkh:stellar:{network}:{address}\`
- **sourcePublicKey** (requerido): Fuente de transacción que firmará (debe ser el emisor)
- **contractId** (opcional): Sobrescribir ID de contrato ACTA (C...)

### Emitir Credencial Vinculada

- **owner** (requerido): Dirección del propietario de la bóveda (G...)
- **vcId** (requerido): Identificador de credencial
- **vcData** (requerido): Payload de datos de credencial (JSON string). Debe incluir \`@context\` con al menos \`"https://www.w3.org/ns/credentials/v2"\`
- **issuer** (requerido): Dirección del emisor (G...)
- **holder** (requerido): DID del titular de la credencial en formato \`did:pkh:stellar:{network}:{address}\`
- **issuerDid** (opcional): DID del emisor en formato \`did:pkh:stellar:{network}:{address}\`
- **sourcePublicKey** (requerido): Fuente de transacción que firmará (debe ser el emisor)
- **contractId** (opcional): Sobrescribir ID de contrato ACTA (C...)
- **parentOwner** (requerido): Dirección del propietario de la VC padre (G...)
- **parentVcId** (requerido): Identificador de la VC padre

### Revocar Credencial

- **vcId** (requerido): Identificador de credencial
- **date** (opcional): Timestamp ISO-8601 (por defecto: ahora)
- **sourcePublicKey** (requerido): Fuente de transacción que firmará (debe ser propietario de VC o admin del contrato)
- **contractId** (opcional): Sobrescribir ID de contrato ACTA (C...)

## Flujo Prepare/Submit

1. **Prepare**: Envía solicitud con parámetros de operación (sin \`signedXdr\`)
2. **Firmar**: Firma el \`xdr\` devuelto con tu wallet Stellar usando el \`network\` passphrase
3. **Submit**: Envía solicitud con \`signedXdr\` para ejecutar

**Nota:** El endpoint \`issue\` almacena automáticamente la credencial en la bóveda y la marca como válida en una sola transacción.
    `,
};
