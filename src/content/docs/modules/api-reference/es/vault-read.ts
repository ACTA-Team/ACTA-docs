import type { DocPage } from "@/@types/docs";

export const vaultRead: DocPage = {
  slug: "api-vault-read",
  title: "Operaciones de Bóveda (Lectura)",
  section: "Referencia API",
  tocItems: [
    "Listar IDs de VC",
    "Conteo de VC",
    "Obtener VC",
    "Verificar VC",
    "Metadatos de la Bóveda",
    "Emisores Bloqueados",
    "Conteo de Emisores Bloqueados",
    "Cuerpo de solicitud",
    "Respuestas",
  ],
  content: `
# Operaciones de Bóveda (Lectura)

Operaciones de solo lectura para datos de bóveda. No requiere autenticación.

Las lecturas identifican la bóveda por **\`owner\`** (más un **\`userSalt\`** opcional). También puedes pasar **\`vaultContract\`** (la dirección \`C...\` ya resuelta) para saltarte la resolución vía factory. No hay override de \`contractId\`.

## Listar IDs de VC

### POST /contracts/vault/list-vc-ids

Lista los IDs de credenciales verificables (VC) almacenados en la bóveda de un propietario.

**Cuerpo de solicitud:**

\`\`\`json
{
  "owner": "G...",
  "userSalt": "00...00"
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

## Conteo de VC

### POST /contracts/vault/vc-count

Devuelve el número de VC almacenadas en la bóveda de un propietario.

**Cuerpo de solicitud:**

\`\`\`json
{
  "owner": "G...",
  "userSalt": "00...00"
}
\`\`\`

**Respuesta:**

\`\`\`json
{
  "count": 3
}
\`\`\`

## Obtener VC

### POST /contracts/vault/get-vc

Obtiene una credencial verificable específica de una bóveda.

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
  "vcData": {
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

**Ejemplo:**

\`\`\`bash
curl -X POST https://api.testnet.acta.build/contracts/vault/verify-vc \\
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
curl "https://api.testnet.acta.build/contracts/vault/G..."
\`\`\`

## Emisores Bloqueados

### GET /contracts/vault/:owner/issuers/denied

Lista las direcciones de emisores actualmente bloqueados (denegados) para la bóveda del owner. La emisión está abierta por defecto, así que este es el conjunto de excepciones explícitas.

**Respuesta:**

\`\`\`json
["G...", "G..."]
\`\`\`

## Conteo de Emisores Bloqueados

### GET /contracts/vault/:owner/issuers/denied/count

Devuelve el número de emisores bloqueados para la bóveda del owner.

**Respuesta:**

\`\`\`json
{
  "count": 1
}
\`\`\`

## Cuerpo de solicitud

Las lecturas POST requieren:
- **owner** (requerido): Dirección del propietario de la bóveda (G...)
- **vcId** (requerido para get-vc y verify-vc): Identificador de credencial
- **userSalt** (opcional): salt de 32 bytes que selecciona la bóveda del owner; por defecto son 32 bytes en cero (una bóveda canónica por owner)
- **vaultContract** (opcional): Dirección de bóveda resuelta (C...) para saltarse la resolución vía factory

Las lecturas GET reciben \`owner\` como segmento de ruta y aceptan \`userSalt\` como parámetro de consulta.

## Respuestas

- **Listar IDs de VC**: Array de cadenas de ID de credenciales
- **Conteo de VC**: \`{ count }\`
- **Obtener VC**: Objeto de datos de credencial o null si no se encuentra
- **Verificar VC**: Objeto de estado con \`status\` ("valid" | "revoked") y timestamp opcional \`since\`
- **Metadatos de la Bóveda**: \`{ owner, vault_address, did_uri, version, vc_count, denied_issuer_count }\`
- **Emisores Bloqueados**: Array de direcciones de emisores; **Conteo de Emisores Bloqueados**: \`{ count }\`
    `,
};
