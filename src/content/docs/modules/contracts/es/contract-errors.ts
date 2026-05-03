import type { DocPage } from "@/@types/docs";

export const contractErrors: DocPage = {
  slug: "contract-errors",
  title: "Errores de contrato",
  section: "Contratos",
  tocItems: [
    "Cómo aparecen los errores",
    "vc-vault",
    "vc-issuer-registry",
    "Fuente",
  ],
  content: `
# Errores de contrato

Soroban devuelve invocaciones fallidas como \`Error(Contract, #<código>)\`. El **código** numérico coincide con el discriminante \`#[repr(u32)]\` del enum \`ContractError\` de cada contrato en **contracts-acta**.

Los códigos son **por contrato**: el mismo número puede significar otra variante en otro binario WASM. Mapea siempre el código según el contrato que invocaste (vc-vault vs vc-issuer-registry).

## Cómo aparecen los errores

- **Simulación / envío:** Horizon o el RPC devuelve \`tx_failed\` con detalle del error de contrato, incluido el código.
- **API prepare/submit:** Un invoke Soroban rechazado muestra el mismo error subyacente tras el submit; el prepare puede tener éxito y fallar solo cuando la transacción firmada llega a la red.

## vc-vault

Crate: \`contracts-acta/contracts/vc-vault\` — \`src/error.rs\`.

| Código | Variante | Significado |
|--------|----------|-------------|
| 1 | \`AlreadyInitialized\` | Recurso ya inicializado (contrato o bóveda). |
| 2 | \`IssuerNotAuthorized\` | Emisor no está en la lista autorizada de la bóveda. |
| 3 | \`IssuerAlreadyAuthorized\` | Emisor ya autorizado. |
| 4 | \`VaultRevoked\` | Bóveda revocada; escrituras bloqueadas. |
| 5 | \`VCSAlreadyMigrated\` | Migración ya hecha; nada que migrar. |
| 6 | \`VCNotFound\` | VC no encontrada en bóveda o registro de estado. |
| 7 | \`VCAlreadyRevoked\` | VC ya revocada. |
| 8 | \`VaultNotInitialized\` | Bóveda no inicializada para este propietario. |
| 9 | \`NotInitialized\` | Contrato no inicializado (sin admin). |
| 10 | \`InvalidVaultContract\` | El parámetro \`vault_contract\` no es este contrato. |
| 11 | \`NotAuthorizedSponsor\` | El firmante no es admin del contrato ni sponsor autorizado (bóveda patrocinada). |
| 12 | \`VCAlreadyExists\` | \`vc_id\` ya existe en esta bóveda; no se permite re-emisión. |
| 13 | \`NoPendingAdmin\` | Se llamó \`accept_contract_admin\` sin nominación de admin pendiente. |
| 14 | \`ParentVCInvalid\` | La VC padre no existe o fue revocada (emisión vinculada). |

## vc-issuer-registry

Crate: \`contracts-acta/contracts/vc-issuer-registry\` — \`src/error.rs\`.

| Código | Variante | Significado |
|--------|----------|-------------|
| 1 | \`AlreadyInitialized\` | \`initialize()\` ya fue llamado. |
| 2 | \`IssuerNotFound\` | Dirección de emisor no encontrada en el registro. |
| 3 | \`IssuerAlreadyExists\` | Dirección de emisor ya registrada. |
| 4 | \`NotInitialized\` | Contrato aún no inicializado. |
| 5 | \`InvalidMetadata\` | Metadatos superan el tamaño máximo permitido. |

## Fuente

Definiciones y comentarios oficiales en el repositorio:

- \`contracts-acta/contracts/vc-vault/src/error.rs\`
- \`contracts-acta/contracts/vc-issuer-registry/src/error.rs\`
    `,
};
