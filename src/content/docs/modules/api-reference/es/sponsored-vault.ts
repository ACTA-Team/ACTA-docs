import type { DocPage } from "@/@types/docs";

export const sponsoredVault: DocPage = {
  slug: "api-sponsored-vault",
  title: "Bóveda patrocinada (Sponsored Vault)",
  section: "Referencia API",
  tocItems: [
    "Concepto",
    "On-chain (factory.deploy_sponsored)",
    "API HTTP",
    "Prepare / submit",
    "Notas operativas",
  ],
  content: `
# Bóveda patrocinada (Sponsored Vault)

Una **bóveda patrocinada** es una bóveda ACTA mono-inquilino normal, desplegada mediante **\`deploy_sponsored\`** en el **vc-vault-factory**. El **sponsor** invoca el factory y firma la transacción (mapeado on-chain al desplegador); el **propietario** recibe la bóveda y no firma. Úsalo cuando una organización orquesta el onboarding mientras el usuario final solo recibe la bóveda.

Como comparación, \`POST /contracts/vault/create\` prepara el \`deploy\` del factory, donde normalmente firma el **propietario**. El flujo patrocinado usa \`POST /contracts/sponsored-vault/create\`. En ambos casos, el propietario termina con la bóveda determinista en \`(factory, owner, userSalt)\`.

## Concepto

| Rol | Responsabilidad |
|------|----------------|
| **Sponsor** | Firma la transacción; mapeado on-chain al desplegador. Paga red/fees como cualquier invocación. |
| **Propietario** | Recibe la bóveda mono-inquilino; su dirección se almacena como admin de la bóveda; el \`didUri\` se almacena para la bóveda. |

**El despliegue patrocinado es abierto** - cualquier dirección sponsor puede llamar a \`deploy_sponsored\` (sujeto a auth de Stellar/Soroban y a las fees). **No hay lista blanca de sponsors** ni **flag open-to-all** que gestionar.

Al tener éxito, el factory despliega la bóveda del propietario en la dirección determinista \`(factory, owner, userSalt)\`.

## On-chain (factory.deploy_sponsored)

Entrypoint Soroban relevante en el **vc-vault-factory**:

| Función | Auth | Descripción |
|----------|------|-------------|
| \`deploy_sponsored(sponsor, owner, did_uri, user_salt)\` | Sponsor | Despliega de forma determinista una bóveda mono-inquilino para \`owner\`; el sponsor autoriza el despliegue. |

**HTTP público:** la API de ACTA documenta solo **\`POST /contracts/sponsored-vault/create\`** (prepare/submit para \`deploy_sponsored\`). No hay rutas de admin/lista blanca - el despliegue patrocinado es abierto.

## API HTTP

Esta ruta usa el mismo middleware que otras rutas de escritura públicas \`/contracts/*\`: header **\`X-ACTA-Key\`**, API key válida y límites de tasa. Antepón la URL base de tu red (ej. \`https://api.testnet.acta.build\`).

### POST /contracts/sponsored-vault/create

Prepara o envía \`deploy_sponsored\`.

**Cuerpo (Prepare):**

\`\`\`json
{
  "sponsor": "G...",
  "owner": "G...",
  "didUri": "did:stellar:testnet:znfxngsh46vkyqu6inrx4omphi",
  "userSalt": "0000...0000",
  "sourcePublicKey": "G..."
}
\`\`\`

- **sponsor** (requerido): Dirección Stellar mapeada al desplegador on-chain (debe satisfacer la auth cuando la transacción se firma y envía).
- **owner** (requerido): Propietario de la bóveda (\`G...\`); la bóveda se despliega de forma determinista para este propietario.
- **didUri** (requerido): URI del DID almacenado para la bóveda.
- **userSalt** (opcional): salt de 32 bytes (hex) que selecciona la bóveda. Por defecto todo en cero.
- **sourcePublicKey** (requerido): Cuenta Stellar usada como **fuente de la transacción** cuando la API prepara el XDR. Normalmente la cuenta sponsor es a la vez \`sponsor\` y la cuenta firmante/fuente.

**Cuerpo (Submit):** \`{ "signedXdr": "AAAA..." }\`

**Respuestas:** Prepare → \`{ "xdr", "network" }\`; Submit → \`{ "tx_id" }\`.

## Prepare / submit

Este endpoint de escritura sigue el flujo estándar de dos pasos:

1. **Prepare** - JSON con campos de operación (sin \`signedXdr\`) → \`xdr\` + \`network\` passphrase.
2. **Firmar** - la wallet Stellar firma el XDR para satisfacer los requisitos de auth del sponsor.
3. **Submit** - POST a la misma ruta con \`{ "signedXdr" }\` → \`tx_id\`.

## Notas operativas

- El despliegue patrocinado es **abierto**: no hay lista blanca ni flag open-to-all que verificar antes de llamar a **create**.
- Evita llamar a **create** cuando el propietario ya tiene una bóveda con el mismo \`userSalt\`; prefiere primero una lectura por API de la existencia de la bóveda (ver operaciones de lectura de bóveda).
    `,
};
