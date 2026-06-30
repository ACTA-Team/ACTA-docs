import type { DocPage } from "@/@types/docs";

export const vaultRead: DocPage = {
  slug: "api-vault-read",
  title: "Operaciones de Bóveda (Lectura)",
  section: "Referencia API",
  tocItems: [
    "Listar IDs de VC",
    "Obtener VC",
    "Verificar VC",
    "Conteo de VC",
    "Emisores Bloqueados",
    "Conteo de Emisores Bloqueados",
    "Metadatos de la Bóveda",
    "Cuerpo de solicitud",
    "Respuestas",
  ],
  content: `
# Operaciones de Bóveda (Lectura)

Operaciones de solo lectura para datos de bóveda. No requieren autenticación.

> **Bóvedas mono-inquilino (v0.4.0):** las rutas de lectura reciben **\`owner\`** y derivan la bóveda de \`(factory, owner, userSalt)\`. Pasa el **\`userSalt\`** opcional (hex de 32 bytes, por defecto todo en cero) para apuntar a una bóveda no canónica, o **\`vaultContract\`** (\`C...\`) para direccionar una bóveda directamente y omitir la derivación.

## Listar IDs de VC

### POST /contracts/vault/list-vc-ids

Lista los IDs de credenciales verificables (VC) almacenados en la bóveda de un propietario.

**Cuerpo de solicitud:**

\`\`\`json
{
  "owner": "G...",
  "userSalt": "0000...0000"
}
\`\`\`

**Respuesta:**

\`\`\`json
["credential-1", "credential-2", "credential-3"]
\`\`\`

**Ejemplo:**

\`\`\`bash
curl -X POST https://api.testnet.acta.build/contracts/vault/list-vc-ids \\
  -H "Content-Type: application/json" \\
  -d '{
    "owner": "G..."
  }'
\`\`\`

## Obtener VC

### POST /contracts/vault/get-vc

Obtiene una credencial verificable específica de una bóveda.

**Cuerpo de solicitud:**

\`\`\`json
{
  "owner": "G...",
  "vcId": "credential-123",
  "userSalt": "0000...0000"
}
\`\`\`

**Respuesta:**

\`\`\`json
{
  "vcData": {
    "@context": [
      "https://www.w3.org/ns/credentials/v2",
      "https://www.w3.org/ns/credentials/examples/v2"
    ],
    "type": ["VerifiableCredential"],
    "credentialSubject": {
      "id": "did:stellar:testnet:znfxngsh46vkyqu6inrx4omphi",
      "name": "John Doe"
    }
  }
}
\`\`\`

**Ejemplo:**

\`\`\`bash
curl -X POST https://api.testnet.acta.build/contracts/vault/get-vc \\
  -H "Content-Type: application/json" \\
  -d '{
    "owner": "G...",
    "vcId": "credential-123"
  }'
\`\`\`

## Verificar VC

### POST /contracts/vault/verify-vc

Verifica una VC comprobando que existe en la bóveda del propietario y devolviendo su estado de emisión.

**Cuerpo de solicitud:**

\`\`\`json
{
  "owner": "G...",
  "vcId": "credential-123",
  "userSalt": "0000...0000"
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

**Ejemplo:**

\`\`\`bash
curl -X POST https://api.testnet.acta.build/contracts/vault/verify-vc \\
  -H "Content-Type: application/json" \\
  -d '{
    "owner": "G...",
    "vcId": "credential-123"
  }'
\`\`\`

## Conteo de VC

### POST /contracts/vault/vc-count

Devuelve la cantidad de VC almacenadas en la bóveda de un propietario.

**Cuerpo de solicitud:**

\`\`\`json
{
  "owner": "G...",
  "userSalt": "0000...0000"
}
\`\`\`

**Respuesta:**

\`\`\`json
{
  "count": 12
}
\`\`\`

## Emisores Bloqueados

### GET /contracts/vault/issuers/denied

Lista los emisores que un propietario ha **bloqueado** (denegar-por-excepción). La emisión es abierta por defecto, por lo que esta lista está vacía a menos que el propietario haya bloqueado a alguien explícitamente.

**Parámetros de consulta:**

- \`owner\` (requerido): Dirección del propietario de la bóveda (\`G...\`)
- \`userSalt\` (opcional): Selecciona la bóveda. Por defecto todo en cero.
- \`vaultContract\` (opcional): id de bóveda \`C...\` explícito.

**Respuesta:**

\`\`\`json
["G...blocked-1", "G...blocked-2"]
\`\`\`

**Ejemplo:**

\`\`\`bash
curl "https://api.testnet.acta.build/contracts/vault/issuers/denied?owner=G..."
\`\`\`

## Conteo de Emisores Bloqueados

### GET /contracts/vault/issuers/denied/count

Devuelve la cantidad de emisores bloqueados en la bóveda de un propietario.

**Parámetros de consulta:**

- \`owner\` (requerido): Dirección del propietario de la bóveda (\`G...\`)
- \`userSalt\` (opcional): Selecciona la bóveda. Por defecto todo en cero.
- \`vaultContract\` (opcional): id de bóveda \`C...\` explícito.

**Respuesta:**

\`\`\`json
{
  "count": 2
}
\`\`\`

## Metadatos de la Bóveda

### GET /contracts/vault/:owner

Devuelve los metadatos de la bóveda derivada de un propietario.

**Parámetros de ruta / consulta:**

- \`:owner\` (requerido): Dirección del propietario de la bóveda (\`G...\`)
- \`userSalt\` (opcional, consulta): Selecciona la bóveda. Por defecto todo en cero.
- \`vaultContract\` (opcional, consulta): id de bóveda \`C...\` explícito.

**Respuesta:**

\`\`\`json
{
  "owner": "G...",
  "vault_address": "C...",
  "did_uri": "did:stellar:testnet:znfxngsh46vkyqu6inrx4omphi",
  "version": "0.4.0",
  "vc_count": 12,
  "denied_issuer_count": 2
}
\`\`\`

**Ejemplo:**

\`\`\`bash
curl "https://api.testnet.acta.build/contracts/vault/G..."
\`\`\`

## Cuerpo de solicitud

Las operaciones de VC requieren:
- **owner** (requerido): Dirección del propietario de la bóveda (\`G...\`)
- **vcId** (requerido para get-vc y verify-vc): Identificador de credencial
- **userSalt** (opcional): salt de 32 bytes (hex) que selecciona cuál de las bóvedas del propietario se usa (por defecto todo en cero)
- **vaultContract** (opcional): id de bóveda \`C...\` explícito, omitiendo la derivación

## Respuestas

- **Listar IDs de VC**: Array de cadenas de ID de credenciales
- **Obtener VC**: Objeto de datos de credencial o null si no se encuentra
- **Verificar VC**: Objeto de estado con \`status\` ("valid" | "revoked") y timestamp opcional \`since\`
- **Conteo de VC / Conteo de Emisores Bloqueados**: \`{ "count": number }\`
- **Emisores Bloqueados**: Array de direcciones de emisores bloqueados
- **Metadatos de la Bóveda**: \`{ owner, vault_address, did_uri, version, vc_count, denied_issuer_count }\`
    `,
};
