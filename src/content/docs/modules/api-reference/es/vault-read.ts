import type { DocPage } from "@/@types/docs";

export const vaultRead: DocPage = {
  slug: "api-vault-read",
  title: "Operaciones de Bóveda (Lectura)",
  section: "Referencia API",
  tocItems: [
    "Autenticación y Propiedad",
    "Listar IDs de VC",
    "Conteo de VC",
    "Obtener VC",
    "Verificar VC",
    "Metadatos de la Bóveda",
    "Emisores Bloqueados",
    "Conteo de Emisores Bloqueados",
    "Parámetros de solicitud",
    "Respuestas",
  ],
  content: `
# Operaciones de Bóveda (Lectura)

Operaciones de solo lectura para datos de bóveda.

Las lecturas identifican la bóveda por **\`owner\`** (más un **\`userSalt\`** opcional); la API deriva la dirección de la bóveda a través del factory. No hay override de \`contractId\`.

## Autenticación y Propiedad

Todos los endpoints de lectura requieren una API key válida (header \`X-ACTA-Key\`).

- **\`list-vc-ids\`** y **\`get-vc\`** requieren además que \`owner\` coincida con el \`wallet_address\` vinculado a tu API key (las keys con rol admin están exentas), porque enumeran y devuelven contenidos de credenciales descifrados.
- **\`verify-vc\`** y las lecturas GET están abiertas a **cualquier API key válida**, para que terceros puedan verificar credenciales y leer metadatos públicos de la bóveda.

## Listar IDs de VC

### POST /contracts/vault/list-vc-ids

Lista los IDs de credenciales verificables (VC) almacenados en la bóveda de un propietario, con paginación.

**Cuerpo de solicitud:**

\`\`\`json
{
  "owner": "G...",
  "offset": 0,
  "limit": 50,
  "userSalt": "00...00"
}
\`\`\`

- \`offset\` (opcional): índice de inicio desde cero, por defecto \`0\`
- \`limit\` (opcional): tamaño de página, por defecto \`50\`, máximo \`200\` (valores mayores devuelven \`400 limit_too_large\`)

**Respuesta:**

\`\`\`json
{
  "result": ["credential-1", "credential-2", "credential-3"],
  "offset": 0,
  "limit": 50
}
\`\`\`

**Ejemplo:**

\`\`\`bash
curl -X POST https://api.testnet.acta.build/contracts/vault/list-vc-ids \\
  -H "X-ACTA-Key: your_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "owner": "G..."
  }'
\`\`\`

## Conteo de VC

### GET /contracts/vault/vc-count

Devuelve el número de VC almacenadas en la bóveda de un propietario. Úsalo para dimensionar la paginación de \`list-vc-ids\`.

**Parámetros de consulta:** \`owner\` (requerido), \`userSalt\` (opcional)

**Respuesta:**

\`\`\`json
{
  "count": 3
}
\`\`\`

**Ejemplo:**

\`\`\`bash
curl -H "X-ACTA-Key: your_key" \\
  "https://api.testnet.acta.build/contracts/vault/vc-count?owner=G..."
\`\`\`

## Obtener VC

### POST /contracts/vault/get-vc

Obtiene una credencial verificable específica de una bóveda. Los datos de la credencial se almacenan cifrados on-chain y la API los descifra antes de devolverlos, por eso este endpoint exige la vinculación key-owner.

**Cuerpo de solicitud:**

\`\`\`json
{
  "owner": "G...",
  "vcId": "credential-123",
  "userSalt": "00...00"
}
\`\`\`

**Respuesta:**

\`\`\`json
{
  "result": {
    "@context": [
      "https://www.w3.org/ns/credentials/v2",
      "https://www.w3.org/ns/credentials/examples/v2"
    ],
    "type": ["VerifiableCredential"],
    "credentialSubject": {
      "id": "did:stellar:...",
      "name": "John Doe"
    }
  }
}
\`\`\`

**Ejemplo:**

\`\`\`bash
curl -X POST https://api.testnet.acta.build/contracts/vault/get-vc \\
  -H "X-ACTA-Key: your_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "owner": "G...",
    "vcId": "credential-123"
  }'
\`\`\`

## Verificar VC

### POST /contracts/vault/verify-vc

Verifica una VC comprobando que existe en la bóveda del propietario y devolviendo su estado de emisión on-chain. Abierto a cualquier API key válida (sin verificación de propiedad) - este es el endpoint que usan los verificadores externos.

**Cuerpo de solicitud:**

\`\`\`json
{
  "owner": "G...",
  "vcId": "credential-123",
  "userSalt": "00...00"
}
\`\`\`

**Respuesta:**

\`\`\`json
{
  "status": "valid",
  "since": "2024-01-01T00:00:00.000Z"
}
\`\`\`

O si está revocada:

\`\`\`json
{
  "status": "revoked",
  "since": "2024-01-15T00:00:00.000Z"
}
\`\`\`

\`status\` es uno de \`"valid"\`, \`"revoked"\` o \`"invalid"\` (con \`"unknown"\` como respaldo cuando el contrato devuelve una forma inesperada).

**Ejemplo:**

\`\`\`bash
curl -X POST https://api.testnet.acta.build/contracts/vault/verify-vc \\
  -H "X-ACTA-Key: your_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "owner": "G...",
    "vcId": "credential-123"
  }'
\`\`\`

## Metadatos de la Bóveda

### GET /contracts/vault/:owner

Devuelve los metadatos de la bóveda del owner. Acepta un parámetro de consulta \`userSalt\` opcional para seleccionar una bóveda no predeterminada.

**Respuesta:**

\`\`\`json
{
  "owner": "G...",
  "vault_address": "C...",
  "did_uri": "did:stellar:...",
  "version": "0.4.0",
  "vc_count": 3,
  "denied_issuer_count": 1
}
\`\`\`

**Ejemplo:**

\`\`\`bash
curl -H "X-ACTA-Key: your_key" \\
  "https://api.testnet.acta.build/contracts/vault/G..."
\`\`\`

## Emisores Bloqueados

### GET /contracts/vault/issuers/denied

Lista las direcciones de emisores actualmente bloqueados (denegados) para la bóveda del owner, con paginación. La emisión está abierta por defecto, así que este es el conjunto de excepciones explícitas.

**Parámetros de consulta:** \`owner\` (requerido), \`offset\` (opcional), \`limit\` (opcional, máx 200), \`userSalt\` (opcional)

**Respuesta:**

\`\`\`json
{
  "issuers": ["G...", "G..."],
  "offset": 0,
  "limit": 50
}
\`\`\`

## Conteo de Emisores Bloqueados

### GET /contracts/vault/issuers/denied/count

Devuelve el número de emisores bloqueados para la bóveda del owner.

**Parámetros de consulta:** \`owner\` (requerido), \`userSalt\` (opcional)

**Respuesta:**

\`\`\`json
{
  "count": 1
}
\`\`\`

## Parámetros de solicitud

Las lecturas POST reciben un cuerpo JSON:
- **owner** (requerido): Dirección del propietario de la bóveda (G...)
- **vcId** (requerido para get-vc y verify-vc): Identificador de credencial
- **offset** / **limit** (opcional, solo list-vc-ids): paginación, limit ≤ 200
- **userSalt** (opcional): salt de 32 bytes (64 caracteres hex) que selecciona la bóveda del owner; por defecto son 32 bytes en cero (una bóveda canónica por owner)

Las lecturas GET reciben \`owner\` como parámetro de consulta (o como segmento de ruta para los metadatos de la bóveda) y aceptan \`userSalt\` como parámetro de consulta.

## Respuestas

- **Listar IDs de VC**: \`{ result, offset, limit }\` con \`result\` como array de cadenas de ID de credenciales
- **Conteo de VC**: \`{ count }\`
- **Obtener VC**: \`{ result }\` con los datos descifrados de la credencial
- **Verificar VC**: \`{ status, since? }\` con \`status\` "valid" | "revoked" | "invalid"
- **Metadatos de la Bóveda**: \`{ owner, vault_address, did_uri, version, vc_count, denied_issuer_count }\`
- **Emisores Bloqueados**: \`{ issuers, offset, limit }\`; **Conteo de Emisores Bloqueados**: \`{ count }\`
    `,
};
