import type { DocPage } from "@/@types/docs";

export const vaultWrite: DocPage = {
  slug: "api-vault-write",
  title: "Operaciones de Bóveda (Escritura)",
  section: "Referencia API",
  tocItems: [
    "Crear Bóveda",
    "Bloquear Emisor",
    "Desbloquear Emisor",
    "Revocar Bóveda",
    "Establecer nuevo propietario",
    "Bóveda patrocinada",
    "Flujo Prepare/Submit",
  ],
  content: `
# Operaciones de Bóveda (Escritura)

Operaciones de escritura para gestión de bóvedas. Todos los endpoints soportan flujo prepare/submit. **Autenticación:** igual que otros \`/contracts/*\` — \`X-ACTA-Key\` válida (ver Resumen de la API).

> **Bóvedas mono-inquilino (v0.4.0):** cada propietario tiene su propia \`vc-vault\`, desplegada por el \`vc-vault-factory\`. La API deriva la dirección de la bóveda a partir de \`(factory, owner, userSalt)\`, por lo que pasas **\`owner\`** (no un \`contractId\` de bóveda). El **\`userSalt\`** opcional (hex de 32 bytes, por defecto todo en cero) selecciona cuál de las bóvedas del propietario se usa.

## Crear Bóveda

### POST /contracts/vault/create

Despliega una nueva bóveda mono-inquilino para un propietario **a través del factory** (\`factory.deploy\`). La dirección de la bóveda es determinista para \`(factory, owner, userSalt)\`.

**Cuerpo de solicitud (Prepare):**

\`\`\`json
{
  "owner": "G...",
  "didUri": "did:stellar:testnet:znfxngsh46vkyqu6inrx4omphi",
  "userSalt": "0000000000000000000000000000000000000000000000000000000000000000",
  "sourcePublicKey": "G..."
}
\`\`\`

- **owner** (requerido): Dirección del propietario de la bóveda (\`G...\`).
- **didUri** (requerido): URI del DID almacenado para la bóveda.
- **userSalt** (opcional): salt de 32 bytes (hex) que selecciona la bóveda. Por defecto todo en cero (la bóveda canónica).
- **sourcePublicKey** (requerido): Fuente de transacción que firmará.

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

## Bloquear Emisor

### POST /contracts/vault/deny-issuer

La emisión es **abierta por defecto**. Para impedir que un emisor específico escriba en tu bóveda, **bloquéalo** con \`deny_issuer\`. (Alias retrocompatible: \`POST /contracts/vault/revoke-issuer\` mapea a bloquear.)

**Cuerpo de solicitud (Prepare):**

\`\`\`json
{
  "owner": "G...",
  "issuer": "G...",
  "userSalt": "0000...0000",
  "sourcePublicKey": "G..."
}
\`\`\`

- **owner** (requerido): Dirección del propietario de la bóveda (\`G...\`).
- **issuer** (requerido): Dirección del emisor a bloquear (\`G...\`).
- **userSalt** (opcional): Selecciona la bóveda. Por defecto todo en cero.
- **sourcePublicKey** (requerido): Fuente de transacción que firmará (el propietario).

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

## Desbloquear Emisor

### POST /contracts/vault/allow-issuer

Quita a un emisor de la lista de bloqueo de la bóveda, restaurando su capacidad (por defecto) de emitir. (Alias retrocompatible: \`POST /contracts/vault/authorize-issuer\` mapea a desbloquear.)

**Cuerpo de solicitud (Prepare):**

\`\`\`json
{
  "owner": "G...",
  "issuer": "G...",
  "userSalt": "0000...0000",
  "sourcePublicKey": "G..."
}
\`\`\`

- **owner** (requerido): Dirección del propietario de la bóveda (\`G...\`).
- **issuer** (requerido): Dirección del emisor a desbloquear (\`G...\`).
- **userSalt** (opcional): Selecciona la bóveda. Por defecto todo en cero.
- **sourcePublicKey** (requerido): Fuente de transacción que firmará (el propietario).

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

Revoca la bóveda del propietario (las escrituras que requieren una bóveda activa quedan bloqueadas).

**Cuerpo de solicitud (Prepare):**

\`\`\`json
{
  "owner": "G...",
  "userSalt": "0000...0000",
  "sourcePublicKey": "G..."
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
  "userSalt": "0000...0000",
  "sourcePublicKey": "G..."
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

Creación de bóveda en la que un **sponsor** firma \`deploy_sponsored\` en el factory en lugar de que el propietario firme \`deploy\`. El propietario igualmente recibe una bóveda mono-inquilino en la dirección determinista de \`(factory, owner, userSalt)\`. La superficie HTTP **pública** es solo **\`POST /contracts/sponsored-vault/create\`** (mismo middleware \`X-ACTA-Key\` que otros escritos públicos \`/contracts/*\`). El despliegue patrocinado es **abierto** — no hay lista blanca de sponsors.

Consulta **Bóveda patrocinada (Sponsored Vault)** (\`api-sponsored-vault\`) para semántica del contrato, el endpoint create y \`sponsoredVaultCreate\` en el SDK de credenciales.

## Flujo Prepare/Submit

Todos los endpoints de escritura siguen el mismo patrón:

1. **Prepare**: Envía solicitud con parámetros de operación (sin \`signedXdr\`)
2. **Firmar**: Firma el \`xdr\` devuelto con tu wallet Stellar usando el \`network\` passphrase
3. **Submit**: Envía solicitud con \`signedXdr\` para ejecutar

**Parámetros comunes:**
- **owner** (requerido): Dirección del propietario de la bóveda (\`G...\`); la API deriva la bóveda a partir de ella.
- **sourcePublicKey** (requerido): Fuente de transacción que firmará (debe ser firmante autorizado).
- **userSalt** (opcional): salt de 32 bytes (hex) que selecciona cuál de las bóvedas del propietario se usa. Por defecto todo en cero.
    `,
};
