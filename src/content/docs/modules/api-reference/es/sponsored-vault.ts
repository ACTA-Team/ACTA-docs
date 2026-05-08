import type { DocPage } from "@/@types/docs";

export const sponsoredVault: DocPage = {
  slug: "api-sponsored-vault",
  title: "Bóveda patrocinada (Sponsored Vault)",
  section: "Referencia API",
  tocItems: [
    "Concepto",
    "Contrato on-chain (vc-vault)",
    "API HTTP",
    "Prepare / submit",
    "Notas operativas",
  ],
  content: `
# Bóveda patrocinada (Sponsored Vault)

Una **bóveda patrocinada** es una bóveda ACTA normal (mismo almacenamiento que \`create_vault\`) creada mediante \`create_sponsored_vault\` en el contrato Soroban **vc-vault**. El **patrocinador (sponsor)** invoca el contrato y debe cumplir la autenticación Soroban (\`sponsor.require_auth()\`); el **propietario (owner)** es el administrador de la bóveda y no firma esta transacción. Sirve cuando una organización paga fees u orquesta el alta mientras el usuario final solo recibe la bóveda.

En comparación, \`POST /contracts/vault/create\` prepara \`create_vault\`, donde suele firmar el **propietario**. El flujo patrocinado usa \`POST /contracts/sponsored-vault/create\`; la invocación debe cumplir la auth on-chain del **sponsor**—en la práctica el XDR preparado suele firmarlo la cuenta sponsor (ver **sourcePublicKey** abajo).

## Concepto

| Rol | Responsabilidad |
|-----|-----------------|
| **Sponsor** | Firma la transacción; debe estar permitido (ver abajo). Paga red/fees como en cualquier invocación. |
| **Owner** | Recibe la bóveda; su dirección queda como admin de bóveda; se guarda \`didUri\`. |
| **Admin del contrato** | Admin Soroban del contrato (no “admin HTTP”): siempre puede patrocinar; puede activar modo abierto y gestionar la lista de sponsors on-chain. |

**Modos de autorización** (flag on-chain \`sponsored_vault_open_to_all\`, por defecto \`false\`):

- **Restringido (\`open_to_all = false\`)**: Solo el admin del contrato **o** las direcciones en la **lista de sponsors autorizados** pueden llamar \`create_sponsored_vault\`.
- **Abierto (\`open_to_all = true\`)**: Cualquier sponsor puede llamar \`create_sponsored_vault\` (siguen aplicando auth y fees de Stellar/Soroban).

**Fallos habituales on-chain:**

- \`NotAuthorizedSponsor\` (código **11**): Sponsor no permitido con modo restringido.
- \`AlreadyInitialized\` (código **1**): El owner ya tiene bóveda; no repetir create para ese owner.
- \`NotInitialized\`: Contrato no inicializado.

Si tiene éxito, el contrato emite **\`SponsoredVaultCreated\`** con \`sponsor\`, \`owner\` y \`did_uri\`.

## Contrato on-chain (vc-vault)

Entrypoints Soroban relevantes en el mismo contrato **vc-vault** que el resto de operaciones de bóveda:

| Función | Auth | Descripción |
|---------|------|-------------|
| \`create_sponsored_vault(sponsor, owner, did_uri)\` | Sponsor | Crea estado de bóveda para \`owner\` si está permitido y no estaba inicializado. |
| \`get_sponsored_vault_open_to_all\` | Solo lectura | Devuelve el booleano modo abierto/restringido. |
| \`set_sponsored_vault_open_to_all(open)\` | Admin del contrato | Establece modo restringido vs abierto. |
| \`add_sponsored_vault_sponsor(sponsor)\` | Admin del contrato | Añade una dirección al conjunto de sponsors autorizados. |
| \`remove_sponsored_vault_sponsor(sponsor)\` | Admin del contrato | Quita una dirección del conjunto de sponsors autorizados. |

En almacenamiento persistente aparecen \`SponsoredVaultOpenToAll\` y entradas \`SponsoredVaultSponsor(Address)\` por dirección.

**HTTP público:** la API ACTA documenta aquí solo **\`POST /contracts/sponsored-vault/create\`** (prepare/submit de \`create_sponsored_vault\`). Lecturas y ajustes admin del flag y de la lista de sponsors **no** forman parte de la superficie REST pública; los admins del contrato invocan on-chain (o herramientas internas), no estas rutas en esta referencia.

## API HTTP

Esta ruta usa el mismo middleware que otros \`/contracts/*\` de escritura públicos: cabecera **\`X-ACTA-Key\`**, API key válida y límites de tasa. Antepón la URL base de red (p. ej. \`https://acta.build/api/testnet\`).

### POST /contracts/sponsored-vault/create

Prepara o envía \`create_sponsored_vault\`.

**Cuerpo (prepare):**

\`\`\`json
{
  "sponsor": "G...",
  "owner": "G...",
  "didUri": "did:pkh:stellar:testnet:G...",
  "sourcePublicKey": "G...",
  "contractId": "C..."
}
\`\`\`

- **sponsor** (requerido): Dirección Stellar que el contrato recibe como sponsor (debe cumplir \`sponsor.require_auth()\` al firmar y enviar la transacción).
- **owner** (requerido): Propietario de la bóveda (\`G...\`).
- **didUri** (requerido): DID URI de la bóveda.
- **sourcePublicKey** (requerido): Cuenta Stellar usada como **fuente (source)** de la transacción al preparar el XDR. La invocación firmada debe autorizar igualmente al **sponsor** en el contrato; lo habitual es que la cuenta sponsor sea a la vez \`sponsor\` y cuenta source/firmante.
- **contractId** (opcional): id del contrato vc-vault (\`C...\`); si no, el valor por defecto del servidor.

**Cuerpo (submit):** \`{ "signedXdr": "AAAA..." }\`

**Respuestas:** Prepare → \`{ "xdr", "network" }\`; Submit → \`{ "tx_id" }\`.

## Prepare / submit

Este endpoint de escritura sigue el flujo estándar en dos pasos:

1. **Prepare** — JSON con campos de operación (sin \`signedXdr\`) → \`xdr\` + \`network\`.
2. **Firmar** — Wallet Stellar firma el XDR de forma que se cumplan los requisitos de auth del sponsor.
3. **Submit** — POST al mismo path con \`{ "signedXdr" }\` → \`tx_id\`.

## Notas operativas

- En modo **restringido**, confirma por otros medios o vía simulación Soroban que tu **sponsor** es admin del contrato o está en la lista autorizada antes de llamar a **create**; no hay helper HTTP público para el flag open-to-all ni la allowlist en esta referencia.
- Evita llamar **create** si el owner ya tiene bóveda; mejor comprobar existencia vía lectura de bóveda (API u on-chain).
    `,
};
