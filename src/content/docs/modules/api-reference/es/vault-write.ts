import type { DocPage } from "@/@types/docs";

export const vaultWrite: DocPage = {
  slug: "api-vault-write",
  title: "Operaciones de Bóveda (Escritura)",
  section: "Referencia API",
  tocItems: [
    "Crear Bóveda",
    "Autorizar Emisor",
    "Autorizar Emisores (Múltiples)",
    "Revocar Emisor",
    "Revocar Bóveda",
    "Establecer nuevo propietario",
    "Migrate",
    "Bóveda patrocinada",
    "Flujo Prepare/Submit",
  ],
  content: `
# Operaciones de Bóveda (Escritura)

Operaciones de escritura para gestión de bóvedas. Todos los endpoints soportan flujo prepare/submit. **Autenticación:** igual que otros \`/contracts/*\` — \`X-ACTA-Key\` válida (ver Resumen de la API).

## Crear Bóveda

### POST /contracts/vault/create

Crea (inicializa) una bóveda para un propietario.

**Cuerpo de solicitud (Prepare):**

\`\`\`json
{
  "owner": "G...",
  "didUri": "did:pkh:stellar:testnet:G...",
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

## Autorizar Emisor

### POST /contracts/vault/authorize-issuer

Añade un emisor autorizado a la bóveda de un propietario.

**Cuerpo de solicitud (Prepare):**

\`\`\`json
{
  "owner": "G...",
  "issuer": "G...",
  "sourcePublicKey": "G...",
  "contractId": "C..."
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

## Autorizar Emisores (Múltiples)

### POST /contracts/vault/authorize-issuers

Reemplaza la lista completa de emisores autorizados de la bóveda con el array dado.

**Cuerpo de solicitud (Prepare):**

\`\`\`json
{
  "owner": "G...",
  "issuers": ["G...", "G...", "G..."],
  "sourcePublicKey": "G...",
  "contractId": "C..."
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

## Revocar Emisor

### POST /contracts/vault/revoke-issuer

Revoca la autorización de un emisor de una bóveda.

**Cuerpo de solicitud (Prepare):**

\`\`\`json
{
  "owner": "G...",
  "issuer": "G...",
  "sourcePublicKey": "G...",
  "contractId": "C..."
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

## Revocar Bóveda

### POST /contracts/vault/revoke-vault

Revoca completamente una bóveda.

**Cuerpo de solicitud (Prepare):**

\`\`\`json
{
  "owner": "G...",
  "sourcePublicKey": "G...",
  "contractId": "C..."
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

## Establecer nuevo propietario

### POST /contracts/vault/set-new-owner

Establece el nuevo propietario de la bóveda (admin de bóveda). Debe ser firmado por el propietario actual.

**Cuerpo de solicitud (Prepare):**

\`\`\`json
{
  "owner": "G...",
  "new_owner": "G...",
  "sourcePublicKey": "G...",
  "contractId": "C..."
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

## Migrate

### POST /contracts/vault/migrate

Migra los datos heredados de la bóveda de un propietario al formato actual.

**Cuerpo de solicitud (Prepare):**

\`\`\`json
{
  "owner": "G...",
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

## Bóveda patrocinada

Creación de bóveda en la que un **sponsor** firma \`create_sponsored_vault\` en el contrato vc-vault en lugar de que el propietario firme \`create_vault\`. On-chain el contrato también tiene ajustes solo-admin (\`open-to-all\`, lista de sponsors). La superficie HTTP **pública** es solo **\`POST /contracts/sponsored-vault/create\`** (mismo middleware \`X-ACTA-Key\` que otros escritos públicos \`/contracts/*\`, no rutas de API key admin).

Consulta **Bóveda patrocinada (Sponsored Vault)** (\`api-sponsored-vault\`) para semántica del contrato, el endpoint create y \`sponsoredVaultCreate\` en el SDK de credenciales.

## Flujo Prepare/Submit

Todos los endpoints de escritura siguen el mismo patrón:

1. **Prepare**: Envía solicitud con parámetros de operación (sin \`signedXdr\`)
2. **Firmar**: Firma el \`xdr\` devuelto con tu wallet Stellar usando el \`network\` passphrase
3. **Submit**: Envía solicitud con \`signedXdr\` para ejecutar

**Parámetros comunes:**
- **owner** (requerido): Dirección del propietario de la bóveda (G...)
- **sourcePublicKey** (requerido): Fuente de transacción que firmará (debe ser firmante autorizado)
- **contractId** (opcional): Sobrescribir ID de contrato ACTA (C...)
    `,
};
