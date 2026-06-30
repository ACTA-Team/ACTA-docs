import type { DocPage } from "@/@types/docs";

export const credentials: DocPage = {
  slug: "api-credentials",
  title: "Operaciones de Credenciales",
  section: "Referencia API",
  tocItems: [
    "Requisito de DID del emisor",
    "Emitir Credencial",
    "Emisión por Lote",
    "Revocar Credencial",
    "Tarifas",
    "Cuerpo de solicitud",
    "Flujo Prepare/Submit",
  ],
  content: `
# Operaciones de Credenciales

Endpoints para emitir y revocar credenciales verificables. Todos soportan flujo prepare/submit. **Emitir Credencial** (\`POST /contracts/vc/issue\`) y **Emisión por Lote** (\`POST /contracts/vc/batch-issue\`) requieren API key; **Revocar Credencial** no requiere autenticación.

> **Bóvedas mono-inquilino (v0.4.0):** la emisión apunta a la **bóveda derivada del propietario** (\`(factory, owner, userSalt)\`). Pasa **\`owner\`** más los opcionales **\`userSalt\`** / **\`vaultContract\`** — no hay un \`contractId\` de bóveda para emitir.

## Requisito de DID del emisor

El emisor debe controlar un **\`did:stellar\` registrado y resoluble**:

- **\`issuerDid\`** es **requerido** y debe ser un \`did:stellar:{network}:{didId}\` que resuelva on-chain. \`did:pkh\` y direcciones de wallet planas **ya no se aceptan**.
- La API exige un **vínculo controlador↔DID**: el controlador on-chain del DID debe ser igual al emisor que firma. Si difieren, la solicitud falla con **\`issuerDid_controller_mismatch\`**.

## Emitir Credencial

### POST /contracts/vc/issue

Emite una VC: almacena el payload en la bóveda derivada del propietario y escribe el estado de emisión = valid. La tarifa on-chain se cobra mediante el \`quote_fee\` del factory y la paga el emisor. **Requiere API key.**

**Headers:**

\`\`\`
X-ACTA-Key: tu_api_key_aqui
\`\`\`

**Cuerpo de solicitud (Prepare):**

\`\`\`json
{
  "owner": "G...",
  "vcId": "credential-123",
  "vcData": "{\\"@context\\":[\\"https://www.w3.org/ns/credentials/v2\\",\\"https://www.w3.org/ns/credentials/examples/v2\\"],\\"type\\":[\\"VerifiableCredential\\"],\\"credentialSubject\\":{\\"id\\":\\"did:stellar:testnet:znfxngsh46vkyqu6inrx4omphi\\",\\"name\\":\\"John Doe\\"}}",
  "issuer": "G...",
  "issuerDid": "did:stellar:testnet:znfxngsh46vkyqu6inrx4omphi",
  "userSalt": "0000...0000",
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
    "issuerDid": "did:stellar:testnet:znfxngsh46vkyqu6inrx4omphi",
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

Emite múltiples VC en la bóveda derivada del propietario en una sola transacción. Aplica el mismo requisito de DID del emisor y la tarifa on-chain por credencial. **Requiere API key.**

**Cuerpo de solicitud (Prepare):**

\`\`\`json
{
  "owner": "G...",
  "issuer": "G...",
  "issuerDid": "did:stellar:testnet:znfxngsh46vkyqu6inrx4omphi",
  "userSalt": "0000...0000",
  "sourcePublicKey": "G...",
  "vcs": [
    {
      "vcId": "credential-1",
      "vcData": "{\\"@context\\":[\\"https://www.w3.org/ns/credentials/v2\\"],\\"type\\":[\\"VerifiableCredential\\"]}"
    },
    {
      "vcId": "credential-2",
      "vcData": "{\\"@context\\":[\\"https://www.w3.org/ns/credentials/v2\\"],\\"type\\":[\\"VerifiableCredential\\"]}"
    }
  ]
}
\`\`\`

**Respuesta (Submit):**

\`\`\`json
{
  "tx_id": "abc123..."
}
\`\`\`

## Revocar Credencial

### POST /contracts/vc/revoke

Revoca una VC por ID en la bóveda derivada del propietario. No requiere autenticación. **Requiere \`owner\`** para que la API pueda derivar la bóveda correcta.

**Cuerpo de solicitud (Prepare):**

\`\`\`json
{
  "owner": "G...",
  "vcId": "credential-123",
  "date": "2024-01-15T00:00:00.000Z",
  "userSalt": "0000...0000",
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

## Tarifas

Las tarifas de emisión se cobran **on-chain** por la bóveda mediante el \`quote_fee\` del factory (por defecto **1 USDC por credencial**, pagada por el **emisor**). La API **ya no acepta sobrescritura de tarifa**, y no hay niveles de tarifa por rol — el factory tiene una sola tarifa estándar más una tarifa personalizada opcional por emisor (con expiración opcional).

## Cuerpo de solicitud

### Emitir Credencial

- **owner** (requerido): Dirección del propietario de la bóveda (\`G...\`); la bóveda se deriva de ella.
- **vcId** (requerido): Identificador de credencial
- **vcData** (requerido): Payload de datos de la credencial (string JSON). Debe incluir \`@context\` con al menos \`"https://www.w3.org/ns/credentials/v2"\`. El titular se expresa dentro de \`vcData\` como \`credentialSubject.id\` (p. ej. un \`did:stellar\`), no como un campo aparte.
- **issuer** (requerido): Dirección del emisor (\`G...\`)
- **issuerDid** (requerido): El \`did:stellar\` resoluble del emisor; su controlador on-chain debe ser igual a \`issuer\`
- **userSalt** (opcional): salt de 32 bytes (hex) que selecciona la bóveda del propietario (por defecto todo en cero)
- **vaultContract** (opcional): id de bóveda \`C...\` explícito, omitiendo la derivación
- **sourcePublicKey** (requerido): Fuente de transacción que firmará (debe ser el emisor)

### Emisión por Lote

- **owner**, **issuer**, **issuerDid**, **sourcePublicKey**: como arriba
- **userSalt** / **vaultContract** (opcionales): como arriba
- **vcs** (requerido): Array de entradas \`{ vcId, vcData }\` (el titular va dentro de cada \`vcData\` como \`credentialSubject.id\`)

### Revocar Credencial

- **owner** (requerido): Dirección del propietario de la bóveda (\`G...\`); la bóveda se deriva de ella.
- **vcId** (requerido): Identificador de credencial
- **date** (opcional): timestamp ISO-8601 (por defecto: ahora)
- **userSalt** (opcional): Selecciona la bóveda del propietario (por defecto todo en cero)
- **sourcePublicKey** (requerido): Fuente de transacción que firmará

## Flujo Prepare/Submit

1. **Prepare**: Envía solicitud con parámetros de operación (sin \`signedXdr\`)
2. **Firmar**: Firma el \`xdr\` devuelto con tu wallet Stellar usando el \`network\` passphrase
3. **Submit**: Envía solicitud con \`signedXdr\` para ejecutar

**Nota:** El endpoint \`issue\` almacena la credencial en la bóveda derivada y la marca como válida en una sola transacción; la tarifa on-chain se cobra en este paso.
    `,
};
