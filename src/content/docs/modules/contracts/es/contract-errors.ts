import type { DocPage } from "@/@types/docs";

export const contractErrors: DocPage = {
  slug: "contract-errors",
  title: "Errores de contrato",
  section: "Contratos",
  tocItems: [
    "Cómo aparecen los errores",
    "vc-vault",
    "Enum vc-vault (Rust)",
    "vc-issuer-registry",
    "Fuente",
  ],
  content: `
# Errores de contrato

Soroban devuelve invocaciones fallidas como \`Error(Contract, #<código>)\`. El **código** numérico es el discriminante \`#[repr(u32)]\` del enum \`ContractError\` del contrato (ver \`contracts-acta\`).

Los códigos son **por WASM**: el mismo número puede ser otra variante en otro binario. Mapea según el **id de contrato** invocado (vc-vault vs vc-issuer-registry) y la **revisión de \`error.rs\`** embarcada en ese WASM.

## Cómo aparecen los errores

- **Simulación / envío:** Horizon o el RPC devuelve \`tx_failed\` con el código de contrato.
- **API prepare/submit:** El prepare puede devolver XDR sin error; el fallo de contrato aparece en el **submit** al ejecutarse la transacción firmada.

## vc-vault

Crate: \`contracts-acta/contracts/vc-vault\` — \`src/error.rs\`.

### Enum vc-vault (Rust)

El conjunto de errores on-chain es un único enum Soroban \`#[contracterror]\`. El propio módulo documenta la forma en Horizon/RPC:

\`\`\`rust
//! Contract error codes. Exposed as Error(Contract, #code) by Soroban.

use soroban_sdk::contracterror;

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum ContractError {
    // variantes …
}
\`\`\`

Cada variante tiene un \`u32\` asignado (1, 2, …): es el \`#code\` en \`Error(Contract, #code)\`.

### Tabla de errores vc-vault

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

Si tu copia o despliegue solo define variantes hasta \`InvalidVaultContract\` (código **10**), ese WASM aún no incluye patrocinio / emisión vinculada / handoff de admin (**11–14**). Revisa el \`error.rs\` de tu árbol antes de mapear códigos en herramientas de soporte.

## vc-issuer-registry

Crate: \`contracts-acta/contracts/vc-issuer-registry\` — \`src/error.rs\`.

Mismo patrón \`#[contracterror]\` / \`#[repr(u32)]\`; los códigos siguientes son **solo** de issuer-registry (no intercambiables con vc-vault).

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
