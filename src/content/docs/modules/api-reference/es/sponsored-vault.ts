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
    "SDK TypeScript",
    "Notas operativas",
  ],
  content: `
# Bóveda patrocinada (Sponsored Vault)

Una **bóveda patrocinada** es una bóveda ACTA normal (mismo almacenamiento que \`create_vault\`) creada mediante \`create_sponsored_vault\` en el contrato Soroban **vc-vault**. El **patrocinador (sponsor)** invoca el contrato y debe cumplir la autenticación Soroban (\`sponsor.require_auth()\`); el **propietario (owner)** es el administrador de la bóveda y no firma esta transacción. Sirve cuando una organización paga fees u orquesta el alta mientras el usuario final solo recibe la bóveda.

En comparación, \`POST /contracts/vault/create\` prepara \`create_vault\`, donde suele firmar el **propietario**. El flujo patrocinado usa \`POST /contracts/sponsored-vault/create\` y el **sponsor** debe coincidir con \`sourcePublicKey\` en prepare/submit.

## Concepto

| Rol | Responsabilidad |
|-----|-----------------|
| **Sponsor** | Firma la transacción; debe estar permitido (ver abajo). Paga red/fees como en cualquier invocación. |
| **Owner** | Recibe la bóveda; su dirección queda como admin de bóveda; se guarda \`didUri\`. |
| **Admin del contrato** | Admin Soroban del contrato (no confundir con “admin HTTP”): siempre puede patrocinar; puede activar modo abierto y gestionar la lista de sponsors autorizados. |

**Modos de autorización** (flag on-chain \`sponsored_vault_open_to_all\`, por defecto \`false\`):

- **Restringido (\`open_to_all = false\`)**: Solo el admin del contrato **o** las direcciones en la **lista de sponsors autorizados** pueden llamar \`create_sponsored_vault\`.
- **Abierto (\`open_to_all = true\`)**: Cualquier sponsor puede llamar \`create_sponsored_vault\` (siguen aplicando auth y fees de Stellar/Soroban).

**Fallos habituales on-chain:**

- \`NotAuthorizedSponsor\` (código **11**): Sponsor no permitido con modo restringido.
- \`AlreadyInitialized\` (código **1**): El owner ya tiene bóveda; no repetir create para ese owner.
- \`NotInitialized\`: Contrato no inicializado.

Si tiene éxito, el contrato emite **\`SponsoredVaultCreated\`** con \`sponsor\`, \`owner\` y \`did_uri\`.

## Contrato on-chain (vc-vault)

Entrypoints Soroban usados por la API HTTP (mismo contrato vc-vault que el resto de operaciones de bóveda):

| Función | Auth | Descripción |
|---------|------|-------------|
| \`create_sponsored_vault(sponsor, owner, did_uri)\` | Sponsor | Crea estado de bóveda para \`owner\` si está permitido y no estaba inicializado. |
| \`get_sponsored_vault_open_to_all\` | Solo lectura | Devuelve el booleano modo abierto/restringido. |
| \`set_sponsored_vault_open_to_all(open)\` | Admin del contrato | Establece modo restringido vs abierto. |
| \`add_sponsored_vault_sponsor(sponsor)\` | Admin del contrato | Añade una dirección al conjunto de sponsors autorizados. |
| \`remove_sponsored_vault_sponsor(sponsor)\` | Admin del contrato | Quita una dirección del conjunto de sponsors autorizados. |

En almacenamiento persistente aparecen \`SponsoredVaultOpenToAll\` y entradas \`SponsoredVaultSponsor(Address)\` por dirección.

## API HTTP

Estas rutas usan el mismo middleware que otros \`/contracts/*\` de usuario: cabecera **\`X-ACTA-Key\`**, API key válida y límites de tasa. Antepón la URL base de red (p. ej. \`https://acta.build/api/testnet\`).

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

- **sponsor** (requerido): Cuenta Stellar del sponsor (debe coincidir con el firmante / \`sourcePublicKey\`).
- **owner** (requerido): Propietario de la bóveda (\`G...\`).
- **didUri** (requerido): DID URI de la bóveda.
- **sourcePublicKey** (requerido): Cuenta que firmará la transacción (debe ser el sponsor).
- **contractId** (opcional): id del contrato vc-vault (\`C...\`); si no, el valor por defecto del servidor.

**Cuerpo (submit):** \`{ "signedXdr": "AAAA..." }\`

**Respuestas:** Prepare → \`{ "xdr", "network" }\`; Submit → \`{ "tx_id" }\`.

### GET /contracts/sponsored-vault/open-to-all

Simula \`get_sponsored_vault_open_to_all\`. **Query:**

- **contractId** (opcional)
- **sourcePublicKey** (opcional): Cuenta para simulación; si se omite, usa configuración del servidor.

**Respuesta:**

\`\`\`json
{ "open": false }
\`\`\`

### POST /contracts/sponsored-vault/open-to-all

Prepare/submit de \`set_sponsored_vault_open_to_all\`. **Prepare:**

\`\`\`json
{
  "open": true,
  "sourcePublicKey": "G...",
  "contractId": "C..."
}
\`\`\`

- **open** (requerido): booleano.
- **sourcePublicKey** (requerido): Debe ser el **admin del contrato** del vc-vault.

### POST /contracts/sponsored-vault/add-sponsor

Prepare/submit de \`add_sponsored_vault_sponsor\`. **Prepare:**

\`\`\`json
{
  "sponsor": "G...",
  "sourcePublicKey": "G...",
  "contractId": "C..."
}
\`\`\`

\`sourcePublicKey\` debe ser el admin del contrato.

### POST /contracts/sponsored-vault/remove-sponsor

Prepare/submit de \`remove_sponsored_vault_sponsor\`. Misma forma que add-sponsor (\`sponsor\`, \`sourcePublicKey\`, \`contractId\` opcional).

## Prepare / submit

Los endpoints de escritura siguen el flujo estándar en dos pasos:

1. **Prepare** — JSON con campos de operación (sin \`signedXdr\`) → \`xdr\` + \`network\`.
2. **Firmar** — Wallet Stellar firma el XDR (sponsor o admin según corresponda).
3. **Submit** — POST al mismo path con \`{ "signedXdr" }\` → \`tx_id\`.

## SDK TypeScript (\`ActaClient\`)

| HTTP | Método cliente |
|------|----------------|
| POST .../create | \`sponsoredVaultCreate(payload)\` |
| GET .../open-to-all | \`getSponsoredVaultOpenToAll(args?)\` |
| POST .../open-to-all | \`sponsoredVaultSetOpenToAll(payload)\` |
| POST .../add-sponsor | \`sponsoredVaultAddSponsor(payload)\` |
| POST .../remove-sponsor | \`sponsoredVaultRemoveSponsor(payload)\` |

## Notas operativas

- Antes de patrocinar en modo **restringido**, lee \`open\` con GET o SDK; si es \`false\`, el sponsor debe ser admin del contrato o estar añadido con **add-sponsor** (tx admin on-chain).
- Evita llamar **create** si el owner ya tiene bóveda; mejor comprobar existencia vía lectura de bóveda (API u on-chain).
- Herramientas internas o backoffice pueden envolver estos endpoints; la superficie REST canónica es \`/contracts/sponsored-vault/*\` en la API ACTA.
    `,
};
