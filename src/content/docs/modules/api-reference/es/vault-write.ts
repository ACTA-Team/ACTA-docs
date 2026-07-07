import type { DocPage } from "@/@types/docs";

export const vaultWrite: DocPage = {
  slug: "api-vault-write",
  title: "Operaciones de Bóveda (Escritura)",
  section: "Referencia API",
  tocItems: [
    "Crear Bóveda",
    "Bloquear Emisor",
    "Desbloquear Emisor",
    "Establecer DID de la Bóveda",
    "Push de Credencial",
    "Revocar Bóveda",
    "Establecer nuevo propietario",
    "Bóveda patrocinada",
    "Flujo Prepare/Submit",
  ],
  content: `
# Operaciones de Bóveda (Escritura)

Operaciones de escritura para gestión de bóvedas. Todos los endpoints soportan flujo prepare/submit. **Autenticación:** igual que otros \`/contracts/*\` - \`X-ACTA-Key\` válida (ver Resumen de la API).

Las bóvedas son **mono-inquilino**: cada owner tiene su propio contrato \`vc-vault\`, desplegado de forma determinista por el \`vc-vault-factory\`. La bóveda se identifica por \`owner\` (más un \`userSalt\` opcional); no hay un \`contractId\` por solicitud para sobrescribir la bóveda.

## Crear Bóveda

### POST /contracts/vault/create

Despliega (e inicializa) la bóveda del owner **a través del factory**. El factory deriva la dirección de la bóveda de forma determinista a partir de \`(factory, owner, userSalt)\`, por lo que el mismo owner + salt siempre apunta a la misma bóveda.

**Cuerpo de solicitud (Prepare):**

\`\`\`json
{
  "owner": "G...",
  "didUri": "did:stellar:...",
  "userSalt": "00...00",
  "sourcePublicKey": "G..."
}
\`\`\`

- **owner** (requerido): Dirección del propietario de la bóveda (G...).
- **didUri** (requerido): URI del DID almacenado para el owner de la bóveda.
- **userSalt** (opcional): salt de 32 bytes que selecciona qué bóveda para este owner. Por defecto son 32 bytes en cero (una bóveda canónica por owner).
- **sourcePublicKey** (requerido): Fuente de transacción que firma el XDR preparado.

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

La emisión está **abierta por defecto**: cualquier emisor puede escribir en la bóveda salvo que el owner lo bloquee. **Bloquear Emisor** bloquea un emisor concreto (lo añade al conjunto de denegados de la bóveda).

> **Retrocompatibilidad:** \`POST /contracts/vault/revoke-issuer\` sigue disponible como alias de esta ruta (revoke → deny).

**Cuerpo de solicitud (Prepare):**

\`\`\`json
{
  "owner": "G...",
  "issuer": "G...",
  "userSalt": "00...00",
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

## Desbloquear Emisor

### POST /contracts/vault/allow-issuer

Desbloquea un emisor previamente denegado (lo quita del conjunto de denegados de la bóveda). Como la emisión está abierta por defecto, esto solo hace falta para deshacer un **Bloquear Emisor** anterior.

> **Retrocompatibilidad:** \`POST /contracts/vault/authorize-issuer\` sigue disponible como alias de esta ruta (authorize → allow).

**Cuerpo de solicitud (Prepare):**

\`\`\`json
{
  "owner": "G...",
  "issuer": "G...",
  "userSalt": "00...00",
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

## Establecer DID de la Bóveda

### POST /contracts/vault/set-vault-did

Actualiza el DID URI almacenado para la bóveda del owner. Firmado por el **propietario de la bóveda**.

**Cuerpo de solicitud (Prepare):**

\`\`\`json
{
  "owner": "G...",
  "didUri": "did:stellar:...",
  "userSalt": "00...00",
  "sourcePublicKey": "G..."
}
\`\`\`

**Respuestas:** Prepare devuelve \`{ xdr, network }\`; Submit (\`{ "signedXdr": "..." }\`) devuelve \`{ tx_id }\`.

## Push de Credencial

### POST /contracts/vault/push

Mueve una credencial de una bóveda desplegada por el factory a otra bóveda **con el mismo propietario** (por ejemplo, entre la bóveda canónica de un owner y una bóveda con salt). La credencial se escribe en la bóveda de destino y se elimina de la bóveda de origen. \`fromOwner\` debe coincidir con la wallet vinculada a tu API key.

**Cuerpo de solicitud (Prepare):**

\`\`\`json
{
  "fromOwner": "G...",
  "toOwner": "G...",
  "vcId": "credential-123",
  "userSalt": "00...00",
  "sourcePublicKey": "G..."
}
\`\`\`

- **sourcePublicKey** (requerido): debe ser \`fromOwner\` (firma el admin de la bóveda de origen).

**Respuestas:** Prepare devuelve \`{ xdr, network }\`; Submit devuelve \`{ tx_id }\`.

## Revocar Bóveda

### POST /contracts/vault/revoke-vault

Revoca completamente la bóveda del owner. **Irreversible**: después, todas las escrituras en la bóveda quedan bloqueadas.

**Cuerpo de solicitud (Prepare):**

\`\`\`json
{
  "owner": "G...",
  "userSalt": "00...00",
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
  "userSalt": "00...00",
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

Despliegue de bóveda en el que un **sponsor** invoca \`deploy_sponsored\` en el **vc-vault-factory** en lugar de que el owner despliegue su propia bóveda. On-chain, el patrocinio es abierto (cualquier dirección puede patrocinar), pero la ruta HTTP **\`POST /contracts/sponsored-vault/create\`** requiere una API key con rol **admin**.

Consulta **Bóveda patrocinada (Sponsored Vault)** (\`api-sponsored-vault\`) para semántica del contrato, el endpoint create y \`sponsoredVaultCreate\` en el SDK de credenciales.

## Flujo Prepare/Submit

Todos los endpoints de escritura siguen el mismo patrón:

1. **Prepare**: Envía solicitud con parámetros de operación (sin \`signedXdr\`)
2. **Firmar**: Firma el \`xdr\` devuelto con tu wallet Stellar usando el \`network\` passphrase
3. **Submit**: Envía solicitud con \`signedXdr\` para ejecutar

**Parámetros comunes:**
- **owner** (requerido): Dirección del propietario de la bóveda (G...)
- **userSalt** (opcional): salt de 32 bytes que selecciona la bóveda del owner; por defecto son 32 bytes en cero (una bóveda canónica por owner)
- **sourcePublicKey** (requerido): Fuente de transacción que firmará (debe ser firmante autorizado)
    `,
};
