import type { DocPage } from "@/@types/docs";

export const vaultRead: DocPage = {
  slug: "api-vault-read",
  title: "Operaciones de Bóveda (Lectura)",
  section: "Referencia API",
  tocItems: [
    "Listar IDs de VC",
    "Obtener VC",
    "Obtener VC Padre",
    "Verificar VC",
    "Cuerpo de solicitud",
    "Respuestas",
  ],
  content: `
# Operaciones de Bóveda (Lectura)

Operaciones de solo lectura para datos de bóveda. No requiere autenticación.

## Listar IDs de VC

### POST /contracts/vault/list-vc-ids

Lista los IDs de credenciales verificables (VC) almacenados en la bóveda de un propietario.

**Cuerpo de solicitud:**

\`\`\`json
{
  "owner": "G...",
  "contractId": "C..."
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
  "contractId": "C..."
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

## Obtener VC Padre

### POST /contracts/vault/get-vc-parent

Obtiene la info de la VC padre para una credencial vinculada. Devuelve \`null\` si la credencial no tiene vínculo padre. No requiere autenticación.

**Cuerpo de solicitud:**

\`\`\`json
{
  "owner": "G...",
  "vcId": "linked-credential-456",
  "contractId": "C..."
}
\`\`\`

**Respuesta (con padre):**

\`\`\`json
{
  "parent": {
    "owner": "G...",
    "vc_id": "credential-123"
  }
}
\`\`\`

**Respuesta (sin padre):**

\`\`\`json
{
  "parent": null
}
\`\`\`

**Ejemplo:**

\`\`\`bash
curl -X POST https://api.testnet.acta.build/contracts/vault/get-vc-parent \\
  -H "Content-Type: application/json" \\
  -d '{
    "owner": "G...",
    "vcId": "linked-credential-456"
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
  "contractId": "C..."
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

## Cuerpo de solicitud

Todos los endpoints requieren:
- **owner** (requerido): Dirección del propietario de la bóveda (G...)
- **vcId** (requerido para get-vc y verify-vc): Identificador de credencial
- **contractId** (opcional): Sobrescribir ID de contrato ACTA (C...)

## Respuestas

- **Listar IDs de VC**: Array de cadenas de ID de credenciales
- **Obtener VC**: Objeto de datos de credencial o null si no se encuentra
- **Verificar VC**: Objeto de estado con \`status\` ("valid" | "revoked") y timestamp opcional \`since\`
    `,
};
